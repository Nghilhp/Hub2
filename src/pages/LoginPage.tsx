import {
  BadgeCheck,
  BookOpenCheck,
  Layers3,
  SearchCheck,
  ShieldCheck,
} from 'lucide-react'

import { LoginForm } from '@/components/hub/LoginForm'
import { BRAND_NAME, HUB_DESCRIPTION, HUB_NAME } from '@/data/brand'

type LoginPageProps = {
  onLogin: () => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  return (
    <main className="min-h-svh bg-[#f6f8fb] text-foreground">
      <section className="mx-auto grid min-h-svh w-full max-w-7xl items-center gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(380px,440px)] lg:gap-14 lg:py-10">
        <div className="hidden min-h-[680px] flex-col justify-between overflow-hidden rounded-lg border border-slate-200 bg-white p-8 shadow-sm lg:flex">
          <div>
            <div className="mb-12 flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-lg bg-blue-700 text-white shadow-sm">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-950">
                  {HUB_NAME}
                </p>
                <p className="text-sm text-slate-500">
                  {HUB_DESCRIPTION} nội bộ
                </p>
              </div>
            </div>

            <div className="max-w-2xl">
              <p className="mb-4 text-sm font-semibold text-blue-700">
                UI Principles and Design System
              </p>
              <h1 className="text-5xl font-semibold leading-tight text-slate-950">
                Một nơi gọn gàng để review, tra cứu và thống nhất UI.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
                Truy cập nhanh các principle, pattern và guideline dùng trong
                quá trình thiết kế sản phẩm {BRAND_NAME}.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  label: 'Principles',
                  value: '10+',
                },
                {
                  label: 'Patterns',
                  value: 'Core',
                },
                {
                  label: 'Access',
                  value: 'VNG',
                },
              ].map((item) => (
                <div
                  className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-4"
                  key={item.label}
                >
                  <p className="text-2xl font-semibold text-slate-950">
                    {item.value}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  icon: BookOpenCheck,
                  title: 'Review',
                  text: 'Ngôn ngữ chung cho critique.',
                },
                {
                  icon: SearchCheck,
                  title: 'Tra cứu',
                  text: 'Tìm guideline theo ngữ cảnh.',
                },
                {
                  icon: Layers3,
                  title: 'Hệ thống',
                  text: 'Kết nối principle và pattern.',
                },
              ].map((item) => {
                const Icon = item.icon

                return (
                  <div
                    className="rounded-lg border border-slate-200 bg-white p-4"
                    key={item.title}
                  >
                    <Icon className="mb-4 size-5 text-blue-700" />
                    <p className="font-semibold text-slate-950">
                      {item.title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {item.text}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="login-form-enter mx-auto w-full max-w-[440px]">
          <div className="login-stagger-1 mb-7">
            <div className="mb-7 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-lg bg-blue-700 text-white shadow-sm">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-950">
                    {HUB_NAME}
                  </p>
                  <p className="text-sm text-slate-500">{HUB_DESCRIPTION}</p>
                </div>
              </div>
              <div className="hidden items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 sm:flex">
                <BadgeCheck className="size-4" />
                Nội bộ
              </div>
            </div>
            <p className="mb-3 text-sm font-semibold uppercase text-blue-700">
              Chào mừng tới Design Hub
            </p>
            <h2 className="text-4xl font-semibold leading-tight text-slate-950">
              Đăng nhập để vào không gian UI nội bộ.
            </h2>
          </div>

          <LoginForm onLogin={onLogin} />
        </div>
      </section>
    </main>
  )
}
