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
import { localSections } from '@/data/navigation'
import {
  priorityLevels,
  relatedGuidelines,
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
    <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl space-y-12">
        <section className="scroll-mt-24" id="introduction">
          <Badge className="mb-4 bg-blue-600 text-white hover:bg-blue-600">
            UI Principle
          </Badge>
          <h1 className="text-4xl font-semibold tracking-normal">
            ZaloPay UI Principles
          </h1>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            A practical framework for reviewing, designing, and discussing
            product interfaces across ZaloPay journeys. It focuses on hierarchy,
            clarity, trust, feedback, accessibility, and brand expression.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { icon: BookOpen, label: 'Readable docs' },
              { icon: ShieldCheck, label: 'Trust-first flows' },
              { icon: FileText, label: 'Review-ready rules' },
            ].map((item) => (
              <div
                className="flex items-center gap-3 rounded-lg border bg-card p-4 text-sm"
                key={item.label}
              >
                <item.icon className="size-4 text-blue-600" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        <Separator />

        <section className="scroll-mt-24 space-y-4" id="goal">
          <h2 className="text-2xl font-semibold">Goal</h2>
          <p className="leading-7 text-muted-foreground">
            Help product teams make faster and more consistent UI decisions,
            especially in money-moving flows where confidence, readability, and
            safety matter. The framework gives designers and reviewers a shared
            vocabulary instead of relying on personal preference.
          </p>
        </section>

        <section className="scroll-mt-24 space-y-4" id="definition-and-scope">
          <h2 className="text-2xl font-semibold">Definition and Scope</h2>
          <Card>
            <CardContent className="space-y-4 p-5 leading-7 text-muted-foreground">
              <p>
                UI Principles are decision rules for screen structure,
                component behavior, content emphasis, visual states, and trust
                cues. They are not a replacement for the design system, UX
                pattern library, or product requirements.
              </p>
              <p>
                Use this document when reviewing new features, redesigning core
                journeys, or resolving design tradeoffs between clarity,
                conversion, risk, and brand expression.
              </p>
            </CardContent>
          </Card>
        </section>

        <section
          className="scroll-mt-24 space-y-4"
          id="information-priority-levels"
        >
          <h2 className="text-2xl font-semibold">Information Priority Levels</h2>
          <div className="grid gap-3">
            {priorityLevels.map((priority) => (
              <Card key={priority.level}>
                <CardHeader className="pb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{priority.level}</Badge>
                    <CardTitle className="text-base">{priority.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-6">
                    {priority.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section
          className="scroll-mt-24 space-y-4"
          id="how-to-use-this-framework"
        >
          <h2 className="text-2xl font-semibold">How to Use This Framework</h2>
          <div className="grid gap-3">
            {[
              'Start with the user task and identify the highest-risk decision.',
              'Map screen content into P0 to P3 priority levels before polishing visuals.',
              'Review the eight principles and note which ones are most relevant to the flow.',
              'Capture exceptions and unresolved tradeoffs in design review notes.',
            ].map((step, index) => (
              <div
                className="flex gap-3 rounded-lg border bg-card p-4"
                key={step}
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-200">
                  {index + 1}
                </span>
                <p className="text-sm leading-6">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="scroll-mt-24 space-y-5" id="ui-principles">
          <div>
            <h2 className="text-2xl font-semibold">UI Principles</h2>
            <p className="mt-2 leading-7 text-muted-foreground">
              The eight principles below are designed to be scanned quickly in a
              review meeting and still provide enough detail for implementation
              follow-up.
            </p>
          </div>
          <div className="space-y-5">
            {uiPrinciples.map((principle) => (
              <PrincipleSection key={principle.number} principle={principle} />
            ))}
          </div>
        </section>

        <section className="scroll-mt-24 space-y-4" id="related-guidelines">
          <h2 className="text-2xl font-semibold">Related Guidelines</h2>
          <ul className="grid gap-3">
            {relatedGuidelines.map((guideline) => (
              <li className="flex gap-3 rounded-lg border bg-card p-4" key={guideline}>
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-blue-600" />
                <span className="text-sm leading-6">{guideline}</span>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="scroll-mt-24 space-y-4 pb-16"
          id="design-review-checklist"
        >
          <h2 className="text-2xl font-semibold">Design Review Checklist</h2>
          <Card>
            <CardContent className="p-5">
              <ul className="grid gap-3">
                {reviewChecklist.map((item) => (
                  <li className="flex gap-3 text-sm leading-6" key={item}>
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-blue-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <p className="text-sm text-muted-foreground">
            Current section: {activeSection.replaceAll('-', ' ')}
          </p>
        </section>
      </article>
    </main>
  )
}
