import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
} from 'react'
import {
  BookOpen,
  Bot,
  Check,
  ChevronDown,
  FileText,
  LogOut,
  Menu,
  MessageSquareText,
  Moon,
  Search,
  Send,
  Sparkles,
  Sun,
  X,
} from 'lucide-react'

import { GlobalNav } from '@/components/hub/GlobalNav'
import { SidebarNav } from '@/components/hub/SidebarNav'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { hubTabs, localSections, type HubTab } from '@/data/navigation'
import { cn } from '@/lib/utils'

const APP_VERSION = '0.0.0'
const THEME_KEY = 'hub-theme'
const USER_EMAIL = 'trinhnnt2@vng.com.vn'
const USER_NAME = 'Trinhnnt2'
const USER_INITIAL = USER_NAME.charAt(0).toUpperCase()
const ZALO_BOT_URL = 'https://zalo.me/21271472240833679'

const searchSectionMetaById: Record<string, string> = {
  introduction: 'Tổng quan',
  goal: 'Mục tiêu',
  'definition-and-scope': 'Phạm vi',
  'information-priority-levels': 'Priority',
  'how-to-use-this-framework': 'Framework',
  'related-guidelines': 'Guideline',
  'design-review-checklist': 'Checklist',
}

const searchSections = localSections.map((section) => ({
  id: section.id,
  icon: FileText,
  label: section.label,
  meta: searchSectionMetaById[section.id] ?? 'Nội dung',
  type: 'section' as const,
}))

const searchSuggestions = [
  { id: 'goal', label: 'Mục tiêu' },
  { id: 'information-priority-levels', label: 'Priority' },
  { id: 'how-to-use-this-framework', label: 'Framework' },
  { id: 'design-review-checklist', label: 'Checklist review' },
]

const feedbackTypeOptions = [
  { value: 'content', label: 'Nội dung guideline' },
  { value: 'ui', label: 'Giao diện / trải nghiệm' },
  { value: 'bug', label: 'Lỗi hiển thị' },
  { value: 'other', label: 'Khác' },
]

const FEEDBACK_TOAST_VISIBLE_MS = 3200
const FEEDBACK_TOAST_EXIT_MS = 240
const HUB_MODAL_EXIT_MS = 180
const MAX_FEEDBACK_TOASTS = 3
const MAX_SEARCH_RESULTS = 5
const SEARCH_DEBOUNCE_MS = 1000

type FeedbackToast = {
  id: number
  message: string
  state: 'open' | 'closed'
}

type ToastStyle = CSSProperties & {
  '--toast-index': number
  '--toast-y': string
  '--toast-scale': number
  '--toast-opacity': number
}

function normalizeSearchText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
}

function getHighlightedParts(text: string, query: string) {
  const normalizedQuery = normalizeSearchText(query.trim())

  if (!normalizedQuery) {
    return [{ text, isMatch: false }]
  }

  let normalizedText = ''
  const normalizedIndexMap: number[] = []

  Array.from(text).forEach((char, charIndex) => {
    const normalizedChar = normalizeSearchText(char)

    Array.from(normalizedChar).forEach(() => {
      normalizedIndexMap.push(charIndex)
    })

    normalizedText += normalizedChar
  })

  const matchIndex = normalizedText.indexOf(normalizedQuery)

  if (matchIndex < 0) {
    return [{ text, isMatch: false }]
  }

  const matchStart = normalizedIndexMap[matchIndex]
  const matchEnd =
    normalizedIndexMap[matchIndex + normalizedQuery.length - 1] + 1

  return [
    { text: text.slice(0, matchStart), isMatch: false },
    { text: text.slice(matchStart, matchEnd), isMatch: true },
    { text: text.slice(matchEnd), isMatch: false },
  ].filter((part) => part.text.length > 0)
}

type HeaderProps = {
  activeTab: HubTab
  activeSection: string
  onLogout: () => void
  onSectionSelect: (sectionId: string) => void
  onTabChange: (tab: HubTab) => void
}

export function Header({
  activeTab,
  activeSection,
  onLogout,
  onSectionSelect,
  onTabChange,
}: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isSearchMounted, setIsSearchMounted] = useState(false)
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  const [isFeedbackMounted, setIsFeedbackMounted] = useState(false)
  const [feedbackIdentity, setFeedbackIdentity] = useState<'anonymous' | 'domain'>(
    'anonymous'
  )
  const [feedbackDomain, setFeedbackDomain] = useState(USER_EMAIL)
  const [feedbackDomainError, setFeedbackDomainError] = useState('')
  const [isFeedbackDomainFocused, setIsFeedbackDomainFocused] = useState(false)
  const [feedbackType, setFeedbackType] = useState(feedbackTypeOptions[0])
  const [isFeedbackTypeOpen, setIsFeedbackTypeOpen] = useState(false)
  const [feedbackSubmitError, setFeedbackSubmitError] = useState('')
  const [isFeedbackSubmitting, setIsFeedbackSubmitting] = useState(false)
  const [feedbackToasts, setFeedbackToasts] = useState<FeedbackToast[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }

    return (
      window.localStorage.getItem(THEME_KEY) === 'dark' ||
      document.documentElement.classList.contains('dark')
    )
  })
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchExitTimeoutRef = useRef<number | null>(null)
  const feedbackExitTimeoutRef = useRef<number | null>(null)

  const searchGroups = useMemo(() => {
    const normalizedQuery = normalizeSearchText(debouncedSearchQuery.trim())

    function filterItems<T extends { label: string; meta: string }>(items: T[]) {
      if (!normalizedQuery) {
        return items.slice(0, MAX_SEARCH_RESULTS)
      }

      return items
        .filter((item) =>
          normalizeSearchText(`${item.label} ${item.meta}`).includes(normalizedQuery)
        )
        .slice(0, MAX_SEARCH_RESULTS)
    }

    return [
      {
        label: 'Gợi ý',
        items: filterItems(searchSections),
      },
    ].filter((group) => group.items.length > 0)
  }, [debouncedSearchQuery])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
    window.localStorage.setItem(THEME_KEY, isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  useEffect(() => {
    return () => {
      if (searchExitTimeoutRef.current) {
        window.clearTimeout(searchExitTimeoutRef.current)
      }

      if (feedbackExitTimeoutRef.current) {
        window.clearTimeout(feedbackExitTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!isSearchOpen) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, SEARCH_DEBOUNCE_MS)

    return () => window.clearTimeout(timeoutId)
  }, [isSearchOpen, searchQuery])

  useEffect(() => {
    if (!isSearchOpen) {
      return
    }

    const frameId = window.requestAnimationFrame(() => {
      searchInputRef.current?.focus()
    })

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeSearch()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      window.cancelAnimationFrame(frameId)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isSearchOpen])

  useEffect(() => {
    if (!isFeedbackOpen) {
      return
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeFeedback()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isFeedbackOpen])

  function openSearch() {
    if (searchExitTimeoutRef.current) {
      window.clearTimeout(searchExitTimeoutRef.current)
      searchExitTimeoutRef.current = null
    }

    setIsSearchMounted(true)
    setIsSearchOpen(true)
  }

  function closeSearch() {
    setIsSearchOpen(false)

    if (searchExitTimeoutRef.current) {
      window.clearTimeout(searchExitTimeoutRef.current)
    }

    searchExitTimeoutRef.current = window.setTimeout(() => {
      setIsSearchMounted(false)
      setSearchQuery('')
      setDebouncedSearchQuery('')
      searchExitTimeoutRef.current = null
    }, HUB_MODAL_EXIT_MS)
  }

  function openFeedback() {
    if (feedbackExitTimeoutRef.current) {
      window.clearTimeout(feedbackExitTimeoutRef.current)
      feedbackExitTimeoutRef.current = null
    }

    setFeedbackDomain(USER_EMAIL)
    setFeedbackDomainError('')
    setFeedbackSubmitError('')
    setIsFeedbackMounted(true)
    setIsFeedbackOpen(true)
  }

  function closeFeedback() {
    setFeedbackDomainError('')
    setFeedbackSubmitError('')
    setIsFeedbackSubmitting(false)
    setIsFeedbackTypeOpen(false)
    setIsFeedbackOpen(false)

    if (feedbackExitTimeoutRef.current) {
      window.clearTimeout(feedbackExitTimeoutRef.current)
    }

    feedbackExitTimeoutRef.current = window.setTimeout(() => {
      setIsFeedbackMounted(false)
      feedbackExitTimeoutRef.current = null
    }, HUB_MODAL_EXIT_MS)
  }

  function showSuccessToast() {
    const toastId = Date.now()

    setFeedbackToasts((currentToasts) => [
      {
        id: toastId,
        message: 'Cảm ơn, góp ý gửi thành công.',
        state: 'open',
      },
      ...currentToasts.slice(0, MAX_FEEDBACK_TOASTS - 1),
    ])

    window.setTimeout(() => {
      setFeedbackToasts((currentToasts) =>
        currentToasts.map((toast) =>
          toast.id === toastId ? { ...toast, state: 'closed' } : toast
        )
      )
    }, FEEDBACK_TOAST_VISIBLE_MS)

    window.setTimeout(() => {
      setFeedbackToasts((currentToasts) =>
        currentToasts.filter((toast) => toast.id !== toastId)
      )
    }, FEEDBACK_TOAST_VISIBLE_MS + FEEDBACK_TOAST_EXIT_MS)
  }

  function handleSearchItemSelect(item: (typeof searchSections)[number]) {
    onSectionSelect(item.id)
    closeSearch()
  }

  async function handleFeedbackSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFeedbackSubmitError('')
    const feedbackForm = event.currentTarget

    if (
      feedbackIdentity === 'domain' &&
      !/^[^@\s]+@vng\.com\.vn$/i.test(feedbackDomain.trim())
    ) {
      setFeedbackDomainError('Email phải dùng domain @vng.com.vn')
      return
    }

    const formData = new FormData(feedbackForm)
    const title = String(formData.get('title') ?? '').trim()
    const description = String(formData.get('description') ?? '').trim()

    if (!title || !description) {
      setFeedbackSubmitError('Vui lòng nhập tiêu đề và nội dung góp ý.')
      return
    }

    setIsFeedbackSubmitting(true)

    try {
      const response = await fetch('/api/feedback', {
        body: JSON.stringify({
          activeSection,
          activeTab,
          description,
          domain: feedbackIdentity === 'domain' ? feedbackDomain.trim() : '',
          identity: feedbackIdentity,
          pageUrl: window.location.href,
          title,
          type: feedbackType.value,
          typeLabel: feedbackType.label,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        throw new Error(
          payload?.error || 'Không thể gửi góp ý đến Zalo Bot.'
        )
      }

      feedbackForm.reset()
      closeFeedback()
      showSuccessToast()
    } catch (error) {
      setFeedbackSubmitError(
        error instanceof Error
          ? error.message
          : 'Không thể gửi góp ý đến Zalo Bot.'
      )
    } finally {
      setIsFeedbackSubmitting(false)
    }
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 bg-background/95 shadow-[0_4px_18px_rgba(15,23,42,0.06)] backdrop-blur supports-backdrop-filter:bg-background/85">
        <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center gap-3 px-4 sm:px-6">
        <Sheet>
          <SheetTrigger
            className="lg:hidden"
            render={
              <Button aria-label="Open section navigation" size="icon" variant="ghost" />
            }
          >
            <Menu />
          </SheetTrigger>
          <SheetContent className="w-[86vw] max-w-sm" side="left">
            <SheetHeader>
              <SheetTitle>Zalopay Design Hub</SheetTitle>
              <SheetDescription>Navigate UI Principle sections.</SheetDescription>
            </SheetHeader>
            <div className="border-t border-foreground/10 px-3 py-4">
              <SidebarNav
                activeSection={activeSection}
                onSelect={onSectionSelect}
              />
            </div>
          </SheetContent>
        </Sheet>

        <button
          className="flex shrink-0 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          onClick={() => onTabChange('ui-principle')}
          type="button"
        >
          <img
            alt="Zalopay"
            className="h-5 w-auto"
            src="/zalopay-logo-horizontal.png"
          />
          <span className="hidden items-center gap-3 sm:flex">
            <span className="h-4 w-px bg-foreground/15" aria-hidden="true" />
            <span className="font-aeonik-pro text-sm font-medium leading-none text-foreground">
              Design Hub
            </span>
          </span>
        </button>

        <div className="ml-auto" />

        <div className="hidden w-auto items-center lg:flex">
          <div className="relative w-auto">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              aria-label="Tìm kiếm UI Hub"
              className="w-[calc(17ch+3.25rem)] border-0 bg-transparent pl-8 shadow-none transition-colors hover:bg-[#F1F7FF] focus-visible:border-0 focus-visible:bg-[#F1F7FF]"
              onFocus={openSearch}
              placeholder="Tìm kiếm thông tin"
              readOnly
              type="search"
            />
          </div>
        </div>

        <GlobalNav activeTab={activeTab} onTabChange={onTabChange} />

        <div className="flex min-w-0 items-center gap-2 lg:hidden">
          <select
            aria-label="Global navigation"
            className="h-9 max-w-[44vw] rounded-lg border border-foreground/10 bg-background px-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            onChange={(event) => onTabChange(event.target.value as HubTab)}
            value={activeTab}
          >
            {hubTabs.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.label}
              </option>
            ))}
          </select>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                aria-label="Open user menu"
                className="h-10 shrink-0 gap-3 border-0 px-1.5 py-1.5 hover:bg-[#F1F7FF] dark:hover:bg-blue-950/30"
                size="lg"
                variant="outline"
              />
            }
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#00A957] text-xs font-semibold text-white">
              {USER_INITIAL}
            </span>
            <span className="hidden min-w-0 text-left sm:block">
              <span className="block truncate text-sm font-semibold leading-4 text-foreground">
                {USER_NAME}
              </span>
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 p-2" sideOffset={24}>
            <div className="p-0">
              <div className="flex items-center gap-3 rounded-lg p-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#00A957] text-sm font-semibold text-white">
                  {USER_INITIAL}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-foreground">
                    {USER_NAME}
                  </span>
                  <span className="block truncate text-xs font-normal text-muted-foreground">
                    {USER_EMAIL}
                  </span>
                </span>
              </div>
            </div>
            <DropdownMenuSeparator />
            <div className="px-1.5 py-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Vai trò</span>
                <span className="font-medium text-foreground">Editor</span>
              </div>
            </div>
            <DropdownMenuSeparator />
            <div className="px-1.5 py-1">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground">Giao diện</span>
                <div className="grid grid-cols-2 rounded-lg bg-muted p-0.5">
                  <button
                    className={cn(
                      'flex h-7 items-center gap-1.5 rounded-md px-2 text-xs font-medium transition-colors',
                      !isDarkMode
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                    onClick={() => setIsDarkMode(false)}
                    type="button"
                  >
                    <Sun className="size-3.5" />
                    Light
                  </button>
                  <button
                    className={cn(
                      'flex h-7 items-center gap-1.5 rounded-md px-2 text-xs font-medium transition-colors',
                      isDarkMode
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                    onClick={() => setIsDarkMode(true)}
                    type="button"
                  >
                    <Moon className="size-3.5" />
                    Dark
                  </button>
                </div>
              </div>
            </div>
            <DropdownMenuSeparator />
            <div className="px-1.5 py-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Version</span>
                <span className="font-medium text-foreground">v{APP_VERSION}</span>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className={cn('cursor-pointer px-1.5 py-2 text-destructive')}
              onClick={onLogout}
              variant="destructive"
            >
              <LogOut />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
      </header>

      <a
        aria-label="Mở Zalo Bot UI team"
        className="fixed bottom-24 right-5 z-30 flex h-11 items-center gap-2 rounded-full bg-[#F1F7FF] px-4 text-sm font-medium text-[#0033C9] shadow-[0_8px_24px_rgba(15,23,42,0.12)] transition-colors hover:bg-[#E4EEFF] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-blue-950/40 dark:text-blue-100 dark:hover:bg-blue-900/60"
        href={ZALO_BOT_URL}
        rel="noreferrer"
        target="_blank"
      >
        <Bot className="size-4" />
        Hỏi Bot
      </a>

      <button
        aria-label="Mở form góp ý cải thiện"
        className="fixed bottom-10 right-5 z-30 flex h-11 items-center gap-2 rounded-full border-0 bg-background px-4 text-sm font-medium text-foreground shadow-[0_8px_24px_rgba(15,23,42,0.12)] transition-colors hover:bg-[#F1F7FF] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 dark:hover:bg-blue-950/30"
        onClick={openFeedback}
        type="button"
      >
        <MessageSquareText className="size-4 text-[#00A957]" />
        Góp ý
      </button>

      {feedbackToasts.length > 0 && (
        <div
          aria-live="polite"
          className="hub-toast-stack fixed right-5 top-20 z-50"
        >
          {feedbackToasts.map((toast, index) => (
            <div
              className="hub-toast absolute right-0 top-0 flex w-[min(calc(100vw-2.5rem),22rem)] items-start gap-3 rounded-xl bg-[#00A957] px-4 py-3 text-white shadow-[0_16px_36px_rgba(0,169,87,0.28)]"
              data-state={toast.state}
              key={toast.id}
              role="status"
              style={
                {
                  '--toast-index': index,
                  '--toast-y': `${index * 58}px`,
                  '--toast-scale': Math.max(0.92, 1 - index * 0.04),
                  '--toast-opacity': Math.max(0.78, 1 - index * 0.12),
                  zIndex: feedbackToasts.length - index,
                } as ToastStyle
              }
            >
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-white/15">
                <Check className="size-3.5 stroke-[3]" />
              </span>
              <span className="text-sm font-medium leading-6">
                {toast.message}
              </span>
            </div>
          ))}
        </div>
      )}

      {isFeedbackMounted && (
        <div
          aria-modal="true"
          className="hub-command-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/25 px-4 py-6 backdrop-blur-[3px] dark:bg-black/55"
          data-state={isFeedbackOpen ? 'open' : 'closed'}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeFeedback()
            }
          }}
          role="dialog"
        >
          <form
            className="hub-command-panel w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-2xl"
            data-state={isFeedbackOpen ? 'open' : 'closed'}
            noValidate
            onSubmit={handleFeedbackSubmit}
          >
            <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold leading-6">
                  Góp ý cải thiện
                </h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Gửi ý tưởng, lỗi hoặc đề xuất trực tiếp đến Zalo Bot của Design Hub
                </p>
              </div>
              <button
                aria-label="Đóng form góp ý"
                className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                onClick={closeFeedback}
                type="button"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="grid gap-4 px-5 py-5">
              <div className="grid gap-3">
                <span className="text-sm font-medium text-foreground">
                  Danh tính
                </span>
                <div className="grid gap-2 sm:grid-cols-2">
                  <label
                    className={cn(
                      'flex cursor-pointer items-start gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm transition-colors',
                      feedbackIdentity === 'anonymous' &&
                        'border-[#BFEFD8] bg-[#ECFFF5] dark:border-emerald-400/30 dark:bg-emerald-400/10'
                    )}
                  >
                    <input
                      checked={feedbackIdentity === 'anonymous'}
                      className="size-4 accent-[#00A957]"
                      name="feedbackIdentity"
                        onChange={() => {
                          setFeedbackIdentity('anonymous')
                          setFeedbackDomainError('')
                          setFeedbackSubmitError('')
                        }}
                      type="radio"
                      value="anonymous"
                    />
                    <span className="grid gap-0.5">
                      <span className="font-medium text-foreground">Gửi ẩn danh</span>
                      <span className="text-xs leading-5 text-muted-foreground">
                        Bot không hiển thị domain của bạn.
                      </span>
                    </span>
                  </label>
                  <label
                    className={cn(
                      'flex cursor-pointer items-start gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm transition-colors',
                      feedbackIdentity === 'domain' &&
                        'border-[#BFEFD8] bg-[#ECFFF5] dark:border-emerald-400/30 dark:bg-emerald-400/10'
                    )}
                  >
                    <input
                      checked={feedbackIdentity === 'domain'}
                      className="size-4 accent-[#00A957]"
                      name="feedbackIdentity"
                        onChange={() => {
                          setFeedbackIdentity('domain')
                          setFeedbackDomain((current) => current || USER_EMAIL)
                          setFeedbackSubmitError('')
                        }}
                      type="radio"
                      value="domain"
                    />
                    <span className="grid gap-0.5">
                      <span className="font-medium text-foreground">
                        Hiển thị domain
                      </span>
                      <span className="text-xs leading-5 text-muted-foreground">
                        Giúp team liên hệ khi cần làm rõ.
                      </span>
                    </span>
                  </label>
                </div>
                {feedbackIdentity === 'domain' && (
                  <div className="grid gap-1.5">
                    <div className="relative">
                      <input
                        aria-describedby={
                          feedbackDomainError ? 'feedback-domain-error' : undefined
                        }
                        aria-invalid={feedbackDomainError ? 'true' : undefined}
                        className={cn(
                          'h-10 w-full rounded-lg border border-border bg-background px-3 pr-10 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
                          feedbackDomainError &&
                            'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20'
                        )}
                        name="vngDomain"
                        onBlur={() => setIsFeedbackDomainFocused(false)}
                        onChange={(event) => {
                          setFeedbackDomain(event.target.value)
                          setFeedbackDomainError('')
                          setFeedbackSubmitError('')
                        }}
                        onFocus={() => setIsFeedbackDomainFocused(true)}
                        placeholder="Nhập domain của bạn. Ví dụ: domain@vng.com.vn"
                        type="text"
                        value={feedbackDomain}
                      />
                      {isFeedbackDomainFocused && feedbackDomain && (
                        <button
                          aria-label="Xoá domain"
                          className="absolute right-2 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          onClick={() => {
                            setFeedbackDomain('')
                            setFeedbackDomainError('')
                            setFeedbackSubmitError('')
                          }}
                          onMouseDown={(event) => event.preventDefault()}
                          type="button"
                        >
                          <X className="size-3.5" />
                        </button>
                      )}
                    </div>
                    {feedbackDomainError && (
                      <p
                        className="text-xs font-medium text-destructive"
                        id="feedback-domain-error"
                      >
                        {feedbackDomainError}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="relative grid gap-2">
                <span className="text-sm font-medium text-foreground">
                  Loại đóng góp
                </span>
                <input name="feedbackType" type="hidden" value={feedbackType.value} />
                <button
                  aria-expanded={isFeedbackTypeOpen}
                  className="flex h-10 w-full items-center justify-between rounded-lg border border-border bg-background px-3 text-left text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  onClick={() => setIsFeedbackTypeOpen((current) => !current)}
                  type="button"
                >
                  <span>{feedbackType.label}</span>
                  <ChevronDown
                    className={cn(
                      'size-4 text-muted-foreground transition-transform',
                      isFeedbackTypeOpen && 'rotate-180'
                    )}
                  />
                </button>
                {isFeedbackTypeOpen && (
                  <div className="absolute left-0 right-0 top-[calc(100%+0.375rem)] z-10 overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-lg">
                    {feedbackTypeOptions.map((option) => {
                      const isSelected = option.value === feedbackType.value

                      return (
                        <button
                          className={cn(
                            'flex h-10 w-full items-center gap-2 px-3 text-left text-sm transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none',
                            isSelected && 'bg-muted'
                          )}
                          key={option.value}
                          onClick={() => {
                            setFeedbackType(option)
                            setIsFeedbackTypeOpen(false)
                          }}
                          type="button"
                        >
                          <span className="flex w-4 justify-center">
                            {isSelected && (
                              <Check className="size-4 text-[#00A957]" />
                            )}
                          </span>
                          <span>{option.label}</span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-foreground">
                  Tiêu đề
                </span>
                <input
                  className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  name="title"
                  placeholder="Ví dụ: Bổ sung ví dụ cho Principle 3"
                  required
                  type="text"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-foreground">
                  Nội dung góp ý
                </span>
                <textarea
                  className="min-h-28 resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm leading-6 outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  name="description"
                  placeholder="Mô tả vấn đề, đề xuất chỉnh sửa hoặc ví dụ cần thêm."
                  required
                />
              </label>

            </div>

            <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-4">
              {feedbackSubmitError && (
                <p className="mr-auto text-xs font-medium text-destructive">
                  {feedbackSubmitError}
                </p>
              )}
              <Button
                disabled={isFeedbackSubmitting}
                onClick={closeFeedback}
                type="button"
                variant="outline"
              >
                Huỷ
              </Button>
              <Button
                className="gap-2 bg-[#0033C9] text-white hover:bg-[#002AA6] dark:bg-[#1B5CFF] dark:text-white dark:hover:bg-[#2F6DFF]"
                disabled={isFeedbackSubmitting}
                type="submit"
              >
                <Send className="size-4" />
                {isFeedbackSubmitting ? 'Đang gửi...' : 'Gửi góp ý'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {isSearchMounted && (
        <div
          aria-modal="true"
          className="hub-command-backdrop fixed inset-0 z-50 flex items-start justify-center bg-black/25 px-4 pt-[18svh] backdrop-blur-[3px] dark:bg-black/55"
          data-state={isSearchOpen ? 'open' : 'closed'}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeSearch()
            }
          }}
          role="dialog"
        >
          <div
            className="hub-command-panel w-full max-w-2xl overflow-hidden rounded-2xl border border-foreground/10 bg-popover text-popover-foreground shadow-2xl"
            data-state={isSearchOpen ? 'open' : 'closed'}
          >
            <div className="flex h-16 items-center gap-3 border-b border-border px-5">
              <Search className="size-5 shrink-0 text-muted-foreground" />
              <input
                aria-label="Search pages and actions"
                className="h-full min-w-0 flex-1 bg-transparent text-lg outline-none placeholder:text-muted-foreground"
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search pages and actions..."
                ref={searchInputRef}
                type="search"
                value={searchQuery}
              />
              <kbd className="rounded-lg bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                esc
              </kbd>
            </div>

            <div className="max-h-[60svh] overflow-y-auto p-2">
              {searchGroups.length > 0 ? (
                searchGroups.map((group) => (
                  <section className="py-2" key={group.label}>
                    <h2 className="px-3 pb-2 text-xs font-semibold uppercase text-muted-foreground">
                      {group.label}
                    </h2>
                    <div className="space-y-1">
                      {group.items.map((item, index) => {
                        const Icon = item.icon

                        return (
                          <button
                            className={cn(
                              'flex h-12 w-full items-center gap-3 rounded-lg px-3 text-left transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none',
                              index === 0 && !debouncedSearchQuery && 'bg-muted'
                            )}
                            key={`${item.type}-${item.id}`}
                            onClick={() => handleSearchItemSelect(item)}
                            type="button"
                          >
                            <Icon className="size-4 shrink-0 text-muted-foreground" />
                            <span className="min-w-0 flex-1 truncate text-sm font-medium">
                              {getHighlightedParts(item.label, debouncedSearchQuery).map(
                                (part, partIndex) =>
                                  part.isMatch ? (
                                    <mark
                                      className="rounded bg-[#ECFFF5] px-0.5 text-[#007A3D] dark:bg-[#003D24] dark:text-[#4DFF9F]"
                                      key={`${item.id}-label-${partIndex}`}
                                    >
                                      {part.text}
                                    </mark>
                                  ) : (
                                    <span key={`${item.id}-label-${partIndex}`}>
                                      {part.text}
                                    </span>
                                  )
                              )}
                            </span>
                            <span className="truncate text-sm text-muted-foreground">
                              {getHighlightedParts(item.meta, debouncedSearchQuery).map(
                                (part, partIndex) =>
                                  part.isMatch ? (
                                    <mark
                                      className="rounded bg-[#ECFFF5] px-0.5 text-[#007A3D] dark:bg-[#003D24] dark:text-[#4DFF9F]"
                                      key={`${item.id}-meta-${partIndex}`}
                                    >
                                      {part.text}
                                    </mark>
                                  ) : (
                                    <span key={`${item.id}-meta-${partIndex}`}>
                                      {part.text}
                                    </span>
                                  )
                              )}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </section>
                ))
              ) : (
                <div className="flex min-h-32 flex-col items-center justify-center gap-2 text-center">
                  <Sparkles className="size-5 text-muted-foreground" />
                  <p className="text-sm font-medium">Không tìm thấy kết quả</p>
                  <p className="text-xs text-muted-foreground">
                    Thử tìm theo tên tab hoặc section khác.
                  </p>
                </div>
              )}
            </div>

            <div className="border-t border-border px-5 py-3">
              <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <BookOpen className="size-3.5" />
                <span>Gợi ý</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchSuggestions.map((suggestion) => (
                  <button
                    className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-[#F1F7FF] hover:text-[#0033C9] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 dark:hover:bg-blue-950/40 dark:hover:text-blue-200"
                    key={suggestion.id}
                    onClick={() => {
                      onSectionSelect(suggestion.id)
                      closeSearch()
                    }}
                    type="button"
                  >
                    {suggestion.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
