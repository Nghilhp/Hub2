import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

type AnchorItem = {
  id: string
  label: string
}

type RightAnchorNavProps = {
  activeSection: string
  onSelect: (anchorId: string) => void
}

const anchorItemsBySection: Record<string, AnchorItem[]> = {
  goal: [{ id: 'goal', label: 'Mục tiêu dự án' }],
  'definition-and-scope': [
    { id: 'definition-and-scope', label: 'Định nghĩa và phạm vi' },
    { id: 'definition-summary', label: 'UI Principle' },
    { id: 'definition-in-scope', label: 'In scope' },
    { id: 'definition-out-of-scope', label: 'Out of scope' },
  ],
  'information-priority-levels': [
    {
      id: 'information-priority-levels',
      label: 'Phân loại mức độ ưu tiên thông tin',
    },
    { id: 'priority-core-rule', label: 'Core rule' },
    ...['P0', 'P1', 'P2', 'P3', 'P4'].map((level) => ({
      id: `priority-${level.toLowerCase()}`,
      label: level,
    })),
    { id: 'priority-confirm-transfer', label: 'Ví dụ: Confirm transfer' },
  ],
  'how-to-use-this-framework': [
    { id: 'how-to-use-this-framework', label: 'Cách sử dụng framework này' },
    { id: 'framework-usage-steps', label: 'Các bước áp dụng' },
    { id: 'framework-core-questions', label: 'Câu hỏi cốt lõi' },
  ],
  'related-guidelines': [
    { id: 'related-guidelines', label: 'Heuristic Evaluation' },
  ],
  'design-review-checklist': [
    { id: 'design-review-checklist', label: 'Design review checklist' },
    { id: 'review-decision-rule', label: 'Decision rule' },
  ],
}

export function RightAnchorNav({
  activeSection,
  onSelect,
}: RightAnchorNavProps) {
  const anchorItems = anchorItemsBySection[activeSection] ?? []
  const [activeAnchor, setActiveAnchor] = useState(anchorItems[0]?.id ?? '')

  useEffect(() => {
    setActiveAnchor(anchorItems[0]?.id ?? '')

    const anchorElements = anchorItems
      .map((anchor) => document.getElementById(anchor.id))
      .filter((anchor): anchor is HTMLElement => Boolean(anchor))

    if (anchorElements.length === 0) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (visibleEntry) {
          setActiveAnchor(visibleEntry.target.id)
        }
      },
      {
        rootMargin: '-96px 0px -58% 0px',
        threshold: [0.15, 0.35, 0.6],
      }
    )

    anchorElements.forEach((anchor) => observer.observe(anchor))

    return () => observer.disconnect()
  }, [activeSection, anchorItems])

  if (anchorItems.length === 0) {
    return null
  }

  return (
    <aside
      aria-label="Nội dung"
      className="w-64 shrink-0"
    >
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-normal text-muted-foreground">
        Nội dung
      </h2>
      <nav className="space-y-1">
        {anchorItems.map((anchor) => (
          <button
            aria-current={activeAnchor === anchor.id ? 'location' : undefined}
            className={cn(
              'block w-full min-w-0 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
              activeAnchor === anchor.id
                ? 'font-medium text-[#0033C9] dark:text-blue-200'
                : 'text-muted-foreground'
            )}
            key={anchor.id}
            onClick={() => {
              setActiveAnchor(anchor.id)
              onSelect(anchor.id)
            }}
            type="button"
          >
            <span className="block min-w-0 truncate" title={anchor.label}>
              {anchor.label}
            </span>
          </button>
        ))}
      </nav>
    </aside>
  )
}
