import { useState, type FormEvent } from 'react'
import { Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type LoginPageProps = {
  onLogin: () => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    window.setTimeout(() => {
      setIsSubmitting(false)
      onLogin()
    }, 600)
  }

  return (
    <main className="flex min-h-svh flex-col bg-[#F8FBFF] text-[#1d1d1f]">
      <div className="flex min-h-11 items-center justify-center border-b border-[#E4EEFF] bg-[#F1F7FF] px-4 text-center text-sm font-medium text-[#0033C9] sm:text-base">
        <span>ZaloPay UI Hub is in MVP preview.</span>
        <a
          className="ml-2 underline underline-offset-4 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          href="#login"
        >
          Read the guideline note
        </a>
      </div>

      <section className="grid flex-1 p-2 lg:grid-cols-2">
        <aside className="relative hidden min-h-[calc(100svh-6.5rem)] overflow-hidden bg-[#0033C9] text-white lg:block">
          <div className="absolute left-6 top-6 z-10 flex size-8 items-center justify-center rounded-full bg-white/15">
            <Sparkles className="size-5" />
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_78%,rgba(0,207,106,0.9),transparent_20%),radial-gradient(circle_at_22%_18%,rgba(255,255,255,0.18),transparent_32%),linear-gradient(135deg,#0033C9_0%,#0033C9_56%,#002798_100%)]" />
          <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(0deg,rgba(255,255,255,.45)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.32)_1px,transparent_1px)] [background-size:3px_3px]" />
          <div className="relative z-10 flex h-full items-center justify-center px-16">
            <blockquote className="max-w-xl text-center text-2xl font-medium leading-[1.7] text-white/92">
              “A shared UI language helps every team design faster, review with
              clarity, and protect user trust in every payment moment.”
              <footer className="mt-7 text-sm font-normal text-white/45">
                ZaloPay Product Design · Vietnam
              </footer>
            </blockquote>
          </div>
        </aside>

        <section
          className="flex min-h-[calc(100svh-8rem)] items-center justify-center bg-white px-5 py-12 sm:px-8"
          id="login"
        >
          <div className="w-full max-w-[568px]">
            <div className="mx-auto max-w-[420px]">
              <div className="mb-12 text-center">
                <h1 className="font-serif text-3xl font-medium tracking-normal">
                  Welcome to ZaloPay UI Hub
                </h1>
                <p className="mt-5 text-base text-black/45">
                  Sign in or create an account
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <label className="sr-only" htmlFor="email">
                  Email
                </label>
                <Input
                  autoComplete="email"
                  className="h-12 rounded-none border-[#E4EEFF] bg-white px-4 text-base text-[#1d1d1f] shadow-none focus-visible:border-[#00CF6A] focus-visible:ring-0"
                  defaultValue="uihub@zalopay.vn"
                  id="email"
                  required
                  type="email"
                />
                <Button
                  className="h-13 w-full rounded-none bg-[#0033C9] text-base font-medium text-white hover:bg-[#002798]"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? 'Continuing...' : 'Continue'}
                </Button>

                <div className="flex items-center gap-4 py-5 text-sm text-black/40">
                  <span className="h-px flex-1 bg-black/8" />
                  <span>or</span>
                  <span className="h-px flex-1 bg-black/8" />
                </div>

                <Button
                  className="h-13 w-full rounded-none bg-[#00A957] text-base font-medium text-white hover:bg-[#008F4A]"
                  type="button"
                >
                  Show other options
                </Button>
              </form>
            </div>

            <p className="mt-28 text-center text-sm text-black/45 max-sm:mt-12">
              By signing in you agree to our{' '}
              <a className="underline underline-offset-4" href="#terms">
                Terms of service
              </a>{' '}
              &{' '}
              <a className="underline underline-offset-4" href="#privacy">
                Privacy policy
              </a>
            </p>
          </div>
        </section>
      </section>

      <footer className="flex min-h-16 items-center justify-between gap-4 bg-[#0033C9] px-6 py-4 text-white">
        <div className="flex items-center gap-3">
          <span className="flex size-8 items-center justify-center rounded-md bg-[#00CF6A] text-xs font-semibold text-[#0033C9]">
            ZP
          </span>
          <span className="text-xl font-semibold">ZaloPay UI Hub</span>
        </div>
        <div className="hidden items-center gap-3 text-lg font-semibold sm:flex">
          <span className="text-white/75">curated by</span>
          <span>Product Design</span>
        </div>
      </footer>
    </main>
  )
}
