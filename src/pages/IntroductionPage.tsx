import {
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
} from 'react'
import { createPortal } from 'react-dom'
import { ArrowUpRight, Check, ChevronDown, Search, X } from 'lucide-react'
import { gsap } from 'gsap'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import DotGrid from '@/components/DotGrid'
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
] as const
const pendingSections = ['UI Pattern', 'Design System', 'Illus System']
const sidebarMainGroupKeys = {
  'Our team here': 'ourTeam',
  'UI Team': 'uiTeam',
  'UX Team': 'uxTeam',
  'Motion Hub': 'motionHub',
} as const
const sidebarSpacing = {
  childGapClass: 'space-y-[8px]',
  childIndentClass: 'pl-[16px]',
  childListTopGapClass: 'pt-[8px]',
  childLevelGapClass: 'pt-[8px]',
  mainGroupGapClass: 'space-y-[8px]',
  primaryChildHeightClass: 'h-[44px]',
} as const
const pageTitleClassName =
  'text-[2rem] font-bold leading-[2.5rem] tracking-normal text-[var(--ds-text-primary)] md:text-[3rem] md:leading-[3.5rem]'
const headerIconButtonClassName =
  'rounded-full bg-[var(--ds-background-secondary)] text-[var(--ds-text-secondary)] hover:bg-[var(--ds-component-item-hover)] hover:text-[var(--ds-text-primary)]'
const SEARCH_MODAL_EXIT_MS = 180
const MAX_INTRO_SEARCH_RESULTS = 8

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
type UXTeamView = {
  parentId: string
  childId?: string
  grandchildId?: string
}
type IntroductionSearchItem = {
  description: string
  id: string
  keywords: string
  label: string
  meta: string
  onSelect: () => void
}

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

const uxTeamSections = [
  {
    id: 'overview',
    label: 'Tổng quan',
    description:
      'Introduction cho UX Team: cách team kết nối insight, luồng trải nghiệm và nội dung để tạo ra sản phẩm dễ hiểu hơn.',
    children: [],
  },
  {
    id: 'ux-design',
    label: 'UX Design',
    description:
      'Chuyển insight thành hành trình, cấu trúc luồng và giải pháp tương tác rõ ràng cho người dùng.',
    children: [
      {
        id: 'ux-principle',
        label: 'UX Principle',
        description:
          'Các nguyên tắc định hướng cách team xây dựng trải nghiệm rõ ràng, hữu ích và đáng tin cậy.',
      },
      {
        id: 'ux-pattern',
        label: 'UX Pattern',
        description:
          'Các cấu trúc giải pháp lặp lại giúp team xử lý những bài toán UX quen thuộc một cách nhất quán.',
        children: [
          {
            id: 'overview',
            label: 'Tổng quan',
            description:
              'Giới thiệu vai trò, phạm vi và cách sử dụng UX Pattern trong quá trình thiết kế.',
          },
          {
            id: 'onboarding-task-list',
            label: 'Onboarding task list',
            description:
              'Pattern hướng dẫn người dùng hoàn thành các bước onboarding theo một danh sách nhiệm vụ rõ ràng.',
          },
        ],
      },
      {
        id: 'workflow',
        label: 'Workflow',
        description:
          'Các luồng làm việc giúp team phối hợp, nhận yêu cầu và triển khai UX work có cấu trúc.',
        children: [
          {
            id: 'overview',
            label: 'Tổng quan',
            description:
              'Giới thiệu cách workflow UX vận hành từ request, alignment đến handoff.',
          },
          {
            id: 'order-ticket',
            label: 'Order Ticket',
            description:
              'Cách tạo ticket để gửi yêu cầu UX rõ ràng, đủ bối cảnh và dễ follow-up.',
          },
        ],
      },
    ],
  },
  {
    id: 'ux-research',
    label: 'UX Research',
    description:
      'Khám phá hành vi, nhu cầu và rào cản để quyết định thiết kế xuất phát từ dữ liệu thực tế.',
    children: [
      {
        id: 'principle',
        label: 'Principle',
        description:
          'Nguyên tắc giúp research trả lời đúng câu hỏi, đúng mức bằng chứng và đúng quyết định cần hỗ trợ.',
      },
      {
        id: 'methods',
        label: 'Methods',
        description:
          'Bộ phương pháp nghiên cứu định tính và định lượng để chọn đúng cách học từ user.',
        children: [
          {
            id: 'survey',
            label: 'Survey',
            description:
              'Thu thập phản hồi có cấu trúc từ nhiều user để đo mức độ phổ biến, ưu tiên hoặc phản ứng với giả thuyết.',
          },
          {
            id: 'in-depth-interview',
            label: 'In-depth Interview',
            description:
              'Phỏng vấn sâu để hiểu động cơ, bối cảnh, hành vi và cách user ra quyết định.',
          },
          {
            id: 'focus-group',
            label: 'Focus Group',
            description:
              'Thảo luận nhóm để khám phá phản ứng, ngôn ngữ và góc nhìn giữa nhiều participant.',
          },
          {
            id: 'usability-testing',
            label: 'Usability Testing',
            description:
              'Quan sát user thực hiện tác vụ để phát hiện điểm vướng, hiểu nhầm và rủi ro trong flow.',
          },
          {
            id: 'unmoderated-ut',
            label: 'Unmoderated UT',
            description:
              'Usability testing không moderator, phù hợp khi cần scale nhanh trên nhiều participant.',
          },
        ],
      },
      {
        id: 'workflow',
        label: 'Workflow',
        description:
          'Quy trình chọn method, nhận yêu cầu research và phối hợp với stakeholders.',
        children: [
          {
            id: 'overview',
            label: 'Tổng quan',
            description:
              'Tổng quan cách UX Research vận hành từ request, method selection đến handoff insight.',
          },
          {
            id: 'method-picker-matrix',
            label: 'Method Picker Matrix',
            description:
              'Ma trận giúp chọn research method theo mục tiêu, loại câu hỏi và mức độ bằng chứng cần có.',
          },
          {
            id: 'order-research',
            label: 'Oder Research',
            description:
              'Cách gửi yêu cầu research đủ bối cảnh, problem, timeline và quyết định cần hỗ trợ.',
          },
        ],
      },
    ],
  },
  {
    id: 'ux-writing',
    label: 'UX Writing',
    description:
      'Tạo nội dung rõ ràng, hữu ích và đáng tin cậy trong từng trạng thái, cảnh báo và lời kêu gọi hành động.',
    children: [
      {
        id: 'principles',
        label: 'Principles',
        description:
          'Nguyên tắc định hướng cách viết nội dung rõ ràng, nhất quán và phù hợp ngữ cảnh.',
      },
      {
        id: 'workflow',
        label: 'Workflow',
        description:
          'Quy trình phối hợp, nhận yêu cầu và review nội dung UX Writing.',
      },
      {
        id: 'glossary',
        label: 'Glossary',
        description:
          'Danh sách thuật ngữ, cách gọi và quy ước wording dùng trong sản phẩm.',
      },
    ],
  },
] as const

const defaultUXTeamView: UXTeamView = {
  parentId: uxTeamSections[0].id,
}

const uxOverviewMisconceptions = [
  {
    title: 'UX ≠ làm đẹp.',
    body:
      'Đẹp là UI. Một màn hình đẹp lung linh mà user không tìm ra nút thanh toán thì vẫn là UX tệ. Đẹp mà sai vẫn là sai, chỉ là sai một cách có gu.',
  },
  {
    title: 'UX ≠ “vẽ Figma”.',
    body:
      'Figma là cái cây bút. Nói UX là vẽ Figma cũng như nói bác sĩ là người cầm ống nghe.',
  },
  {
    title: 'UX ≠ ý kiến cá nhân của ai to mồm nhất.',
    body:
      '“Tôi thấy cái này khó dùng” không phải insight. “5/8 user không tìm ra nút trong 30 giây” mới là insight.',
  },
  {
    title: 'UX ≠ bước cuối cùng trước khi ship.',
    body:
      'Gọi UX vào lúc sắp release để “review nhẹ” cũng như gọi cứu hỏa lúc nhà cháy còn trơ cái móng.',
  },
]

const uxOverviewZalopayReasons = [
  {
    title: 'Giảm số giao dịch rớt',
    body:
      'ở những khúc luồng rối - mỗi % drop ở luồng nạp/thanh toán là tiền thật.',
  },
  {
    title: 'Giảm tải cho CS',
    body:
      'phần lớn ticket “app lỗi” thật ra là “user không hiểu”, và đó là vấn đề UX chứ không phải bug.',
  },
  {
    title: 'Quyết định dựa trên bằng chứng',
    body:
      'thay vì dựa trên “anh thấy nên làm vậy” - cái tôi và sprint build nhầm thứ không ai cần.',
  },
]

const uxOverviewBlameQuotes = [
  'Bug ở edgecase? Có thể UX define không kỹ rồi.',
  'Số tụt? Hay là solution của UX chưa ổn?',
  'Feature không ai xài? UX có nghiên cứu hành vi chưa?',
  'Trời mưa, server lag, KPI không đạt, cơm Danh Hoa ko ngon?... chắc là do UX rồi',
]

const uxOverviewHubDirections = [
  {
    title: 'PO / stakeholder muốn order research',
    body: 'vào thẳng Order một research.',
  },
  {
    title: 'Muốn hiểu quy trình research chạy thế nào',
    body: 'xem UXR Workflow.',
  },
  {
    title: 'Phân vân nên dùng method nào',
    body: 'tra Method Picker Matrix.',
  },
  {
    title: 'Người trong team, tìm nguyên tắc & pattern',
    body: 'lượn quanh mục UXD / UXR ở sidebar.',
  },
]

function getCurrentHash() {
  if (typeof window === 'undefined') {
    return ''
  }

  return window.location.hash.replace('#', '')
}

function isSurveyPath() {
  if (typeof window === 'undefined') {
    return false
  }

  return (
    window.location.pathname === '/docs/uxr/methods/survey' ||
    getCurrentHash() === 'docs-uxr-methods-survey'
  )
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

function getInitialView(): ActiveView {
  if (typeof window === 'undefined') {
    return { type: 'overview' }
  }

  const hash = getCurrentHash()

  if (hash === 'principles') {
    return { type: 'principles' }
  }

  if (hash.startsWith('ui-team-')) {
    const pendingSection = pendingSections.find(
      (section) =>
        `ui-team-${section.toLowerCase().replaceAll(' ', '-')}` === hash
    )

    if (pendingSection) {
      return { type: 'pending', label: pendingSection }
    }
  }

  const principle = uiTeamPrinciples.find((item) => item.id === hash)

  if (principle) {
    return { type: 'principle', principleId: principle.id }
  }

  return { type: 'overview' }
}

function getInitialTeamTab(): TeamTab {
  if (typeof window === 'undefined') {
    return 'UI Team'
  }

  const hash = getCurrentHash()

  if (hash.startsWith('our-team-')) {
    return 'Our team here'
  }

  if (isSurveyPath() || hash.startsWith('ux-team-')) {
    return 'UX Team'
  }

  if (hash === 'motion-hub') {
    return 'Motion Hub'
  }

  return 'UI Team'
}

function getInitialOurTeamView(): OurTeamView {
  if (typeof window === 'undefined') {
    return 'overview'
  }

  const hash = getCurrentHash()

  if (hash === 'our-team-overview') {
    return 'overview'
  }

  return 'overview'
}

function getInitialUXTeamView(): UXTeamView {
  if (typeof window === 'undefined') {
    return defaultUXTeamView
  }

  if (isSurveyPath()) {
    return { parentId: 'ux-research', childId: 'methods', grandchildId: 'survey' }
  }

  const hash = getCurrentHash()

  if (!hash.startsWith('ux-team-')) {
    return defaultUXTeamView
  }

  const [, sectionId = defaultUXTeamView.parentId, childId, grandchildId] =
    hash.match(/^ux-team-([a-z-]+?)(?:--([a-z-]+))?(?:--([a-z-]+))?$/) ?? []
  const parent = uxTeamSections.find((section) => section.id === sectionId)
  const child = parent?.children.find((item) => item.id === childId)
  const grandchild =
    child && 'children' in child
      ? child.children.find((item) => item.id === grandchildId)
      : undefined

  if (parent) {
    return normalizeUXTeamView({
      parentId: parent.id,
      childId: child?.id,
      grandchildId: grandchild?.id,
    })
  }

  return defaultUXTeamView
}

function getInitialLandingState() {
  if (typeof window === 'undefined') {
    return true
  }

  const hash = getCurrentHash()

  if (isSurveyPath()) {
    return false
  }

  if (!hash || hash === 'landing') {
    return true
  }

  return false
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
    return
  }

  if (view.type === 'pending') {
    window.history.replaceState(
      null,
      '',
      `#ui-team-${view.label.toLowerCase().replaceAll(' ', '-')}`
    )
  }
}

function updateUXHash(view: UXTeamView) {
  const normalizedView = normalizeUXTeamView(view)
  const parent = uxTeamSections.find(
    (section) => section.id === normalizedView.parentId
  )
  const child = parent?.children.find(
    (item) => item.id === normalizedView.childId
  )
  const grandchild =
    child && 'children' in child
      ? child.children.find((item) => item.id === normalizedView.grandchildId)
      : undefined

  if (
    parent?.id === 'ux-research' &&
    child?.id === 'methods' &&
    grandchild?.id === 'survey'
  ) {
    window.history.replaceState(null, '', '#docs-uxr-methods-survey')
    return
  }

  window.history.replaceState(
    null,
    '',
    `#ux-team-${parent?.id ?? defaultUXTeamView.parentId}${
      child ? `--${child.id}` : ''
    }${
      grandchild ? `--${grandchild.id}` : ''
    }`
  )
}

function normalizeUXTeamView(view: UXTeamView): UXTeamView {
  const parent = uxTeamSections.find((section) => section.id === view.parentId)
  const child = parent?.children.find((item) => item.id === view.childId)

  if (!parent) {
    return view
  }

  if (!child) {
    const [firstChild] = parent.children

    if (!firstChild) {
      return view
    }

    if ('children' in firstChild && Array.isArray(firstChild.children)) {
      const [firstGrandchild] = firstChild.children

      return {
        parentId: parent.id,
        childId: firstChild.id,
        grandchildId: firstGrandchild?.id,
      }
    }

    return {
      parentId: parent.id,
      childId: firstChild.id,
    }
  }

  if (
    !('children' in child) ||
    !Array.isArray(child.children) ||
    view.grandchildId
  ) {
    return view
  }

  const [firstGrandchild] = child.children

  if (!firstGrandchild) {
    return view
  }

  return {
    parentId: parent.id,
    childId: child.id,
    grandchildId: firstGrandchild.id,
  }
}

type MobileCardNavLink = {
  key: string
  label: string
  level?: 1 | 2 | 3
  onSelect: () => void
  soon?: boolean
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
  onOpenSearch,
}: {
  activeTeamTab: TeamTab
  isLandingActive: boolean
  items: MobileCardNavItem[]
  onOpenLanding: () => void
  onOpenSearch: () => void
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const navRef = useRef<HTMLElement | null>(null)
  const logoRef = useRef<HTMLButtonElement | null>(null)
  const cardsRef = useRef<Array<HTMLElement | null>>([])
  const timelineRef = useRef<gsap.core.Timeline | null>(null)

  function calculateHeight() {
    return window.innerHeight - 32
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
          <div className="flex items-center gap-1">
            <button
              aria-label="Tìm kiếm"
              className="mobile-card-nav-icon-button"
              onClick={() => {
                closeMenu()
                onOpenSearch()
              }}
              type="button"
            >
              <Search aria-hidden="true" className="size-5" />
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
                    className={cn(
                      'mobile-card-nav-card-link',
                      `mobile-card-nav-card-link-level-${link.level ?? 1}`
                    )}
                    key={link.key}
                    onClick={() => handleLinkSelect(link)}
                    type="button"
                  >
                    <ArrowUpRight aria-hidden="true" className="size-4" />
                    <span>{link.label}</span>
                    {link.soon && <SidebarSoonBadge />}
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
  onUXTeamViewChange,
  onViewChange,
}: {
  activeTeamTab: TeamTab
  isLandingActive: boolean
  onOpenLanding: () => void
  onOurTeamViewChange: (view: OurTeamView) => void
  onTeamTabChange: (tab: TeamTab) => void
  onUXTeamViewChange: (view: UXTeamView) => void
  onViewChange: (view: ActiveView) => void
}) {
  const desktopLogoRef = useRef<HTMLButtonElement | null>(null)
  const searchInputRef = useRef<HTMLInputElement | null>(null)
  const searchExitTimeoutRef = useRef<number | null>(null)
  const [isSearchMounted, setIsSearchMounted] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeSearchIndex, setActiveSearchIndex] = useState(0)
  const [hasScrolled, setHasScrolled] = useState(false)
  const mobileNavItems: MobileCardNavItem[] = [
    {
      label: 'Our team here',
      links: ourTeamSections.map((section) => ({
        key: `our-team-${section.id}`,
        label: section.label,
        level: 1,
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
          key: 'ui-team-overview',
          label: 'Tổng quan',
          level: 1,
          onSelect: () => {
            onTeamTabChange('UI Team')
            onViewChange({ type: 'overview' })
          },
        },
        {
          key: 'ui-team-principles',
          label: 'Principles',
          level: 1,
          onSelect: () => {
            onTeamTabChange('UI Team')
            onViewChange({ type: 'principles' })
          },
        },
        ...pendingSections.map((section) => ({
          key: `ui-team-${section.toLowerCase().replaceAll(' ', '-')}`,
          label: section,
          level: 1 as const,
          onSelect: () => {
            onTeamTabChange('UI Team')
            onViewChange({ type: 'pending', label: section })
          },
          soon: true,
        })),
      ],
    },
    {
      label: 'UX Team',
      links: uxTeamSections.flatMap((section) => [
        {
          key: `ux-team-${section.id}`,
          label: section.label,
          level: 1 as const,
          onSelect: () => {
            onTeamTabChange('UX Team')
            onUXTeamViewChange({ parentId: section.id })
          },
          soon: section.id === 'ux-writing',
        },
        ...section.children.flatMap((child) => {
          const grandChildren =
            'children' in child && Array.isArray(child.children)
              ? child.children.map((grandchild) => ({
                  id: grandchild.id,
                  label: grandchild.label,
                }))
              : []

          return [
            {
              key: `ux-team-${section.id}-${child.id}`,
              label: child.label,
              level: 2 as const,
              onSelect: () => {
                onTeamTabChange('UX Team')
                onUXTeamViewChange({
                  parentId: section.id,
                  childId: child.id,
                })
              },
              soon: section.id === 'ux-writing',
            },
            ...grandChildren.map((grandchild) => ({
              key: `ux-team-${section.id}-${child.id}-${grandchild.id}`,
              label: grandchild.label,
              level: 3 as const,
              onSelect: () => {
                onTeamTabChange('UX Team')
                onUXTeamViewChange({
                  parentId: section.id,
                  childId: child.id,
                  grandchildId: grandchild.id,
                })
              },
              soon: section.id === 'ux-writing',
            })),
          ]
        }),
      ]),
    },
    {
      label: 'Motion Hub',
      links: [
        {
          key: 'motion-hub-pending',
          label: 'To be updated',
          level: 1,
          onSelect: () => onTeamTabChange('Motion Hub'),
          soon: true,
        },
      ],
    },
  ]
  const searchItems = useMemo<IntroductionSearchItem[]>(() => {
    const items: IntroductionSearchItem[] = []

    function addItem(item: IntroductionSearchItem) {
      items.push(item)
    }

    addItem({
      id: 'landing',
      label: 'Design Hub Landing',
      meta: 'Trang mở đầu',
      description:
        'Giới thiệu tổng quan về Design Hub, UI Principle, UI Pattern, Design System và Knowledge Hub.',
      keywords:
        'home introduction landing design hub ui principle ui pattern design system knowledge hub',
      onSelect: onOpenLanding,
    })

    ourTeamSections.forEach((section) => {
      addItem({
        id: `our-team-${section.id}`,
        label: section.label,
        meta: 'Our team here',
        description:
          'Tổng quan cách Product Design phối hợp giữa UX, UI, Research, Writing và Motion.',
        keywords:
          'product design team ux design ui design ux research ux writing motion design',
        onSelect: () => {
          onTeamTabChange('Our team here')
          onOurTeamViewChange(section.id)
        },
      })
    })

    addItem({
      id: 'ui-team-overview',
      label: 'Tổng quan UI Team',
      meta: 'UI Team',
      description:
        'Vai trò UI Team trong việc tạo ngôn ngữ trực quan nhất quán cho Zalopay.',
      keywords: [
        ...overviewIntroParagraphs,
        ...trafficExperienceLayers,
        ...sharedLanguageBullets,
        ...missingLayerNotes,
        ...uiTeamRoleParagraphs,
      ].join(' '),
      onSelect: () => {
        onTeamTabChange('UI Team')
        onViewChange({ type: 'overview' })
      },
    })

    addItem({
      id: 'ui-team-principles',
      label: 'UI Principles',
      meta: 'UI Team',
      description:
        'Danh sách nguyên tắc UI giúp thiết kế rõ ràng, nhất quán, đáng tin và dễ mở rộng.',
      keywords: uiTeamPrinciples
        .map((principle) => `${principle.title} ${principle.subtitle}`)
        .join(' '),
      onSelect: () => {
        onTeamTabChange('UI Team')
        onViewChange({ type: 'principles' })
      },
    })

    uiTeamPrinciples.forEach((principle) => {
      addItem({
        id: `ui-principle-${principle.id}`,
        label: principle.title,
        meta: 'UI Principle',
        description: principle.subtitle,
        keywords: [
          principle.subtitle,
          ...principle.intro,
          ...principle.applicationRules,
          ...principle.criteria,
          ...principle.reasons,
        ].join(' '),
        onSelect: () => {
          onTeamTabChange('UI Team')
          onViewChange({ type: 'principle', principleId: principle.id })
        },
      })
    })

    pendingSections.forEach((section) => {
      addItem({
        id: `ui-team-${section.toLowerCase().replaceAll(' ', '-')}`,
        label: section,
        meta: 'UI Team',
        description: 'Khu vực đang được hoàn thiện.',
        keywords: `${section} coming soon to be updated`,
        onSelect: () => {
          onTeamTabChange('UI Team')
          onViewChange({ type: 'pending', label: section })
        },
      })
    })

    uxTeamSections.forEach((section) => {
      addItem({
        id: `ux-team-${section.id}`,
        label: section.label,
        meta: 'UX Team',
        description: section.description,
        keywords: section.description,
        onSelect: () => {
          onUXTeamViewChange({ parentId: section.id })
        },
      })

      section.children.forEach((child) => {
        addItem({
          id: `ux-team-${section.id}-${child.id}`,
          label: child.label,
          meta: `${section.label} / UX Team`,
          description: child.description,
          keywords: child.description,
          onSelect: () => {
            onUXTeamViewChange({
              parentId: section.id,
              childId: child.id,
            })
          },
        })

        if ('children' in child && Array.isArray(child.children)) {
          child.children.forEach((grandchild) => {
            addItem({
              id: `ux-team-${section.id}-${child.id}-${grandchild.id}`,
              label: grandchild.label,
              meta: `${section.label} / ${child.label}`,
              description: grandchild.description,
              keywords: grandchild.description,
              onSelect: () => {
                onUXTeamViewChange({
                  parentId: section.id,
                  childId: child.id,
                  grandchildId: grandchild.id,
                })
              },
            })
          })
        }
      })
    })

    addItem({
      id: 'motion-hub',
      label: 'Motion Hub',
      meta: 'To be updated',
      description:
        'Khu vực motion guideline, interaction motion và animation pattern sẽ được cập nhật.',
      keywords: 'motion animation interaction transition feedback to be updated',
      onSelect: () => onTeamTabChange('Motion Hub'),
    })

    return items
  }, [
    onOpenLanding,
    onOurTeamViewChange,
    onTeamTabChange,
    onUXTeamViewChange,
    onViewChange,
  ])
  const filteredSearchItems = useMemo(() => {
    const normalizedQuery = normalizeSearchText(searchQuery.trim())

    if (!normalizedQuery) {
      return searchItems.slice(0, MAX_INTRO_SEARCH_RESULTS)
    }

    return searchItems
      .map((item) => {
        const searchableText = normalizeSearchText(
          `${item.label} ${item.meta} ${item.description} ${item.keywords}`
        )
        const labelText = normalizeSearchText(item.label)
        const metaText = normalizeSearchText(item.meta)
        const startsWithLabel = labelText.startsWith(normalizedQuery)
        const includesLabel = labelText.includes(normalizedQuery)
        const includesMeta = metaText.includes(normalizedQuery)

        if (!searchableText.includes(normalizedQuery)) {
          return null
        }

        return {
          item,
          score:
            (startsWithLabel ? 40 : 0) +
            (includesLabel ? 20 : 0) +
            (includesMeta ? 8 : 0),
        }
      })
      .filter((result): result is { item: IntroductionSearchItem; score: number } =>
        Boolean(result)
      )
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_INTRO_SEARCH_RESULTS)
      .map((result) => result.item)
  }, [searchItems, searchQuery])

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
      setActiveSearchIndex(0)
      searchExitTimeoutRef.current = null
    }, SEARCH_MODAL_EXIT_MS)
  }

  function selectSearchItem(item: IntroductionSearchItem) {
    item.onSelect()
    closeSearch()
  }

  useEffect(() => {
    return () => {
      if (searchExitTimeoutRef.current) {
        window.clearTimeout(searchExitTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    setActiveSearchIndex(0)
  }, [searchQuery])

  useEffect(() => {
    if (activeSearchIndex > filteredSearchItems.length - 1) {
      setActiveSearchIndex(Math.max(0, filteredSearchItems.length - 1))
    }
  }, [activeSearchIndex, filteredSearchItems.length])

  useEffect(() => {
    function handleGlobalKeyDown(event: KeyboardEvent) {
      const isSearchShortcut =
        (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k'

      if (isSearchShortcut) {
        event.preventDefault()
        openSearch()
        return
      }

      if (event.key === 'Escape' && isSearchOpen) {
        closeSearch()
      }
    }

    document.addEventListener('keydown', handleGlobalKeyDown)
    return () => document.removeEventListener('keydown', handleGlobalKeyDown)
  }, [isSearchOpen])

  useEffect(() => {
    if (!isSearchOpen) {
      return
    }

    const frameId = window.requestAnimationFrame(() => {
      searchInputRef.current?.focus()
    })

    return () => window.cancelAnimationFrame(frameId)
  }, [isSearchOpen])

  useEffect(() => {
    function updateHeaderShadow() {
      setHasScrolled(window.scrollY > 4)
    }

    updateHeaderShadow()
    window.addEventListener('scroll', updateHeaderShadow, { passive: true })

    return () => window.removeEventListener('scroll', updateHeaderShadow)
  }, [])

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-30 border-b bg-transparent transition-[border-color,box-shadow] duration-200 lg:bg-[var(--ds-background-primary)] lg:backdrop-blur',
          hasScrolled
            ? 'border-[var(--ds-border-stroke2)] lg:shadow-[0_2px_16px_rgba(0,31,62,0.06)]'
            : 'border-transparent shadow-none'
        )}
      >
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
          onOpenSearch={openSearch}
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
            onClick={openSearch}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <Search />
          </Button>
        </div>
      </div>
      </header>

      {isSearchMounted && (
        <div
          aria-modal="true"
          className="hub-command-backdrop fixed inset-0 z-50 flex items-start justify-center bg-black/25 px-4 pt-[12svh] backdrop-blur-[3px]"
          data-state={isSearchOpen ? 'open' : 'closed'}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeSearch()
            }
          }}
          role="dialog"
        >
          <div
            className="hub-command-panel w-full max-w-2xl overflow-hidden rounded-2xl border border-[var(--ds-border-stroke2)] bg-[var(--ds-background-primary)] text-[var(--ds-text-primary)] shadow-[0_28px_80px_rgba(0,31,62,0.18)]"
            data-state={isSearchOpen ? 'open' : 'closed'}
          >
            <div className="flex h-16 items-center gap-3 border-b border-[var(--ds-border-stroke1)] px-5">
              <Search
                aria-hidden="true"
                className="size-5 shrink-0 text-[var(--ds-text-tertiary)]"
              />
              <input
                aria-activedescendant={
                  filteredSearchItems[activeSearchIndex]
                    ? `intro-search-${filteredSearchItems[activeSearchIndex].id}`
                    : undefined
                }
                aria-label="Tìm kiếm trong Design Hub"
                className="h-full min-w-0 flex-1 bg-transparent text-lg font-medium outline-none placeholder:text-[var(--ds-text-tertiary)]"
                onChange={(event) => setSearchQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowDown') {
                    event.preventDefault()
                    setActiveSearchIndex((current) =>
                      Math.min(
                        current + 1,
                        Math.max(0, filteredSearchItems.length - 1)
                      )
                    )
                  }

                  if (event.key === 'ArrowUp') {
                    event.preventDefault()
                    setActiveSearchIndex((current) => Math.max(current - 1, 0))
                  }

                  if (event.key === 'Enter') {
                    event.preventDefault()
                    const selectedItem = filteredSearchItems[activeSearchIndex]

                    if (selectedItem) {
                      selectSearchItem(selectedItem)
                    }
                  }
                }}
                placeholder="Tìm trang, guideline hoặc nội dung..."
                ref={searchInputRef}
                role="combobox"
                type="search"
                value={searchQuery}
              />
              <kbd className="hidden rounded-lg bg-[var(--ds-background-secondary)] px-2 py-1 text-xs font-semibold text-[var(--ds-text-tertiary)] sm:inline-flex">
                esc
              </kbd>
            </div>

            <div
              className="max-h-[60svh] overflow-y-auto p-2"
              role="listbox"
            >
              {filteredSearchItems.length > 0 ? (
                <div className="space-y-1">
                  {filteredSearchItems.map((item, index) => (
                    <button
                      aria-selected={index === activeSearchIndex}
                      className={cn(
                        'flex min-h-16 w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-[var(--ds-component-item-hover)] focus-visible:bg-[var(--ds-component-item-hover)] focus-visible:outline-none',
                        index === activeSearchIndex &&
                          'bg-[var(--ds-component-item-hover)]'
                      )}
                      id={`intro-search-${item.id}`}
                      key={item.id}
                      onClick={() => selectSearchItem(item)}
                      onMouseEnter={() => setActiveSearchIndex(index)}
                      role="option"
                      type="button"
                    >
                      <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--ds-background-zpblue-subtle)] text-[var(--ds-text-link)]">
                        <Search aria-hidden="true" className="size-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="truncate text-sm font-bold leading-5 text-[var(--ds-text-primary)]">
                            {getHighlightedParts(item.label, searchQuery).map(
                              (part, partIndex) =>
                                part.isMatch ? (
                                  <mark
                                    className="rounded bg-[var(--brand-green-soft)] px-0.5 text-[#007A3D]"
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
                          <span className="shrink-0 rounded-full bg-[var(--ds-background-secondary)] px-2 py-0.5 text-[11px] font-semibold text-[var(--ds-text-tertiary)]">
                            {getHighlightedParts(item.meta, searchQuery).map(
                              (part, partIndex) =>
                                part.isMatch ? (
                                  <mark
                                    className="rounded bg-[var(--brand-green-soft)] px-0.5 text-[#007A3D]"
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
                        </span>
                        <span className="mt-1 line-clamp-2 block text-sm leading-6 text-[var(--ds-text-secondary)]">
                          {getHighlightedParts(item.description, searchQuery).map(
                            (part, partIndex) =>
                              part.isMatch ? (
                                <mark
                                  className="rounded bg-[var(--brand-green-soft)] px-0.5 text-[#007A3D]"
                                  key={`${item.id}-description-${partIndex}`}
                                >
                                  {part.text}
                                </mark>
                              ) : (
                                <span
                                  key={`${item.id}-description-${partIndex}`}
                                >
                                  {part.text}
                                </span>
                              )
                          )}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex min-h-40 flex-col items-center justify-center gap-2 px-6 text-center">
                  <Search
                    aria-hidden="true"
                    className="size-5 text-[var(--ds-text-tertiary)]"
                  />
                  <p className="text-sm font-bold text-[var(--ds-text-primary)]">
                    Không tìm thấy kết quả
                  </p>
                  <p className="max-w-sm text-xs leading-5 text-[var(--ds-text-secondary)]">
                    Thử tìm theo tên team, principle, research method hoặc nội
                    dung như survey, workflow, hierarchy.
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t border-[var(--ds-border-stroke1)] px-5 py-3 text-xs font-medium text-[var(--ds-text-tertiary)]">
              <span>Gợi ý:</span>
              {['Survey', 'Research workflow', 'UI Principle', 'Design System'].map(
                (suggestion) => (
                  <button
                    className="rounded-full bg-[var(--ds-background-secondary)] px-3 py-1.5 transition-colors hover:bg-[var(--ds-component-item-hover)] hover:text-[var(--ds-text-link)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--ds-border-zpblue-subtle)]"
                    key={suggestion}
                    onClick={() => setSearchQuery(suggestion)}
                    type="button"
                  >
                    {suggestion}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </>
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

function SidebarSoonBadge() {
  return (
    <span className="rounded-full border border-[var(--ds-border-stroke2)] bg-[var(--ds-background-primary)] px-2 py-0.5 text-[10px] font-bold uppercase leading-4 text-[var(--ds-text-tertiary)]">
      Soon
    </span>
  )
}

function SidebarContent({
  activeTeamTab,
  activeOurTeamView,
  activeUXTeamView,
  activeView,
  compact = false,
  onOurTeamViewSelect,
  onTeamTabSelect,
  onUXTeamViewSelect,
  onSelect,
}: {
  activeTeamTab: TeamTab
  activeOurTeamView: OurTeamView
  activeUXTeamView: UXTeamView
  activeView?: ActiveView
  compact?: boolean
  onOurTeamViewSelect?: (view: OurTeamView) => void
  onTeamTabSelect?: (tab: TeamTab) => void
  onUXTeamViewSelect?: (view: UXTeamView) => void
  onSelect?: (view: ActiveView) => void
}) {
  const navRef = useRef<HTMLElement | null>(null)
  const [openGroups, setOpenGroups] = useState({
    motionHub: false,
    ourTeam: false,
    uiTeam: true,
    uxTeam: false,
    uxOverview: false,
    uxResearch: true,
    uxResearchMethods: false,
    uxResearchWorkflow: false,
    uxDesign: false,
    uxPattern: false,
    uxWorkflow: false,
    uxWriting: false,
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
      uxOverview:
        activeTeamTab === 'UX Team' &&
        activeUXTeamView.parentId === 'overview',
      uxResearch:
        activeTeamTab === 'UX Team' &&
        activeUXTeamView.parentId === 'ux-research',
      uxResearchMethods:
        activeTeamTab === 'UX Team' &&
        activeUXTeamView.parentId === 'ux-research' &&
        activeUXTeamView.childId === 'methods',
      uxResearchWorkflow:
        activeTeamTab === 'UX Team' &&
        activeUXTeamView.parentId === 'ux-research' &&
        activeUXTeamView.childId === 'workflow',
      uxDesign:
        activeTeamTab === 'UX Team' &&
        activeUXTeamView.parentId === 'ux-design',
      uxPattern:
        activeTeamTab === 'UX Team' &&
        activeUXTeamView.parentId === 'ux-design' &&
        activeUXTeamView.childId === 'ux-pattern',
      uxWorkflow:
        activeTeamTab === 'UX Team' &&
        activeUXTeamView.parentId === 'ux-design' &&
        activeUXTeamView.childId === 'workflow',
      uxWriting:
        activeTeamTab === 'UX Team' &&
        activeUXTeamView.parentId === 'ux-writing',
    })
  }, [activeTeamTab, activeView, activeUXTeamView])

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
  const activeUXTeamParentIndex =
    activeTeamTab === 'UX Team'
      ? uxTeamSections.findIndex(
          (section) => section.id === activeUXTeamView.parentId
        )
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

  function selectUXTeamView(view: UXTeamView) {
    onTeamTabSelect?.('UX Team')
    onUXTeamViewSelect?.(view)
  }

  function handleMainTabClick(tab: TeamTab) {
    const isCurrentTab = activeTeamTab === tab

    if (
      (tab === 'Our team here' || tab === 'UI Team' || tab === 'UX Team') &&
      isCurrentTab
    ) {
      toggleGroup(sidebarMainGroupKeys[tab])
      return
    }

    if (tab === 'Our team here' || tab === 'UI Team' || tab === 'UX Team') {
      setOpenGroups((current) => ({
        ...current,
        [sidebarMainGroupKeys[tab]]: true,
      }))
    }

    selectTeamTab(tab)
  }

  function getUXSectionGroupKey(sectionId: string) {
    if (sectionId === 'overview') {
      return 'uxOverview' as const
    }

    if (sectionId === 'ux-design') {
      return 'uxDesign' as const
    }

    if (sectionId === 'ux-writing') {
      return 'uxWriting' as const
    }

    return 'uxResearch' as const
  }

  function getUXChildGroupKey(sectionId: string, childId: string) {
    if (sectionId === 'ux-research' && childId === 'methods') {
      return 'uxResearchMethods' as const
    }

    if (sectionId === 'ux-research' && childId === 'workflow') {
      return 'uxResearchWorkflow' as const
    }

    if (sectionId === 'ux-design' && childId === 'workflow') {
      return 'uxWorkflow' as const
    }

    return 'uxPattern' as const
  }

  function renderMainTab(tab: TeamTab) {
    const groupKey = sidebarMainGroupKeys[tab]
    const isActive = activeTeamTab === tab
    const hasChildren =
      tab === 'Our team here' || tab === 'UI Team' || tab === 'UX Team'
    const shouldShowActiveBackground = isActive && !hasChildren

    return (
      <button
        aria-expanded={hasChildren ? openGroups[groupKey] : undefined}
        data-sidebar-active={isActive}
        className={cn(
          'flex h-12 w-full items-center justify-between rounded-xl px-4 text-left text-base font-medium leading-6 transition-colors hover:bg-[#F7FBFF] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--ds-border-zpblue-subtle)]',
          isActive
            ? cn(
                'font-bold text-[var(--ds-text-primary)]',
                shouldShowActiveBackground && 'bg-[#FAFCFF]'
              )
            : 'text-[var(--ds-text-tertiary)]'
        )}
        onClick={() => handleMainTabClick(tab)}
        type="button"
      >
        <span className="flex items-center gap-2">
          {tab}
          {tab === 'Motion Hub' && <SidebarSoonBadge />}
        </span>
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
        className={cn(
          sidebarSpacing.childIndentClass,
          sidebarSpacing.childGapClass,
          className
        )}
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
              <span className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-base font-normal leading-6">
                {item}
                {pendingSections.includes(item as (typeof pendingSections)[number]) && (
                  <SidebarSoonBadge />
                )}
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
                className: sidebarSpacing.childListTopGapClass,
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
              className: sidebarSpacing.childListTopGapClass,
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

          <div
            className="hub-sidebar-accordion"
            data-state={openGroups.uxTeam ? 'open' : 'closed'}
          >
            <div
              className={cn(
                'hub-sidebar-accordion-content',
                sidebarSpacing.childListTopGapClass,
                sidebarSpacing.childGapClass
              )}
            >
              {uxTeamSections.map((section) => {
                const groupKey = getUXSectionGroupKey(section.id)
                const hasChildren = section.children.length > 0
                const sectionIndex = uxTeamSections.findIndex(
                  (item) => item.id === section.id
                )
                const isParentActive =
                  activeUXTeamParentIndex === sectionIndex
                const activeChildIndex =
                  activeTeamTab === 'UX Team' &&
                  activeUXTeamView.parentId === section.id &&
                  activeUXTeamView.childId
                    ? section.children.findIndex(
                        (child) => child.id === activeUXTeamView.childId
                      )
                    : null

                return (
                  <div key={section.id}>
                    <button
                      aria-current={isParentActive ? 'true' : undefined}
                      aria-expanded={hasChildren ? openGroups[groupKey] : undefined}
                      className={cn(
                        'flex w-full items-center justify-between rounded-2xl text-left transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--ds-border-zpblue-subtle)]',
                        sidebarSpacing.primaryChildHeightClass,
                        sidebarSpacing.childIndentClass,
                        isParentActive
                          ? 'bg-[#F5F9FF] text-[#001F3E]'
                          : 'text-[var(--ds-text-tertiary)] hover:bg-[#FAFCFF]'
                      )}
                      data-sidebar-active={isParentActive}
                      onClick={() => {
                        if (!hasChildren) {
                          selectUXTeamView({ parentId: section.id })
                          return
                        }

                        if (
                          activeTeamTab === 'UX Team' &&
                          activeUXTeamView.parentId === section.id
                        ) {
                          toggleGroup(groupKey)
                          return
                        }

                        setOpenGroups((current) => ({
                          ...current,
                          uxTeam: true,
                          [groupKey]: true,
                        }))
                        selectUXTeamView({ parentId: section.id })
                      }}
                      type="button"
                    >
                      <span className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-base font-normal leading-6">
                        {section.label}
                        {section.id === 'ux-writing' && <SidebarSoonBadge />}
                      </span>
                      {hasChildren && (
                        <ChevronDown
                          className={cn(
                            'mr-3 size-4 text-[var(--ds-text-secondary)] transition-transform',
                            openGroups[groupKey] ? 'rotate-180' : 'rotate-0'
                          )}
                        />
                      )}
                    </button>

                    {hasChildren && (
                      <div
                        className="hub-sidebar-accordion"
                        data-state={openGroups[groupKey] ? 'open' : 'closed'}
                      >
                        <div
                          className={cn(
                            'hub-sidebar-accordion-content',
                            sidebarSpacing.childIndentClass,
                            sidebarSpacing.childLevelGapClass,
                            'ml-3 border-l border-[var(--ds-border-stroke2)] pl-3'
                          )}
                        >
                          {section.children.some(
                            (child) =>
                              'children' in child && child.children.length > 0
                          ) ? (
                            <div className="space-y-[8px]">
                              {section.children.map((child) => {
                                const grandChildren =
                                  'children' in child ? child.children : []
                                const hasGrandChildren =
                                  grandChildren.length > 0
                                const childGroupKey = hasGrandChildren
                                  ? getUXChildGroupKey(section.id, child.id)
                                  : null
                                const isChildActive =
                                  activeTeamTab === 'UX Team' &&
                                  activeUXTeamView.parentId === section.id &&
                                  activeUXTeamView.childId === child.id
                                const activeGrandChildIndex =
                                  isChildActive && activeUXTeamView.grandchildId
                                    ? grandChildren.findIndex(
                                        (item) =>
                                          item.id ===
                                          activeUXTeamView.grandchildId
                                      )
                                    : null

                                return (
                                  <div key={child.id}>
                                    <button
                                      aria-current={
                                        isChildActive ? 'true' : undefined
                                      }
                                      aria-expanded={
                                        childGroupKey
                                          ? openGroups[childGroupKey]
                                          : undefined
                                      }
                                      className={cn(
                                        'flex min-h-9 w-full items-center justify-between rounded-lg border border-transparent px-3 text-left text-[13px] leading-5 transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--ds-border-zpblue-subtle)]',
                                        isChildActive
                                          ? 'border-[var(--ds-border-zpblue-subtle)] bg-[var(--ds-background-primary)] font-semibold text-[#001F3E]'
                                          : 'text-[var(--ds-text-tertiary)] hover:bg-[var(--ds-background-primary)]'
                                      )}
                                      data-sidebar-active={isChildActive}
                                      onClick={() => {
                                        if (childGroupKey) {
                                          if (isChildActive) {
                                            toggleGroup(childGroupKey)
                                            return
                                          } else {
                                            setOpenGroups((current) => ({
                                              ...current,
                                              [groupKey]: true,
                                              [childGroupKey]: true,
                                            }))
                                          }
                                        }

                                        selectUXTeamView({
                                          parentId: section.id,
                                          childId: child.id,
                                        })
                                      }}
                                      type="button"
                                    >
                                      <span className="flex items-center gap-2">
                                        <span
                                          className={cn(
                                            'h-1.5 w-1.5 rounded-full',
                                            isChildActive
                                              ? 'bg-[var(--ds-text-link)]'
                                              : 'bg-[var(--ds-border-stroke2)]'
                                          )}
                                        />
                                        {child.label}
                                      </span>
                                      {childGroupKey && (
                                        <ChevronDown
                                          className={cn(
                                            'size-4 text-[var(--ds-text-secondary)] transition-transform',
                                            openGroups[childGroupKey]
                                              ? 'rotate-180'
                                              : 'rotate-0'
                                          )}
                                        />
                                      )}
                                    </button>

                                    {childGroupKey && (
                                      <div
                                        className="hub-sidebar-accordion"
                                        data-state={
                                          openGroups[childGroupKey]
                                            ? 'open'
                                            : 'closed'
                                        }
                                      >
                                        <div className="hub-sidebar-accordion-content pl-[16px] pt-[8px]">
                                          {renderSidebarLineList({
                                            activeIndex:
                                              activeGrandChildIndex !== null &&
                                              activeGrandChildIndex >= 0
                                                ? activeGrandChildIndex
                                                : null,
                                            className: 'pl-[0px] pt-[0px]',
                                            items: grandChildren.map(
                                              (item) => item.label
                                            ),
                                            onItemClick: (index) =>
                                              selectUXTeamView({
                                                parentId: section.id,
                                                childId: child.id,
                                                grandchildId:
                                                  grandChildren[index].id,
                                              }),
                                          })}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          ) : (
                            renderSidebarLineList({
                              activeIndex:
                                activeChildIndex !== null &&
                                activeChildIndex >= 0
                                  ? activeChildIndex
                                  : null,
                              className: 'pl-[0px] pt-[0px]',
                              items: section.children.map(
                                (child) => child.label
                              ),
                              onItemClick: (index) =>
                                selectUXTeamView({
                                  parentId: section.id,
                                  childId: section.children[index].id,
                                }),
                            })
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
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

function OurTeamContent() {
  return (
    <section>
      <h1 className={pageTitleClassName}>
        Our team is here
      </h1>
      <Separator className="mt-9 bg-[var(--ds-border-zpblue-subtle)]" />

      <article className="overview-article our-team-article mt-14 max-w-6xl">
        <section className="overview-hero our-team-hero">
          <h2 className="max-w-4xl text-2xl font-bold leading-9 text-[var(--ds-text-primary)] md:text-[2rem] md:leading-[2.75rem]">
            Một đội ngũ cùng xây dựng trải nghiệm tài chính đơn giản, gần gũi
            và đáng tin cậy.
          </h2>
        </section>

        <section className="mt-10">
          <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-4 text-base leading-8 text-[var(--ds-text-primary)]">
              <p>
                Product Design kết nối nhiều chuyên môn để biến những nghiệp vụ
                tài chính phức tạp thành hành trình rõ ràng, nhất quán và dễ sử
                dụng hơn cho người Việt.
              </p>
              <p>
                Chúng tôi cùng xây dựng một ngôn ngữ thiết kế chung, nơi mỗi
                luồng trải nghiệm, giao diện, chuyển động, hình ảnh và câu chữ
                hỗ trợ lẫn nhau.
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

        <section className="mt-14">
          <div className="max-w-3xl">
            <h3 className="text-xl font-bold leading-8 text-[var(--ds-text-primary)]">
              Những việc chúng tôi tập trung làm tốt
            </h3>
            <p className="mt-2 text-base leading-8 text-[var(--ds-text-secondary)]">
              Trang này không đi sâu vào từng quy trình. Nó giúp bạn nắm nhanh
              cách Product Design tạo ra chất lượng trải nghiệm ở Zalopay.
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

        <section className="mt-16 [&>section:first-child]:mt-0">
          <OverviewArticleSection title="Design System là nền tảng của ngôn ngữ chung">
            <p>
              Khi sản phẩm mở rộng, sự nhất quán không thể chỉ phụ thuộc vào
              kinh nghiệm cá nhân. Design System kết nối principle, component,
              pattern, nội dung, chuyển động và tài liệu hướng dẫn thành một hệ
              thống chung.
            </p>
            <div className="overview-closing-block">
              <span>Mục đích chính:</span>
              <p>
                Giúp Product, Design và Engineering phối hợp hiệu quả hơn, hạn
                chế giải quyết lại những vấn đề đã có lời giải và duy trì chất
                lượng trải nghiệm trên quy mô lớn.
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
                cùng chia sẻ một mục tiêu: kiến tạo những trải nghiệm tài chính
                đơn giản, gần gũi và đáng tin cậy cho người Việt.
              </p>
            </div>
          </OverviewArticleSection>
        </section>
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

function LandingContent({
  onOpenMotionHub,
  onOpenOurTeam,
  onOpenUIPrinciples,
  onOpenUXResearch,
  onOpenUXTeam,
}: {
  onOpenMotionHub: () => void
  onOpenOurTeam: () => void
  onOpenUIPrinciples: () => void
  onOpenUXResearch: () => void
  onOpenUXTeam: () => void
}) {
  const landingRef = useRef<HTMLElement>(null)
  const [shouldRenderCollabCursor, setShouldRenderCollabCursor] =
    useState(false)
  const systemCards = [
    {
      accent: 'blue',
      eyebrow: 'Đội ngũ',
      label: 'Our team here',
      title: 'Product Design tại Zalopay',
      description:
        'Một nơi để hiểu các nhóm UX, UI, Research, Writing và Motion phối hợp với nhau như thế nào.',
      metric: '5 chuyên môn',
      onSelect: onOpenOurTeam,
    },
    {
      accent: 'green',
      eyebrow: 'Nguyên tắc',
      label: 'UI Team',
      title: 'UI Principle và ngôn ngữ thị giác',
      description:
        'Bộ nguyên tắc giúp giao diện rõ ràng, nhất quán, đáng tin và có thể scale qua nhiều feature.',
      metric: `${uiTeamPrinciples.length} nguyên tắc`,
      onSelect: onOpenUIPrinciples,
    },
    {
      accent: 'teal',
      eyebrow: 'Trải nghiệm',
      label: 'UX Team',
      title: 'UX method, pattern và workflow',
      description:
        'Cách team biến insight, hành trình, nội dung và nghiên cứu thành quyết định sản phẩm dễ hiểu hơn.',
      metric: 'UXD / UXR / UXW',
      onSelect: onOpenUXTeam,
    },
    {
      accent: 'violet',
      eyebrow: 'Motion',
      label: 'Motion Hub',
      title: 'Motion như một cách dẫn dắt sản phẩm',
      description:
        'Không chỉ làm giao diện sinh động, motion giúp hướng sự chú ý, phản hồi trạng thái và nối ngữ cảnh.',
      metric: 'Sắp cập nhật',
      onSelect: onOpenMotionHub,
    },
  ]
  const featureLinks = [
    {
      title: 'Review UI theo nguyên tắc',
      description:
        'Dùng UI Principles để kiểm tra hierarchy, trạng thái, trust và accessibility.',
      label: 'Xem nguyên tắc',
      onSelect: onOpenUIPrinciples,
    },
    {
      title: 'Chuẩn bị research',
      description:
        'Xem workflow, chọn method phù hợp và chuẩn bị input trước khi gửi yêu cầu.',
      label: 'Xem workflow',
      onSelect: onOpenUXResearch,
    },
  ]

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)')

    function updateCollabCursorPreference() {
      setShouldRenderCollabCursor(pointerQuery.matches && !motionQuery.matches)
    }

    updateCollabCursorPreference()
    motionQuery.addEventListener('change', updateCollabCursorPreference)
    pointerQuery.addEventListener('change', updateCollabCursorPreference)

    return () => {
      motionQuery.removeEventListener('change', updateCollabCursorPreference)
      pointerQuery.removeEventListener('change', updateCollabCursorPreference)
    }
  }, [])

  useEffect(() => {
    document.body.classList.toggle(
      'hub-landing-cursor-active',
      shouldRenderCollabCursor
    )

    return () => {
      document.body.classList.remove('hub-landing-cursor-active')
      document.documentElement.style.removeProperty(
        '--login-you-cursor-opacity'
      )
      document.documentElement.style.removeProperty('--login-you-cursor-x')
      document.documentElement.style.removeProperty('--login-you-cursor-y')
    }
  }, [shouldRenderCollabCursor])

  const handleLandingPointerMove = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (!shouldRenderCollabCursor) {
        return
      }

      document.documentElement.style.setProperty(
        '--login-you-cursor-opacity',
        '1'
      )
      document.documentElement.style.setProperty(
        '--login-you-cursor-x',
        `${event.clientX}px`
      )
      document.documentElement.style.setProperty(
        '--login-you-cursor-y',
        `${event.clientY}px`
      )
    },
    [shouldRenderCollabCursor]
  )

  useEffect(() => {
    if (!shouldRenderCollabCursor) {
      return
    }

    function handleWindowPointerMove(event: globalThis.PointerEvent) {
      document.documentElement.style.setProperty(
        '--login-you-cursor-opacity',
        '1'
      )
      document.documentElement.style.setProperty(
        '--login-you-cursor-x',
        `${event.clientX}px`
      )
      document.documentElement.style.setProperty(
        '--login-you-cursor-y',
        `${event.clientY}px`
      )
    }

    function handleWindowPointerLeave() {
      document.documentElement.style.setProperty(
        '--login-you-cursor-opacity',
        '0'
      )
    }

    window.addEventListener('pointermove', handleWindowPointerMove, {
      passive: true,
    })
    window.addEventListener('pointerleave', handleWindowPointerLeave)

    return () => {
      window.removeEventListener('pointermove', handleWindowPointerMove)
      window.removeEventListener('pointerleave', handleWindowPointerLeave)
    }
  }, [shouldRenderCollabCursor])

  return (
    <section
      className={cn(
        'hub-landing',
        shouldRenderCollabCursor && 'login-collab-cursor-enabled'
      )}
      onPointerMove={handleLandingPointerMove}
      ref={landingRef}
    >
      <TargetCursor
        cursorColor="#2377ff"
        cursorColorOnTarget="#2377ff"
        hideDefaultCursor={false}
        showDot={false}
        targetSelector=".hub-landing-click-target"
      />
      <div className="hub-landing-hero">
        <div className="hub-landing-dot-background" aria-hidden="true">
          <DotGrid
            activeColor="#00CF6A"
            baseColor="#eff6ff"
            className="hub-landing-dot-grid"
            dotSize={4}
            gap={28}
            maxSpeed={2800}
            proximity={132}
            resistance={900}
            returnDuration={1.1}
            shockRadius={180}
            shockStrength={2.4}
            speedTrigger={95}
          />
        </div>
        <div className="hub-landing-hero__copy">
          <p className="hub-landing-eyebrow">Zalopay Design Hub</p>
          <h1>
            Cùng thiết kế trải nghiệm tốt hơn cùng{' '}
            <span className="hub-landing-heading-blue">Product Design</span>{' '}
            <span className="hub-landing-heading-green">team</span>
          </h1>
          <p>
            Nơi tập trung cách Product Design làm việc: team, nguyên tắc,
            pattern, nghiên cứu, nội dung và motion. Mục tiêu là giúp mọi người
            tìm nhanh, hiểu đúng và áp dụng nhất quán.
          </p>
          <div className="hub-landing-hero__actions">
            <Button
              className="hub-landing-click-target hub-landing-hero-cta h-11 rounded-full border-[var(--ds-border-zpblue-subtle)] bg-[var(--ds-background-primary)] px-5 text-[var(--ds-text-link)] hover:bg-[var(--ds-background-primary)] hover:text-[var(--ds-text-link)]"
              onClick={onOpenUIPrinciples}
              type="button"
              variant="outline"
            >
              Xem UI Principles
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Button>
            <Button
              className="hub-landing-click-target hub-landing-hero-cta h-11 rounded-full border-[var(--ds-border-zpblue-subtle)] bg-[var(--ds-background-primary)] px-5 text-[var(--ds-text-link)] hover:bg-[var(--ds-background-primary)] hover:text-[var(--ds-text-link)]"
              onClick={onOpenUXTeam}
              type="button"
              variant="outline"
            >
              Khám phá UX Team
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="hub-landing-news">
        <button
          className="hub-landing-click-target"
          onClick={onOpenUXResearch}
          type="button"
        >
          <span>Mới</span>
          UX Research workflow đã có method picker, hướng dẫn survey và điểm vào order research.
        </button>
        <button
          className="hub-landing-click-target"
          onClick={onOpenUIPrinciples}
          type="button"
        >
          <span>Hướng dẫn</span>
          UI Principles đã sẵn sàng để review clarity, trạng thái hệ thống, trust và accessibility.
        </button>
      </div>

      <section className="hub-landing-section">
        <div className="hub-landing-section__header">
          <p className="hub-landing-eyebrow">Các khu vực chính</p>
          <h2>Chọn đúng nơi để bắt đầu.</h2>
          <p>
            Mỗi tab phục vụ một nhu cầu khác nhau: hiểu team, review UI, tra cứu
            UX workflow hoặc chuẩn bị cho motion guideline.
          </p>
        </div>

        <div className="hub-landing-card-grid">
          {systemCards.map((card) => (
            <button
              className="hub-landing-card hub-landing-click-target"
              data-accent={card.accent}
              key={card.label}
              onClick={card.onSelect}
              type="button"
            >
              <span className="hub-landing-card__topline">
                <span>{card.eyebrow}</span>
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </span>
              <span className="hub-landing-card__title">{card.title}</span>
              <span className="hub-landing-card__body">{card.description}</span>
              <span className="hub-landing-card__footer">
                <span>{card.label}</span>
                <strong>{card.metric}</strong>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="hub-landing-discover">
        <div>
          <p className="hub-landing-eyebrow">Bạn đang cần gì?</p>
          <h2>Đi thẳng tới tác vụ phổ biến.</h2>
        </div>
        <div className="hub-landing-feature-grid">
          {featureLinks.map((item) => (
            <button
              className="hub-landing-feature hub-landing-click-target"
              key={item.title}
              onClick={item.onSelect}
              type="button"
            >
              <span>
                <Check aria-hidden="true" className="size-4 stroke-[3]" />
              </span>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
              <em>{item.label}</em>
            </button>
          ))}
        </div>
      </section>

      {shouldRenderCollabCursor &&
        createPortal(
          <div
            className="login-you-cursor hub-landing-you-cursor"
            aria-hidden="true"
          >
            <div className="login-you-cursor-arrow" />
            <div className="login-you-cursor-pill">You</div>
          </div>,
          document.body
        )}
    </section>
  )
}

function UXOverviewContent() {
  return (
    <article className="overview-article mt-10 max-w-6xl text-[var(--ds-text-primary)]">
      <div className="space-y-5">
        <div className="inline-flex rounded-full bg-[var(--ds-background-zpblue-subtle)] px-3 py-1 text-[11px] font-semibold uppercase leading-4 text-[var(--ds-text-link)]">
          Tài liệu
        </div>

        <div className="grid gap-3">
          <h2 className="max-w-4xl text-2xl font-bold leading-9 text-[var(--ds-text-primary)] md:text-[2rem] md:leading-[2.75rem]">
            Chào mừng bạn tới UX Hub
          </h2>
          <p className="max-w-3xl text-base leading-8 text-[var(--ds-text-secondary)] md:text-xl md:leading-9">
            Nơi team UX cất giữ cách họ nghĩ, thứ họ làm, và họ đã dìu nhau qua
            từng cú ngã như thế nào
          </p>
        </div>

        <p className="text-sm font-semibold leading-7 text-[var(--ds-text-primary)]">
          “Chắc hẳn bạn đã từng một lần trong đời nghe văng vẳng bên tai câu
          nói “Cái này UX chưa được tốt nè!””
        </p>
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <UXArticlePanel title="UX là gì?">
          <p>
            UX là{' '}
            <strong>trải nghiệm của người dùng khi họ chạm vào sản phẩm</strong> -
            từ lúc mở app, dò tìm nút, cho tới lúc bực mình rồi thoát ra.
            Việc của team UX là làm cho cái khúc “bực mình rồi thoát ra” ít
            xảy ra nhất có thể.
          </p>
          <p>
            Nói gọn hơn nữa: UX là{' '}
            <strong>
              khoảng cách giữa “cái team nghĩ user sẽ làm” và “cái user thật sự
              làm”
            </strong>
            . Khoảng cách đó càng gần thì sản phẩm càng dễ dùng.
          </p>
        </UXArticlePanel>

        <div className="overview-callout">
          <p className="text-sm font-bold leading-6 text-[var(--ds-text-primary)]">
            UX giúp team kéo gần khoảng cách giữa:
          </p>
          <OverviewBulletList
            items={[
              'Điều team kỳ vọng user sẽ hiểu.',
              'Điều user thật sự hiểu.',
              'Điều user có thể làm trơn tru trong sản phẩm.',
            ]}
          />
        </div>
      </div>

      <UXArticleSection
        description="Dẹp vài hiểu lầm kinh điển, viết ra một lần cho đỡ phải giải thích lần thứ một nghìn."
        title="UX không phải là gì"
      >
        <UXCardGrid items={uxOverviewMisconceptions} />
      </UXArticleSection>

      <UXArticleSection
        description="Zalopay là sản phẩm tài chính. Ở đây user đụng tới tiền của họ, mà tiền thì không ai có tâm trạng để mò thử xem sao."
        title="Tại sao Zalopay cần UX"
      >
        <UXCardGrid items={uxOverviewZalopayReasons} variant="numbered" />
      </UXArticleSection>

      <UXArticleSection
        description="Quy tắc ngón tay cái: gọi tụi mình khi bạn đang đứng trước một quyết định mà câu trả lời phụ thuộc vào việc user thật sự nghĩ hoặc làm gì."
        title="Khi nào thì gọi team UX"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <UXInfoCard
            label="01"
            text="Khi chưa có dữ liệu để trả lời một quyết định sản phẩm."
            title="Gọi khi còn phân vân"
          />
          <UXInfoCard
            label="02"
            text="Gọi lúc còn hỏi “có nên làm feature này không” thì team giúp được nhiều hơn."
            title="Gọi sớm"
          />
          <UXInfoCard
            label="03"
            text="Điền khung input ở trang Order một research rồi gửi cho team."
            title="Cách gọi"
          />
        </div>
        <p>
          Còn nếu chưa chắc có cần research không - cứ ping. Nghĩ cùng nhau là
          phần tụi mình thích nhất.
        </p>
      </UXArticleSection>

      <UXArticleSection
        description="Đây là nơi team UX cất cách mình nghĩ và làm: nguyên tắc, pattern, quy trình, guidebook."
        title="UX Hub là gì, và dùng sao"
      >
        <UXQuickLinkList items={uxOverviewHubDirections} />
      </UXArticleSection>

      <UXArticleSection title="UX khổ như nào">
        <div className="space-y-4">
          <p>
            Đùa thôi, khổ gì đâu. Nghề UX có một nghịch lý đáng yêu:{' '}
            <strong>
              làm tốt thì không ai thấy, làm dở thì cả công ty thấy
            </strong>
            . Một luồng mượt mà thì user lướt qua không suy nghĩ. Nhưng một
            luồng vướng thì lập tức có tên trong group chat.
          </p>
          <p>
            Sự thật là <strong>UX không sửa được mọi thứ</strong>. UX giúp được
            khi vấn đề thật sự nằm ở chỗ{' '}
            <em>user không hiểu / không làm được / không muốn làm</em>.
          </p>
          <p>
            Cái nghịch lý “làm tốt thì vô hình” cũng chính là phần thưởng: khi
            một triệu user dùng app trơn tru mà chẳng buồn nghĩ tới, đó là lúc
            tụi mình đã làm đúng việc.
          </p>
        </div>
        <UXQuoteGroup items={uxOverviewBlameQuotes} />
      </UXArticleSection>
    </article>
  )
}

function UXArticleSection({
  children,
  description,
  title,
}: {
  children: ReactNode
  description?: string
  title: string
}) {
  return (
    <section className="mt-14 space-y-4 text-base leading-8 text-[var(--ds-text-primary)]">
      <div>
        <h3 className="text-xl font-bold leading-8 text-[var(--ds-text-primary)]">
          {title}
        </h3>
        {description && (
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--ds-text-secondary)]">
            {description}
          </p>
        )}
      </div>
      <div className="max-w-5xl space-y-4">{children}</div>
    </section>
  )
}

function UXArticlePanel({
  children,
  title,
}: {
  children: ReactNode
  title: string
}) {
  return (
    <section className="space-y-4 rounded-2xl border border-[var(--ds-border-stroke2)] bg-[var(--ds-background-primary)] p-6 text-base leading-8 text-[var(--ds-text-primary)]">
      <h3 className="text-xl font-bold leading-8 text-[var(--ds-text-primary)]">
        {title}
      </h3>
      {children}
    </section>
  )
}

function UXQuoteGroup({ items }: { items: string[] }) {
  return (
    <div className="mt-6 rounded-2xl border border-[var(--ds-border-stroke2)] bg-[var(--ds-background-primary)] p-5">
      <div className="grid gap-3">
        {items.map((quote) => (
          <p className="text-sm font-semibold leading-7 text-[var(--ds-text-primary)]" key={quote}>
            “{quote}”
          </p>
        ))}
      </div>
    </div>
  )
}

function UXCardGrid({
  items,
  variant = 'default',
}: {
  items: Array<{ title: string; body: string }>
  variant?: 'default' | 'numbered'
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map((item, index) => (
        <article
          className="rounded-2xl border border-[var(--ds-border-stroke2)] bg-[var(--ds-background-primary)] p-5"
          key={item.title}
        >
          <span className="mb-3 block text-xs font-bold uppercase leading-4 text-[var(--ds-text-link)]">
            {variant === 'numbered'
              ? String(index + 1).padStart(2, '0')
              : 'Note'}
          </span>
          <h4 className="text-base font-bold leading-6 text-[var(--ds-text-primary)]">
            {item.title}
          </h4>
          <p className="mt-2 text-sm leading-6 text-[var(--ds-text-secondary)]">
            {item.body}
          </p>
        </article>
      ))}
    </div>
  )
}

function UXInfoCard({
  label,
  text,
  title,
}: {
  label: string
  text: string
  title: string
}) {
  return (
    <article className="rounded-2xl border border-[var(--ds-border-stroke2)] bg-[var(--ds-background-primary)] p-5">
      <span className="mb-3 block text-xs font-bold uppercase leading-4 text-[var(--ds-text-link)]">
        {label}
      </span>
      <h4 className="text-base font-bold leading-6 text-[var(--ds-text-primary)]">
        {title}
      </h4>
      <p className="mt-2 text-sm leading-6 text-[var(--ds-text-secondary)]">
        {text}
      </p>
    </article>
  )
}

function UXQuickLinkList({
  items,
}: {
  items: Array<{ title: string; body: string }>
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--ds-border-stroke2)] bg-[var(--ds-background-primary)]">
      {items.map((item) => (
        <div
          className="grid gap-2 border-b border-[var(--ds-border-stroke2)] p-5 last:border-b-0 md:grid-cols-[0.9fr_1.1fr]"
          key={item.title}
        >
          <p className="font-bold leading-7 text-[var(--ds-text-primary)]">
            {item.title}
          </p>
          <p className="leading-7 text-[var(--ds-text-secondary)]">
            {item.body}
          </p>
        </div>
      ))}
    </div>
  )
}

const uxPrinciples = [
  {
    number: '01',
    title: 'Evidence over Opinion',
    summary:
      'Quyết định dựa trên bằng chứng, không dựa trên ai to mồm hay senior nhất.',
    statement:
      'Quyết định thiết kế dựa trên bằng chứng, không dựa trên cảm tính hoặc thẩm quyền.',
    why:
      'Trong phòng họp, ý kiến mạnh nhất thường thắng nếu team không có một tiếng nói thứ ba: evidence. Với sản phẩm tài chính, cái giá của đoán sai không chỉ là sửa lại UI, mà còn là drop giao dịch, ticket CS và mất niềm tin.',
    checks: [
      'Phát biểu gắn với data, observation hoặc research insight.',
      'Khi không có evidence, nói rõ đây là giả định cần kiểm chứng.',
      'Sẵn sàng đổi ý khi data trái với trực giác.',
      'Phân biệt được user nói và user làm.',
    ],
    dos: [
      'Gắn mỗi đề xuất với một mẩu bằng chứng, dù nhỏ.',
      'Khi chưa có data, gọi đúng tên: đây là hypothesis.',
      'Đưa user vào phòng họp gián tiếp qua clip, quote hoặc số liệu.',
    ],
    donts: [
      'Dùng best practice hoặc “bên kia cũng làm vậy” như bằng chứng.',
      'Để chức danh quyết định đúng sai trong tranh luận.',
      'Nói “user chắc sẽ thích” mà không có cơ sở.',
    ],
  },
  {
    number: '02',
    title: 'Problem before Solution',
    summary: 'Hiểu vấn đề thật trước khi nhảy vào vẽ giải pháp.',
    statement:
      'Hiểu rõ vấn đề thật sự đang giải quyết trước khi nghĩ tới solution.',
    why:
      'Cám dỗ lớn nhất của designer là nhảy thẳng vào Figma. Nhưng nếu vấn đề bị hiểu sai, giải pháp càng polished càng khiến team tự tin vào thứ sai. Một yêu cầu thường tới dưới dạng solution; việc của UX là kéo nó về problem.',
    checks: [
      'Nói được vấn đề người dùng đang gặp là gì.',
      'Tách được request dạng solution khỏi problem thật.',
      'Biết nhóm user nào đang gặp vấn đề và trong bối cảnh nào.',
      'Có tiêu chí để biết vấn đề đã được giải quyết hay chưa.',
    ],
    dos: [
      'Hỏi “vì sao cần làm việc này?” trước khi hỏi “làm như thế nào?”.',
      'Viết problem statement trước khi mở Figma.',
      'Kiểm tra lại problem với data, user hoặc stakeholder liên quan.',
    ],
    donts: [
      'Nhận solution được giao như đề bài cuối cùng.',
      'Vẽ nhiều phương án khi chưa rõ mình đang giải quyết gì.',
      'Dùng UI đẹp để che một problem chưa được hiểu đúng.',
    ],
  },
  {
    number: '03',
    title: 'Design for Reality',
    summary:
      'Thiết kế cho user thật và cả lúc mọi thứ hỏng, không chỉ happy path.',
    statement:
      'Thiết kế cho điều kiện sử dụng thật: user bận, thiếu tập trung, mạng lỗi, dữ liệu thiếu và trạng thái không hoàn hảo.',
    why:
      'Happy path thường làm demo đẹp, nhưng sản phẩm thật sống ở những tình huống lộn xộn hơn. Với tài chính, một edge case bị bỏ quên có thể khiến user hiểu sai trạng thái tiền, giao dịch hoặc trách nhiệm tiếp theo.',
    checks: [
      'Có xử lý loading, empty, error, pending và retry.',
      'Nội dung đủ rõ khi user không đọc kỹ từng dòng.',
      'Luồng vẫn hiểu được khi thiếu dữ liệu hoặc mạng chập chờn.',
      'Các quyết định quan trọng có confirmation và recovery phù hợp.',
    ],
    dos: [
      'Thiết kế cả unhappy path trước khi coi luồng là xong.',
      'Review bằng tình huống thật, không chỉ bằng màn hình đẹp nhất.',
      'Đặt câu hỏi: nếu user đang vội thì có hiểu đúng không?',
    ],
    donts: [
      'Chỉ thiết kế trạng thái lý tưởng.',
      'Để error message hoặc trạng thái giao dịch mơ hồ.',
      'Giả định user luôn bình tĩnh, rảnh và đọc đủ mọi hướng dẫn.',
    ],
  },
  {
    number: '04',
    title: 'Know When Not To',
    summary: 'Biết khi nào không nên research, không nên thêm, không nên làm.',
    statement:
      'Một quyết định UX tốt không chỉ nói nên làm gì, mà còn biết khi nào nên dừng hoặc không làm.',
    why:
      'Không phải vấn đề nào cũng cần research, không phải luồng nào cũng cần thêm bước, không phải insight nào cũng đáng biến thành feature. Biết không làm giúp team giữ sản phẩm gọn và tập trung vào phần thật sự tạo giá trị.',
    checks: [
      'Biết rủi ro hiện tại có đủ lớn để cần thêm effort không.',
      'Biết khi nào existing data đã đủ để quyết định.',
      'Có thể nói rõ thứ gì sẽ bị loại bỏ nếu chọn hướng này.',
      'Không thêm UI chỉ để xử lý sự bất an của team.',
    ],
    dos: [
      'Dừng research khi câu trả lời đã đủ để ra quyết định.',
      'Loại bỏ bước, option hoặc nội dung không phục vụ mục tiêu.',
      'Nói “không làm” kèm lý do và trade-off rõ ràng.',
    ],
    donts: [
      'Research mọi thứ cho chắc.',
      'Thêm lựa chọn vì sợ bỏ sót mọi trường hợp.',
      'Giữ một việc chỉ vì đã lỡ bắt đầu.',
    ],
  },
  {
    number: '05',
    title: 'Tie Everything to Impact',
    summary: 'Mọi việc phải nối được tới tác động lên user hoặc business.',
    statement:
      'Mỗi việc UX làm cần nối được tới một thay đổi kỳ vọng trong hành vi, cảm nhận hoặc kết quả kinh doanh.',
    why:
      'UX dễ bị xem là chi phí mềm nếu team không nói rõ impact. Principle này giúp bảo vệ team khỏi bẫy “đẹp vì đẹp” và giúp stakeholder hiểu vì sao một quyết định thiết kế đáng được ưu tiên.',
    checks: [
      'Nói được việc này nhắm tới đổi chỉ số hoặc hành vi nào.',
      'Gắn research insight với một quyết định cụ thể.',
      'Phân biệt được impact thật và hoạt động cho có.',
    ],
    dos: [
      'Mỗi dự án nêu rõ: thành công thì điều gì thay đổi.',
      'Nối insight research tới quyết định hoặc chỉ số cụ thể.',
      'Sẵn sàng dừng việc không nối được tới impact nào.',
    ],
    donts: [
      'Đo giá trị UX bằng số màn vẽ hay số report viết ra.',
      'Làm research mà không biết nó phục vụ quyết định nào.',
      'Giữ một việc chỉ vì đã lỡ bắt đầu.',
    ],
  },
  {
    number: '06',
    title: 'Share the Thinking, not just the Output',
    summary: 'Để lại dấu vết tư duy, không chỉ giao output cuối.',
    statement:
      'Để lại dấu vết tư duy: vì sao quyết định được đưa ra, phương án nào bị loại và trade-off nằm ở đâu.',
    why:
      'Output cuối chỉ kể một phần câu chuyện. Nếu không có dấu vết tư duy, người sau phải hỏi lại từ đầu hoặc lặp lại tranh luận cũ. Đây cũng là cách team UX xây uy tín: người khác thấy được logic, không chỉ thấy file.',
    checks: [
      'Ghi lại lý do và các phương án đã loại khi ra quyết định.',
      'Người mới đọc lại hiểu được vì sao, không cần hỏi riêng.',
      'Quyết định review được dựa trên lý do, không dựa trên trí nhớ.',
    ],
    dos: [
      'Kèm theo output một ghi chú ngắn: vấn đề, lựa chọn, lý do.',
      'Ghi lại cả phương án đã loại và vì sao loại.',
      'Làm việc đủ minh bạch để người khác review được.',
    ],
    donts: [
      'Để lý do quan trọng chỉ tồn tại trong trí nhớ.',
      'Giả định người sau sẽ tự hiểu logic của mình.',
      'Coi “đã giao file” là đã xong việc truyền đạt.',
    ],
  },
]

const uxPrincipleUsage = [
  {
    title: 'Khi bắt đầu một việc',
    body: 'Tự hỏi: vấn đề là gì, có đáng làm không, nếu làm thì đổi gì.',
  },
  {
    title: 'Khi review công việc của nhau',
    body: 'Soi theo principle thay vì “tôi thấy chưa ổn”: có evidence chưa, đã lo edge case chưa, lý do có rõ không.',
  },
  {
    title: 'Khi team lặp lại một vấn đề',
    body: 'Đó là tín hiệu cần tinh chỉnh hệ nguyên tắc, không chỉ xử lý từng ca lẻ.',
  },
]

const uxPatternOverviewSteps = [
  {
    title: 'Audit',
    body:
      'Mapping vấn đề, group theo hành vi hoặc domain, ước lượng mức ảnh hưởng tới KPI và log issue vào backlog tracker.',
  },
  {
    title: 'Define success metric',
    body:
      'Chốt metric trước khi thiết kế để biết pattern đang nhắm tới thay đổi hành vi hoặc kết quả nào.',
  },
  {
    title: 'Propose solution',
    body:
      'Viết hypothesis, chọn UX Strategy / UX Tactics, đi từ lofi tới midfi và align nội bộ với collaborators.',
  },
  {
    title: 'Implement',
    body:
      'Chuẩn bị spec, guideline, check ZDS alignment, finalize UI, QC sandbox và double-check rule / logic trước khi lên prod.',
  },
  {
    title: 'Validate',
    body:
      'So sánh pre vs post release, gắn tag Success hoặc Fail, document kết quả và quyết định có iterate tiếp không.',
  },
  {
    title: 'Patternize',
    body:
      'Đóng gói guideline, nêu khi nào nên dùng / không nên dùng, publish cho stakeholders và maintain khi có case mới.',
  },
]

const uxPatternOverviewCards = [
  {
    title: 'Pattern không phải component',
    body:
      'Component là thứ đặt lên màn hình. Pattern là logic giải quyết một bài toán UX lặp lại: context, behavior, state, rule và bằng chứng áp dụng.',
  },
  {
    title: 'Pattern đi cùng evidence',
    body:
      'Một pattern nên có case study, metric hoặc observation để team biết vì sao nó tồn tại, không chỉ vì “màn này từng làm vậy”.',
  },
  {
    title: 'Pattern có phạm vi dùng',
    body:
      'Pattern tốt nói rõ khi nào nên dùng, khi nào không nên dùng, state nào bắt buộc có và phần nào được phép tùy biến.',
  },
  {
    title: 'Pattern cần được maintain',
    body:
      'Khi sản phẩm đổi, data đổi hoặc use case mới xuất hiện, pattern cần được cập nhật để không biến thành rule cũ kỹ.',
  },
]

const onboardingPatternStates = [
  {
    title: 'Default / Not started',
    body:
      'Hiển thị danh sách nhiệm vụ rõ thứ tự ưu tiên, phần thưởng tương ứng và CTA đầu tiên dễ bắt đầu.',
  },
  {
    title: 'In progress',
    body:
      'Cho user thấy nhiệm vụ đã hoàn thành, nhiệm vụ tiếp theo và tiến độ tổng để không phải nhớ mình đang ở đâu.',
  },
  {
    title: 'Reward claim',
    body:
      'Khi task hoàn tất, trạng thái nhận thưởng cần nổi bật, feedback rõ và không lẫn với CTA làm nhiệm vụ.',
  },
  {
    title: 'Completed',
    body:
      'Khi hoàn tất toàn bộ onboarding, chuyển sang trạng thái achievement hoặc remove khỏi Home để tránh làm nhiễu.',
  },
  {
    title: 'Unavailable / Error',
    body:
      'Có trạng thái khi task chưa đủ điều kiện, hết ưu đãi, lỗi nhận thưởng hoặc cần retry để user không hiểu nhầm.',
  },
]

const onboardingGuidelines = [
  {
    title: 'Giữ first sight tập trung',
    body:
      'Task list nên thay vùng banner thụ động bằng một khu vực có hành động rõ, nhưng không chiếm hết khả năng khám phá Home.',
  },
  {
    title: 'Reward tăng theo độ khó',
    body:
      'Nhiệm vụ càng khó như eKYC, link bank hoặc first payment nên có incentive rõ hơn để giữ động lực.',
  },
  {
    title: 'CTA theo một mạch',
    body:
      'Mỗi thời điểm chỉ nên có một bước tiếp theo nổi bật. Tránh để user phải tự đoán task nào đáng làm trước.',
  },
  {
    title: 'Motion dùng để hướng mắt',
    body:
      'Pointer, icon animation hoặc feedback nhỏ có thể dùng để kéo chú ý, miễn là không làm Home bị ồn.',
  },
]

const onboardingCaseStudyIssues = [
  'New user vào Home nhưng không biết phải làm gì tiếp vì có quá nhiều entry cạnh tranh.',
  'User chưa hiểu app có core value nào đáng thử ngay sau onboarding.',
  'User không hiểu việc submit personal data sẽ mở khóa lợi ích gì, nên các bước khó dễ bị bỏ giữa chừng.',
]

const onboardingHypotheses = [
  'Nếu input phone xong được vào Home ngay, thời gian đi tới trải nghiệm chính sẽ giảm.',
  'Nếu first sight có khu vực campaign / task list nổi bật, user sẽ nhận biết việc cần làm nhanh hơn.',
  'Nếu phần thưởng tăng dần theo độ phức tạp nhiệm vụ, user có thêm động lực hoàn thành các bước khó.',
  'Nếu achievement được thể hiện rõ, onboarding có cảm giác tiến bộ hơn thay vì chỉ là checklist bắt buộc.',
]

const onboardingMetricRows = [
  {
    metric: 'NPU convert',
    control: '27,784',
    treatment: '3,515',
    diff: '+69%',
  },
  {
    metric: 'CR từ traffic đến NPU',
    control: '14.15%',
    treatment: '23.88%',
    diff: '+68.73%',
  },
  {
    metric: 'Frequency open app',
    control: '4.59',
    treatment: '5.20',
    diff: '+13.41%',
  },
  {
    metric: 'Số ngày mở app trung bình',
    control: '1.32',
    treatment: '2.16',
    diff: '+63.64%',
  },
]

const workflowGoals = [
  'Đồng bộ quy trình xử lý task UX Design.',
  'Giúp team chọn đúng project type và checklist tương ứng.',
  'Giúp stakeholders hiểu quy trình tổng quan của UXD và phân loại đúng requirement.',
]

const workflowFlowProjectNodes = [
  {
    title: 'Quick Fix',
    track: 'Fast Track',
    deliverable: 'Bypass UX',
    tone: 'violet',
  },
  {
    title: 'Adjust',
    track: 'Fast Track',
    deliverable: 'UX Brief',
    tone: 'blue',
  },
  {
    title: 'New Func',
    track: 'Standard Track',
    deliverable: 'UX Detailed',
    tone: 'green',
  },
  {
    title: 'Revamp',
    track: 'Standard Track',
    deliverable: 'UX Detailed',
    tone: 'amber',
  },
  {
    title: 'New Product',
    track: 'Deep Track',
    deliverable: 'UX Full',
    tone: 'red',
  },
] as const

const workflowProjectTypes = [
  {
    level: 'Quick Fix',
    description: 'Chỉ đổi visual, copy, spacing... không đổi flow.',
    action: 'Bypass UX và follow up.',
    track: 'Fast Track',
    deliverable: 'Bypass UX',
  },
  {
    level: 'Adjust',
    description: 'Thêm/bớt field, reorder hoặc optimize nhẹ flow cũ.',
    action: 'Brief / proposal ngắn, success metric và UX review.',
    track: 'Standard Track',
    deliverable: 'UX Brief',
  },
  {
    level: 'New Feature',
    description: 'Thêm flow riêng hoặc UX touchpoint mới.',
    action: 'Detailed UX define, user flow, wireframe, competitor analysis và desk research.',
    track: 'Standard Track',
    deliverable: 'UX Detailed',
  },
  {
    level: 'Revamp',
    description: 'Revamp một core flow đang live.',
    action: 'Detailed UX define, data analysis, user flow và wireframe.',
    track: 'Deep Track',
    deliverable: 'UX Detailed',
  },
  {
    level: 'New Product',
    description: 'Sản phẩm hoàn toàn mới hoặc cross-domain.',
    action: 'UX full task với discovery, research, define, flow và validation plan.',
    track: 'Deep Track',
    deliverable: 'UX Full',
  },
]

const workflowChecklistRows = [
  {
    item: 'Problem statement',
    quickFix: 'Không cần',
    adjust: 'Brief',
    newFeature: 'Detailed',
    revamp: 'Detailed',
    newProduct: 'Full',
  },
  {
    item: 'Data analysis',
    quickFix: 'Không cần',
    adjust: 'Nice to have',
    newFeature: 'Nice to have',
    revamp: 'Cần có',
    newProduct: 'Cần có',
  },
  {
    item: 'User / market research',
    quickFix: 'Không cần',
    adjust: 'Không cần',
    newFeature: 'Không cần',
    revamp: 'Nice to have',
    newProduct: 'Cần có',
  },
  {
    item: 'User research',
    quickFix: 'Không cần',
    adjust: 'Không cần',
    newFeature: 'Nice to have',
    revamp: 'Cần có',
    newProduct: 'Cần có',
  },
  {
    item: 'Competitor analysis',
    quickFix: 'Không cần',
    adjust: 'Không cần',
    newFeature: 'Cần có',
    revamp: 'Nice to have',
    newProduct: 'Cần có',
  },
  {
    item: 'Moodboard / reference',
    quickFix: 'Không cần',
    adjust: 'Không cần',
    newFeature: 'Cần có',
    revamp: 'Cần có',
    newProduct: 'Cần có',
  },
  {
    item: 'Success metric',
    quickFix: 'Không cần',
    adjust: 'Cần có',
    newFeature: 'Cần có',
    revamp: 'Cần có',
    newProduct: 'Cần có',
  },
]

const orderTicketProjectTypes = [
  {
    title: 'Tạo mới màn/flow',
    body:
      'Feature hoặc luồng chưa tồn tại, cần thiết kế từ đầu.',
  },
  {
    title: 'Review wireframe có sẵn',
    body:
      'Đã có bản thiết kế, nhờ UXD soi UX logic, rule hoặc flow.',
  },
  {
    title: 'UX Writing',
    body:
      'Chỉnh hoặc viết lại text, label, error message và microcopy.',
  },
  {
    title: 'Optimize / revamp',
    body:
      'Luồng đã live nhưng có vấn đề, cần cải tiến.',
  },
  {
    title: 'Design state lỗi / edge case',
    body:
      'Bổ sung màn lỗi, empty, pending cho luồng có sẵn.',
  },
]

const orderTicketTemplateItems = [
  {
    title: 'Context / Background',
    body:
      'Bối cảnh dẫn tới request này: sản phẩm/luồng nào, ở scope màn nào, có gì thay đổi.',
    example:
      'Writing: text này hiển thị ở màn/ngữ cảnh nào, trước/sau khi user làm gì.',
  },
  {
    title: 'Problem',
    body:
      'Vấn đề thật mà user hoặc business đang gặp. Đây là phần quan trọng nhất của ticket.',
    example:
      'Tốt: User vào tab Tài khoản mất nhiều thời gian tìm hỗ trợ/lịch sử giao dịch. Chưa đủ: Nhờ team review giúp wireframe.',
  },
  {
    title: 'Data',
    body:
      'Số liệu hoặc signal của vấn đề: funnel, dashboard, ticket CS, research note hoặc feedback định tính.',
    example:
      'Tốt: 90% source input đến từ icon service; drop-off 40% ở bước X. Chưa đủ: Cảm giác chỗ này chưa ổn.',
  },
  {
    title: 'Product requirement',
    body:
      'Yêu cầu cụ thể cần giải quyết gì, ràng buộc gì và màn/flow nào nằm trong scope.',
    example:
      'Tạo mới cần nêu flow/chức năng mong muốn; revamp cần nêu issue cũ và direction kỳ vọng.',
  },
  {
    title: 'Timeline',
    body:
      'Mốc thật cần có design để kịp quyết định, align hoặc release.',
    example:
      'Tốt: Release theme mới lock vào 16/8. Chưa đủ: Càng sớm càng tốt.',
  },
  {
    title: 'Success metric',
    body:
      'Đo bằng gì để biết design này thành công. Đây là lối thoát khỏi request kiểu “nhìn đẹp hơn”.',
    example:
      'Interaction rate, time-to-task, drop-off, CR hoặc tiêu chí định tính nếu là writing.',
  },
  {
    title: 'Wireframe draft idea',
    body:
      'Nếu đã có ý tưởng phác, link Figma hoặc screenshot chỗ cần làm thì đính kèm.',
    example:
      'Với request review, writing hoặc design lỗi, link màn liên quan gần như bắt buộc.',
  },
]

const orderTicketBadInput = [
  'Có link nhưng thiếu problem, data, scope và deadline.',
  'Không nói rõ review để giải quyết điều gì.',
  'Team UXD phải quay lại hỏi thêm vài vòng trước khi start được.',
]

const orderTicketGoodInput = [
  'Context nêu rõ tab Tài khoản đang làm user mất thời gian tìm tính năng hay dùng.',
  'Product requirement nói rõ cần revamp để user nhận thức mức độ xác minh và truy cập nhanh hỗ trợ/lịch sử giao dịch.',
  'Có link problem statement, data analysis, benchmark và wireframe.',
  'Success metric gồm interaction rate, time-to-task và mức tương tác với tab Tài khoản.',
]

const uxResearchPrinciples = [
  {
    number: '01',
    title: 'Hành vi nói thật hơn lời nói',
    trap:
      'Bẫy “sự lịch thiệp giả tạo”: user thường có xu hướng trả lời dễ nghe, lịch sự hoặc hợp ý người hỏi.',
    statement:
      'Tin vào điều user làm, không tin tuyệt đối điều user nói.',
    why:
      'Đây là cái bẫy số một của research: user có thể nói họ thích, sẽ dùng hoặc thấy ổn, nhưng hành vi thật trong task lại kể một câu chuyện khác. Ở bối cảnh Việt Nam, hiệu ứng này còn mạnh hơn vì user thường ngại chê thẳng hoặc muốn giữ hòa khí trong buổi research.',
    checks: [
      {
        good: 'Ưu tiên quan sát user thao tác thật hơn hỏi ý kiến chung chung.',
        trap: 'Kết luận từ việc user nói họ sẽ làm gì.',
      },
      {
        good: 'Khi user khen, hỏi tiếp “lần gần nhất anh/chị dùng nó là khi nào?”.',
        trap: 'Ghi nhận lời khen như bằng chứng sản phẩm tốt.',
      },
      {
        good: 'Để ý mâu thuẫn giữa điều user nói và điều họ vừa làm.',
        trap: 'Bỏ qua mâu thuẫn vì lời nói “rõ ràng” hơn.',
      },
      {
        good: 'Hỏi về quá khứ cụ thể, không hỏi về tương lai giả định.',
        trap: 'Hỏi “anh/chị sẽ dùng không?” và tin câu trả lời.',
      },
    ],
    dos: [
      'Cho user làm task thật rồi quan sát, thay vì chỉ phỏng vấn ý kiến.',
      'Đào quá khứ: “kể lần gần nhất anh/chị gặp việc này.”',
      'Khi nghe lời khen, tìm hành vi xác nhận hoặc phản chứng.',
    ],
    donts: [
      'Đừng hỏi “bạn có thích/có dùng không?” và coi câu trả lời là kết luận.',
      'Đừng hỏi tương lai giả định như “sau này anh/chị có dùng không?”.',
      'Đừng để sự lịch sự của user thành kết luận research.',
    ],
    levels: [
      'Pass — Kết luận chính dựa trên hành vi quan sát được.',
      'Flag — Có quan sát hành vi nhưng vẫn trộn lẫn lời nói như evidence chính.',
      'Fail — Kết luận dựa thuần trên điều user nói sẽ làm hoặc nói họ thích.',
    ],
  },
  {
    number: '02',
    title: 'Cách hỏi quyết định chất lượng câu trả lời',
    trap:
      'Bẫy “câu hỏi dẫn dắt”: câu hỏi thiếu khách quan sẽ tạo ra dữ liệu nghe có vẻ hợp lý nhưng bị nhiễu.',
    statement:
      'Một câu hỏi dẫn dắt cho ra một câu trả lời dễ dùng sai.',
    why:
      'Dữ liệu rác nguy hiểm hơn không có dữ liệu, vì nó tạo cảm giác team đã có bằng chứng. Câu hỏi dẫn dắt thường vô tình: khen ngầm tính năng, gợi ý đáp án, hỏi hai ý trong một câu hoặc dùng ngôn ngữ của team thay vì ngôn ngữ của user.',
    checks: [
      {
        good: 'Câu hỏi mở, không gợi ý đáp án mong muốn.',
        trap: 'Câu hỏi chứa sẵn nhận định như “có phải tính năng này tiện hơn không?”.',
      },
      {
        good: 'Một câu chỉ hỏi một ý.',
        trap: 'Hỏi gộp hai vấn đề khiến câu trả lời không biết đang nói về phần nào.',
      },
      {
        good: 'Dùng từ ngữ user hiểu, tránh jargon nội bộ.',
        trap: 'Bắt user trả lời bằng khái niệm của product team.',
      },
      {
        good: 'Hỏi follow-up “vì sao / kể thêm / lúc đó anh/chị làm gì?”.',
        trap: 'Dừng ở câu trả lời đầu tiên vì nghe đã đủ hợp lý.',
      },
    ],
    dos: [
      'Viết câu hỏi trung lập trước buổi research.',
      'Review script để bắt leading question và double-barreled question.',
      'Dùng follow-up để đào sâu thay vì gợi ý hướng trả lời.',
    ],
    donts: [
      'Đừng hỏi câu có sẵn đáp án mong muốn.',
      'Đừng hỏi nhiều ý trong cùng một câu.',
      'Đừng dùng thuật ngữ nội bộ nếu user không nói như vậy.',
    ],
    levels: [
      'Pass — Script trung lập, câu hỏi rõ một ý và có follow-up mở.',
      'Flag — Có vài câu hơi dẫn dắt nhưng vẫn sửa được trước fieldwork.',
      'Fail — Insight phụ thuộc vào câu hỏi đã gợi ý đáp án.',
    ],
  },
  {
    number: '03',
    title: 'Vài người đúng hơn nhiều người sai',
    trap:
      'Bẫy “ảo giác con số”: trong định tính, sample lớn không cứu được method sai hoặc participant sai.',
    statement:
      'Chọn đúng người, đúng tình huống quan trọng hơn gom thật nhiều response không phù hợp.',
    why:
      'Research định tính không nhằm lấy số đông để đại diện thống kê. Giá trị của nó nằm ở việc quan sát đúng người trong đúng bối cảnh để hiểu cơ chế phía sau hành vi. Năm participant phù hợp có thể cho insight rõ hơn năm mươi response lệch đối tượng.',
    checks: [
      {
        good: 'Recruit đúng nhóm user liên quan tới decision cần ra.',
        trap: 'Lấy ai cũng được miễn đủ số lượng.',
      },
      {
        good: 'Nói rõ tiêu chí chọn participant và bối cảnh sử dụng.',
        trap: 'Không biết participant có thật sự gặp problem không.',
      },
      {
        good: 'Dừng khi pattern lặp lại đủ rõ cho quyết định hiện tại.',
        trap: 'Tiếp tục gom thêm chỉ để thấy con số lớn hơn.',
      },
      {
        good: 'Phân biệt qualitative signal với quantitative proof.',
        trap: 'Dùng số participant nhỏ để kết luận thị trường lớn.',
      },
    ],
    dos: [
      'Define participant criteria trước khi recruit.',
      'Ưu tiên user thật có hành vi/problem liên quan.',
      'Nói rõ giới hạn của sample trong report.',
    ],
    donts: [
      'Đừng dùng sample lớn nhưng sai đối tượng.',
      'Đừng biến qualitative finding thành tỷ lệ đại diện thị trường.',
      'Đừng recruit cho đủ số nếu không đúng problem.',
    ],
    levels: [
      'Pass — Participant đúng tiêu chí và insight nối được tới problem.',
      'Flag — Sample hơi rộng, cần ghi rõ giới hạn khi kết luận.',
      'Fail — Kết luận từ nhóm participant không gặp vấn đề đang nghiên cứu.',
    ],
  },
  {
    number: '04',
    title: 'Tách quan sát khỏi diễn giải',
    trap:
      'Bẫy “insight tự suy diễn”: researcher dễ nhảy từ một hành vi quan sát được sang kết luận quá xa.',
    statement:
      'Observation là điều nhìn/nghe thấy; interpretation là cách mình hiểu nó. Hai thứ phải được tách rõ.',
    why:
      'Một insight tốt cần có dấu vết logic. Nếu team trộn observation với interpretation, người đọc report sẽ không biết đâu là evidence, đâu là giả thuyết, và đâu là recommendation. Việc tách rõ giúp insight dễ review, dễ phản biện và ít bị biến thành ý kiến cá nhân.',
    checks: [
      {
        good: 'Ghi nguyên hành vi, quote hoặc tình huống trước khi diễn giải.',
        trap: 'Viết thẳng “user không tin sản phẩm” mà không có evidence.',
      },
      {
        good: 'Dùng cấu trúc evidence → interpretation → implication.',
        trap: 'Nhảy thẳng từ một observation sang solution.',
      },
      {
        good: 'Gắn mỗi insight với bằng chứng cụ thể.',
        trap: 'Insight nghe hay nhưng không truy lại được source.',
      },
      {
        good: 'Nói rõ mức độ chắc chắn và giả thuyết cần kiểm chứng tiếp.',
        trap: 'Trình bày suy luận như sự thật tuyệt đối.',
      },
    ],
    dos: [
      'Document observation thô trước khi tổng hợp.',
      'Tách rõ evidence, interpretation và recommendation.',
      'Đánh dấu assumption cần kiểm chứng tiếp.',
    ],
    donts: [
      'Đừng gọi mọi suy luận là insight.',
      'Đừng bỏ qua evidence vì conclusion nghe hợp lý.',
      'Đừng để report chỉ còn opinion đã được viết đẹp.',
    ],
    levels: [
      'Pass — Mỗi insight đều truy được về observation/quote/task evidence.',
      'Flag — Có evidence nhưng phần interpretation còn nhảy bước.',
      'Fail — Report chỉ có kết luận, không có evidence kiểm tra lại được.',
    ],
  },
  {
    number: '05',
    title: 'Insight phải tạo ra hành động',
    trap:
      'Bẫy “nghiên cứu ngăn kéo”: report có hay đến mấy mà không đổi quyết định nào thì insight không đi tới đâu.',
    statement:
      'Một insight tốt phải giúp team biết nên làm gì, dừng gì hoặc kiểm chứng gì tiếp theo.',
    why:
      'Research không kết thúc ở file report. Nó kết thúc khi team ra quyết định tốt hơn: đổi priority, sửa flow, bỏ một giả định, chọn method tiếp theo hoặc đặt lại problem. Insight càng rõ implication, stakeholder càng dễ hành động.',
    checks: [
      {
        good: 'Mỗi insight có implication hoặc recommendation rõ.',
        trap: 'Report chỉ kể user nói gì mà không nói team nên làm gì.',
      },
      {
        good: 'Insight nối lại với decision/research question ban đầu.',
        trap: 'Finding hay nhưng lạc khỏi mục tiêu nghiên cứu.',
      },
      {
        good: 'Có next step: design change, follow-up research hoặc data cần check.',
        trap: 'Kết thúc bằng “cần nghiên cứu thêm” nhưng không nói thêm gì.',
      },
      {
        good: 'Ưu tiên insight theo impact và confidence.',
        trap: 'Đưa mọi finding lên cùng mức quan trọng.',
      },
    ],
    dos: [
      'Viết implication ngay dưới insight.',
      'Gắn insight với quyết định product/design cụ thể.',
      'Chốt next step và owner nếu insight cần follow-up.',
    ],
    donts: [
      'Đừng deliver report chỉ để lưu trữ.',
      'Đừng để insight không trả lời research question nào.',
      'Đừng đưa recommendation không có evidence hoặc trade-off.',
    ],
    levels: [
      'Pass — Insight dẫn tới action, decision hoặc experiment cụ thể.',
      'Flag — Insight có ý nghĩa nhưng next step còn mơ hồ.',
      'Fail — Report đọc xong không biết team nên làm gì tiếp.',
    ],
  },
] as const

const surveyUseCases = [
  {
    title: 'Đo mức độ phổ biến',
    body:
      'Khi team đã biết một vấn đề hoặc nhu cầu có thể tồn tại, survey giúp biết nó phổ biến tới đâu trong một nhóm user lớn hơn.',
  },
  {
    title: 'Ưu tiên hướng giải quyết',
    body:
      'Khi có nhiều option, survey giúp team hiểu option nào được chọn nhiều hơn, nhóm user nào cần ưu tiên và vì sao.',
  },
  {
    title: 'Đo cảm nhận sau launch',
    body:
      'Dùng sau khi feature live để đo satisfaction, ease-of-use, mức độ hiểu hoặc phản ứng với thay đổi mới.',
  },
  {
    title: 'Follow-up từ qualitative research',
    body:
      'Sau interview hoặc usability testing, survey giúp kiểm tra insight đó có lặp lại ở nhóm lớn hơn không.',
  },
]

const surveyDoItems = [
  'Bắt đầu bằng research question rõ ràng trước khi viết form.',
  'Chọn đúng audience và segment để đọc kết quả có ngữ cảnh.',
  'Giữ câu hỏi trung lập, một câu chỉ hỏi một ý.',
  'Pilot survey với nhóm nhỏ trước khi gửi rộng.',
  'Chuẩn bị cách phân tích trước khi launch.',
]

const surveyDontItems = [
  'Dùng survey để khám phá sâu động cơ phức tạp thay cho interview.',
  'Hỏi quá nhiều open-ended question khiến respondent mệt và khó phân tích.',
  'Dẫn dắt câu trả lời bằng wording như “Bạn có đồng ý là...”.',
  'Gom nhiều mục tiêu nghiên cứu vào một form.',
  'Chỉ nhìn tổng số mà bỏ qua khác biệt giữa các segment.',
]

const surveyWorkflowSteps = [
  {
    title: 'Define goal',
    body:
      'Viết rõ quyết định nào cần survey hỗ trợ, research question là gì và team sẽ làm gì với kết quả.',
  },
  {
    title: 'Choose audience',
    body:
      'Xác định nhóm respondent, tiêu chí lọc, sample kỳ vọng và các biến segment cần hỏi ở đầu form.',
  },
  {
    title: 'Design questions',
    body:
      'Chọn loại câu hỏi phù hợp: single choice, multiple choice, rating scale, ranking hoặc open-ended.',
  },
  {
    title: 'Peer review',
    body:
      'Nhờ ít nhất một người review wording, logic skip, bias, độ dài và cách câu trả lời sẽ được phân tích.',
  },
  {
    title: 'Pilot',
    body:
      'Test form với nhóm nhỏ để bắt câu hỏi khó hiểu, option thiếu, lỗi logic hoặc thời lượng quá dài.',
  },
  {
    title: 'Launch',
    body:
      'Gửi survey kèm context ngắn, thời gian đóng form, cam kết bảo mật và cách dữ liệu sẽ được dùng.',
  },
  {
    title: 'Analyze',
    body:
      'Clean data, loại response kém chất lượng, đọc theo segment và tổng hợp pattern định lượng/định tính.',
  },
  {
    title: 'Share insight',
    body:
      'Trả lời lại research question, nêu implication cho product/design và đề xuất next step rõ ràng.',
  },
]

const surveyQuestionTypes = [
  {
    title: 'Single choice',
    body:
      'Dùng khi respondent chỉ nên chọn một đáp án. Ví dụ: “Bạn thường dùng tính năng nào nhất?”.',
  },
  {
    title: 'Multiple choice',
    body:
      'Dùng khi có thể chọn nhiều option. Cần thêm “Khác” nếu option chưa bao phủ hết.',
  },
  {
    title: 'Rating scale',
    body:
      'Dùng để đo mức độ hài lòng, dễ dùng, tin tưởng hoặc đồng ý. Giữ scale nhất quán trong cùng survey.',
  },
  {
    title: 'Ranking',
    body:
      'Dùng để so sánh mức ưu tiên giữa các option, nhưng không nên bắt rank quá nhiều lựa chọn.',
  },
  {
    title: 'Open-ended',
    body:
      'Dùng để hỏi lý do phía sau lựa chọn. Nên ít và đặt đúng chỗ để tránh câu trả lời hời hợt.',
  },
  {
    title: 'Screening / segment',
    body:
      'Dùng ở đầu form để phân nhóm respondent theo hành vi, tần suất, vai trò hoặc trạng thái sử dụng.',
  },
]

const surveyChecklistRows = [
  {
    item: 'Research question',
    check:
      'Có câu hỏi nghiên cứu cụ thể và biết quyết định nào sẽ dùng kết quả survey.',
  },
  {
    item: 'Audience',
    check:
      'Định nghĩa respondent, tiêu chí lọc và segment cần đọc sau khi có kết quả.',
  },
  {
    item: 'Question design',
    check:
      'Câu hỏi trung lập, không double-barreled, option đủ bao phủ và scale nhất quán.',
  },
  {
    item: 'Survey length',
    check:
      'Form đủ ngắn để hoàn thành, ưu tiên câu hỏi cần cho quyết định thay vì hỏi cho biết.',
  },
  {
    item: 'Pilot',
    check:
      'Đã test với nhóm nhỏ để bắt lỗi wording, logic, missing option và thời lượng.',
  },
  {
    item: 'Analysis plan',
    check:
      'Biết trước sẽ đọc metric nào, segment nào, open-ended sẽ tag theme ra sao.',
  },
  {
    item: 'Privacy',
    check:
      'Nói rõ phản hồi có anonymous không, dữ liệu được dùng thế nào và có follow-up không.',
  },
]

const uxResearchWorkflowGoals = [
  'Đồng bộ quy trình xử lý task UX Research.',
  'Giúp team chọn đúng method cho từng loại requirement, kèm checklist tương ứng.',
  'Giúp stakeholders hiểu quy trình tổng quan của một dự án research và material cần chuẩn bị.',
  'Đảm bảo chất lượng convert từ insight ra quyết định.',
]

const uxResearchWhenToResearch = [
  {
    title: 'Có câu hỏi cụ thể cần trả lời',
    body:
      'Không phải “tìm hiểu user nghĩ gì nói chung”, mà là một câu hỏi research đủ rõ để biết cần học điều gì.',
  },
  {
    title: 'Data hiện có chưa giải đáp được',
    body:
      'Team đã check analytics, CS ticket, expert review hoặc dữ liệu sẵn có nhưng vẫn chưa đủ để ra quyết định.',
  },
  {
    title: 'Kết quả sẽ ảnh hưởng đến quyết định',
    body:
      'Nếu insight không làm thay đổi product/design/business decision nào, research dễ thành hoạt động cho có.',
  },
]

const uxResearchMethodPickerColumns = [
  {
    key: 'directional',
    label: 'Cái này có đáng để làm không?',
    subtitle: 'Directional (Business/Market Fit)',
  },
  {
    key: 'exploratory',
    label: 'Vấn đề thật sự là gì?',
    subtitle: 'Exploratory',
  },
  {
    key: 'evaluation',
    label: 'User có dùng được không?',
    subtitle: 'Evaluation',
  },
  {
    key: 'measurement',
    label: 'Cái này tốt hơn/tốt đến mức nào?',
    subtitle: 'Measurement',
  },
] as const

const uxResearchMethodPickerRows = [
  {
    state: 'Product concept / Biz idea',
    context: 'Mới có direction. Chưa có design / solution / data',
    cells: {
      directional: {
        method: 'Desk Research + Competitive Audit',
        body:
          'Xem đối thủ làm gì, mình có gì, thị trường ra sao. Đây là lúc duy nhất hỏi “có nên làm không”.',
        warning:
          'Không dùng Concept Test ở đây. Hỏi user có hiểu/thích ý tưởng không không trả lời được câu hỏi no-value.',
      },
      exploratory: {
        method: 'Exploratory Interview',
        body:
          'Tìm mental model, unmet need, context of use. Chưa có gì để validate, chỉ cần nghe và khám phá.',
      },
      evaluation: {
        empty: 'Chưa có gì để test. Nghỉ khoẻ',
      },
      measurement: {
        empty: 'Chưa có baseline. Nghỉ khoẻ',
      },
    },
  },
  {
    state: 'Có Data Signal',
    context: 'Data drop, feedback, complaint, funnel...',
    cells: {
      directional: {
        empty: 'Signal đã confirm có vấn đề - khỏi hỏi có nên làm không',
      },
      exploratory: {
        method: 'Rootcause Analysis',
        body:
          'Hiểu signal xảy ra ở đâu, painpoint gì, segment nào, trước khi đi interview.',
        note:
          'IDI để đào sâu tư duy quá khứ/lý do ra quyết định. Diary Study để theo dõi hành vi real-time theo thời gian.',
      },
      evaluation: {
        empty: 'Data chỉ nói lên signal hoặc symptom, không reflect được cảm nhận',
      },
      measurement: {
        method: 'Funnel Analysis + Behavioral Data',
        body:
          'Đọc data trước khi quyết định có cần research thêm không.',
        warning:
          'Không dùng Survey ở đây. User nói “tốt” nhưng data cho thấy họ drop/fail. Survey vô nghĩa, tin data trước, hỏi user sau.',
      },
    },
  },
  {
    state: 'Có Hypothesis',
    context: 'Biết vấn đề, có thể giải quyết',
    cells: {
      directional: {
        method: 'Concept Validation',
        body:
          'Câu hỏi: “Họ có cần/hiểu giải pháp này không?” Phải có ít nhất 2-3 hướng để compare, không test một hướng duy nhất.',
      },
      exploratory: {
        method: 'Assumption Validation Interview',
        body:
          'Kiểm tra từng assumption trong hypothesis. Có structure, không phải exploratory thuần.',
      },
      evaluation: {
        empty: 'Chưa có prototype',
      },
      measurement: {
        empty: 'Chưa có baseline để so sánh/đo lường',
      },
    },
  },
  {
    state: 'Có Design / Hi-fi Wireframe',
    context: 'Solution đã hình thành, sẵn sàng test',
    cells: {
      directional: {
        empty: 'Đã quyết rồi - đừng dùng UT để justify biz decision',
      },
      exploratory: {
        empty: 'Tới đây mà vẫn hỏi “Why?” -> problem chưa xong, quay về State 02 dùm',
      },
      evaluation: {
        method: 'Usability Testing (UT)',
        body:
          'Task-based, think-aloud. Đo lường, định tính được.',
        note:
          'Moderated UT khi luồng còn phức tạp hoặc dễ gây hiểu lầm. Unmoderated UT khi solution khá hoàn chỉnh, muốn đánh rộng và cần insight at scale.',
      },
      measurement: {
        empty: 'Chưa có data để so sánh',
      },
    },
  },
  {
    state: 'On Prod',
    context: 'Feature live, user đang dùng thật',
    cells: {
      directional: {
        empty: 'On Prod rồi ôi!!',
      },
      exploratory: {
        method: 'AI-Interview / Quick Survey định tính',
        body:
          'Hỏi về real experience sau khi dùng thật, không phải recall hay opinion về design.',
        warning:
          'Không quay lại hỏi “Why?” bằng IDI nếu đã có behavioral data trả lời được câu đó rồi.',
      },
      evaluation: {
        method: 'Bi-weekly Interview',
        body:
          'Tiếp xúc với user thực tế với nhịp độ thường xuyên để gần hơn và thấu hiểu ngữ cảnh sử dụng của user hơn.',
      },
      measurement: {
        method: 'A/B Testing',
        body:
          'Behavioral data đo what happened, SUS/SUPR-Q đo how users feel về trải nghiệm.',
        note:
          'A/B testing khi có đủ traffic, engineering setup và thời gian chạy. Proxy Metric + Survey ngắn khi thiếu resource, đo gián tiếp qua funnel.',
      },
    },
  },
]

const uxResearchQuestionTypes = [
  {
    title: 'Directional — “Cái này có đáng để làm không?”',
    body:
      'Business/Market Fit: Desk Research + Competitive Audit, Concept Validation.',
  },
  {
    title: 'Exploratory — “Vấn đề thật sự là gì?”',
    body:
      'Exploratory Interview, Rootcause Analysis (IDI, Diary Study), Assumption Validation Interview, AI-Interview / Quick Survey định tính.',
  },
  {
    title: 'Evaluation — “User có dùng được không?”',
    body:
      'Usability Testing (Moderated / Unmoderated UT), Bi-weekly Interview.',
  },
  {
    title: 'Measurement — “Cái này tốt hơn/tốt đến mức nào?”',
    body: 'Funnel Analysis + Behavioral Data, A/B Testing.',
  },
]

const uxResearchOutOfScopeItems = [
  {
    title: 'Biz muốn Positioning / Market Research',
    body:
      'Không phải UXR scope. Flag với PO, redirect sang BI hoặc để biz tự làm Market Research. UXR không có tool hay manday để answer “mình nên position ở đâu trên thị trường”.',
  },
  {
    title: 'PO request vì không có budget A/B',
    body:
      'Không tự ý swap method. Check Downgrade Table trước; nếu không có method thay thế hợp lệ thì flag rõ với PO về giới hạn của kết quả, không làm cho có.',
  },
  {
    title: 'Research để justify decision đã làm',
    body:
      'Confirmation bias research - kết quả không actionable dù ra sao. Từ chối, giải thích tại sao nó không giúp được gì, và gợi ý hướng khác nếu được.',
  },
]

const uxResearchDowngradeRows = [
  {
    standard: 'UT',
    alternative: 'Guerilla Test',
    note:
      'Test nhanh 3-5 user tại văn phòng/quán cafe, trước cổng VNG, không cần recruit bài bản.',
  },
  {
    standard: 'IDI',
    alternative: 'Quick Interview / Bi-weekly',
    note: 'Phỏng vấn nhanh 15-30p, tập trung vào 1-2 câu hỏi “chí mạng”.',
  },
  {
    standard: 'A/B Testing',
    alternative: 'Proxy Metric / Survey ngắn',
    note: 'Dùng dữ liệu gián tiếp hoặc khảo sát nhanh để dự đoán xu hướng.',
  },
]

const orderResearchInputItems = [
  {
    title: 'Vấn đề cốt lõi / business goal',
    body:
      'Primary goal của dự án là gì? Product friction nào đang khiến team cần research?',
  },
  {
    title: 'Insight dùng để ra quyết định gì',
    body:
      'Kết quả research sẽ giúp chọn, bỏ, ưu tiên, redesign, launch hay validate điều gì?',
  },
  {
    title: 'Hiện tại đã có gì rồi',
    body:
      'Data signals, biz goal, CS ticket, previous research, expert review hoặc dashboard liên quan.',
  },
  {
    title: 'Timeline',
    body:
      'Có cần gấp không? Khi nào cần kết quả để kịp quyết định hoặc release?',
  },
  {
    title: 'Mức độ ảnh hưởng',
    body:
      'Ảnh hưởng tới bao nhiêu user, KPI nào, rủi ro gì nếu không có insight?',
  },
]

const orderResearchGoodBad = [
  {
    title: 'Nên viết',
    body:
      '“Cần biết vì sao KYC step X drop cao để quyết định nên đổi copy, giảm bước hay đổi thứ tự field.”',
  },
  {
    title: 'Chưa đủ',
    body:
      '“Muốn hiểu user nghĩ gì về flow này.” Câu này chưa nói quyết định nào sẽ thay đổi sau research.',
  },
]

function getUXPrincipleAnchor(principle: (typeof uxPrinciples)[number]) {
  return `ux-principle-${principle.number}`
}

function UXPrincipleContent() {
  return (
    <article className="overview-article mt-10 max-w-6xl text-[var(--ds-text-primary)]">
      <div className="space-y-5">
        <div className="inline-flex rounded-full bg-[var(--ds-background-zpblue-subtle)] px-3 py-1 text-[11px] font-semibold uppercase leading-4 text-[var(--ds-text-link)]">
          Principles
        </div>
        <div className="grid gap-3">
          <h2 className="max-w-4xl text-2xl font-bold leading-9 text-[var(--ds-text-primary)] md:text-[2rem] md:leading-[2.75rem]">
            UXD Principles
          </h2>
          <p className="max-w-4xl text-base leading-8 text-[var(--ds-text-secondary)] md:text-xl md:leading-9">
            Sáu nguyên tắc về cách tư duy và ra quyết định - không phải sản
            phẩm trông thế nào, mà là mình nghĩ thế nào trước khi tạo ra nó.
          </p>
        </div>
        <p className="max-w-4xl text-sm font-semibold leading-7 text-[var(--ds-text-primary)]">
          “Tư duy đúng (UX Principle) - Thiết kế đúng (UI Principle) - Sản phẩm
          không rủi ro (Product Audit Checklist) tạo thành một chiếc kiềng ba
          chân để làm sản phẩm.”
        </p>
      </div>

      <UXArticleSection
        description="Một principle có ích phải giúp team cắt lựa chọn: đứng trước hai hướng, nó giúp biết chọn gì và dám nói không với phần còn lại."
        title="Sáu nguyên tắc"
      >
        <div className="grid gap-3 md:grid-cols-2">
          {uxPrinciples.map((principle) => (
            <a
              className="rounded-2xl border border-[var(--ds-border-stroke2)] bg-[var(--ds-background-primary)] p-5 text-left transition-colors hover:border-[var(--ds-border-zpblue-subtle)] hover:bg-[var(--ds-background-secondary)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--ds-border-zpblue-subtle)]"
              href={`#${getUXPrincipleAnchor(principle)}`}
              key={principle.title}
            >
              <span className="mb-3 block text-xs font-bold uppercase leading-4 text-[var(--ds-text-link)]">
                {principle.number}
              </span>
              <h4 className="text-base font-bold leading-6 text-[var(--ds-text-primary)]">
                {principle.title}
              </h4>
              <p className="mt-2 text-sm leading-6 text-[var(--ds-text-secondary)]">
                {principle.summary}
              </p>
            </a>
          ))}
        </div>
      </UXArticleSection>

      <UXArticleSection
        description="Đây là working framework, không phải luật cứng. Dùng nó để chuyển tranh luận cảm tính thành một cách suy nghĩ có cấu trúc chung."
        title="Cách dùng bộ nguyên tắc này"
      >
        <div className="grid gap-4 md:grid-cols-3">
          {uxPrincipleUsage.map((item, index) => (
            <UXInfoCard
              key={item.title}
              label={String(index + 1).padStart(2, '0')}
              text={item.body}
              title={item.title}
            />
          ))}
        </div>
        <p>
          Nguyên tắc nào thường xuyên bị vi phạm là nguyên tắc team cần xem lại
          về cách mình đang hệ thống quy chuẩn.
        </p>
      </UXArticleSection>

      <section className="mt-14 grid gap-5">
        {uxPrinciples.map((principle) => (
          <UXPrincipleDetail key={principle.title} principle={principle} />
        ))}
      </section>
    </article>
  )
}

function UXPrincipleDetail({
  principle,
}: {
  principle: (typeof uxPrinciples)[number]
}) {
  return (
    <article
      className="scroll-mt-32 rounded-2xl border border-[var(--ds-border-stroke2)] bg-[var(--ds-background-primary)] p-6"
      id={getUXPrincipleAnchor(principle)}
    >
      <div className="grid gap-2">
        <span className="text-xs font-bold uppercase leading-4 text-[var(--ds-text-link)]">
          Principle {principle.number}
        </span>
        <h3 className="text-xl font-bold leading-8 text-[var(--ds-text-primary)]">
          {principle.title}
        </h3>
        <p className="max-w-4xl text-sm font-semibold leading-7 text-[var(--ds-text-primary)]">
          “Statement: {principle.statement}”
        </p>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_1.05fr]">
        <div className="space-y-3 text-sm leading-7 text-[var(--ds-text-secondary)]">
          <h4 className="text-base font-bold leading-6 text-[var(--ds-text-primary)]">
            Tại sao quan trọng
          </h4>
          <p>{principle.why}</p>
        </div>

        <div className="rounded-2xl bg-[var(--ds-background-secondary)] p-5">
          <h4 className="text-base font-bold leading-6 text-[var(--ds-text-primary)]">
            Tự kiểm
          </h4>
          <ul className="mt-3 grid gap-2">
            {principle.checks.map((check) => (
              <li
                className="rounded-xl bg-[var(--ds-background-primary)] px-4 py-3 text-sm leading-6 text-[var(--ds-text-secondary)]"
                key={check}
              >
                {check}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <UXDoDontList items={principle.dos} title="Do" variant="do" />
        <UXDoDontList items={principle.donts} title="Don't" variant="dont" />
      </div>
    </article>
  )
}

function UXDoDontList({
  items,
  title,
  variant,
}: {
  items: readonly string[]
  title: string
  variant: 'do' | 'dont'
}) {
  const isDo = variant === 'do'
  const Icon = isDo ? Check : X

  return (
    <div
      className={cn(
        'rounded-2xl border p-5',
        isDo
          ? 'border-[#B7EBD0] bg-[#F0FFF7]'
          : 'border-[#FFD0D0] bg-[#FFF5F5]'
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'flex size-6 shrink-0 items-center justify-center rounded-full',
            isDo ? 'bg-[#00CF6A] text-white' : 'bg-[#E5484D] text-white'
          )}
        >
          <Icon aria-hidden="true" className="size-4" />
        </span>
        <h4
          className={cn(
            'text-base font-bold leading-6',
            isDo ? 'text-[#006B3A]' : 'text-[#B42318]'
          )}
        >
          {title}
        </h4>
      </div>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li className="text-sm leading-6 text-[var(--ds-text-primary)]" key={item}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function UXPatternOverviewContent() {
  return (
    <article className="overview-article mt-10 max-w-6xl text-[var(--ds-text-primary)]">
      <div className="space-y-5">
        <div className="inline-flex rounded-full bg-[var(--ds-background-zpblue-subtle)] px-3 py-1 text-[11px] font-semibold uppercase leading-4 text-[var(--ds-text-link)]">
          UX Patterns
        </div>
        <div className="grid gap-3">
          <h2 className="max-w-4xl text-2xl font-bold leading-9 text-[var(--ds-text-primary)] md:text-[2rem] md:leading-[2.75rem]">
            UX Pattern là gì?
          </h2>
          <p className="max-w-4xl text-base leading-8 text-[var(--ds-text-secondary)] md:text-xl md:leading-9">
            Bộ cách giải quyết những bài toán UX lặp lại, đã có logic, state,
            guideline và bằng chứng để team dùng lại nhất quán hơn.
          </p>
        </div>
      </div>

      <UXArticleSection
        description="Dùng phần này như bản đồ đọc nhanh trước khi đi vào từng pattern cụ thể."
        title="Cách hiểu UX Pattern"
      >
        <UXCardGrid items={uxPatternOverviewCards} />
      </UXArticleSection>

      <UXArticleSection
        description="Một pattern nên được sinh ra từ problem thật, đi qua thử nghiệm thật, rồi mới được đóng gói thành guideline."
        title="Từ case study thành pattern"
      >
        <div className="grid gap-3 md:grid-cols-2">
          {uxPatternOverviewSteps.map((step, index) => (
            <UXInfoCard
              key={step.title}
              label={String(index + 1).padStart(2, '0')}
              text={step.body}
              title={step.title}
            />
          ))}
        </div>
      </UXArticleSection>

      <UXArticleSection
        description="Pattern detail nên giúp người đọc biết dùng ở đâu, setup state nào và vì sao pattern này đáng tin."
        title="Cấu trúc một pattern detail"
      >
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <UXArticlePanel title="Checklist cần có">
            <OverviewBulletList
              items={[
                'Pattern giải quyết vấn đề gì.',
                'Khi nào nên dùng và không nên dùng.',
                'State / scenario bắt buộc cần thiết kế.',
                'Guideline áp dụng trong flow thật.',
                'Case study, metric hoặc evidence đi kèm.',
              ]}
            />
          </UXArticlePanel>
          <div className="overview-callout">
            <p className="text-sm font-bold leading-6 text-[var(--ds-text-primary)]">
              Pattern hiện có:
            </p>
            <p className="mt-3 text-sm leading-6 text-[var(--ds-text-secondary)]">
              Onboarding Task List - pattern dẫn dắt new user bằng danh sách
              nhiệm vụ có thưởng tăng dần, rút ra từ dự án Revamp Onboarding.
            </p>
          </div>
        </div>
      </UXArticleSection>
    </article>
  )
}

function OnboardingTaskListContent() {
  return (
    <article className="overview-article mt-10 max-w-6xl text-[var(--ds-text-primary)]">
      <div className="space-y-5">
        <div className="inline-flex rounded-full bg-[var(--ds-background-zpblue-subtle)] px-3 py-1 text-[11px] font-semibold uppercase leading-4 text-[var(--ds-text-link)]">
          UX Patterns
        </div>
        <div className="grid gap-3">
          <h2 className="max-w-4xl text-2xl font-bold leading-9 text-[var(--ds-text-primary)] md:text-[2rem] md:leading-[2.75rem]">
            Onboarding Task List
          </h2>
          <p className="max-w-4xl text-base leading-8 text-[var(--ds-text-secondary)] md:text-xl md:leading-9">
            Pattern dẫn dắt new user bằng danh sách nhiệm vụ có thưởng tăng
            dần, thay cho banner thụ động trên Home.
          </p>
        </div>
        <p className="max-w-4xl text-sm font-semibold leading-7 text-[var(--ds-text-primary)]">
          “Pattern này rút ra từ dự án Revamp Onboarding (New User) - đã A/B
          test với kết quả CR +68%, frequency mở app +21%.”
        </p>
      </div>

      <UXArticleSection
        description="Bản chất là biến một vùng Home bị động thành một đường đi có thứ tự, có động lực và có phản hồi tiến độ."
        title="Pattern là gì"
      >
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <UXArticlePanel title="Cách hoạt động">
            <p>
              Thay vùng banner thụ động ở đầu Home bằng một component danh sách
              nhiệm vụ có thưởng. Task list dẫn dắt new user qua các bước như
              bật thông báo, xác thực, nạp tiền lần đầu hoặc link bank.
            </p>
            <p>
              Pattern này xử lý hai vấn đề chính: user bị overwhelmed khi vào
              Home và thiếu động lực để hoàn thành các bước onboarding khó.
            </p>
          </UXArticlePanel>
          <div className="overview-callout">
            <p className="text-sm font-bold leading-6 text-[var(--ds-text-primary)]">
              Mục tiêu UX
            </p>
            <OverviewBulletList
              items={[
                'Giảm cảm giác không biết làm gì tiếp.',
                'Tạo thứ tự ưu tiên rõ ràng cho new user.',
                'Biến onboarding thành chuỗi nhiệm vụ có reward.',
              ]}
            />
          </div>
        </div>
      </UXArticleSection>

      <UXArticleSection
        description="Phần này giúp team quyết định pattern có phù hợp với bài toán hiện tại không."
        title="Khi nào nên dùng / không nên dùng"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <UXDoDontList
            items={[
              'User mới vào một luồng nhiều bước và dễ bỏ giữa chừng.',
              'Có phần thưởng hoặc ưu đãi thật để gắn vào từng bước.',
              'Cần dẫn dắt thứ tự ưu tiên rõ ràng thay vì để user tự mò.',
            ]}
            title="Nên dùng"
            variant="do"
          />
          <UXDoDontList
            items={[
              'Luồng chỉ có 1-2 bước đơn giản, không cần chia thành nhiệm vụ.',
              'User đã quen sản phẩm và không cần onboarding thêm.',
              'Không có incentive thật, khiến task list chỉ là checklist trang trí.',
            ]}
            title="Không nên dùng"
            variant="dont"
          />
        </div>
      </UXArticleSection>

      <UXArticleSection
        description="Các state này nên được define trước khi handoff để tránh thiếu rule ở sandbox hoặc production."
        title="State / scenario cần có"
      >
        <UXCardGrid items={onboardingPatternStates} variant="numbered" />
      </UXArticleSection>

      <UXArticleSection
        description="Guideline áp dụng khi mang pattern này sang domain hoặc campaign khác."
        title="Guideline áp dụng"
      >
        <UXCardGrid items={onboardingGuidelines} />
      </UXArticleSection>

      <UXArticleSection
        description="Case study dùng làm bằng chứng cho pattern: Revamp Onboarding (New User)."
        title="Case study"
      >
        <div className="grid gap-5">
          <UXArticlePanel title="Audit - vấn đề">
            <OverviewBulletList items={onboardingCaseStudyIssues} />
          </UXArticlePanel>

          <div className="grid gap-4 md:grid-cols-3">
            <UXInfoCard
              label="Metric"
              text="Uplift CTR, CR từ traffic đến NPU, frequency open app và số ngày mở app trung bình."
              title="Success metric"
            />
            <UXInfoCard
              label="Strategy"
              text="Simplify intent, minimize friction và tạo dominant first sight bằng task list."
              title="UX Strategy"
            />
            <UXInfoCard
              label="Result"
              text="Treatment cho thấy CR vượt trội, engagement tăng và user được dẫn dắt hiệu quả hơn."
              title="Outcome"
            />
          </div>

          <UXArticlePanel title="Giả thuyết thiết kế">
            <OverviewBulletList items={onboardingHypotheses} />
          </UXArticlePanel>

          <UXMetricTable rows={onboardingMetricRows} />

          <p className="text-sm leading-7 text-[var(--ds-text-secondary)]">
            Kết luận: dù traffic nhóm Treatment thấp hơn nhiều, chất lượng user
            tốt hơn hẳn. CR vượt trội, giữ được NPU chất lượng và engagement
            tăng. Next step là kéo dài testing, mở A/B test lên 50% và tiếp tục
            improve task list cùng Growth + Product team.
          </p>
        </div>
      </UXArticleSection>
    </article>
  )
}

function UXMetricTable({
  rows,
}: {
  rows: Array<{
    control: string
    diff: string
    metric: string
    treatment: string
  }>
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--ds-border-stroke2)] bg-[var(--ds-background-primary)]">
      <table className="min-w-[680px] w-full border-collapse text-left text-sm">
        <thead className="bg-[var(--ds-background-zpblue-subtle)] text-[var(--ds-text-primary)]">
          <tr>
            <th className="px-4 py-3 font-bold">Metric</th>
            <th className="px-4 py-3 font-bold">A - Control</th>
            <th className="px-4 py-3 font-bold">B - Treatment</th>
            <th className="px-4 py-3 font-bold">Diff B vs A</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              className="border-t border-[var(--ds-border-stroke2)]"
              key={row.metric}
            >
              <td className="px-4 py-3 font-semibold text-[var(--ds-text-primary)]">
                {row.metric}
              </td>
              <td className="px-4 py-3 text-[var(--ds-text-secondary)]">
                {row.control}
              </td>
              <td className="px-4 py-3 text-[var(--ds-text-secondary)]">
                {row.treatment}
              </td>
              <td className="px-4 py-3 font-bold text-[#006B3A]">
                {row.diff}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function WorkflowFlowDiagram() {
  const nodeToneClassNames = {
    amber: 'border-[#F5D6A0] bg-[#FFF8EA] text-[#7A5C18]',
    blue: 'border-[#B8DCFF] bg-[#F1F8FF] text-[#0057B8]',
    green: 'border-[#AFEAD7] bg-[#F0FFF9] text-[#007A52]',
    red: 'border-[#FFD0C8] bg-[#FFF5F2] text-[#A11B10]',
    violet: 'border-[#D8D2FF] bg-[#F5F3FF] text-[#4138A5]',
  } as const

  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--ds-border-stroke2)] bg-[var(--ds-background-secondary)] p-4 md:p-6">
      <div className="mx-auto grid min-w-[760px] max-w-[920px] gap-4">
        <div className="mx-auto w-[280px]">
          <WorkflowFlowNode
            description="Nhận brief, align scope với PO/biz"
            title="Kick-off"
          />
        </div>
        <div className="mx-auto w-[280px]">
          <WorkflowFlowNode
            description="Đề bài đã đặt đúng vấn đề chưa?"
            title="Problem Framing"
          />
        </div>

        <div className="grid grid-cols-[1fr_64px_1fr] items-start gap-4">
          <div className="grid content-start gap-3">
            <WorkflowFlowLabel label="No" />
            <WorkflowFlowNode
              description="Check lại với stakeholder để clear đề bài"
              title="Re-Define"
            />
            <WorkflowFlowLabel label="Infeasible" />
            <WorkflowFlowNode
              className="mx-auto w-[150px]"
              title="Pending"
              variant="muted"
            />
          </div>

          <div className="flex min-h-[132px] items-end justify-center">
            <span className="rounded-full border border-[var(--ds-border-stroke2)] bg-[var(--ds-background-primary)] px-3 py-1 text-xs font-semibold text-[var(--ds-text-secondary)]">
              Done
            </span>
          </div>

          <div className="grid content-start gap-3">
            <WorkflowFlowLabel label="Yes" />
            <WorkflowFlowNode
              description="Phân loại project type và pass checklist"
              title="Categorization"
            />
          </div>
        </div>

        <WorkflowBranchLabel label="Project type" />
        <div className="grid grid-cols-5 gap-3">
          {workflowFlowProjectNodes.map((node) => (
            <WorkflowFlowNode
              className={nodeToneClassNames[node.tone]}
              key={node.title}
              title={node.title}
              variant="tinted"
            />
          ))}
        </div>

        <WorkflowBranchLabel label="Track" />
        <div className="grid grid-cols-5 gap-3">
          {workflowFlowProjectNodes.map((node) => (
            <WorkflowFlowNode
              className="min-h-[56px]"
              key={`${node.title}-${node.track}`}
              title={node.track}
              variant="muted"
            />
          ))}
        </div>

        <WorkflowBranchLabel label="UX output" />
        <div className="grid grid-cols-5 gap-3">
          {workflowFlowProjectNodes.map((node) => (
            <WorkflowFlowNode
              className={nodeToneClassNames[node.tone]}
              key={`${node.title}-${node.deliverable}`}
              title={node.deliverable}
              variant="tinted"
            />
          ))}
        </div>

        <div className="mx-auto w-[360px]">
          <WorkflowFlowNode
            description="Logic, Problem Statement, Userflow, IA..."
            title="Internal UX Review"
          />
        </div>
        <div className="mx-auto w-[160px]">
          <WorkflowFlowNode title="Deliver" variant="muted" />
        </div>
      </div>
    </div>
  )
}

function WorkflowFlowNode({
  className,
  description,
  title,
  variant = 'default',
}: {
  className?: string
  description?: string
  title: string
  variant?: 'default' | 'muted' | 'tinted'
}) {
  return (
    <div
      className={cn(
        'flex min-h-[72px] flex-col items-center justify-center rounded-2xl border px-4 py-3 text-center',
        variant === 'default' &&
          'border-[var(--ds-border-stroke2)] bg-[var(--ds-background-primary)] text-[var(--ds-text-primary)]',
        variant === 'muted' &&
          'border-[var(--ds-border-stroke2)] bg-[#FFFCF4] text-[#786A43]',
        variant === 'tinted' && 'font-bold',
        className
      )}
    >
      <p className="text-base font-bold leading-6">{title}</p>
      {description && (
        <p className="mt-1 text-xs font-medium leading-5 text-[var(--ds-text-secondary)]">
          {description}
        </p>
      )}
    </div>
  )
}

function WorkflowBranchLabel({ label }: { label: string }) {
  return (
    <div className="relative flex items-center py-1">
      <span className="h-px flex-1 bg-[var(--ds-border-stroke2)]" />
      <span className="mx-3 rounded-full bg-[var(--ds-background-primary)] px-3 py-1 text-xs font-bold uppercase leading-4 text-[var(--ds-text-link)]">
        {label}
      </span>
      <span className="h-px flex-1 bg-[var(--ds-border-stroke2)]" />
    </div>
  )
}

function WorkflowFlowLabel({ label }: { label: string }) {
  return (
    <span className="mx-auto rounded-full border border-[var(--ds-border-stroke2)] bg-[var(--ds-background-primary)] px-3 py-1 text-xs font-semibold text-[var(--ds-text-secondary)]">
      {label}
    </span>
  )
}

function UXResearchWorkflowMap() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--ds-border-stroke2)] bg-white px-3 py-4">
      <img
        alt="Sơ đồ quy trình UX Research từ entry point tới readout và handoff"
        className="block h-auto max-w-none"
        height={1531}
        src="/ux-research-workflow-map.svg"
        width={940}
      />
    </div>
  )
}

function WorkflowOverviewContent() {
  return (
    <article className="overview-article mt-10 max-w-6xl text-[var(--ds-text-primary)]">
      <div className="space-y-5">
        <div className="inline-flex rounded-full bg-[var(--ds-background-zpblue-subtle)] px-3 py-1 text-[11px] font-semibold uppercase leading-4 text-[var(--ds-text-link)]">
          Workflow
        </div>
        <div className="grid gap-3">
          <h2 className="max-w-4xl text-2xl font-bold leading-9 text-[var(--ds-text-primary)] md:text-[2rem] md:leading-[2.75rem]">
            Overall
          </h2>
          <p className="max-w-4xl text-base leading-8 text-[var(--ds-text-secondary)] md:text-xl md:leading-9">
            Quy trình tổng quan UX Design: phân loại project type, chọn track
            phù hợp và follow đúng checklist.
          </p>
        </div>
      </div>

      <UXArticleSection
        description="Workflow này giúp cả UXD và stakeholder gọi đúng loại việc, tránh thiếu input và giảm vòng hỏi lại."
        title="Goal"
      >
        <UXArticlePanel title="Mục tiêu">
          <OverviewBulletList items={workflowGoals} />
        </UXArticlePanel>
      </UXArticleSection>

      <UXArticleSection
        description="Đây là đường đi tổng quát từ lúc nhận brief tới lúc deliver output."
        title="Quy trình tổng quan"
      >
        <WorkflowFlowDiagram />
      </UXArticleSection>

      <UXArticleSection
        description="Năm project type dưới đây là trục xuyên suốt: mỗi loại quyết định track xử lý và checklist cần làm."
        title="Phân loại Project Type"
      >
        <WorkflowProjectTypeTable rows={workflowProjectTypes} />
      </UXArticleSection>

      <UXArticleSection
        description="Track càng sâu thì input càng cần rõ, vì mức ảnh hưởng tới flow, logic và KPI càng lớn."
        title="Track theo Project Type"
      >
        <div className="grid gap-3 md:grid-cols-3">
          {workflowProjectTypes.map((item) => (
            <UXInfoCard
              key={item.level}
              label={item.track}
              text={item.deliverable}
              title={item.level}
            />
          ))}
        </div>
      </UXArticleSection>

      <UXArticleSection
        description="Dùng bảng này để biết mỗi project type cần chuẩn bị tới mức nào trước khi UXD bắt đầu."
        title="Checklist theo Project Type"
      >
        <WorkflowChecklistTable rows={workflowChecklistRows} />
      </UXArticleSection>
    </article>
  )
}

function OrderTicketContent() {
  return (
    <article className="overview-article mt-10 max-w-6xl text-[var(--ds-text-primary)]">
      <div className="space-y-5">
        <div className="inline-flex rounded-full bg-[var(--ds-background-zpblue-subtle)] px-3 py-1 text-[11px] font-semibold uppercase leading-4 text-[var(--ds-text-link)]">
          Workflow
        </div>
        <div className="grid gap-3">
          <h2 className="max-w-4xl text-2xl font-bold leading-9 text-[var(--ds-text-primary)] md:text-[2rem] md:leading-[2.75rem]">
            Order Ticket
          </h2>
          <p className="max-w-4xl text-base leading-8 text-[var(--ds-text-secondary)] md:text-xl md:leading-9">
            Ticket checklist giúp stakeholders điền đủ thông tin cần thiết để
            UXD hiểu problem, scope và tiêu chí thành công trước khi bắt đầu.
          </p>
        </div>
        <p className="max-w-4xl text-sm font-semibold leading-7 text-[var(--ds-text-primary)]">
          “Một - ít phút để điền, tiết kiệm 60 phút catchup.”
        </p>
      </div>

      <UXArticleSection
        description="Chọn đúng project type giúp UXD xác định mức checklist, track xử lý và kỳ vọng output."
        title="Phân loại Project Type"
      >
        <UXCardGrid items={orderTicketProjectTypes} variant="numbered" />
      </UXArticleSection>

      <UXArticleSection
        description="Đây là khung kick-off tối thiểu. Ticket càng rõ, team càng dễ start mà không cần hỏi lại."
        title="Jira ticket - Kick off template"
      >
        <div className="grid gap-4">
          {orderTicketTemplateItems.map((item, index) => (
            <article
              className="rounded-2xl border border-[var(--ds-border-stroke2)] bg-[var(--ds-background-primary)] p-5"
              key={item.title}
            >
              <span className="mb-3 block text-xs font-bold uppercase leading-4 text-[var(--ds-text-link)]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h4 className="text-base font-bold leading-6 text-[var(--ds-text-primary)]">
                {item.title}
              </h4>
              <p className="mt-2 text-sm leading-6 text-[var(--ds-text-secondary)]">
                {item.body}
              </p>
              <p className="mt-3 rounded-xl bg-[var(--ds-background-secondary)] px-4 py-3 text-sm leading-6 text-[var(--ds-text-primary)]">
                {item.example}
              </p>
            </article>
          ))}
        </div>
      </UXArticleSection>

      <UXArticleSection
        description="Cùng một dạng việc, nhưng input khác nhau sẽ tạo ra tốc độ xử lý rất khác."
        title="Ví dụ: request tệ vs request tốt"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <UXDoDontList
            items={orderTicketBadInput}
            title="Chưa đủ input"
            variant="dont"
          />
          <UXDoDontList
            items={orderTicketGoodInput}
            title="Đủ input để start ngay"
            variant="do"
          />
        </div>
      </UXArticleSection>

      <UXArticleSection
        description="Sau khi ticket được gửi, UXD sẽ đọc khung kick-off và phản hồi theo mức rõ của problem."
        title="Sau khi gửi"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <UXInfoCard
            label="Ready"
            text="Nếu problem rõ và scope hợp lý, UXD confirm và bắt đầu, hoặc catchup align nhanh nếu cần chốt thêm."
            title="Problem rõ"
          />
          <UXInfoCard
            label="Clarify"
            text="Nếu problem chưa rõ hoặc thiếu input, UXD phản hồi ngay để cùng làm rõ trước khi start."
            title="Thiếu input"
          />
        </div>
      </UXArticleSection>
    </article>
  )
}

function WorkflowProjectTypeTable({
  rows,
}: {
  rows: typeof workflowProjectTypes
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--ds-border-stroke2)] bg-[var(--ds-background-primary)]">
      <table className="min-w-[760px] w-full border-collapse text-left text-sm">
        <thead className="bg-[var(--ds-background-zpblue-subtle)] text-[var(--ds-text-primary)]">
          <tr>
            <th className="px-4 py-3 font-bold">Level</th>
            <th className="px-4 py-3 font-bold">Description</th>
            <th className="px-4 py-3 font-bold">Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              className="border-t border-[var(--ds-border-stroke2)]"
              key={row.level}
            >
              <td className="px-4 py-3 font-semibold text-[var(--ds-text-primary)]">
                {row.level}
              </td>
              <td className="px-4 py-3 text-[var(--ds-text-secondary)]">
                {row.description}
              </td>
              <td className="px-4 py-3 text-[var(--ds-text-secondary)]">
                {row.action}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function WorkflowChecklistTable({
  rows,
}: {
  rows: typeof workflowChecklistRows
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--ds-border-stroke2)] bg-[var(--ds-background-primary)]">
      <table className="min-w-[860px] w-full border-collapse text-left text-sm">
        <thead className="bg-[var(--ds-background-zpblue-subtle)] text-[var(--ds-text-primary)]">
          <tr>
            <th className="px-4 py-3 font-bold">Checklist</th>
            <th className="px-4 py-3 font-bold">Quick Fix</th>
            <th className="px-4 py-3 font-bold">Adjust</th>
            <th className="px-4 py-3 font-bold">New Feature</th>
            <th className="px-4 py-3 font-bold">Revamp</th>
            <th className="px-4 py-3 font-bold">New Product</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              className="border-t border-[var(--ds-border-stroke2)]"
              key={row.item}
            >
              <td className="px-4 py-3 font-semibold text-[var(--ds-text-primary)]">
                {row.item}
              </td>
              <td className="px-4 py-3 text-[var(--ds-text-secondary)]">
                {row.quickFix}
              </td>
              <td className="px-4 py-3 text-[var(--ds-text-secondary)]">
                {row.adjust}
              </td>
              <td className="px-4 py-3 text-[var(--ds-text-secondary)]">
                {row.newFeature}
              </td>
              <td className="px-4 py-3 text-[var(--ds-text-secondary)]">
                {row.revamp}
              </td>
              <td className="px-4 py-3 text-[var(--ds-text-secondary)]">
                {row.newProduct}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function UXResearchSurveyContent() {
  return (
    <article className="overview-article mt-10 max-w-6xl text-[var(--ds-text-primary)]">
      <div className="space-y-5">
        <div className="inline-flex rounded-full bg-[var(--ds-background-zpblue-subtle)] px-3 py-1 text-[11px] font-semibold uppercase leading-4 text-[var(--ds-text-link)]">
          UX Research Method
        </div>
        <div className="grid gap-3">
          <h2 className="max-w-4xl text-2xl font-bold leading-9 text-[var(--ds-text-primary)] md:text-[2rem] md:leading-[2.75rem]">
            Survey
          </h2>
          <p className="max-w-4xl text-base leading-8 text-[var(--ds-text-secondary)] md:text-xl md:leading-9">
            Survey là phương pháp thu thập phản hồi có cấu trúc từ nhiều user
            cùng lúc, phù hợp để đo mức độ phổ biến, so sánh nhóm user hoặc
            kiểm chứng một giả thuyết đã rõ.
          </p>
        </div>
        <p className="max-w-4xl text-sm font-semibold leading-7 text-[var(--ds-text-primary)]">
          “Survey không thay thế interview. Survey giúp team biết một tín hiệu
          có rộng tới đâu, với nhóm nào, và có đủ đáng ưu tiên không.”
        </p>
      </div>

      <UXArticleSection
        description="Dùng survey khi team cần dữ liệu có cấu trúc trên nhóm user đủ lớn, không phải khi cần đào sâu động cơ phức tạp."
        title="Khi nào dùng Survey"
      >
        <UXCardGrid items={surveyUseCases} />
      </UXArticleSection>

      <UXArticleSection
        description="Một survey tốt bắt đầu từ quyết định cần ra, không bắt đầu từ danh sách câu hỏi."
        title="Quy trình chạy Survey"
      >
        <div className="grid gap-3 md:grid-cols-2">
          {surveyWorkflowSteps.map((step, index) => (
            <UXInfoCard
              key={step.title}
              label={String(index + 1).padStart(2, '0')}
              text={step.body}
              title={step.title}
            />
          ))}
        </div>
      </UXArticleSection>

      <UXArticleSection
        description="Chọn loại câu hỏi theo cách team muốn phân tích câu trả lời sau đó."
        title="Loại câu hỏi thường dùng"
      >
        <UXCardGrid items={surveyQuestionTypes} variant="numbered" />
      </UXArticleSection>

      <UXArticleSection
        description="Hai danh sách này dùng để review nhanh trước khi gửi survey cho user."
        title="Do / Don't"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <UXDoDontList items={surveyDoItems} title="Do" variant="do" />
          <UXDoDontList items={surveyDontItems} title="Don't" variant="dont" />
        </div>
      </UXArticleSection>

      <UXArticleSection
        description="Checklist tối thiểu để survey không chỉ có response, mà có insight dùng được cho product/design."
        title="Pre-launch checklist"
      >
        <SurveyChecklistTable rows={surveyChecklistRows} />
      </UXArticleSection>

      <UXArticleSection
        description="Sau khi đóng form, đừng chỉ report số. Hãy biến kết quả thành quyết định tiếp theo."
        title="Cách đọc kết quả"
      >
        <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <UXArticlePanel title="Phân tích định lượng">
            <OverviewBulletList
              items={[
                'Clean data và loại response kém chất lượng.',
                'Đọc tổng quan trước: tỷ lệ chọn, trung bình, phân bố điểm.',
                'So sánh theo segment quan trọng như user mới/cũ, tần suất sử dụng hoặc trạng thái KYC.',
                'Không kết luận từ mẫu quá nhỏ hoặc nhóm respondent bị lệch.',
              ]}
            />
          </UXArticlePanel>
          <UXArticlePanel title="Phân tích định tính">
            <OverviewBulletList
              items={[
                'Tag theme cho câu trả lời open-ended.',
                'Đếm tần suất theme nhưng vẫn đọc quote để hiểu sắc thái.',
                'Tách rõ insight, evidence và recommendation.',
                'Kết thúc bằng implication: team nên giữ, bỏ, ưu tiên hay nghiên cứu tiếp điều gì.',
              ]}
            />
          </UXArticlePanel>
        </div>
      </UXArticleSection>
    </article>
  )
}

function SurveyChecklistTable({
  rows,
}: {
  rows: typeof surveyChecklistRows
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--ds-border-stroke2)] bg-[var(--ds-background-primary)]">
      {rows.map((row) => (
        <div
          className="grid gap-2 border-b border-[var(--ds-border-stroke2)] p-5 last:border-b-0 md:grid-cols-[0.35fr_1fr]"
          key={row.item}
        >
          <p className="font-bold leading-7 text-[var(--ds-text-primary)]">
            {row.item}
          </p>
          <p className="text-sm leading-6 text-[var(--ds-text-secondary)]">
            {row.check}
          </p>
        </div>
      ))}
    </div>
  )
}

function UXResearchWorkflowOverviewContent() {
  return (
    <article className="overview-article mt-10 max-w-6xl text-[var(--ds-text-primary)]">
      <div className="space-y-5">
        <div className="inline-flex rounded-full bg-[var(--ds-background-zpblue-subtle)] px-3 py-1 text-[11px] font-semibold uppercase leading-4 text-[var(--ds-text-link)]">
          Workflow
        </div>
        <div className="grid gap-3">
          <h2 className="max-w-4xl text-2xl font-bold leading-9 text-[var(--ds-text-primary)] md:text-[2rem] md:leading-[2.75rem]">
            Overall
          </h2>
          <p className="max-w-4xl text-base leading-8 text-[var(--ds-text-secondary)] md:text-xl md:leading-9">
            Quy trình chuẩn xử lý một task UX Research - từ entry point tới
            readout và handoff.
          </p>
        </div>
      </div>

      <UXArticleSection
        description="Workflow này giúp team biết khi nào cần research, chọn method nào và cần chuẩn bị material gì."
        title="Mục tiêu"
      >
        <UXArticlePanel title="UX Research workflow giúp">
          <OverviewBulletList items={uxResearchWorkflowGoals} />
        </UXArticlePanel>
      </UXArticleSection>

      <UXArticleSection
        description="Research chỉ đáng làm khi nó trả lời một câu hỏi cụ thể và thay đổi một quyết định thật."
        title="Khi nào nên làm research"
      >
        <UXCardGrid items={uxResearchWhenToResearch} variant="numbered" />
      </UXArticleSection>

      <UXArticleSection
        description="Từ lúc nhận yêu cầu tới lúc bàn giao insight, mỗi bước cần giữ được liên kết giữa câu hỏi, method và quyết định."
        title="Sơ đồ quy trình"
      >
        <UXResearchWorkflowMap />
      </UXArticleSection>
    </article>
  )
}

function UXResearchMethodPickerContent() {
  const [selectedState, setSelectedState] = useState(
    uxResearchMethodPickerRows[0].state
  )
  const [selectedQuestion, setSelectedQuestion] = useState<
    (typeof uxResearchMethodPickerColumns)[number]['key']
  >(
    uxResearchMethodPickerColumns[0].key
  )
  const selectedRow =
    uxResearchMethodPickerRows.find((row) => row.state === selectedState) ??
    uxResearchMethodPickerRows[0]
  const selectedColumn =
    uxResearchMethodPickerColumns.find(
      (column) => column.key === selectedQuestion
    ) ?? uxResearchMethodPickerColumns[0]
  const selectedCell = selectedRow.cells[selectedColumn.key]

  return (
    <article className="overview-article mt-10 max-w-6xl text-[var(--ds-text-primary)]">
      <div className="space-y-5">
        <div className="inline-flex rounded-full bg-[var(--ds-background-zpblue-subtle)] px-3 py-1 text-[11px] font-semibold uppercase leading-4 text-[var(--ds-text-link)]">
          Workflow
        </div>
        <div className="grid gap-3">
          <h2 className="max-w-4xl text-2xl font-bold leading-9 text-[var(--ds-text-primary)] md:text-[2rem] md:leading-[2.75rem]">
            Method Picker Matrix
          </h2>
          <p className="max-w-4xl text-base leading-8 text-[var(--ds-text-secondary)] md:text-xl md:leading-9">
            Tra cứu nên dùng method nào theo trạng thái sản phẩm và loại câu
            hỏi cần trả lời.
          </p>
        </div>
        <p className="max-w-5xl text-sm leading-7 text-[var(--ds-text-secondary)]">
          Ma trận này đọc theo hai chiều:{' '}
          <strong className="text-[var(--ds-text-primary)]">
            trạng thái sản phẩm
          </strong>{' '}
          (hàng) và{' '}
          <strong className="text-[var(--ds-text-primary)]">
            loại câu hỏi cần trả lời
          </strong>{' '}
          (cột). Tìm ô giao giữa trạng thái hiện tại của bạn và câu hỏi đang
          cần answer. Ô đó cho biết method phù hợp, hoặc lý do tại sao chưa nên
          làm research ở đây.
        </p>
      </div>

      <UXArticleSection
        description="Chọn nhanh trạng thái sản phẩm và loại câu hỏi để thấy method gợi ý trước khi đọc toàn bộ matrix."
        title="Pick nhanh method"
      >
        <UXResearchMethodWizard
          selectedCell={selectedCell}
          selectedColumn={selectedColumn}
          selectedQuestion={selectedQuestion}
          selectedRow={selectedRow}
          selectedState={selectedState}
          onQuestionChange={setSelectedQuestion}
          onStateChange={setSelectedState}
        />
      </UXArticleSection>

      <UXArticleSection
        description="Đi theo hàng trước, rồi đọc qua cột để tránh chọn method chỉ vì team đang quen dùng."
        title="Ma trận chọn method"
      >
        <UXResearchMethodPickerMatrix />
      </UXArticleSection>

      <UXArticleSection
        description="Bốn nhóm câu hỏi này là trục chính để xác định loại research cần làm."
        title="Bốn loại câu hỏi"
      >
        <div className="grid gap-4 md:grid-cols-2">
          {uxResearchQuestionTypes.map((item, index) => (
            <UXInfoCard
              key={item.title}
              label={String(index + 1).padStart(2, '0')}
              text={item.body}
              title={item.title}
            />
          ))}
        </div>
      </UXArticleSection>

      <UXArticleSection
        description="Một số request nghe giống research, nhưng không map vào UXR workflow hoặc không tạo ra insight actionable."
        title="Out-of-scope — request không map vào UXR workflow"
      >
        <UXQuickLinkList items={uxResearchOutOfScopeItems} />
      </UXArticleSection>

      <UXArticleSection
        description="Khi method chuẩn bị kẹt budget, timeline hoặc sample, dùng bảng này để chọn hướng thay thế có giới hạn rõ ràng."
        title="Downgrade Table — phương pháp thay thế khi bí đường"
      >
        <UXResearchDowngradeTable rows={uxResearchDowngradeRows} />
      </UXArticleSection>
    </article>
  )
}

function UXResearchMethodWizard({
  onQuestionChange,
  onStateChange,
  selectedCell,
  selectedColumn,
  selectedQuestion,
  selectedRow,
  selectedState,
}: {
  onQuestionChange: (
    question: (typeof uxResearchMethodPickerColumns)[number]['key']
  ) => void
  onStateChange: (state: string) => void
  selectedCell: {
    body?: string
    empty?: string
    method?: string
    note?: string
    warning?: string
  }
  selectedColumn: (typeof uxResearchMethodPickerColumns)[number]
  selectedQuestion: (typeof uxResearchMethodPickerColumns)[number]['key']
  selectedRow: (typeof uxResearchMethodPickerRows)[number]
  selectedState: string
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
      <div className="grid gap-4">
        <div className="rounded-2xl border border-[var(--ds-border-stroke2)] bg-[var(--ds-background-primary)] p-5">
          <p className="text-sm font-bold leading-6 text-[var(--ds-text-primary)]">
            1. Trạng thái sản phẩm hiện tại
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {uxResearchMethodPickerRows.map((row) => {
              const isActive = row.state === selectedState

              return (
                <button
                  className={cn(
                    'rounded-xl border px-4 py-3 text-left transition-colors',
                    isActive
                      ? 'border-[var(--ds-border-zpblue-subtle)] bg-[var(--ds-background-zpblue-subtle)]'
                      : 'border-[var(--ds-border-stroke2)] bg-[var(--ds-background-primary)] hover:bg-[var(--ds-background-secondary)]'
                  )}
                  key={row.state}
                  onClick={() => onStateChange(row.state)}
                  type="button"
                >
                  <span className="block text-sm font-bold leading-6 text-[var(--ds-text-primary)]">
                    {row.state}
                  </span>
                  <span className="mt-1 block text-xs font-medium leading-5 text-[var(--ds-text-secondary)]">
                    {row.context}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--ds-border-stroke2)] bg-[var(--ds-background-primary)] p-5">
          <p className="text-sm font-bold leading-6 text-[var(--ds-text-primary)]">
            2. Loại câu hỏi cần trả lời
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {uxResearchMethodPickerColumns.map((column) => {
              const isActive = column.key === selectedQuestion

              return (
                <button
                  className={cn(
                    'rounded-xl border px-4 py-3 text-left transition-colors',
                    isActive
                      ? 'border-[var(--ds-border-zpblue-subtle)] bg-[var(--ds-background-zpblue-subtle)]'
                      : 'border-[var(--ds-border-stroke2)] bg-[var(--ds-background-primary)] hover:bg-[var(--ds-background-secondary)]'
                  )}
                  key={column.key}
                  onClick={() => onQuestionChange(column.key)}
                  type="button"
                >
                  <span className="block text-sm font-bold leading-6 text-[var(--ds-text-primary)]">
                    {column.label}
                  </span>
                  <span className="mt-1 block text-xs font-medium leading-5 text-[var(--ds-text-secondary)]">
                    {column.subtitle}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--ds-border-zpblue-subtle)] bg-[var(--ds-background-primary)] p-6">
        <span className="inline-flex rounded-full bg-[var(--ds-background-zpblue-subtle)] px-3 py-1 text-[11px] font-semibold uppercase leading-4 text-[var(--ds-text-link)]">
          Recommended
        </span>
        <div className="mt-4 grid gap-2">
          <p className="text-sm font-semibold leading-6 text-[var(--ds-text-secondary)]">
            {selectedRow.state} / {selectedColumn.subtitle}
          </p>
          {selectedCell.empty ? (
            <h3 className="text-xl font-bold leading-8 text-[var(--ds-text-primary)]">
              {selectedCell.empty}
            </h3>
          ) : (
            <>
              <h3 className="text-xl font-bold leading-8 text-[var(--ds-text-link)]">
                {selectedCell.method}
              </h3>
              {selectedCell.body && (
                <p className="text-sm leading-7 text-[var(--ds-text-secondary)]">
                  {selectedCell.body}
                </p>
              )}
            </>
          )}
        </div>
        {selectedCell.note && (
          <p className="mt-4 rounded-xl border border-[#B8DCFF] bg-[#F1F8FF] px-4 py-3 text-sm font-medium leading-6 text-[#0057B8]">
            {selectedCell.note}
          </p>
        )}
        {selectedCell.warning && (
          <p className="mt-4 rounded-xl border border-[#F5D6A0] bg-[#FFF8EA] px-4 py-3 text-sm font-medium leading-6 text-[#7A5C18]">
            {selectedCell.warning}
          </p>
        )}
      </div>
    </div>
  )
}

function UXResearchOrderContent() {
  return (
    <article className="overview-article mt-10 max-w-6xl text-[var(--ds-text-primary)]">
      <div className="space-y-5">
        <div className="inline-flex rounded-full bg-[var(--ds-background-zpblue-subtle)] px-3 py-1 text-[11px] font-semibold uppercase leading-4 text-[var(--ds-text-link)]">
          Workflow
        </div>
        <div className="grid gap-3">
          <h2 className="max-w-4xl text-2xl font-bold leading-9 text-[var(--ds-text-primary)] md:text-[2rem] md:leading-[2.75rem]">
            Order một research
          </h2>
          <p className="max-w-4xl text-base leading-8 text-[var(--ds-text-secondary)] md:text-xl md:leading-9">
            Bắt đầu ở đây - điền khung input rồi gửi cho team UX trước khi lên
            ticket chính thức.
          </p>
        </div>
        <p className="max-w-4xl text-sm font-semibold leading-7 text-[var(--ds-text-primary)]">
          “Mất khoảng 15 phút để điền, tiết kiệm 60 phút catchup.”
        </p>
      </div>

      <UXArticleSection
        description="Nếu đã biết format ticket order thì viết ticket luôn. Nếu chưa chắc, điền khung dưới trước để team UX check hướng xử lý."
        title="Bạn biết format ticket order chưa?"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <UXInfoCard
            label="Rồi"
            text="Viết ticket luôn, nhớ gắn context/problem/decision cần support."
            title="Có đủ format"
          />
          <UXInfoCard
            label="Chưa"
            text="Điền đủ khung input này rồi gửi cho team UX để cùng xác định có cần research không, làm theo cách nào và mất bao lâu."
            title="Cần align trước"
          />
        </div>
      </UXArticleSection>

      <UXArticleSection
        description="Đây chưa phải ticket, chỉ là thông tin để team UX check research này có cần làm không, làm theo cách nào và mất bao lâu."
        title="Khung input - collect requirement"
      >
        <UXCardGrid items={orderResearchInputItems} variant="numbered" />
      </UXArticleSection>

      <UXArticleSection
        description="Research chỉ đáng làm khi kết quả của nó thay đổi một quyết định bạn đang phải ra."
        title="Để ra quyết định gì"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <UXDoDontList
            items={[orderResearchGoodBad[0].body]}
            title={orderResearchGoodBad[0].title}
            variant="do"
          />
          <UXDoDontList
            items={[orderResearchGoodBad[1].body]}
            title={orderResearchGoodBad[1].title}
            variant="dont"
          />
        </div>
      </UXArticleSection>

      <UXArticleSection
        description="Sau khi nhận input, team UXR sẽ phản hồi nhanh để chốt có làm research hay không và nếu làm thì đi theo method nào."
        title="Sau khi gửi"
      >
        <UXQuickLinkList
          items={[
            {
              title: 'Problem rõ, decision rõ',
              body: 'UXR confirm scope, chọn method và bắt đầu research plan.',
            },
            {
              title: 'Thiếu context hoặc decision',
              body: 'UXR phản hồi để làm rõ trước khi lên ticket chính thức.',
            },
            {
              title: 'Không cần research',
              body: 'Team có thể đề xuất dùng data sẵn có, expert review hoặc alignment nhanh thay vì chạy research.',
            },
          ]}
        />
      </UXArticleSection>
    </article>
  )
}

function UXResearchMethodPickerMatrix() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--ds-border-stroke2)] bg-[var(--ds-background-primary)]">
      <table className="min-w-[980px] w-full border-collapse text-left text-sm">
        <thead>
          <tr className="bg-[var(--ds-background-zpblue-subtle)] text-[var(--ds-text-primary)]">
            <th className="w-[180px] px-4 py-4 align-bottom font-bold">
              <span className="block text-xs uppercase leading-4 text-[var(--ds-text-link)]">
                Trạng thái
              </span>
              <span className="mt-1 block text-sm">Câu hỏi</span>
            </th>
            {uxResearchMethodPickerColumns.map((column) => (
              <th className="min-w-[200px] px-4 py-4 align-top" key={column.key}>
                <span className="block font-bold leading-6">
                  {column.label}
                </span>
                <span className="mt-1 block text-xs font-medium leading-5 text-[var(--ds-text-secondary)]">
                  {column.subtitle}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {uxResearchMethodPickerRows.map((row) => (
            <tr
              className="border-t border-[var(--ds-border-stroke2)]"
              key={row.state}
            >
              <th className="bg-[#FFFCF4] px-4 py-5 align-top text-left">
                <span className="block font-bold leading-6 text-[var(--ds-text-primary)]">
                  {row.state}
                </span>
                <span className="mt-2 block text-sm font-medium leading-6 text-[var(--ds-text-secondary)]">
                  {row.context}
                </span>
              </th>
              {uxResearchMethodPickerColumns.map((column) => (
                <td
                  className="border-l border-[var(--ds-border-stroke2)] px-4 py-5 align-top"
                  key={`${row.state}-${column.key}`}
                >
                  <UXResearchMethodCell cell={row.cells[column.key]} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function UXResearchMethodCell({
  cell,
}: {
  cell: {
    body?: string
    empty?: string
    method?: string
    note?: string
    warning?: string
  }
}) {
  if (cell.empty) {
    return (
      <div className="flex min-h-[104px] items-center justify-center text-center text-sm font-medium leading-6 text-[var(--ds-text-tertiary)]">
        {cell.empty}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="font-bold leading-6 text-[var(--ds-text-link)]">
          {cell.method}
        </p>
        {cell.body && (
          <p className="mt-2 text-sm leading-6 text-[var(--ds-text-secondary)]">
            {cell.body}
          </p>
        )}
      </div>
      {cell.note && (
        <p className="rounded-xl border border-[#B8DCFF] bg-[#F1F8FF] px-3 py-2 text-xs font-medium leading-5 text-[#0057B8]">
          {cell.note}
        </p>
      )}
      {cell.warning && (
        <p className="rounded-xl border border-[#F5D6A0] bg-[#FFF8EA] px-3 py-2 text-xs font-medium leading-5 text-[#7A5C18]">
          {cell.warning}
        </p>
      )}
    </div>
  )
}

function UXResearchDowngradeTable({
  rows,
}: {
  rows: typeof uxResearchDowngradeRows
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--ds-border-stroke2)] bg-[var(--ds-background-primary)]">
      <table className="min-w-[760px] w-full border-collapse text-left text-sm">
        <thead className="bg-[var(--ds-background-zpblue-subtle)] text-[var(--ds-text-primary)]">
          <tr>
            <th className="w-[180px] px-4 py-3 font-bold">
              Phương pháp chuẩn
            </th>
            <th className="w-[260px] px-4 py-3 font-bold">
              Phương pháp thay thế
            </th>
            <th className="px-4 py-3 font-bold">Lưu ý</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              className="border-t border-[var(--ds-border-stroke2)]"
              key={row.standard}
            >
              <td className="px-4 py-3 font-semibold text-[var(--ds-text-primary)]">
                {row.standard}
              </td>
              <td className="px-4 py-3 text-[var(--ds-text-secondary)]">
                {row.alternative}
              </td>
              <td className="px-4 py-3 leading-6 text-[var(--ds-text-secondary)]">
                {row.note}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function getUXResearchPrincipleAnchor(
  principle: (typeof uxResearchPrinciples)[number]
) {
  return `ux-research-principle-${principle.number}`
}

function UXResearchPrincipleContent() {
  return (
    <article className="overview-article mt-10 max-w-6xl text-[var(--ds-text-primary)]">
      <div className="space-y-5">
        <div className="inline-flex rounded-full bg-[var(--ds-background-zpblue-subtle)] px-3 py-1 text-[11px] font-semibold uppercase leading-4 text-[var(--ds-text-link)]">
          Principles
        </div>
        <div className="grid gap-3">
          <h2 className="max-w-4xl text-2xl font-bold leading-9 text-[var(--ds-text-primary)] md:text-[2rem] md:leading-[2.75rem]">
            Research Northstar
          </h2>
          <p className="max-w-4xl text-base leading-8 text-[var(--ds-text-secondary)] md:text-xl md:leading-9">
            5 nguyên tắc vàng cho dữ liệu sạch và insight thật sự dùng được
            trong quyết định product/design.
          </p>
        </div>
        <p className="max-w-4xl text-sm font-semibold leading-7 text-[var(--ds-text-primary)]">
          “Vượt ra ngoài lý thuyết, đây là bản đồ tác nghiệp để team tránh dữ
          liệu nhiễu, câu hỏi dẫn dắt và những insight nghe hay nhưng không tạo
          ra hành động.”
        </p>
      </div>

      <UXArticleSection
        description="Năm principle này giúp researcher giữ chất lượng evidence từ lúc đặt câu hỏi, quan sát, tổng hợp tới lúc đưa ra recommendation."
        title="Năm nguyên tắc"
      >
        <UXResearchPrincipleTable />
      </UXArticleSection>

      <UXArticleSection
        description="Đọc nhanh: mỗi principle chống lại một cái bẫy research thường gặp. Click từng ô để nhảy xuống phần nội dung tương ứng."
        title="Bẫy cần tránh"
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {uxResearchPrinciples.map((principle) => (
            <a
              className="rounded-2xl border border-[var(--ds-border-stroke2)] bg-[var(--ds-background-primary)] p-5 transition-colors hover:border-[var(--ds-border-zpblue-subtle)] hover:bg-[var(--ds-background-secondary)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--ds-border-zpblue-subtle)]"
              href={`#${getUXResearchPrincipleAnchor(principle)}`}
              key={principle.title}
            >
              <span className="mb-2 block text-xs font-bold uppercase leading-4 text-[var(--ds-text-link)]">
                Trap {principle.number}
              </span>
              <p className="font-bold leading-7 text-[var(--ds-text-primary)]">
                {principle.title}
              </p>
              <p className="text-sm leading-6 text-[var(--ds-text-secondary)]">
                {principle.trap}
              </p>
            </a>
          ))}
        </div>
      </UXArticleSection>

      <section className="mt-14 grid gap-5">
        {uxResearchPrinciples.map((principle) => (
          <UXResearchPrincipleDetail
            key={principle.title}
            principle={principle}
          />
        ))}
      </section>
    </article>
  )
}

function UXResearchPrincipleTable() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--ds-border-stroke2)] bg-[var(--ds-background-primary)]">
      <table className="min-w-[720px] w-full border-collapse text-left text-sm">
        <thead className="bg-[var(--ds-background-zpblue-subtle)] text-[var(--ds-text-primary)]">
          <tr>
            <th className="w-16 px-4 py-3 font-bold">#</th>
            <th className="w-[260px] px-4 py-3 font-bold">Nguyên tắc</th>
            <th className="px-4 py-3 font-bold">Cái bẫy nó chống</th>
          </tr>
        </thead>
        <tbody>
          {uxResearchPrinciples.map((principle) => (
            <tr
              className="border-t border-[var(--ds-border-stroke2)]"
              key={principle.title}
            >
              <td className="px-4 py-3 font-bold text-[var(--ds-text-link)]">
                {principle.number}
              </td>
              <td className="px-4 py-3 font-semibold text-[var(--ds-text-primary)]">
                {principle.title}
              </td>
              <td className="px-4 py-3 leading-6 text-[var(--ds-text-secondary)]">
                {principle.trap}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function UXResearchPrincipleDetail({
  principle,
}: {
  principle: (typeof uxResearchPrinciples)[number]
}) {
  return (
    <article
      className="scroll-mt-32 rounded-2xl border border-[var(--ds-border-stroke2)] bg-[var(--ds-background-primary)] p-6"
      id={getUXResearchPrincipleAnchor(principle)}
    >
      <div className="grid gap-2">
        <span className="text-xs font-bold uppercase leading-4 text-[var(--ds-text-link)]">
          Principle {principle.number}
        </span>
        <h3 className="text-xl font-bold leading-8 text-[var(--ds-text-primary)]">
          {principle.title}
        </h3>
        <p className="max-w-4xl text-sm font-semibold leading-7 text-[var(--ds-text-primary)]">
          “Statement: {principle.statement}”
        </p>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-3 text-sm leading-7 text-[var(--ds-text-secondary)]">
          <h4 className="text-base font-bold leading-6 text-[var(--ds-text-primary)]">
            Tại sao quan trọng
          </h4>
          <p>{principle.why}</p>
        </div>

        <div className="rounded-2xl bg-[var(--ds-background-secondary)] p-5">
          <h4 className="text-base font-bold leading-6 text-[var(--ds-text-primary)]">
            Mức độ
          </h4>
          <ul className="mt-3 grid gap-2">
            {principle.levels.map((level) => (
              <li
                className="rounded-xl bg-[var(--ds-background-primary)] px-4 py-3 text-sm leading-6 text-[var(--ds-text-secondary)]"
                key={level}
              >
                {level}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-[var(--ds-border-stroke2)]">
        <div className="grid bg-[var(--ds-background-zpblue-subtle)] text-sm font-bold leading-6 text-[var(--ds-text-primary)] md:grid-cols-2">
          <p className="px-4 py-3">Đang làm đúng</p>
          <p className="border-t border-[var(--ds-border-stroke2)] px-4 py-3 md:border-l md:border-t-0">
            Đang vấp bẫy
          </p>
        </div>
        {principle.checks.map((check) => (
          <div
            className="grid border-t border-[var(--ds-border-stroke2)] text-sm leading-6 md:grid-cols-2"
            key={check.good}
          >
            <p className="px-4 py-3 text-[var(--ds-text-secondary)]">
              {check.good}
            </p>
            <p className="border-t border-[var(--ds-border-stroke2)] px-4 py-3 text-[var(--ds-text-secondary)] md:border-l md:border-t-0">
              {check.trap}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <UXDoDontList items={principle.dos} title="Do" variant="do" />
        <UXDoDontList items={principle.donts} title="Don't" variant="dont" />
      </div>
    </article>
  )
}

function UXTeamContent({ view }: { view: UXTeamView }) {
  const parent =
    uxTeamSections.find((section) => section.id === view.parentId) ??
    uxTeamSections[0]
  const child = parent.children.find((item) => item.id === view.childId)
  const grandchild =
    child && 'children' in child
      ? child.children.find((item) => item.id === view.grandchildId)
      : undefined
  const isSurvey =
    parent.id === 'ux-research' &&
    child?.id === 'methods' &&
    grandchild?.id === 'survey'
  const isUXResearchPrinciple =
    parent.id === 'ux-research' && child?.id === 'principle'
  const isUXResearchWorkflow =
    parent.id === 'ux-research' && child?.id === 'workflow'
  const isUXResearchWorkflowOverview =
    isUXResearchWorkflow && grandchild?.id === 'overview'
  const isUXResearchMethodPicker =
    isUXResearchWorkflow && grandchild?.id === 'method-picker-matrix'
  const isUXResearchOrder =
    isUXResearchWorkflow && grandchild?.id === 'order-research'
  const isOverview = parent.id === 'overview'
  const isUXPrinciple = parent.id === 'ux-design' && child?.id === 'ux-principle'
  const isUXPattern = parent.id === 'ux-design' && child?.id === 'ux-pattern'
  const isUXPatternOverview = isUXPattern && grandchild?.id === 'overview'
  const isOnboardingTaskList =
    isUXPattern && grandchild?.id === 'onboarding-task-list'
  const isWorkflow = parent.id === 'ux-design' && child?.id === 'workflow'
  const isWorkflowOverview = isWorkflow && grandchild?.id === 'overview'
  const isOrderTicket = isWorkflow && grandchild?.id === 'order-ticket'
  const isUXWriting = parent.id === 'ux-writing'
  const title = isSurvey
    ? 'Survey'
    : grandchild
      ? grandchild.label
      : child
        ? child.label
        : parent.label
  const description = grandchild
    ? grandchild.description
    : child
      ? child.description
      : parent.description

  return (
    <section>
      <h1 className={pageTitleClassName}>
        {title}
      </h1>
      <Separator className="mt-9 bg-[var(--ds-border-zpblue-subtle)]" />

      {isOverview ? (
        <UXOverviewContent />
      ) : isUXResearchPrinciple ? (
        <UXResearchPrincipleContent />
      ) : isSurvey ? (
        <UXResearchSurveyContent />
      ) : isUXResearchWorkflowOverview ? (
        <UXResearchWorkflowOverviewContent />
      ) : isUXResearchMethodPicker ? (
        <UXResearchMethodPickerContent />
      ) : isUXResearchOrder ? (
        <UXResearchOrderContent />
      ) : isUXPrinciple ? (
        <UXPrincipleContent />
      ) : isUXPatternOverview ? (
        <UXPatternOverviewContent />
      ) : isOnboardingTaskList ? (
        <OnboardingTaskListContent />
      ) : isWorkflowOverview ? (
        <WorkflowOverviewContent />
      ) : isOrderTicket ? (
        <OrderTicketContent />
      ) : isUXWriting ? (
        <Card className="mt-16 rounded-xl border-[var(--ds-border-stroke2)] bg-[var(--ds-background-secondary)] p-8 shadow-none">
          <CardContent className="px-0 text-base font-medium leading-6 text-[var(--ds-text-tertiary)]">
            To be updated
          </CardContent>
        </Card>
      ) : (
      <article className="overview-article mt-14 max-w-6xl text-[var(--ds-text-primary)]">
        <div className="overview-hero">
          <h2 className="max-w-4xl text-2xl font-bold leading-9 text-[var(--ds-text-primary)] md:text-[2rem] md:leading-[2.75rem]">
            {description}
          </h2>
        </div>

        <section className="mt-10 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-4 text-base leading-8 text-[var(--ds-text-primary)]">
            {isSurvey ? (
              <>
                <p>
                  Survey phù hợp khi team đã có giả thuyết tương đối rõ và cần
                  đo lường tín hiệu trên một nhóm người dùng đủ lớn.
                </p>
                <p>
                  Trong UX Research, survey không thay thế phỏng vấn hay
                  usability testing. Nó giúp kiểm chứng mức độ phổ biến của một
                  vấn đề, so sánh nhóm người dùng hoặc ưu tiên các hướng cần đào
                  sâu tiếp theo.
                </p>
              </>
            ) : isOverview ? (
              <>
                <p>
                  UX Team kết nối UX Design, UX Research và UX Writing để giúp
                  những trải nghiệm tài chính trở nên rõ ràng, dễ tin và dễ hành
                  động hơn.
                </p>
                <p>
                  Trang tổng quan là điểm bắt đầu để hiểu vai trò từng nhóm, sau
                  đó đi tiếp vào từng tài liệu cấp 2 theo đúng nhánh chuyên môn.
                </p>
              </>
            ) : (
              <>
                <p>
                  Mục này giúp team nắm nhanh vai trò, phạm vi và cách sử dụng
                  tài liệu trong quá trình thiết kế sản phẩm.
                </p>
                <p>
                  Nội dung được chia theo chuyên môn và phương pháp để mọi người
                  tìm được đúng tài liệu khi cần ra quyết định, review giải pháp
                  hoặc chuẩn bị nghiên cứu.
                </p>
              </>
            )}
          </div>

          <div className="overview-callout">
            <p className="text-sm font-bold leading-6 text-[var(--ds-text-primary)]">
              Cấu trúc trong UX Team:
            </p>
            <OverviewBulletList
              items={[
                'Tổng quan là introduction của UX Team.',
                'Child cấp 1 gồm UX Design, UX Research và UX Writing.',
                'Child cấp 2 đi theo nhánh tài liệu trong link, ví dụ UX Research / Methods.',
              ]}
            />
          </div>
        </section>

        <section className="mt-14">
          <SectionHeading
            description={
              isOverview
                ? 'Các nhánh cấp 1 trong UX Team.'
                : 'Các mục liên quan trong cùng nhóm để team đi tiếp mà không mất ngữ cảnh.'
            }
            title={isOverview ? 'Trong UX Team' : `Trong ${parent.label}`}
          />
          <div className="overview-layer-grid our-team-static-card-grid mt-6">
            {(isOverview
              ? uxTeamSections.filter((section) => section.id !== 'overview')
              : parent.children
            ).map((item) => (
              <article
                className={cn(
                  'overview-layer-card',
                  item.id === child?.id && 'border-[var(--ds-border-zpblue-subtle)]'
                )}
                key={item.id}
              >
                <span className="overview-layer-number">UX</span>
                <h4>{item.label}</h4>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        {isSurvey && (
          <section className="mt-14 space-y-7">
            {[
              {
                title: 'Khi nào dùng Survey',
                body:
                  'Dùng survey khi cần đo mức độ phổ biến, tần suất hành vi, mức độ hài lòng, nhu cầu ưu tiên hoặc phản ứng với một giả thuyết đã được định nghĩa rõ.',
              },
              {
                title: 'Cần chuẩn bị gì',
                body:
                  'Xác định câu hỏi nghiên cứu, đối tượng trả lời, tiêu chí phân nhóm, loại câu hỏi và cách phân tích trước khi viết form.',
              },
              {
                title: 'Điều cần tránh',
                body:
                  'Không dùng survey để hỏi người dùng thiết kế sản phẩm thay team, không đặt câu hỏi dẫn dắt và không gom quá nhiều mục tiêu vào một form.',
              },
            ].map((item, index) => (
              <OurTeamFocusSection index={index} item={item} key={item.title} />
            ))}
          </section>
        )}
      </article>
      )}
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
  const [activeTeamTab, setActiveTeamTab] = useState<TeamTab>(getInitialTeamTab)
  const [activeOurTeamView, setActiveOurTeamView] =
    useState<OurTeamView>(getInitialOurTeamView)
  const [activeUXTeamView, setActiveUXTeamView] =
    useState<UXTeamView>(getInitialUXTeamView)
  const [activeView, setActiveView] = useState<ActiveView>(getInitialView)
  const [isLandingActive, setIsLandingActive] = useState(getInitialLandingState)
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

  function handleUXTeamViewChange(view: UXTeamView) {
    const nextView = normalizeUXTeamView(view)

    setIsLandingActive(false)
    setActiveTeamTab('UX Team')
    setActiveUXTeamView(nextView)
    updateUXHash(nextView)
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

    if (tab === 'UX Team') {
      setActiveUXTeamView(defaultUXTeamView)
      updateUXHash(defaultUXTeamView)
    }

    if (tab === 'Motion Hub') {
      window.history.replaceState(null, '', '#motion-hub')
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleOpenLanding() {
    setIsLandingActive(true)
    window.history.replaceState(null, '', '#landing')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleOpenUIPrinciples() {
    setIsLandingActive(false)
    setActiveTeamTab('UI Team')
    const principlesView: ActiveView = { type: 'principles' }
    setActiveView(principlesView)
    updateHash(principlesView)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const contentAnimationKey = isLandingActive
    ? 'landing'
    : activeTeamTab === 'Our team here'
      ? `our-team-${activeOurTeamView}`
      : activeTeamTab === 'UX Team'
        ? `ux-team-${activeUXTeamView.parentId}-${activeUXTeamView.childId ?? 'none'}-${activeUXTeamView.grandchildId ?? 'none'}`
        : activeTeamTab === 'UI Team'
          ? activeView.type === 'principle'
            ? `ui-principle-${activeView.principleId}`
            : activeView.type === 'pending'
              ? `ui-pending-${activeView.label}`
              : `ui-${activeView.type}`
          : activeTeamTab

  return (
    <div className="min-h-svh bg-[var(--ds-background-primary)] font-sf-pro-display text-[var(--ds-text-primary)]">
      <PageHeader
        activeTeamTab={activeTeamTab}
        isLandingActive={isLandingActive}
        onOpenLanding={handleOpenLanding}
        onOurTeamViewChange={handleOurTeamViewChange}
        onTeamTabChange={handleTeamTabChange}
        onUXTeamViewChange={handleUXTeamViewChange}
        onViewChange={handleViewChange}
      />

      <div
        className={cn(
          'mx-auto max-w-[1500px] pb-24',
          isLandingActive
            ? 'px-0 pt-24'
            : 'px-5 pt-32 sm:px-8 lg:px-14 lg:pt-[180px]'
        )}
      >
        {!isLandingActive && (
          <aside className="hub-sidebar-scroll fixed left-[max(3.5rem,calc((100vw-1500px)/2+3.5rem))] top-24 hidden max-h-[calc(100svh-6rem)] w-72 overflow-x-hidden overflow-y-auto pr-3 pt-[84px] lg:block">
            <SidebarContent
              activeTeamTab={activeTeamTab}
              activeOurTeamView={activeOurTeamView}
              activeUXTeamView={activeUXTeamView}
              activeView={activeView}
              onOurTeamViewSelect={handleOurTeamViewChange}
              onSelect={handleViewChange}
              onTeamTabSelect={handleTeamTabChange}
              onUXTeamViewSelect={handleUXTeamViewChange}
            />
          </aside>
        )}

        <main className={cn('min-w-0', !isLandingActive && 'lg:ml-[19rem]')}>
          <div className="hub-page-fade-in" key={contentAnimationKey}>
            {isLandingActive ? (
              <LandingContent
                onOpenMotionHub={() => handleTeamTabChange('Motion Hub')}
                onOpenOurTeam={() => handleTeamTabChange('Our team here')}
                onOpenUIPrinciples={handleOpenUIPrinciples}
                onOpenUXResearch={() =>
                  handleUXTeamViewChange({
                    parentId: 'ux-research',
                    childId: 'workflow',
                    grandchildId: 'overview',
                  })
                }
                onOpenUXTeam={() => handleTeamTabChange('UX Team')}
              />
            ) : activeTeamTab === 'Our team here' ? (
              <OurTeamContent />
            ) : activeTeamTab === 'UX Team' ? (
              <UXTeamContent view={activeUXTeamView} />
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
