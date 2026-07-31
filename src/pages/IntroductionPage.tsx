import {
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { ArrowUpRight, ChevronDown, Search } from 'lucide-react'
import { gsap } from 'gsap'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { LineSidebar } from '@/components/hub/LineSidebar'
import { TargetCursor } from '@/components/hub/TargetCursor'
import {
  uiTeamPrinciples,
  type UITeamPrinciple,
} from '@/data/ui-team-principles'
import { cn } from '@/lib/utils'

const topNavItems = ['Our team here', 'UI Team', 'UX Team', 'Motion Hub'] as const
const ourTeamSections = [
  { id: 'overview', label: 'Tổng quan' },
  { id: 'focus-areas', label: 'Focus Areas' },
] as const
const pendingSections = ['UI Pattern', 'Design System', 'Illus System']
const sidebarMainGroupKeys = {
  'Our team here': 'ourTeam',
  'UI Team': 'uiTeam',
  'UX Team': 'uxTeam',
  'Motion Hub': 'motionHub',
} as const
const sidebarSpacing = {
  childIndentClass: 'pl-[16px]',
  childLevelGapClass: 'pt-[8px]',
  mainGroupGapClass: 'space-y-[8px]',
  primaryChildHeightClass: 'h-[44px]',
} as const
const pageTitleClassName =
  'text-[2rem] font-bold leading-[2.5rem] tracking-normal text-[var(--ds-text-primary)] md:text-[3rem] md:leading-[3.5rem]'
const headerIconButtonClassName =
  'rounded-full bg-[var(--ds-background-secondary)] text-[var(--ds-text-secondary)] hover:bg-[var(--ds-component-item-hover)] hover:text-[var(--ds-text-primary)]'

function animateLogoClick(element: HTMLElement | null) {
  if (!element) {
    return
  }

  gsap.killTweensOf(element)
  gsap
    .timeline()
    .to(element, {
      duration: 0.1,
      ease: 'power2.out',
      scale: 0.94,
    })
    .to(element, {
      duration: 0.18,
      ease: 'back.out(2)',
      scale: 1.04,
    })
    .to(element, {
      duration: 0.12,
      ease: 'power2.out',
      scale: 1,
    })
}

type ActiveView =
  | { type: 'overview' }
  | { type: 'principles' }
  | { type: 'principle'; principleId: string }
  | { type: 'pending'; label: string }

type TeamTab = (typeof topNavItems)[number]
type OurTeamView = (typeof ourTeamSections)[number]['id']

const overviewIntroParagraphs = [
  'Trước khi đi vào từng lớp, hãy bắt đầu bằng một tình huống quen thuộc: ngã tư có đèn giao thông.',
  'Khi đèn đỏ bật sáng, chúng ta biết cần dừng lại. Khi đèn xanh xuất hiện, chúng ta có thể tiếp tục di chuyển. Không cần thêm lời giải thích, mọi người vẫn hiểu và hành động giống nhau.',
]

const trafficExperienceLayers = [
  'Luật giao thông định hướng hành vi.',
  'Tín hiệu giao thông tạo ra quy ước quen thuộc.',
  'Hạ tầng giúp các quy ước được triển khai nhất quán.',
  'Sổ tay tập trung hướng dẫn để mọi người tra cứu và áp dụng.',
]

const overviewLayers = [
  {
    title: '01. UI Principle - Luật giao thông',
    summary: 'Định hướng vì sao team chọn một giải pháp UI.',
    paragraphs: [
      'UI Principle là những nguyên tắc nền tảng định hướng mọi quyết định giao diện.',
      'Giống như quy ước “đỏ là dừng, xanh là đi”, principle giúp team xác định điều gì cần được ưu tiên trong từng tình huống. Khi có nhiều phương án thiết kế, principle là cơ sở để đánh giá giải pháp nào rõ ràng, phù hợp và đáng tin cậy hơn với người dùng.',
      'Với một sản phẩm tài chính như Zalopay, mỗi quyết định UI đều cần giúp người dùng:',
    ],
    bullets: [
      'Nhận biết thông tin quan trọng.',
      'Hiểu đúng trạng thái giao dịch.',
      'Biết hành động tiếp theo.',
      'Hạn chế nhầm lẫn và sai sót.',
      'Cảm thấy an tâm khi sử dụng.',
    ],
    closing:
      'Principle không đưa ra một giao diện cụ thể. Principle giúp team hiểu vì sao một giải pháp nên được lựa chọn.',
  },
  {
    title: '02. UI Pattern - Tín hiệu giao thông',
    summary: 'Thống nhất cách xử lý các tình huống lặp lại.',
    paragraphs: [
      'Nếu principle là luật, UI Pattern là những quy ước quen thuộc được sử dụng cho các tình huống lặp lại.',
      'Tại một ngã tư, đèn đỏ luôn nằm trên, đèn vàng ở giữa và đèn xanh ở dưới. Cách sắp xếp nhất quán giúp mọi người nhận biết tín hiệu nhanh chóng, ngay cả khi đi qua một con đường hoàn toàn mới.',
      'Trong sản phẩm cũng vậy. Những tình huống như xác nhận giao dịch, nhập thông tin, báo lỗi, chờ xử lý hay thông báo thành công thường xuất hiện ở nhiều luồng khác nhau. UI Pattern giúp team thống nhất cách giải quyết các tình huống này.',
      'Thay vì mỗi designer tạo ra một cách thể hiện mới, pattern cung cấp cấu trúc đã được kiểm chứng, đồng thời cho phép điều chỉnh theo từng use case cụ thể.',
    ],
    bullets: [],
    closing:
      'Pattern giúp team trả lời câu hỏi: Tình huống này nên được thể hiện như thế nào để người dùng cảm thấy quen thuộc và dễ hiểu?',
  },
  {
    title: '03. Design System - Hạ tầng giao thông',
    summary: 'Cung cấp tài sản để hiện thực hóa giải pháp nhất quán.',
    paragraphs: [
      'Luật và tín hiệu chỉ có thể hoạt động khi có hạ tầng để hiện thực hóa.',
      'Trong giao thông, đó là đèn tín hiệu, cột đèn, biển báo, làn đường và vạch kẻ. Trong thiết kế sản phẩm, đó là màu sắc, typography, icon, grid, component, token và các quy chuẩn sử dụng.',
      'Design System biến principle và pattern thành những tài sản cụ thể để designer và developer có thể sử dụng trực tiếp. Nhờ đó, cùng một trạng thái, hành động hay thành phần giao diện sẽ được thể hiện nhất quán trên toàn bộ Zalopay.',
      'Design System giúp đội ngũ:',
    ],
    bullets: [
      'Tăng tốc quá trình thiết kế và phát triển.',
      'Hạn chế những khác biệt không cần thiết.',
      'Giảm việc giải quyết lại các bài toán đã có lời giải.',
      'Duy trì chất lượng khi sản phẩm mở rộng.',
      'Tạo nên bản sắc trực quan nhất quán cho Zalopay.',
    ],
    closing:
      'Design System trả lời câu hỏi: Chúng ta sử dụng những tài sản và quy chuẩn nào để hiện thực hóa giải pháp?',
  },
  {
    title: '04. Knowledge Hub - Sổ tay giao thông',
    summary: 'Lưu giữ kiến thức để mọi người cùng tìm thấy và áp dụng.',
    paragraphs: [
      'Có luật, tín hiệu và hạ tầng vẫn chưa đủ nếu kiến thức nằm rải rác hoặc chỉ tồn tại trong kinh nghiệm của một vài cá nhân.',
      'Knowledge Hub là nơi tập trung principle, pattern, guideline, use case và ví dụ thực tế để mọi người có thể dễ dàng tra cứu và áp dụng. Đây không chỉ là nơi lưu trữ tài liệu, mà còn là bộ nhớ chung của team.',
      'Mỗi quyết định thiết kế sau khi được kiểm chứng có thể trở thành kiến thức cho những bài toán tiếp theo. Mỗi pattern mới có thể được ghi nhận, đánh giá và hoàn thiện thay vì bị thất lạc trong các file thiết kế hoặc cuộc trò chuyện riêng lẻ.',
      'Knowledge Hub giúp trả lời các câu hỏi:',
    ],
    bullets: [
      'Quy định hiện tại là gì?',
      'Pattern nào phù hợp với tình huống này?',
      'Khi nào nên và không nên sử dụng?',
      'Đã có use case tương tự hay chưa?',
      'Ai đang phụ trách và nội dung được cập nhật khi nào?',
    ],
    closing:
      'Knowledge Hub giúp kiến thức không dừng lại ở việc “một người biết”, mà trở thành điều cả team có thể tìm thấy, hiểu và sử dụng.',
  },
]

const sharedLanguageBullets = [
  'UI Principle định hướng vì sao chúng ta đưa ra quyết định.',
  'UI Pattern xác định cách giải quyết một tình huống lặp lại.',
  'Design System cung cấp tài sản để hiện thực hóa giải pháp.',
  'Knowledge Hub lưu giữ và lan tỏa kiến thức để mọi người cùng áp dụng.',
]

const missingLayerNotes = [
  'Khi thiếu principle, quyết định dễ dựa trên cảm tính.',
  'Khi thiếu pattern, cùng một vấn đề có thể được giải quyết theo nhiều cách khác nhau.',
  'Khi thiếu Design System, giải pháp khó được triển khai nhất quán.',
  'Khi thiếu Knowledge Hub, kiến thức dễ bị phân tán và lặp lại từ đầu.',
]

const uiTeamRoleParagraphs = [
  'UI Team không chỉ hoàn thiện phần nhìn của sản phẩm. Chúng tôi xây dựng và duy trì ngôn ngữ trực quan giúp nhiều đội ngũ cùng tạo ra một trải nghiệm Zalopay thống nhất.',
  'Team phối hợp với UX Design, UX Research, UX Writing, Motion Design, Product và Engineering để chuyển nhu cầu người dùng thành các giải pháp rõ ràng, có hệ thống và có khả năng mở rộng.',
  'Mỗi màn hình là một phần của sản phẩm. Nhưng principle, pattern, system và knowledge mới là nền tảng giúp hàng trăm màn hình cùng nói một ngôn ngữ.',
  'Giống như khi đứng trước một ngã tư, người dùng không cần học lại luật giao thông mỗi lần di chuyển. Trên Zalopay, chúng tôi cũng muốn người dùng có thể nhận biết, hiểu và hành động một cách tự nhiên ở mọi điểm chạm.',
]

const productDesignDisciplines = [
  {
    name: 'UX Design',
    summary:
      'Xác định vấn đề, xây dựng hành trình và biến nhu cầu người dùng thành giải pháp rõ ràng.',
  },
  {
    name: 'UI Design',
    summary:
      'Chuyển hóa giải pháp thành giao diện trực quan, nhất quán và mang bản sắc Zalopay.',
  },
  {
    name: 'UX Research',
    summary:
      'Khám phá hành vi, nhu cầu và rào cản để quyết định thiết kế xuất phát từ dữ liệu thực tế.',
  },
  {
    name: 'UX Writing',
    summary:
      'Biến thông tin tài chính thành nội dung rõ ràng, gần gũi và dễ hành động.',
  },
  {
    name: 'Motion Design',
    summary:
      'Dùng chuyển động để hướng dẫn thao tác, phản hồi trạng thái và làm trải nghiệm tự nhiên hơn.',
  },
]

const productDesignFocusAreas = [
  {
    title: 'Đơn giản hóa trải nghiệm tài chính',
    body:
      'Ẩn sau mỗi thao tác là nhiều nghiệp vụ và trạng thái phức tạp. Product Design sắp xếp lại sự phức tạp đó để người dùng luôn biết mình đang làm gì, cần chú ý điều gì và bước tiếp theo là gì.',
  },
  {
    title: 'Thấu hiểu để thiết kế đúng',
    body:
      'Nghiên cứu, phỏng vấn, usability testing và phân tích hành vi giúp team nhận diện nhu cầu chưa được đáp ứng, rào cản trải nghiệm và yếu tố ảnh hưởng đến niềm tin.',
  },
  {
    title: 'Chuyển vấn đề thành hành trình rõ ràng',
    body:
      'UX Design kết nối nhu cầu người dùng với mục tiêu sản phẩm, cân bằng giữa sự đơn giản, minh bạch, nghiệp vụ và an toàn trong từng luồng trải nghiệm.',
  },
  {
    title: 'Một ngôn ngữ hình ảnh nhất quán',
    body:
      'UI Design, Design System, principles và patterns tạo nền tảng để các đội ngũ thiết kế nhanh hơn, đồng bộ hơn và dễ mở rộng khi sản phẩm phát triển.',
  },
  {
    title: 'Chuyển động có mục đích',
    body:
      'Motion không chỉ làm sản phẩm sinh động hơn. Mỗi animation cần hướng sự chú ý, thể hiện quan hệ giữa thành phần, phản hồi thao tác hoặc giúp nhận biết trạng thái.',
  },
  {
    title: 'Tiếng nói phía sau mỗi điểm chạm',
    body:
      'UX Writing giúp sản phẩm trò chuyện với người dùng bằng giọng rõ ràng, hữu ích, minh bạch và đáng tin cậy trong từng nội dung.',
  },
]

const productDesignPrinciples = [
  'Nghiệp vụ phức tạp trở nên dễ hiểu.',
  'Trải nghiệm được giữ nhất quán trên nhiều điểm chạm.',
  'Mỗi chuyển động và câu chữ đều có mục đích.',
  'Người dùng cảm thấy an tâm trong mỗi quyết định tài chính.',
]

function getInitialView(): ActiveView {
  if (typeof window === 'undefined') {
    return { type: 'overview' }
  }

  const hash = window.location.hash.replace('#', '')

  if (hash === 'principles') {
    return { type: 'principles' }
  }

  const principle = uiTeamPrinciples.find((item) => item.id === hash)

  if (principle) {
    return { type: 'principle', principleId: principle.id }
  }

  return { type: 'overview' }
}

function updateHash(view: ActiveView) {
  if (view.type === 'principle') {
    window.history.replaceState(null, '', `#${view.principleId}`)
    return
  }

  if (view.type === 'principles') {
    window.history.replaceState(null, '', '#principles')
    return
  }

  if (view.type === 'overview') {
    window.history.replaceState(null, '', '#introduction')
  }
}

type MobileCardNavLink = {
  label: string
  onSelect: () => void
}

type MobileCardNavItem = {
  label: TeamTab
  links: MobileCardNavLink[]
}

function MobileCardNav({
  activeTeamTab,
  isLandingActive,
  items,
  onOpenLanding,
}: {
  activeTeamTab: TeamTab
  isLandingActive: boolean
  items: MobileCardNavItem[]
  onOpenLanding: () => void
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const navRef = useRef<HTMLElement | null>(null)
  const logoRef = useRef<HTMLButtonElement | null>(null)
  const cardsRef = useRef<Array<HTMLElement | null>>([])
  const timelineRef = useRef<gsap.core.Timeline | null>(null)

  function calculateHeight() {
    const navElement = navRef.current

    if (!navElement) {
      return 60
    }

    const contentElement = navElement.querySelector<HTMLElement>(
      '.mobile-card-nav-content'
    )

    if (!contentElement) {
      return 60
    }

    const currentVisibility = contentElement.style.visibility
    const currentPointerEvents = contentElement.style.pointerEvents
    const currentPosition = contentElement.style.position
    const currentHeight = contentElement.style.height

    contentElement.style.visibility = 'visible'
    contentElement.style.pointerEvents = 'auto'
    contentElement.style.position = 'static'
    contentElement.style.height = 'auto'

    const nextHeight = 60 + contentElement.scrollHeight + 16

    contentElement.style.visibility = currentVisibility
    contentElement.style.pointerEvents = currentPointerEvents
    contentElement.style.position = currentPosition
    contentElement.style.height = currentHeight

    return nextHeight
  }

  function createTimeline() {
    const navElement = navRef.current

    if (!navElement) {
      return null
    }

    gsap.set(navElement, { height: 60, overflow: 'hidden' })
    gsap.set(cardsRef.current, { opacity: 0, y: 32 })

    const timeline = gsap.timeline({ paused: true })

    timeline.to(navElement, {
      duration: 0.42,
      ease: 'power3.out',
      height: calculateHeight,
    })
    timeline.to(
      cardsRef.current,
      {
        duration: 0.36,
        ease: 'power3.out',
        opacity: 1,
        stagger: 0.06,
        y: 0,
      },
      '-=0.12'
    )

    return timeline
  }

  useLayoutEffect(() => {
    const timeline = createTimeline()
    timelineRef.current = timeline

    return () => {
      timeline?.kill()
      timelineRef.current = null
    }
  }, [items.length])

  useLayoutEffect(() => {
    function handleResize() {
      if (!timelineRef.current) {
        return
      }

      timelineRef.current.kill()
      const nextTimeline = createTimeline()

      if (nextTimeline && isExpanded) {
        nextTimeline.progress(1)
      }

      timelineRef.current = nextTimeline
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isExpanded])

  function toggleMenu() {
    const timeline = timelineRef.current

    if (!timeline) {
      return
    }

    if (isExpanded) {
      timeline.eventCallback('onReverseComplete', () => setIsExpanded(false))
      timeline.reverse()
      return
    }

    setIsExpanded(true)
    timeline.play(0)
  }

  function closeMenu() {
    const timeline = timelineRef.current
    const navElement = navRef.current

    timeline?.pause(0)
    gsap.set(cardsRef.current, { opacity: 0, y: 32 })
    gsap.set(navElement, { height: 60, overflow: 'hidden' })
    setIsExpanded(false)
  }

  function handleLinkSelect(link: MobileCardNavLink) {
    link.onSelect()
    closeMenu()
  }

  return (
    <div className="mobile-card-nav-container lg:hidden">
      <nav
        aria-label="Mobile navigation"
        className={cn('mobile-card-nav', isExpanded && 'open')}
        ref={navRef}
      >
        <div className="mobile-card-nav-top">
          <button
            aria-label="Open landing"
            className="mobile-card-nav-logo zalopay-logo-target"
            onClick={() => {
              animateLogoClick(logoRef.current)
              onOpenLanding()
              closeMenu()
            }}
            ref={logoRef}
            type="button"
          >
            <img
              alt="Zalopay"
              className="h-8 w-auto"
              src="/zalopay-logo-horizontal.png"
            />
          </button>
          <button
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Close navigation' : 'Open navigation'}
            className={cn(
              'mobile-card-nav-menu',
              isExpanded && 'mobile-card-nav-menu-open'
            )}
            onClick={toggleMenu}
            type="button"
          >
            <span />
            <span />
          </button>
        </div>

        <div aria-hidden={!isExpanded} className="mobile-card-nav-content">
          {items.map((item, index) => (
            <article
              className={cn(
                'mobile-card-nav-card',
                !isLandingActive && item.label === activeTeamTab && 'is-active'
              )}
              key={item.label}
              ref={(element) => {
                cardsRef.current[index] = element
              }}
            >
              <div className="mobile-card-nav-card-label">{item.label}</div>
              <div className="mobile-card-nav-card-links">
                {item.links.map((link) => (
                  <button
                    aria-label={link.label}
                    className="mobile-card-nav-card-link"
                    key={link.label}
                    onClick={() => handleLinkSelect(link)}
                    type="button"
                  >
                    <ArrowUpRight aria-hidden="true" className="size-4" />
                    <span>{link.label}</span>
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
      </nav>
    </div>
  )
}

function PageHeader({
  activeTeamTab,
  isLandingActive,
  onOpenLanding,
  onOurTeamViewChange,
  onTeamTabChange,
  onViewChange,
}: {
  activeTeamTab: TeamTab
  isLandingActive: boolean
  onOpenLanding: () => void
  onOurTeamViewChange: (view: OurTeamView) => void
  onTeamTabChange: (tab: TeamTab) => void
  onViewChange: (view: ActiveView) => void
}) {
  const desktopLogoRef = useRef<HTMLButtonElement | null>(null)
  const mobileNavItems: MobileCardNavItem[] = [
    {
      label: 'Our team here',
      links: ourTeamSections.map((section) => ({
        label: section.label,
        onSelect: () => {
          onTeamTabChange('Our team here')
          onOurTeamViewChange(section.id)
        },
      })),
    },
    {
      label: 'UI Team',
      links: [
        {
          label: 'Tổng quan',
          onSelect: () => {
            onTeamTabChange('UI Team')
            onViewChange({ type: 'overview' })
          },
        },
        {
          label: 'Principles',
          onSelect: () => {
            onTeamTabChange('UI Team')
            onViewChange({ type: 'principles' })
          },
        },
        ...pendingSections.map((section) => ({
          label: section,
          onSelect: () => {
            onTeamTabChange('UI Team')
            onViewChange({ type: 'pending', label: section })
          },
        })),
      ],
    },
    {
      label: 'UX Team',
      links: [
        {
          label: 'To be updated',
          onSelect: () => onTeamTabChange('UX Team'),
        },
      ],
    },
    {
      label: 'Motion Hub',
      links: [
        {
          label: 'To be updated',
          onSelect: () => onTeamTabChange('Motion Hub'),
        },
      ],
    },
  ]

  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-transparent bg-transparent lg:bg-[var(--ds-background-primary)] lg:shadow-[0_2px_16px_rgba(0,31,62,0.06)] lg:backdrop-blur">
      <TargetCursor
        cursorColor="#2377ff"
        cursorColorOnTarget="#2377ff"
        hideDefaultCursor={false}
        targetSelector=".zalopay-logo-target"
      />
      <MobileCardNav
        activeTeamTab={activeTeamTab}
        isLandingActive={isLandingActive}
        items={mobileNavItems}
        onOpenLanding={onOpenLanding}
      />

      <div className="mx-auto hidden h-24 max-w-[1500px] items-center gap-5 px-5 sm:px-8 lg:flex lg:px-14">
        <div className="flex flex-1 items-center gap-3">
          <button
            aria-label="Open landing"
            className="zalopay-logo-target rounded-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--ds-border-zpblue-subtle)]"
            onClick={() => {
              animateLogoClick(desktopLogoRef.current)
              onOpenLanding()
            }}
            ref={desktopLogoRef}
            type="button"
          >
            <img
              alt="Zalopay"
              className="h-8 w-auto sm:h-9"
              src="/zalopay-logo-horizontal.png"
            />
          </button>
        </div>

        <nav
          aria-label="Team navigation"
          className="team-pill-nav hidden items-center justify-center rounded-full bg-[var(--ds-background-secondary)] p-1 text-base font-semibold leading-6 lg:flex"
        >
          {topNavItems.map((item) => (
            <button
              className={cn(
                'team-pill-button h-10 min-w-36 rounded-full px-6',
                !isLandingActive && item === activeTeamTab
                  ? 'team-tab-button-active is-active'
                  : 'text-[var(--ds-text-primary)]'
              )}
              key={item}
              onClick={() => onTeamTabChange(item)}
              type="button"
            >
              <span aria-hidden="true" className="team-pill-circle" />
              <span className="team-pill-label-stack">
                <span className="team-pill-label">{item}</span>
                <span aria-hidden="true" className="team-pill-label-hover">
                  {item}
                </span>
              </span>
            </button>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-2">
          <Button
            aria-label="Search"
            className={headerIconButtonClassName}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <Search />
          </Button>
        </div>
      </div>
    </header>
  )
}

function PrincipleThumbnail({ principle }: { principle: UITeamPrinciple }) {
  return (
    <div className="bg-[var(--ds-background-primary)] px-3 pt-3">
      <div className="principle-illustration principle-illustration--thumbnail aspect-[1200/408] w-full overflow-hidden rounded-lg">
        <img
          alt={`${principle.title} illustration`}
          className="principle-illustration__image size-full object-cover"
          src={principle.imageSrc}
        />
      </div>
    </div>
  )
}

function SidebarContent({
  activeTeamTab,
  activeOurTeamView,
  activeView,
  compact = false,
  onOurTeamViewSelect,
  onTeamTabSelect,
  onSelect,
}: {
  activeTeamTab: TeamTab
  activeOurTeamView: OurTeamView
  activeView?: ActiveView
  compact?: boolean
  onOurTeamViewSelect?: (view: OurTeamView) => void
  onTeamTabSelect?: (tab: TeamTab) => void
  onSelect?: (view: ActiveView) => void
}) {
  const navRef = useRef<HTMLElement | null>(null)
  const [openGroups, setOpenGroups] = useState({
    motionHub: false,
    ourTeam: false,
    uiTeam: true,
    uxTeam: false,
    principles: true,
    uiPattern: false,
    designSystem: false,
    illusSystem: false,
  })

  function toggleGroup(group: keyof typeof openGroups) {
    setOpenGroups((current) => ({
      ...current,
      [group]: !current[group],
    }))
  }

  useEffect(() => {
    setOpenGroups({
      designSystem:
        activeTeamTab === 'UI Team' &&
        activeView?.type === 'pending' &&
        activeView.label === 'Design System',
      illusSystem:
        activeTeamTab === 'UI Team' &&
        activeView?.type === 'pending' &&
        activeView.label === 'Illus System',
      motionHub: activeTeamTab === 'Motion Hub',
      ourTeam: activeTeamTab === 'Our team here',
      principles:
        activeTeamTab === 'UI Team' &&
        (activeView?.type === 'principles' || activeView?.type === 'principle'),
      uiPattern:
        activeTeamTab === 'UI Team' &&
        activeView?.type === 'pending' &&
        activeView.label === 'UI Pattern',
      uiTeam: activeTeamTab === 'UI Team',
      uxTeam: activeTeamTab === 'UX Team',
    })
  }, [activeTeamTab, activeView])

  useEffect(() => {
    const activeItems = navRef.current?.querySelectorAll<HTMLElement>(
      '[data-sidebar-active="true"]'
    )
    const activeItem = activeItems?.[activeItems.length - 1]

    activeItem?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [activeTeamTab, activeView, openGroups])

  const activePrincipleIndex =
    activeView?.type === 'principle'
      ? uiTeamPrinciples.findIndex(
          (principle) => principle.id === activeView.principleId
        )
      : null
  const activeUITeamPrimaryIndex =
    activeTeamTab !== 'UI Team'
      ? null
      : activeView?.type === 'overview'
        ? 0
        : activeView?.type === 'principles' || activeView?.type === 'principle'
          ? 1
          : null
  const activeUITeamPendingIndex =
    activeTeamTab === 'UI Team' && activeView?.type === 'pending'
      ? pendingSections.indexOf(activeView.label)
      : null
  const activeOurTeamChildIndex =
    activeTeamTab === 'Our team here'
      ? ourTeamSections.findIndex((section) => section.id === activeOurTeamView)
      : null

  function selectUITeamView(view: ActiveView) {
    onTeamTabSelect?.('UI Team')
    onSelect?.(view)
  }

  function selectTeamTab(tab: TeamTab) {
    onTeamTabSelect?.(tab)
  }

  function selectOurTeamView(view: OurTeamView) {
    onTeamTabSelect?.('Our team here')
    onOurTeamViewSelect?.(view)
  }

  function handleMainTabClick(tab: TeamTab) {
    const isCurrentTab = activeTeamTab === tab

    if ((tab === 'Our team here' || tab === 'UI Team') && isCurrentTab) {
      toggleGroup(sidebarMainGroupKeys[tab])
      return
    }

    if (tab === 'Our team here' || tab === 'UI Team') {
      setOpenGroups((current) => ({
        ...current,
        [sidebarMainGroupKeys[tab]]: true,
      }))
    }

    selectTeamTab(tab)
  }

  function renderMainTab(tab: TeamTab) {
    const groupKey = sidebarMainGroupKeys[tab]
    const isActive = activeTeamTab === tab
    const hasChildren = tab === 'Our team here' || tab === 'UI Team'

    return (
      <button
        aria-expanded={hasChildren ? openGroups[groupKey] : undefined}
        data-sidebar-active={isActive}
        className={cn(
          'flex h-12 w-full items-center justify-between rounded-xl px-4 text-left text-base font-medium leading-6 transition-colors hover:bg-[#F7FBFF] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--ds-border-zpblue-subtle)]',
          isActive
            ? 'bg-[#FAFCFF] font-bold text-[var(--ds-text-primary)]'
            : 'text-[var(--ds-text-tertiary)]'
        )}
        onClick={() => handleMainTabClick(tab)}
        type="button"
      >
        <span>{tab}</span>
        {hasChildren && (
          <ChevronDown
            className={cn(
              'size-4 text-[var(--ds-text-secondary)] transition-transform',
              openGroups[groupKey] ? 'rotate-180' : 'rotate-0'
            )}
          />
        )}
      </button>
    )
  }

  function renderSidebarLineList({
    activeIndex,
    className,
    itemGap = 8,
    items,
    onItemClick,
  }: {
    activeIndex: number | null
    className?: string
    itemGap?: number
    items: string[]
    onItemClick: (index: number) => void
  }) {
    return (
      <div
        className={cn(
          sidebarSpacing.childIndentClass,
          sidebarSpacing.childLevelGapClass,
          className
        )}
      >
        <LineSidebar
          accentColor="var(--ds-text-link)"
          className="hub-intro-sidebar-line"
          defaultActive={activeIndex}
          fontSize={compact ? 0.8125 : 0.875}
          itemGap={itemGap}
          markerColor="var(--ds-border-subtlest)"
          markerGap={10}
          markerLength={22}
          maxShift={8}
          onItemClick={onItemClick}
          proximityRadius={90}
          showIndex={false}
          textColor="var(--ds-text-tertiary)"
          items={items}
        />
      </div>
    )
  }

  function renderPrimaryChildList({
    activeIndex,
    className,
    items,
    onItemClick,
  }: {
    activeIndex: number | null
    className?: string
    items: string[]
    onItemClick: (index: number) => void
  }) {
    return (
      <div
        className={cn(sidebarSpacing.childIndentClass, className)}
      >
        {items.map((item, index) => {
          const isActive = activeIndex === index

          return (
            <button
              aria-current={isActive ? 'true' : undefined}
              className={cn(
                'flex w-full items-center rounded-2xl text-left transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--ds-border-zpblue-subtle)]',
                sidebarSpacing.primaryChildHeightClass,
                sidebarSpacing.childIndentClass,
                isActive
                  ? 'bg-[#F5F9FF] text-[#001F3E]'
                  : 'text-[var(--ds-text-tertiary)] hover:bg-[#FAFCFF]'
              )}
              data-sidebar-active={isActive}
              key={item}
              onClick={() => onItemClick(index)}
              type="button"
            >
              <span className="rounded-lg px-3 py-2.5 text-base font-normal leading-6">
                {item}
              </span>
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <nav
      aria-label="UI Team sections"
      className="text-[var(--ds-text-tertiary)]"
      ref={navRef}
    >
      <div className={sidebarSpacing.mainGroupGapClass}>
        <div>
          {renderMainTab('Our team here')}

          <div
            className="hub-sidebar-accordion"
            data-state={openGroups.ourTeam ? 'open' : 'closed'}
          >
            <div className="hub-sidebar-accordion-content">
              {renderPrimaryChildList({
                activeIndex:
                  activeOurTeamChildIndex !== null &&
                  activeOurTeamChildIndex >= 0
                    ? activeOurTeamChildIndex
                    : null,
                items: ourTeamSections.map((section) => section.label),
                onItemClick: (index) =>
                  selectOurTeamView(ourTeamSections[index].id),
              })}
            </div>
          </div>
        </div>

        <div>
          {renderMainTab('UI Team')}

        <div
          className="hub-sidebar-accordion"
          data-state={openGroups.uiTeam ? 'open' : 'closed'}
        >
          <div className="hub-sidebar-accordion-content">
            {renderPrimaryChildList({
              activeIndex: activeUITeamPrimaryIndex,
              items: ['Tổng quan', 'Principles'],
              onItemClick: (index) => {
                if (index === 0) {
                  selectUITeamView({ type: 'overview' })
                  return
                }

                if (
                  activeTeamTab === 'UI Team' &&
                  (activeView?.type === 'principles' ||
                    activeView?.type === 'principle')
                ) {
                  toggleGroup('principles')
                  return
                }

                setOpenGroups((current) => ({
                  ...current,
                  principles: true,
                  uiTeam: true,
                }))
                selectUITeamView({ type: 'principles' })
              },
            })}

            <div
              className="hub-sidebar-accordion"
              data-state={openGroups.principles ? 'open' : 'closed'}
            >
              <div
                className={cn(
                  'hub-sidebar-accordion-content',
                  sidebarSpacing.childIndentClass,
                  sidebarSpacing.childLevelGapClass
                )}
              >
              {renderSidebarLineList({
                activeIndex:
                  activePrincipleIndex !== null && activePrincipleIndex >= 0
                    ? activePrincipleIndex
                    : null,
                className: 'pl-[0px] pt-[0px]',
                items: uiTeamPrinciples.map(
                  (principle) => `${principle.number}. ${principle.title}`
                ),
                onItemClick: (index) =>
                  selectUITeamView({
                    type: 'principle',
                    principleId: uiTeamPrinciples[index].id,
                  }),
              })}
              </div>
            </div>

            {renderPrimaryChildList({
              activeIndex:
                activeUITeamPendingIndex !== null &&
                activeUITeamPendingIndex >= 0
                  ? activeUITeamPendingIndex
                  : null,
              className: 'pt-[0px]',
              items: pendingSections,
              onItemClick: (index) =>
                selectUITeamView({
                  type: 'pending',
                  label: pendingSections[index],
                }),
            })}
          </div>
        </div>
        </div>

        <div>
          {renderMainTab('UX Team')}
        </div>

        <div>
          {renderMainTab('Motion Hub')}
        </div>
      </div>
    </nav>
  )
}

function OverviewContent({
  onSelectPrinciple,
}: {
  onSelectPrinciple: (principleId: string) => void
}) {
  return (
    <section>
      <h1 className={pageTitleClassName}>
        Principles
      </h1>
      <Separator className="mt-9 bg-[var(--ds-border-zpblue-subtle)]" />

      <div className="mt-16 grid gap-x-8 gap-y-11 md:grid-cols-2 xl:grid-cols-3">
        {uiTeamPrinciples.map((principle) => (
          <Card
            className="principle-card group w-full cursor-pointer overflow-hidden rounded-2xl border border-[var(--ds-border-stroke2)] bg-[var(--ds-background-primary)] p-0 shadow-none hover:shadow-none focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--ds-border-zpblue-subtle)]"
            key={principle.id}
            onClick={() => onSelectPrinciple(principle.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                onSelectPrinciple(principle.id)
              }
            }}
          >
            <PrincipleThumbnail principle={principle} />
            <CardHeader className="bg-[var(--ds-background-primary)] p-4">
              <CardTitle className="text-base font-semibold leading-6 text-black">
                {principle.number}. {principle.title}
              </CardTitle>
              <p className="line-clamp-2 text-sm leading-[18px] text-[#767676]">
                {principle.subtitle}
              </p>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  )
}

function OverviewIntroductionContent() {
  function handleLayerCardClick(index: number) {
    document
      .getElementById(`overview-layer-${index + 1}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section>
      <h1 className={pageTitleClassName}>
        Tổng quan
      </h1>
      <Separator className="mt-9 bg-[var(--ds-border-zpblue-subtle)]" />

      <article className="overview-article mt-14 max-w-6xl text-[var(--ds-text-primary)]">
        <div className="overview-hero">
          <h2 className="max-w-4xl text-2xl font-bold leading-9 text-[var(--ds-text-primary)] md:text-[2rem] md:leading-[2.75rem]">
            Một ngôn ngữ chung cho những trải nghiệm tài chính đơn giản và đáng tin cậy
          </h2>
        </div>

        <section className="mt-10">
          <h3 className="text-xl font-bold leading-8 text-[var(--ds-text-primary)]">
            Cùng nhìn một “ngã tư”
          </h3>
          <div className="mt-5 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-4 text-base leading-8 text-[var(--ds-text-primary)]">
              {overviewIntroParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <p>
                UI Design cũng vận hành theo cách tương tự. Để tạo ra trải
                nghiệm nhất quán trên một sản phẩm lớn như Zalopay, team không
                thể chỉ dựa vào cảm nhận của từng designer.
              </p>
            </div>
            <div className="overview-callout">
              <p className="text-sm font-bold leading-6 text-[var(--ds-text-primary)]">
                Một trải nghiệm giao thông rõ ràng được tạo nên bởi nhiều lớp:
              </p>
              <OverviewBulletList items={trafficExperienceLayers} />
            </div>
          </div>
        </section>

        <section className="mt-14">
          <div className="max-w-3xl">
            <h3 className="text-xl font-bold leading-8 text-[var(--ds-text-primary)]">
              Bốn lớp trong ngôn ngữ UI
            </h3>
            <p className="mt-2 text-base leading-8 text-[var(--ds-text-secondary)]">
              Mỗi lớp trả lời một câu hỏi khác nhau trong quá trình thiết kế,
              từ lý do ra quyết định đến cách triển khai và lưu giữ kiến thức.
            </p>
          </div>
          <div className="overview-layer-grid mt-6">
            {overviewLayers.map((section, index) => (
              <button
                className="overview-layer-card"
                key={section.title}
                onClick={() => handleLayerCardClick(index)}
                type="button"
              >
                <span className="overview-layer-number">
                  {section.title.slice(0, 2)}
                </span>
                <h4>{section.title.slice(4)}</h4>
                <p>{section.summary}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-14 space-y-7">
          {overviewLayers.map((section, index) => (
            <OverviewLayerSection
              index={index}
              key={section.title}
              section={section}
            />
          ))}
        </section>

        <OverviewArticleSection title="Bốn lớp, một ngôn ngữ chung">
          <p>
            Bốn lớp không tồn tại độc lập mà liên kết với nhau trong toàn bộ quá
            trình thiết kế:
          </p>
          <OverviewBulletList items={sharedLanguageBullets} />
          <OverviewDependencyList items={missingLayerNotes} />
        </OverviewArticleSection>

        <OverviewArticleSection title="Vai trò của UI Team tại Zalopay">
          {uiTeamRoleParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p className="font-bold text-[var(--ds-text-primary)]">
            Một ngôn ngữ chung. Một trải nghiệm nhất quán. Một Zalopay đơn giản
            và đáng tin cậy hơn.
          </p>
        </OverviewArticleSection>
      </article>
    </section>
  )
}

function OverviewLayerSection({
  index,
  section,
}: {
  index: number
  section: (typeof overviewLayers)[number]
}) {
  const checklistTitle = section.title.startsWith('04')
    ? 'Knowledge Hub giúp trả lời'
    : section.title.startsWith('03')
      ? 'Design System giúp đội ngũ'
      : 'Team cần giúp người dùng'

  return (
    <section className="overview-layer-detail" id={`overview-layer-${index + 1}`}>
      <div className="overview-layer-detail__heading">
        <span>{section.title.slice(0, 2)}</span>
        <h3>{section.title.slice(4)}</h3>
      </div>
      <div className="overview-layer-detail__content">
        {section.paragraphs.map((paragraph, index) => (
          <div className="overview-text-block" key={paragraph}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <p>{paragraph}</p>
          </div>
        ))}
        {section.bullets.length > 0 && (
          <div className="overview-checklist-block">
            <p className="overview-block-title">{checklistTitle}</p>
            <div className="overview-checklist-grid">
              {section.bullets.map((item) => (
                <div className="overview-checklist-item" key={item}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="overview-closing-block">
          <span>Mục đích chính:</span>
          <p>{section.closing}</p>
        </div>
      </div>
    </section>
  )
}

function OverviewArticleSection({
  children,
  title,
}: {
  children: ReactNode
  title: string
}) {
  return (
    <section className="mt-12 space-y-4">
      <h3 className="text-xl font-bold leading-8 text-[var(--ds-text-primary)]">
        {title}
      </h3>
      <div className="space-y-4 text-base leading-8 text-[var(--ds-text-primary)]">
        {children}
      </div>
    </section>
  )
}

function OverviewDependencyList({ items }: { items: string[] }) {
  return (
    <div className="overview-dependency-list">
      {items.map((item) => {
        const [condition, outcome = ''] = item.replace('.', '').split(', ')

        return (
          <div className="overview-dependency-row" key={item}>
            <span>{condition}</span>
            <p>{outcome}</p>
          </div>
        )
      })}
    </div>
  )
}

function OverviewBulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-6">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

function OurTeamContent({ activeView }: { activeView: OurTeamView }) {
  return (
    <section>
      <h1 className={pageTitleClassName}>
        Our team is here
      </h1>
      <Separator className="mt-9 bg-[var(--ds-border-zpblue-subtle)]" />

      <article className="overview-article our-team-article mt-14 max-w-6xl">
        {activeView === 'overview' ? (
          <>
            <section className="overview-hero our-team-hero">
              <h2 className="max-w-4xl text-2xl font-bold leading-9 text-[var(--ds-text-primary)] md:text-[2rem] md:leading-[2.75rem]">
                Một đội ngũ cùng xây dựng trải nghiệm tài chính đơn giản, gần
                gũi và đáng tin cậy.
              </h2>
            </section>

            <section className="mt-10">
              <h3 className="text-xl font-bold leading-8 text-[var(--ds-text-primary)]">
                Product Design @ Zalopay
              </h3>
              <div className="mt-5 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="space-y-4 text-base leading-8 text-[var(--ds-text-primary)]">
                  <p>
                    Product Design kết nối nhiều chuyên môn để biến những
                    nghiệp vụ tài chính phức tạp thành hành trình rõ ràng, nhất
                    quán và dễ sử dụng hơn cho người Việt.
                  </p>
                  <p>
                    Chúng tôi cùng xây dựng một ngôn ngữ thiết kế chung, nơi
                    mỗi luồng trải nghiệm, giao diện, chuyển động, hình ảnh và
                    câu chữ hỗ trợ lẫn nhau.
                  </p>
                </div>
                <div className="overview-callout">
                  <p className="text-sm font-bold leading-6 text-[var(--ds-text-primary)]">
                    Mục tiêu của team:
                  </p>
                  <OverviewBulletList
                    items={[
                      'Giúp người dùng hiểu rõ thông tin.',
                      'Tự tin đưa ra quyết định.',
                      'Cảm thấy an tâm trong mỗi giao dịch.',
                    ]}
                  />
                </div>
              </div>
            </section>

            <section className="mt-14">
              <div className="max-w-3xl">
                <h3 className="text-xl font-bold leading-8 text-[var(--ds-text-primary)]">
                  Một đội ngũ, nhiều góc nhìn
                </h3>
                <p className="mt-2 text-base leading-8 text-[var(--ds-text-secondary)]">
                  Mỗi nhóm tiếp cận trải nghiệm từ một vai trò khác nhau, nhưng
                  cùng chia sẻ một tiêu chuẩn thiết kế chung.
                </p>
              </div>
              <div className="overview-layer-grid our-team-static-card-grid mt-6">
                {productDesignDisciplines.map((item) => (
                  <article className="overview-layer-card" key={item.name}>
                    <span className="overview-layer-number">Team</span>
                    <h4>{item.name}</h4>
                    <p>{item.summary}</p>
                  </article>
                ))}
              </div>
            </section>

          </>
        ) : (
          <>
            <section>
              <div className="max-w-3xl">
                <h3 className="text-xl font-bold leading-8 text-[var(--ds-text-primary)]">
                  Những việc chúng tôi tập trung làm tốt
                </h3>
                <p className="mt-2 text-base leading-8 text-[var(--ds-text-secondary)]">
                  Trang này không đi sâu vào từng quy trình. Nó giúp bạn nắm
                  nhanh cách Product Design tạo ra chất lượng trải nghiệm ở
                  Zalopay.
                </p>
              </div>
            </section>

            <section className="mt-8 space-y-7">
              {productDesignFocusAreas.map((item, index) => (
                <OurTeamFocusSection
                  index={index}
                  item={item}
                  key={item.title}
                />
              ))}
            </section>

            <OverviewArticleSection title="Design System là nền tảng của ngôn ngữ chung">
              <p>
                Khi sản phẩm mở rộng, sự nhất quán không thể chỉ phụ thuộc vào
                kinh nghiệm cá nhân. Design System kết nối principle, component,
                pattern, nội dung, chuyển động và tài liệu hướng dẫn thành một
                hệ thống chung.
              </p>
              <div className="overview-closing-block">
                <span>Mục đích chính:</span>
                <p>
                  Giúp Product, Design và Engineering phối hợp hiệu quả hơn,
                  hạn chế giải quyết lại những vấn đề đã có lời giải và duy trì
                  chất lượng trải nghiệm trên quy mô lớn.
                </p>
              </div>
            </OverviewArticleSection>

            <OverviewArticleSection title="Thông điệp của chúng tôi">
              <div className="overview-checklist-grid">
                {productDesignPrinciples.map((item) => (
                  <div className="overview-checklist-item" key={item}>
                    {item}
                  </div>
                ))}
              </div>
              <div className="overview-closing-block">
                <span>Mục đích chính:</span>
                <p>
                  Dù đến từ những chuyên môn và góc nhìn khác nhau, chúng tôi
                  cùng chia sẻ một mục tiêu: kiến tạo những trải nghiệm tài
                  chính đơn giản, gần gũi và đáng tin cậy cho người Việt.
                </p>
              </div>
            </OverviewArticleSection>
          </>
        )}
      </article>
    </section>
  )
}

function OurTeamFocusSection({
  index,
  item,
}: {
  index: number
  item: (typeof productDesignFocusAreas)[number]
}) {
  return (
    <section className="overview-layer-detail" id={`our-team-focus-${index + 1}`}>
      <div className="overview-layer-detail__heading">
        <span>{String(index + 1).padStart(2, '0')}</span>
        <h3>{item.title}</h3>
      </div>
      <div className="overview-layer-detail__content">
        <div className="overview-text-block">
          <span>01</span>
          <p>{item.body}</p>
        </div>
        <div className="overview-closing-block">
          <span>Mục đích chính:</span>
          <p>
            Giúp team biến góc nhìn chuyên môn thành một phần rõ ràng trong trải
            nghiệm tổng thể của Zalopay.
          </p>
        </div>
      </div>
    </section>
  )
}

function DetailContent({ principle }: { principle: UITeamPrinciple }) {
  const hasContent = Boolean(principle.intro)

  return (
    <section>
      <h1 className={pageTitleClassName}>
        {principle.number}. {principle.title}
      </h1>
      <Separator className="mt-9 bg-[var(--ds-border-zpblue-subtle)]" />

      {hasContent ? (
        <>
          <div className="mt-12 max-w-5xl space-y-12 text-base leading-7 text-[var(--ds-text-primary)]">
            <OverviewSection intro={principle.intro ?? []} />
            <DocumentationSection
              description="Các rule cần được kiểm theo thứ tự khi thiết kế, review hoặc audit màn hình."
              items={principle.applicationRules ?? []}
              showIndex
              title="Nguyên tắc áp dụng"
            />
            <CriteriaSection
              description="Các tiêu chí dùng để đánh giá principle này trong từng màn hình hoặc module cụ thể."
              items={principle.criteria ?? []}
              title="Tiêu chí đánh giá"
            />
            <DocumentationSection
              description="Tác động chính của principle này lên trải nghiệm người dùng và chất lượng hệ thống."
              items={principle.reasons ?? []}
              title="Lý do"
              variant="compact"
            />
          </div>
        </>
      ) : (
        <Card className="mt-16 rounded-xl border-[var(--ds-border-stroke2)] bg-[var(--ds-background-secondary)] p-8 shadow-none">
          <CardContent className="px-0 text-base font-medium leading-6 text-[var(--ds-text-tertiary)]">
            To be updated
          </CardContent>
        </Card>
      )}
    </section>
  )
}

function OverviewSection({ intro }: { intro: string[] }) {
  return (
    <section className="space-y-4">
      <SectionHeading
        description="Tóm tắt mục tiêu và vai trò của principle trong trải nghiệm sản phẩm."
        title="Overview"
      />
      <div className="rounded-2xl border border-[var(--ds-border-stroke2)] bg-[var(--ds-background-secondary)] p-6">
        <div className="max-w-3xl space-y-3">
          {intro.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </div>
    </section>
  )
}

function DocumentationSection({
  description,
  items,
  showIndex = false,
  title,
  variant = 'default',
}: {
  description: string
  items: string[]
  showIndex?: boolean
  title: string
  variant?: 'default' | 'compact'
}) {
  return (
    <section className="space-y-5">
      <SectionHeading description={description} title={title} />
      <div
        className={cn(
          'grid gap-3',
          variant === 'compact'
            ? 'md:grid-cols-3'
            : 'md:grid-cols-2'
        )}
      >
        {items.map((item, index) => (
          <article
            className="rounded-2xl border border-[var(--ds-border-stroke2)] bg-[var(--ds-background-primary)] p-5"
            key={item}
          >
            {showIndex && (
              <span className="mb-3 block text-xs font-bold uppercase leading-4 text-[var(--ds-text-link)]">
                Rule {String(index + 1).padStart(2, '0')}
              </span>
            )}
            <p>{item}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function CriteriaSection({
  description,
  items,
  title,
}: {
  description: string
  items: string[]
  title: string
}) {
  return (
    <section className="space-y-5">
      <SectionHeading description={description} title={title} />
      <div className="overflow-hidden rounded-2xl border border-[var(--ds-border-stroke2)] bg-[var(--ds-background-primary)]">
        {items.map((item) => {
          const [, ...descriptionParts] = item.split(': ')
          const description = descriptionParts.join(': ')

          return (
            <div
              className="border-b border-[var(--ds-border-stroke2)] p-5 last:border-b-0"
              key={item}
            >
              <p>{description}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function SectionHeading({
  description,
  title,
}: {
  description: string
  title: string
}) {
  return (
    <div className="max-w-3xl space-y-2">
      <h2 className="text-lg font-bold leading-7 text-[var(--ds-text-primary)]">
        {title}
      </h2>
      <p className="text-sm leading-6 text-[var(--ds-text-secondary)]">
        {description}
      </p>
    </div>
  )
}

function LandingContent() {
  return (
    <section className="hub-landing-empty">
      <div className="hub-landing-empty__animation" aria-hidden="true">
        <span className="hub-landing-empty__bubble hub-landing-empty__bubble--one" />
        <span className="hub-landing-empty__bubble hub-landing-empty__bubble--two" />
        <span className="hub-landing-empty__bubble hub-landing-empty__bubble--three" />
        <div className="hub-landing-empty__sparkle">
          <span />
          <span />
          <span />
        </div>
      </div>
      <div className="hub-landing-empty__copy">
        <p>To be update</p>
      </div>
    </section>
  )
}

function PendingContent({ label }: { label: string }) {
  return (
    <section>
      <h1 className={pageTitleClassName}>
        {label}
      </h1>
      <Separator className="mt-9 bg-[var(--ds-border-zpblue-subtle)]" />
      <Card className="mt-16 rounded-xl border-[var(--ds-border-stroke2)] bg-[var(--ds-background-secondary)] p-8 shadow-none">
        <CardContent className="px-0 text-base font-medium leading-6 text-[var(--ds-text-tertiary)]">
          To be updated
        </CardContent>
      </Card>
    </section>
  )
}

export function IntroductionPage() {
  const [activeTeamTab, setActiveTeamTab] = useState<TeamTab>('UI Team')
  const [activeOurTeamView, setActiveOurTeamView] =
    useState<OurTeamView>('overview')
  const [activeView, setActiveView] = useState<ActiveView>(getInitialView)
  const [isLandingActive, setIsLandingActive] = useState(true)
  const selectedPrinciple = useMemo(
    () =>
      activeView.type === 'principle'
        ? uiTeamPrinciples.find((item) => item.id === activeView.principleId)
        : undefined,
    [activeView]
  )

  useEffect(() => {
    document.documentElement.classList.remove('dark')
  }, [])

  function handleViewChange(view: ActiveView) {
    setIsLandingActive(false)
    setActiveView(view)
    updateHash(view)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleOurTeamViewChange(view: OurTeamView) {
    setIsLandingActive(false)
    setActiveOurTeamView(view)
    window.history.replaceState(null, '', `#our-team-${view}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleTeamTabChange(tab: TeamTab) {
    setIsLandingActive(false)
    setActiveTeamTab(tab)

    if (tab === 'Our team here') {
      setActiveOurTeamView('overview')
      window.history.replaceState(null, '', '#our-team-overview')
    }

    if (tab === 'UI Team') {
      const overviewView: ActiveView = { type: 'overview' }
      setActiveView(overviewView)
      updateHash(overviewView)
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleOpenLanding() {
    setIsLandingActive(true)
    window.history.replaceState(null, '', '#landing')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-svh bg-[var(--ds-background-primary)] font-sf-pro-display text-[var(--ds-text-primary)]">
      <PageHeader
        activeTeamTab={activeTeamTab}
        isLandingActive={isLandingActive}
        onOpenLanding={handleOpenLanding}
        onOurTeamViewChange={handleOurTeamViewChange}
        onTeamTabChange={handleTeamTabChange}
        onViewChange={handleViewChange}
      />

      <div className="mx-auto max-w-[1500px] px-5 pb-24 pt-32 sm:px-8 lg:px-14 lg:pt-[180px]">
        {!isLandingActive && (
          <aside className="hub-sidebar-scroll fixed left-[max(3.5rem,calc((100vw-1500px)/2+3.5rem))] top-24 hidden max-h-[calc(100svh-6rem)] w-72 overflow-x-hidden overflow-y-auto pr-3 pt-[84px] lg:block">
            <SidebarContent
              activeTeamTab={activeTeamTab}
              activeOurTeamView={activeOurTeamView}
              activeView={activeView}
              onOurTeamViewSelect={handleOurTeamViewChange}
              onSelect={handleViewChange}
              onTeamTabSelect={handleTeamTabChange}
            />
          </aside>
        )}

        <main className={cn('min-w-0', !isLandingActive && 'lg:ml-[19rem]')}>
          <div>
            {isLandingActive ? (
              <LandingContent />
            ) : activeTeamTab === 'Our team here' ? (
              <OurTeamContent activeView={activeOurTeamView} />
            ) : activeTeamTab !== 'UI Team' ? (
              <PendingContent label={activeTeamTab} />
            ) : (
              <>
                {activeView.type === 'overview' && (
                  <OverviewIntroductionContent />
                )}
                {activeView.type === 'principles' && (
                  <OverviewContent
                    onSelectPrinciple={(principleId) =>
                      handleViewChange({ type: 'principle', principleId })
                    }
                  />
                )}
                {activeView.type === 'principle' && selectedPrinciple && (
                  <DetailContent principle={selectedPrinciple} />
                )}
                {activeView.type === 'pending' && (
                  <PendingContent label={activeView.label} />
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
