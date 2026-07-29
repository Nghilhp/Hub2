import { Check, X } from 'lucide-react'

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
    <article className="rounded-lg border bg-card" id={`principle-${principle.number}`}>
      <Card className="border-0 shadow-none">
        <CardHeader className="gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-blue-600 text-white hover:bg-blue-600">
              Principle {principle.number}
            </Badge>
            {principle.vietnameseTitle && (
              <Badge variant="secondary">{principle.vietnameseTitle}</Badge>
            )}
          </div>
          <div>
            <CardTitle className="text-2xl">{principle.title}</CardTitle>
            <CardDescription className="mt-2 text-base leading-7">
              {principle.summary}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="leading-7 text-muted-foreground">{principle.description}</p>

          <div>
            <h4 className="mb-3 text-sm font-semibold">Guidelines</h4>
            <ul className="grid gap-2">
              {principle.guidelines.map((guideline) => (
                <li className="flex gap-3 text-sm leading-6" key={guideline}>
                  <Check className="mt-1 size-4 shrink-0 text-blue-600" />
                  <span>{guideline}</span>
                </li>
              ))}
            </ul>
          </div>

          {(principle.dos || principle.donts) && (
            <div className="grid gap-4 md:grid-cols-2">
              {principle.dos && (
                <div className="rounded-lg border bg-background p-4">
                  <h4 className="mb-3 text-sm font-semibold">Do</h4>
                  <ul className="space-y-2">
                    {principle.dos.map((item) => (
                      <li className="flex gap-2 text-sm leading-6" key={item}>
                        <Check className="mt-1 size-4 shrink-0 text-blue-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {principle.donts && (
                <div className="rounded-lg border bg-background p-4">
                  <h4 className="mb-3 text-sm font-semibold">Don't</h4>
                  <ul className="space-y-2">
                    {principle.donts.map((item) => (
                      <li className="flex gap-2 text-sm leading-6" key={item}>
                        <X className="mt-1 size-4 shrink-0 text-destructive" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {principle.examples && (
            <div className="rounded-lg bg-blue-50 p-4 text-sm leading-6 text-blue-950 dark:bg-blue-950/30 dark:text-blue-100">
              <h4 className="mb-2 font-semibold">Examples</h4>
              <ul className="space-y-1">
                {principle.examples.map((example) => (
                  <li key={example}>{example}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </article>
  )
}
