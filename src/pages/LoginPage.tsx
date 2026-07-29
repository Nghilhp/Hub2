import { ShieldCheck } from 'lucide-react'

import { LoginForm } from '@/components/hub/LoginForm'

type LoginPageProps = {
  onLogin: () => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  return (
    <main className="min-h-svh bg-[#f7f9fc] text-foreground">
      <section className="mx-auto flex min-h-svh w-full max-w-6xl items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-[420px]">
          <div className="mb-8">
            <div className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-blue-700 text-white shadow-sm">
              <ShieldCheck className="size-6" />
            </div>
            <h1 className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-blue-700">
              CHÀO MỪNG TỚI Design Hub
            </h1>
            <p className="text-4xl font-semibold tracking-normal text-slate-950">
              ZaloPay UI Hub
            </p>
          </div>

          <LoginForm onLogin={onLogin} />
        </div>
      </section>
    </main>
  )
}
