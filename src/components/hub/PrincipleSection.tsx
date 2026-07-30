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
      className="rounded-lg border border-[#e1e1e1] bg-white"
      id={`principle-${principle.number}`}
    >
      <Card className="rounded-lg border-0 shadow-none">
        <CardHeader className="gap-5 px-7 pt-7">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="h-7 rounded-full bg-blue-600 px-3 text-sm text-white hover:bg-blue-600">
              Principle {principle.number}
            </Badge>
            {principle.vietnameseTitle && (
              <Badge className="h-7 rounded-full px-3 text-sm" variant="secondary">
                {principle.vietnameseTitle}
              </Badge>
            )}
          </div>
          <div>
            <CardTitle className="text-3xl font-semibold tracking-normal">
              {principle.title}
            </CardTitle>
            <CardDescription className="mt-3 text-lg leading-8">
              {principle.summary}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-7 px-7 pb-7">
          <p className="text-lg leading-8 text-muted-foreground">
            {principle.description}
          </p>

          <div>
            <h4 className="mb-4 text-lg font-semibold">Nguyên tắc áp dụng</h4>
            <ul className="grid gap-3">
              {principle.guidelines.map((guideline) => (
                <li className="flex gap-4 text-base leading-7" key={guideline}>
                  <Check className="mt-1 size-5 shrink-0 text-blue-600" />
                  <span>{guideline}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-lg border border-[#e7e7e7] bg-background p-5">
              <h4 className="mb-4 text-lg font-semibold">Tiêu chí</h4>
              <ul className="space-y-3">
                {principle.criteria.map((item) => (
                  <li className="flex gap-3 text-base leading-7" key={item}>
                    <Check className="mt-1 size-5 shrink-0 text-blue-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-[#e7e7e7] bg-background p-5">
              <h4 className="mb-4 text-lg font-semibold">Lý do</h4>
              <ul className="space-y-3">
                {principle.reasons.map((item) => (
                  <li className="flex gap-3 text-base leading-7" key={item}>
                    <Check className="mt-1 size-5 shrink-0 text-blue-600" />
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
