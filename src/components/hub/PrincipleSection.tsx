import { Check } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { Principle } from '@/data/ui-principles'

type PrincipleSectionProps = {
  principle: Principle
}

export function PrincipleSection({ principle }: PrincipleSectionProps) {
  return (
    <article
      className="rounded-lg border border-[#E4EEFF] bg-card"
      id={`principle-${principle.number}`}
    >
      <Card className="rounded-lg border-0 shadow-none ring-foreground/5">
        <CardHeader className="gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-[#0033C9] text-white hover:bg-[#0033C9]">
              Principle {principle.number}
            </Badge>
            <Badge variant="secondary">{principle.vietnameseTitle}</Badge>
          </div>
          <div>
            <CardTitle className="font-sf-pro-display text-2xl">
              {principle.title}
            </CardTitle>
            <CardDescription className="mt-2 text-base leading-7">
              {principle.summary}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="leading-7 text-muted-foreground">
            {principle.description}
          </p>

          <div>
            <h4 className="mb-3 text-sm font-semibold">Nguyên tắc áp dụng</h4>
            <ul className="grid gap-2 md:grid-cols-2">
              {principle.guidelines.map((guideline) => (
                <li className="flex gap-3 text-sm leading-6" key={guideline}>
                  <Check className="mt-1 size-4 shrink-0 text-[#00A957]" />
                  <span>{guideline}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-[#E4EEFF] bg-background p-4">
              <h4 className="mb-3 text-sm font-semibold">Tiêu chí</h4>
              <ul className="space-y-2">
                {principle.criteria.map((item) => (
                  <li className="flex gap-2 text-sm leading-6" key={item}>
                    <Check className="mt-1 size-4 shrink-0 text-[#00A957]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-[#E4EEFF] bg-background p-4">
              <h4 className="mb-3 text-sm font-semibold">Lý do</h4>
              <ul className="space-y-2">
                {principle.reasons.map((item) => (
                  <li className="flex gap-2 text-sm leading-6" key={item}>
                    <Check className="mt-1 size-4 shrink-0 text-[#00A957]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </article>
  )
}
