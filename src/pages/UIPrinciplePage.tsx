import { useEffect } from 'react'
import { BookOpen, CheckCircle2, FileText, ShieldCheck } from 'lucide-react'

import { PrincipleSection } from '@/components/hub/PrincipleSection'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
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
  reviewDecisionRules,
  reviewChecklist,
  uiPrinciples,
} from '@/data/ui-principles'

type UIPrinciplePageProps = {
  activeSection: string
  onActiveSectionChange: (sectionId: string) => void
}

export function UIPrinciplePage({
  activeSection,
  onActiveSectionChange,
}: UIPrinciplePageProps) {
  useEffect(() => {
    const hashId = window.location.hash.replace('#', '')
    if (hashId && localSections.some((section) => section.id === hashId)) {
      window.setTimeout(() => {
        document.getElementById(hashId)?.scrollIntoView({ block: 'start' })
        onActiveSectionChange(hashId)
      }, 0)
    }
  }, [onActiveSectionChange])

  useEffect(() => {
    const sectionElements = localSections
      .map((section) => document.getElementById(section.id))
      .filter((section): section is HTMLElement => Boolean(section))

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (!visibleEntry) {
          return
        }

        const nextId = visibleEntry.target.id
        onActiveSectionChange(nextId)
        window.history.replaceState(null, '', `#${nextId}`)
      },
      {
        rootMargin: '-96px 0px -58% 0px',
        threshold: [0.15, 0.35, 0.6],
      }
    )

    sectionElements.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [onActiveSectionChange])

  return (
    <main className="min-w-0 flex-1 px-5 py-10 sm:px-8 lg:px-10 xl:px-14">
      <article className="mx-auto max-w-[1160px] space-y-20">
        <section className="scroll-mt-24" id="introduction">
          <Badge className="mb-8 h-8 rounded-full bg-blue-600 px-4 text-base text-white hover:bg-blue-600">
            UI Principle
          </Badge>
          <h1 className="max-w-[980px] text-5xl font-semibold leading-[1.1] tracking-normal text-[#050505] sm:text-6xl lg:text-7xl">
            {BRAND_NAME} UI principle document
          </h1>
          <p className="mt-10 max-w-[1080px] text-2xl font-medium leading-[1.8] text-[#727272]">
            Bộ nguyên tắc định hướng chất lượng UI của {BRAND_NAME}, giúp Product
            Design thiết kế, review và audit UI để đảm bảo clarity,
            consistency, utility và bản sắc riêng của {BRAND_NAME} trên toàn bộ sản
            phẩm.
          </p>
          <div className="mt-14 grid gap-5 sm:grid-cols-3">
            {[
              { icon: BookOpen, label: 'Clarity' },
              { icon: ShieldCheck, label: 'Consistency' },
              { icon: FileText, label: 'Utility' },
            ].map((item) => (
              <div
                className="flex min-h-24 items-center gap-6 rounded-lg border border-[#e1e1e1] bg-white px-7 py-6 text-2xl font-medium text-[#0b0b0b]"
                key={item.label}
              >
                <item.icon className="size-6 shrink-0 text-blue-600" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        <Separator className="bg-[#dedede]" />

        <section className="scroll-mt-24 space-y-8" id="goal">
          <h2 className="text-4xl font-semibold tracking-normal text-[#050505]">
            Mục tiêu dự án
          </h2>
          <p className="text-2xl font-medium leading-[1.65] text-[#727272]">
            Mục đích của UI Principle nhằm chuẩn hóa cách Product Design thiết
            kế, review và audit UI để đảm bảo clarity, consistency, utility và
            bản sắc riêng của Zalopay trên toàn bộ sản phẩm.
          </p>
          <ul className="grid gap-5">
            {projectGoals.map((goal) => (
              <li
                className="flex gap-6 rounded-lg border border-[#e1e1e1] bg-white px-7 py-6"
                key={goal}
              >
                <CheckCircle2 className="mt-1 size-5 shrink-0 text-blue-600" />
                <span className="text-xl leading-9 text-[#111111]">{goal}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="scroll-mt-24 space-y-8" id="definition-and-scope">
          <h2 className="text-4xl font-semibold tracking-normal text-[#050505]">
            Định nghĩa và phạm vi
          </h2>
          <Card className="rounded-lg border-[#e1e1e1] shadow-none">
            <CardContent className="space-y-5 px-7 py-6 text-xl leading-9 text-[#727272]">
              <p>
                UI Principle là bộ nguyên tắc định hướng chất lượng UI của
                Zalopay. Nó mô tả UI tốt cần đạt những tiêu chí nào để rõ ràng,
                nhất quán, đáng tin và có khả năng scale qua nhiều feature.
              </p>
              <p>
                UI Principle không phải list bug UI, không thay thế Design
                System component guideline, không phải full UX journey
                framework, không phải brand guideline độc lập và không phải
                checklist làm đẹp giao diện.
              </p>
            </CardContent>
          </Card>
          <div className="grid gap-5 md:grid-cols-2">
            <Card className="rounded-lg border-[#e1e1e1] shadow-none">
              <CardHeader>
                <CardTitle className="text-2xl">In scope</CardTitle>
                <CardDescription className="text-base leading-7">
                  Những yếu tố mà bộ nguyên tắc này sẽ tập trung hướng dẫn và
                  kiểm soát.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="grid gap-3">
                  {inScopeItems.map((item) => (
                    <li className="text-base leading-7" key={item.title}>
                      <span className="font-medium">{item.title}</span>
                      <span className="text-muted-foreground">
                        {' '}
                        - {item.description}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="rounded-lg border-[#e1e1e1] shadow-none">
              <CardHeader>
                <CardTitle className="text-2xl">Out of scope</CardTitle>
                <CardDescription className="text-base leading-7">
                  Những phần không nằm trong phạm vi tài liệu này, hoặc sẽ được
                  xử lý ở tài liệu/hệ thống khác.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="grid gap-3">
                  {outOfScopeItems.map((item) => (
                    <li className="text-base leading-7" key={item.title}>
                      <span className="font-medium">{item.title}</span>
                      <span className="text-muted-foreground">
                        {' '}
                        - {item.description}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <section
          className="scroll-mt-24 space-y-8"
          id="information-priority-levels"
        >
          <h2 className="text-4xl font-semibold tracking-normal text-[#050505]">
            Phân cấp mức độ quan trọng của thông tin trên UI
          </h2>
          <p className="text-2xl font-medium leading-[1.65] text-[#727272]">
            Phần này định nghĩa cách designer xác định mức độ quan trọng của
            thông tin trên UI. Mục tiêu là giúp team thống nhất: thông tin nào
            phải được nhìn thấy trước, thông tin nào bắt buộc để hoàn thành
            task, và thông tin nào chỉ nên đóng vai trò hỗ trợ.
          </p>
          <Card className="rounded-lg border-blue-200 bg-blue-50/70 shadow-none">
            <CardContent className="px-7 py-6 text-lg leading-8 text-blue-950">
              <span className="font-semibold">Core rule: </span>
              Trong các flow utility hoặc tài chính, thứ tự ưu tiên mặc định là
              P0 &gt; P1 &gt; P2 &gt; P3 &gt; P4. Promotion không được nổi bật
              hơn thông tin tiền, trạng thái, rủi ro hoặc hành động chính.
            </CardContent>
          </Card>
          <div className="grid gap-5">
            {priorityLevels.map((priority) => (
              <Card
                className="rounded-lg border-[#e1e1e1] shadow-none"
                key={priority.level}
              >
                <CardHeader className="pb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="h-7 rounded-full px-3 text-sm" variant="secondary">
                      {priority.level}
                    </Badge>
                    <CardTitle className="text-2xl">{priority.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 text-base leading-7">
                  <p className="text-muted-foreground">{priority.meaning}</p>
                  <p>
                    <span className="font-medium">Ví dụ trong Zalopay: </span>
                    <span className="text-muted-foreground">
                      {priority.examples}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">UI Rule: </span>
                    <span className="text-muted-foreground">
                      {priority.uiRule}
                    </span>
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="rounded-lg border-[#e1e1e1] shadow-none">
            <CardHeader>
              <CardTitle className="text-2xl">Ví dụ: Confirm transfer</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-3">
                {confirmTransferPriorityExample.map((item) => (
                  <li className="text-base leading-7 text-muted-foreground" key={item}>
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        <section
          className="scroll-mt-24 space-y-8"
          id="how-to-use-this-framework"
        >
          <h2 className="text-4xl font-semibold tracking-normal text-[#050505]">
            Cách sử dụng framework này
          </h2>
          <div className="grid gap-5">
            {frameworkUsage.map((step, index) => (
              <div
                className="flex gap-6 rounded-lg border border-[#e1e1e1] bg-white px-7 py-6"
                key={step.timing}
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-base font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-200">
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-xl font-semibold">{step.timing}</h3>
                  <p className="mt-2 text-base leading-7 text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Card className="rounded-lg border-[#e1e1e1] shadow-none">
            <CardHeader>
              <CardTitle className="text-2xl">Câu hỏi cốt lõi</CardTitle>
              <CardDescription className="text-base leading-7">
                Trước khi đi vào chi tiết visual, cần trả lời tối thiểu các câu
                hỏi về mục tiêu, thông tin và hành động của màn hình.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-3">
                {frameworkQuestions.map((question) => (
                  <li className="flex gap-4 text-base leading-7" key={question}>
                    <CheckCircle2 className="mt-1 size-5 shrink-0 text-blue-600" />
                    <span>{question}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="scroll-mt-24 space-y-8" id="ui-principles">
          <div>
            <h2 className="text-4xl font-semibold tracking-normal text-[#050505]">
              8 UI Principles
            </h2>
            <p className="mt-5 text-2xl font-medium leading-[1.65] text-[#727272]">
              Các nguyên tắc dưới đây dùng để định hướng chất lượng UI, giúp
              team review dựa trên principle và tiêu chí cụ thể thay vì góp ý
              cảm tính.
            </p>
          </div>
          <div className="space-y-6">
            {uiPrinciples.map((principle) => (
              <PrincipleSection key={principle.number} principle={principle} />
            ))}
          </div>
        </section>

        <section className="scroll-mt-24 space-y-8" id="related-guidelines">
          <h2 className="text-4xl font-semibold tracking-normal text-[#050505]">
            Heuristic Evaluation
          </h2>
          <ul className="grid gap-5">
            {relatedGuidelines.map((guideline) => (
              <li
                className="flex gap-6 rounded-lg border border-[#e1e1e1] bg-white px-7 py-6"
                key={guideline}
              >
                <CheckCircle2 className="mt-1 size-5 shrink-0 text-blue-600" />
                <span className="text-xl leading-9 text-[#111111]">
                  {guideline}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="scroll-mt-24 space-y-8 pb-20"
          id="design-review-checklist"
        >
          <h2 className="text-4xl font-semibold tracking-normal text-[#050505]">
            Design review checklist
          </h2>
          <Card className="rounded-lg border-[#e1e1e1] shadow-none">
            <CardContent className="px-7 py-6">
              <ul className="grid gap-5">
                {reviewChecklist.map((item) => (
                  <li className="flex gap-6 text-xl leading-9" key={item}>
                    <CheckCircle2 className="mt-1 size-5 shrink-0 text-blue-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="rounded-lg border-blue-200 bg-blue-50/70 shadow-none">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-950">
                Decision rule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-3">
                {reviewDecisionRules.map((rule) => (
                  <li className="text-lg leading-8 text-blue-950" key={rule}>
                    {rule}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <p className="text-sm text-muted-foreground">
            Mục hiện tại: {activeSection.replaceAll('-', ' ')}
          </p>
        </section>
      </article>
    </main>
  )
}
