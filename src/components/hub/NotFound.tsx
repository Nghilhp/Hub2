import { Button } from '@/components/ui/button'

type NotFoundProps = {
  onGoHome: () => void
}

export function NotFound({ onGoHome }: NotFoundProps) {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-6">
      <section className="max-w-md text-center">
        <p className="text-sm font-medium text-[#0033C9] dark:text-blue-200">404</p>
        <h1 className="mt-3 text-3xl font-semibold">Page not found</h1>
        <p className="mt-3 text-muted-foreground">
          The URL does not match a page in this MVP.
        </p>
        <Button className="mt-6" onClick={onGoHome} type="button">
          Back to UI Hub
        </Button>
      </section>
    </main>
  )
}
