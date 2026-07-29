import { Clock3 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

type ComingSoonProps = {
  title: string
}

export function ComingSoon({ title }: ComingSoonProps) {
  return (
    <main className="min-h-[calc(100svh-4rem)] bg-background">
      <section className="mx-auto flex w-full max-w-3xl flex-col justify-center px-6 py-20">
        <Card>
          <CardContent className="flex flex-col items-start gap-4 p-8">
            <Badge variant="secondary">Coming Soon</Badge>
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-200">
                <Clock3 className="size-5" />
              </span>
              <div>
                <h1 className="text-2xl font-semibold">{title}</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  This section is planned for a later MVP iteration.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
