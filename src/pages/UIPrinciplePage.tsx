import { useEffect } from 'react'
import {
  Check,
  CheckCircle2,
  Layers3,
  MousePointerClick,
  Navigation,
  Sparkles,
  X,
} from 'lucide-react'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { BRAND_NAME } from '@/data/brand'
import { localSections } from '@/data/navigation'
import {
  confirmTransferPriorityExample,
  frameworkQuestions,
  frameworkUsage,
  inScopeItems,
  outOfScopeItems,
  priorityLevels,
  projectGoals,
  relatedGuidelines,
  reviewChecklist,
  reviewDecisionRules,
  uiPrinciples,
} from '@/data/ui-principles'
import { cn } from '@/lib/utils'

const projectGoalIllustrations = [
  {
    icon: MousePointerClick,
    cardClassName:
      'border-0 bg-[#F5FBFF] dark:bg-blue-950/30',
    iconClassName:
      'bg-[#DFF6FF] text-[#0095FF] dark:bg-blue-900/60 dark:text-blue-100',
  },
  {
    icon: Layers3,
    cardClassName:
      'border-0 bg-[#F3FFF8] dark:bg-emerald-950/30',
    iconClassName:
      'bg-[#EAFFD6] text-[#35E000] dark:bg-emerald-900/60 dark:text-emerald-100',
  },
  {
    icon: Sparkles,
    cardClassName:
      'border-0 bg-[#FFFBEF] dark:bg-amber-950/30',
    iconClassName:
      'bg-[#FFF2C7] text-[#FFAA00] dark:bg-amber-900/60 dark:text-amber-100',
  },
  {
    icon: Navigation,
    cardClassName:
      'border-0 bg-[#FFF6F2] dark:bg-orange-950/30',
    iconClassName:
      'bg-[#FFE3D4] text-[#FF4D00] dark:bg-orange-900/60 dark:text-orange-100',
  },
]

const frameworkUsageIllustrations = [
  {
    markerClassName: 'bg-[#F1F7FF] text-[#0033C9] dark:bg-blue-400/15 dark:text-blue-200',
  },
  {
    markerClassName: 'bg-[#F1F7FF] text-[#0033C9] dark:bg-blue-400/15 dark:text-blue-200',
  },
  {
    markerClassName: 'bg-[#F1F7FF] text-[#0033C9] dark:bg-blue-400/15 dark:text-blue-200',
  },
  {
    markerClassName: 'bg-[#F1F7FF] text-[#0033C9] dark:bg-blue-400/15 dark:text-blue-200',
  },
]

type UIPrinciplePageProps = {
  activeSection: string
  onActiveSectionChange: (sectionId: string) => void
}

function parseCriterion(item: string) {
  const match = item.match(/^(\d+\.\d+):\s*(.*)$/)

  if (!match) {
    return {
      label: '',
      text: item,
    }
  }

  return {
    label: match[1],
    text: match[2],
  }
}

function parsePriorityExample(item: string) {
  const [level, ...descriptionParts] = item.split(': ')

  return {
    level,
    description: descriptionParts.join(': '),
  }
}

export function UIPrinciplePage({
  activeSection,
  onActiveSectionChange,
}: UIPrinciplePageProps) {
  useEffect(() => {
    const hashId = window.location.hash.replace('#', '')
    const validSectionIds = [
      ...localSections.map((section) => section.id),
      ...uiPrinciples.map((principle) => `principle-${principle.number}`),
    ]

    if (hashId && validSectionIds.includes(hashId)) {
      window.setTimeout(() => {
        document.getElementById(hashId)?.scrollIntoView({ block: 'start' })
        onActiveSectionChange(hashId)
      }, 0)
    }
  }, [onActiveSectionChange])

  function renderActiveSection() {
    const activePrinciple = uiPrinciples.find(
      (principle) => activeSection === `principle-${principle.number}`
    )

    if (activePrinciple) {
      return (
        <section
          className="scroll-mt-24"
          id={`principle-${activePrinciple.number}`}
        >
          <h2 className="font-sf-pro-display text-4xl font-semibold tracking-normal">
            {activePrinciple.title}
          </h2>
          <p className="mt-5 max-w-5xl text-lg leading-8 text-muted-foreground">
            {activePrinciple.summary}
          </p>
          <div className="mt-12 space-y-12">
            <section>
              <div className="max-w-3xl">
                <h3 className="text-xl font-semibold">
                  1. Nguyên tắc áp dụng
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Các rule cần được kiểm theo thứ tự khi review màn hình hoặc
                  module liên quan.
                </p>
              </div>
              <div className="mt-5">
                <ol className="overflow-hidden rounded-xl border border-[#E4EEFF] bg-card dark:border-border">
                  {activePrinciple.guidelines.map((guideline, index) => (
                    <li
                      className="flex gap-3 border-b border-[#E4EEFF] px-4 py-3 text-sm leading-6 last:border-b-0 dark:border-border"
                      key={guideline}
                    >
                      <span className="w-8 shrink-0 font-semibold text-[#0033C9] dark:text-blue-200">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <p className="whitespace-pre-line text-foreground">
                        {guideline}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold">
                2. Tiêu chí
              </h3>
              <ul className="mt-5 overflow-hidden rounded-xl border border-border bg-card">
                {activePrinciple.criteria.map((item) => (
                  (() => {
                    const criterion = parseCriterion(item)

                    return (
                      <li
                        className="flex gap-3 border-b border-border px-4 py-3 text-sm leading-6 last:border-b-0"
                        key={item}
                      >
                        <span className="mt-1 flex w-5 shrink-0 text-[#00A957] dark:text-emerald-300">
                          <Check className="size-4 stroke-[3]" aria-hidden="true" />
                        </span>
                        <span>{criterion.text}</span>
                      </li>
                    )
                  })()
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold">
                3. Lý do
              </h3>
              <ul className="mt-6 grid gap-3 md:grid-cols-3">
                {activePrinciple.reasons.map((item) => (
                  <li
                    className="rounded-xl border border-[#DFF7EA] bg-[#F8FFFB] p-4 text-sm leading-6 dark:border-emerald-400/30 dark:bg-emerald-950/20"
                    key={item}
                  >
                    <CheckCircle2 className="mb-3 size-4 text-[#00A957] dark:text-emerald-300" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </section>
      )
    }

    switch (activeSection) {
      case 'goal':
        return (
          <section className="scroll-mt-24" id="goal">
            <h2 className="font-sf-pro-display text-4xl font-semibold tracking-normal">
              Mục tiêu dự án
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              UI Principle nhằm chuẩn hóa cách Product Design thiết kế, review
              và audit UI để đảm bảo clarity, consistency, utility và bản sắc
              riêng của Zalopay trên toàn bộ sản phẩm.
            </p>
            <ul className="mt-12 grid gap-3 md:grid-cols-2">
              {projectGoals.map((goal, index) => {
                const [title, ...descriptionParts] = goal.split(': ')
                const description = descriptionParts.join(': ')
                const illustration = projectGoalIllustrations[index]
                const IllustrationIcon = illustration.icon

                return (
                  <li
                    className={cn(
                      'rounded-lg p-4',
                      illustration.cardClassName
                    )}
                    key={goal}
                  >
                    <div
                      className={cn(
                        'mb-4 flex size-12 items-center justify-center rounded-xl',
                        illustration.iconClassName
                      )}
                    >
                      <IllustrationIcon className="size-6" />
                    </div>
                    <h3 className="text-base font-semibold leading-6 text-foreground">
                      {title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                      {description}
                    </p>
                  </li>
                )
              })}
            </ul>
          </section>
        )

      case 'definition-and-scope':
        return (
          <section className="scroll-mt-24" id="definition-and-scope">
            <h2 className="font-sf-pro-display text-4xl font-semibold tracking-normal">
              Định nghĩa và phạm vi
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              Xác định rõ UI Principle là gì, được dùng cho phạm vi nào và không
              thay thế những tài liệu nào trong hệ thống thiết kế.
            </p>
            <div
              className="mt-12 border-l-2 border-[#00CF6A] pl-5"
              id="definition-summary"
            >
              <div className="space-y-4 text-sm leading-7 text-foreground/80">
                <p>
                  UI Principle là bộ nguyên tắc định hướng chất lượng UI của
                  {BRAND_NAME}. Nó mô tả UI tốt cần đạt những tiêu chí nào để rõ ràng,
                  nhất quán, đáng tin và có khả năng scale qua nhiều feature.
                </p>
                <p>
                  UI Principle không phải list bug UI, không thay thế Design
                  System component guideline, không phải full UX journey
                  framework, không phải brand guideline độc lập và không phải
                  checklist làm đẹp giao diện.
                </p>
              </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-lg border border-border bg-card">
              <table className="w-full table-fixed border-collapse text-left text-sm">
                <thead>
                  <tr>
                    <th
                      className="border-r border-border bg-[#F6FFFA] px-4 py-3 align-top dark:bg-emerald-950/20"
                      id="definition-in-scope"
                    >
                      <span className="block text-base font-semibold text-[#008C46] dark:text-emerald-300">
                        In scope
                      </span>
                      <span className="mt-1.5 block text-xs font-normal leading-5 text-muted-foreground">
                        Những yếu tố mà bộ nguyên tắc này sẽ tập trung hướng dẫn và
                        kiểm soát.
                      </span>
                    </th>
                    <th
                      className="bg-[#FFF8F8] px-4 py-3 align-top dark:bg-red-950/15"
                      id="definition-out-of-scope"
                    >
                      <span className="block text-base font-semibold text-[#D92D20] dark:text-red-300">
                        Out of scope
                      </span>
                      <span className="mt-1.5 block text-xs font-normal leading-5 text-muted-foreground">
                        Những phần không nằm trong phạm vi tài liệu này, hoặc sẽ được
                        xử lý ở tài liệu/hệ thống khác.
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({
                    length: Math.max(inScopeItems.length, outOfScopeItems.length),
                  }).map((_, index) => {
                    const inScopeItem = inScopeItems[index]
                    const outOfScopeItem = outOfScopeItems[index]

                    return (
                      <tr className="border-t border-border" key={`scope-row-${index}`}>
                        <td className="border-r border-border px-4 py-2.5 align-top leading-5">
                          {inScopeItem && (
                            <div className="flex gap-2">
                              <Check className="mt-0.5 size-3.5 shrink-0 text-[#00A957] dark:text-emerald-300" />
                              <span>
                                <span className="font-medium text-foreground">
                                  {inScopeItem.title}
                                </span>
                                <span className="text-muted-foreground">
                                  {' '}
                                  - {inScopeItem.description}
                                </span>
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-2.5 align-top leading-5">
                          {outOfScopeItem && (
                            <div className="flex gap-2">
                              <X className="mt-0.5 size-3.5 shrink-0 text-[#D92D20] dark:text-red-300" />
                              <span>
                                <span className="font-medium text-foreground">
                                  {outOfScopeItem.title}
                                </span>
                                <span className="text-muted-foreground">
                                  {' '}
                                  - {outOfScopeItem.description}
                                </span>
                              </span>
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )

      case 'information-priority-levels':
        return (
          <section
            className="scroll-mt-24"
            id="information-priority-levels"
          >
            <h2 className="font-sf-pro-display text-4xl font-semibold tracking-normal">
              Phân loại mức độ ưu tiên thông tin
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              Phần này định nghĩa cách designer xác định mức độ quan trọng của
              thông tin trên UI. Mục tiêu là giúp team thống nhất: thông tin nào
              phải được nhìn thấy trước, thông tin nào bắt buộc để hoàn thành
              task, và thông tin nào chỉ nên đóng vai trò hỗ trợ.
            </p>
            <h3 className="mt-12 text-xl font-semibold text-foreground">
              Bảng mức độ ưu tiên
            </h3>
            <div
              className="mt-6 border-l-2 border-[#00CF6A] pl-4"
              id="priority-core-rule"
            >
              <p className="text-sm leading-6 text-foreground">
                <span className="font-semibold">Core rule: </span>
                Trong các flow utility hoặc tài chính, thứ tự ưu tiên mặc định là
                {' '}
                <span className="font-semibold">
                  P0 &gt; P1 &gt; P2 &gt; P3 &gt; P4
                </span>
                . Promotion không được nổi bật hơn thông tin tiền, trạng thái,
                rủi ro hoặc hành động chính.
              </p>
            </div>
            <div className="mt-8 overflow-hidden rounded-lg border border-[#DDEEFF] bg-card dark:border-border">
              <div>
                <table className="w-full table-fixed border-collapse text-left text-[13px]">
                  <colgroup>
                    <col className="w-[24%]" />
                    <col className="w-[26%]" />
                    <col className="w-[25%]" />
                    <col className="w-[25%]" />
                  </colgroup>
                  <thead className="bg-[#F1F7FF] text-[11px] font-semibold uppercase text-foreground dark:bg-blue-950/30">
                    <tr>
                      <th className="border-r border-[#DDEEFF] px-3 py-3 dark:border-border">
                        Priority
                      </th>
                      <th className="border-r border-[#DDEEFF] px-3 py-3 dark:border-border">
                        Meaning
                      </th>
                      <th className="border-r border-[#DDEEFF] px-3 py-3 dark:border-border">
                        Examples in Zalopay
                      </th>
                      <th className="px-3 py-3">UI Rule</th>
                    </tr>
                  </thead>
                  <tbody className="bg-card">
                    {priorityLevels.map((priority) => (
                      <tr
                        className="border-t border-[#DDEEFF] odd:bg-background/40 dark:border-border"
                        id={`priority-${priority.level.toLowerCase()}`}
                        key={priority.level}
                      >
                        <td
                          className="break-words border-r border-[#DDEEFF] px-3 py-4 align-top font-semibold leading-6 text-foreground dark:border-border"
                        >
                          {priority.level} - {priority.title}
                        </td>
                        <td
                          className="break-words border-r border-[#DDEEFF] px-3 py-4 align-top leading-6 text-foreground dark:border-border"
                        >
                          {priority.meaning}
                        </td>
                        <td
                          className="break-words border-r border-[#DDEEFF] px-3 py-4 align-top leading-6 text-foreground dark:border-border"
                        >
                          {priority.examples}
                        </td>
                        <td className="break-words px-3 py-4 align-top leading-6 text-foreground">
                          {priority.uiRule}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <Card
              className="mt-4 rounded-lg border-0 bg-[#F1F7FF] shadow-none ring-0 dark:bg-blue-950/20"
              id="priority-confirm-transfer"
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg leading-7">
                  Ví dụ: Confirm transfer
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="grid gap-2 sm:grid-cols-2">
                  {confirmTransferPriorityExample.map((item) => {
                    const example = parsePriorityExample(item)

                    return (
                    <li
                      className="flex min-h-14 gap-3 rounded-md bg-white/70 px-3 py-2.5 text-sm leading-5 dark:bg-background/50"
                      key={item}
                    >
                      <span className="flex h-6 min-w-9 shrink-0 items-center justify-center rounded-full bg-[#DDEEFF] px-2 text-xs font-semibold text-[#0033C9] dark:bg-blue-400/15 dark:text-blue-200">
                        {example.level}
                      </span>
                      <span className="text-muted-foreground">
                        {example.description}
                      </span>
                    </li>
                    )
                  })}
                </ul>
              </CardContent>
            </Card>
          </section>
        )

      case 'how-to-use-this-framework':
        return (
          <section
            className="scroll-mt-24"
            id="how-to-use-this-framework"
          >
            <h2 className="font-sf-pro-display text-4xl font-semibold tracking-normal">
              Cách sử dụng framework này
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              Hướng dẫn cách áp dụng UI Principle vào từng giai đoạn thiết kế,
              review và audit để ra quyết định nhất quán hơn.
            </p>
            <div className="mt-12 grid gap-4 md:grid-cols-2" id="framework-usage-steps">
              {frameworkUsage.map((step, index) => {
                const illustration = frameworkUsageIllustrations[index]

                return (
                <div
                  className="min-h-36 rounded-lg border border-[#E4EEFF] bg-card p-5 shadow-[0_1px_0_rgba(0,51,201,0.04)] dark:border-border dark:shadow-none"
                  key={step.timing}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className={cn(
                        'flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
                        illustration.markerClassName
                      )}
                    >
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                    <h3 className="text-base font-semibold leading-6 text-foreground">
                      {step.timing}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-foreground/80">
                      {step.description}
                    </p>
                    </div>
                  </div>
                </div>
                )
              })}
            </div>
            <section
              className="mt-4 rounded-lg bg-[#F7FCFF] p-5 dark:bg-card"
              id="framework-core-questions"
            >
              <div className="max-w-2xl">
                <h3 className="text-base font-semibold leading-6 text-foreground">
                  Câu hỏi cốt lõi
                </h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Trả lời nhanh trước khi đi sâu vào visual, thông tin và hành
                  động chính của màn hình.
                </p>
              </div>
              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {frameworkQuestions.map((question) => (
                  <li
                    className="flex min-h-12 items-center gap-3 rounded-md bg-white px-3.5 py-2.5 text-sm font-medium leading-5 text-foreground shadow-[0_8px_22px_rgba(15,23,42,0.06)] dark:bg-background/80 dark:shadow-none"
                    key={question}
                  >
                    <span className="size-2.5 shrink-0 rounded-full bg-[#00A957] shadow-[0_0_0_5px_rgba(0,169,87,0.12)] dark:bg-emerald-300 dark:shadow-[0_0_0_5px_rgba(110,231,183,0.14)]" />
                    <span>{question}</span>
                  </li>
                ))}
              </ul>
            </section>
          </section>
        )

      case 'related-guidelines':
        return (
          <section className="scroll-mt-24" id="related-guidelines">
            <h2 className="font-sf-pro-display text-4xl font-semibold tracking-normal">
              Heuristic Evaluation
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              Các guideline hỗ trợ team kiểm tra tính rõ ràng, nhất quán và độ
              tin cậy của UI trong quá trình review.
            </p>
            <ul className="mt-12 grid gap-4">
              {relatedGuidelines.map((guideline) => (
                <li
                  className="flex gap-3 rounded-lg border border-foreground/5 bg-card p-5"
                  key={guideline}
                >
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#00A957]" />
                  <span className="text-sm leading-6">{guideline}</span>
                </li>
              ))}
            </ul>
          </section>
        )

      case 'design-review-checklist':
        return (
          <section
            className="scroll-mt-24 pb-16"
            id="design-review-checklist"
          >
            <h2 className="font-sf-pro-display text-4xl font-semibold tracking-normal">
              Design review checklist
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              Checklist giúp designer rà soát màn hình trước khi handoff hoặc
              gửi review để giảm thiếu sót trong các điểm quan trọng.
            </p>
            <Card className="mt-12 rounded-lg shadow-none ring-foreground/5">
              <CardContent className="p-5">
                <ul className="grid gap-3">
                  {reviewChecklist.map((item) => (
                    <li className="flex gap-3 text-sm leading-6" key={item}>
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#00A957]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card
              className="mt-4 rounded-lg border-[#E4EEFF] bg-[#F1F7FF] shadow-none ring-[#E4EEFF]"
              id="review-decision-rule"
            >
              <CardHeader>
                <CardTitle className="text-lg text-[#0033C9]">
                  Decision rule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid gap-2">
                  {reviewDecisionRules.map((rule) => (
                    <li className="text-sm leading-6 text-foreground" key={rule}>
                      {rule}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>
        )

      case 'introduction':
      default:
        return (
          <section className="scroll-mt-24" id="introduction">
            <h1 className="font-sf-pro-display text-4xl font-semibold tracking-normal">
              Giới thiệu
            </h1>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              Một ngôn ngữ chung cho những trải nghiệm tài chính đơn giản và
              đáng tin cậy.
            </p>
            <div className="mt-12 border-l-2 border-[#00CF6A] pl-5">
              <div className="space-y-4 text-sm leading-6 text-foreground">
                <p>
                  Zalopay Design Hub là nguồn thông tin chung cho mọi quyết định
                  thiết kế — từ nguyên tắc cốt lõi, nền tảng thị giác đến
                  component và quy trình phối hợp.
                </p>
                <p>
                  Thư viện giúp đội ngũ thiết kế nhanh hơn, trao đổi rõ hơn và tạo
                  ra trải nghiệm nhất quán trên toàn bộ hệ sinh thái Zalopay. Mỗi
                  tài liệu đều được xây dựng để áp dụng trực tiếp vào công việc
                  hằng ngày.
                </p>
              </div>
            </div>
            <img
              alt="Minh hoạ Zalopay Design Hub"
              className="mt-10 aspect-[16/9] w-full rounded-2xl object-cover"
              src="/intro-design-hub-illustration.png"
            />
          </section>
        )
    }
  }

  return (
    <main className="min-w-0 flex-1 pb-20 pt-8">
      <article
        className="hub-section-panel max-w-[760px] space-y-20"
        key={activeSection}
      >
        {renderActiveSection()}
      </article>
    </main>
  )
}
