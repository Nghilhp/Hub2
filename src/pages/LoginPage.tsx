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
    <main className="flex min-h-svh flex-col bg-[#f7f7f5] text-[#1d1d1f]">
      <div className="flex min-h-11 items-center justify-center border-b border-black/10 bg-[#e9e7e2] px-4 text-center text-sm font-medium sm:text-base">
        <span>ZaloPay UI Hub is in MVP preview.</span>
        <a
          className="ml-2 underline underline-offset-4 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          href="#login"
        >
          Read the guideline note
        </a>
      </div>

      <section className="grid flex-1 p-2 lg:grid-cols-2">
        <aside className="relative hidden min-h-[calc(100svh-6.5rem)] overflow-hidden bg-[#0d0e10] text-white lg:block">
          <div className="absolute left-6 top-6 z-10 flex size-8 items-center justify-center rounded-full bg-white/10">
            <Sparkles className="size-5" />
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_78%,rgba(255,255,255,0.72),transparent_17%),radial-gradient(circle_at_68%_42%,rgba(255,255,255,0.18),transparent_32%),linear-gradient(110deg,#08090a_0%,#111315_42%,#4b4d50_100%)]" />
          <div className="absolute inset-0 opacity-[0.13] [background-image:linear-gradient(0deg,rgba(255,255,255,.45)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.32)_1px,transparent_1px)] [background-size:3px_3px]" />
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
                  className="h-12 rounded-none border-[#d8d8d4] bg-white px-4 text-base text-[#1d1d1f] shadow-none focus-visible:border-[#1d1d1f] focus-visible:ring-0"
                  defaultValue="uihub@zalopay.vn"
                  id="email"
                  required
                  type="email"
                />
                <Button
                  className="h-13 w-full rounded-none bg-[#171719] text-base font-medium text-white hover:bg-black"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? 'Continuing...' : 'Continue'}
                </Button>

                <div className="flex items-center gap-4 py-5 text-sm text-black/40">
                  <span className="h-px flex-1 bg-black/12" />
                  <span>or</span>
                  <span className="h-px flex-1 bg-black/12" />
                </div>

                <Button
                  className="h-13 w-full rounded-none bg-[#0f0f10] text-base font-medium text-white hover:bg-black"
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

      <footer className="flex min-h-16 items-center justify-between gap-4 bg-[#2d2d2b] px-6 py-4 text-white">
        <div className="flex items-center gap-3">
          <span className="flex size-8 items-center justify-center rounded-md bg-black text-xs font-semibold">
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
