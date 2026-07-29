import { useState, type FormEvent } from 'react'
import {
  ArrowRight,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { INTERNAL_EMAIL_DOMAIN } from '@/data/brand'

type LoginFormProps = {
  onLogin: () => void
}

type LoginErrors = {
  email?: string
  password?: string
}

function validateVngEmail(email: string) {
  return email.trim().toLowerCase().endsWith(INTERNAL_EMAIL_DOMAIN)
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<LoginErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors: LoginErrors = {}

    if (!email.trim()) {
      nextErrors.email = 'Vui lòng nhập email VNG'
    } else if (!validateVngEmail(email)) {
      nextErrors.email = `Vui lòng sử dụng email VNG có đuôi ${INTERNAL_EMAIL_DOMAIN}`
    }

    if (!password.trim()) {
      nextErrors.password = 'Vui lòng nhập mật khẩu dùng chung'
    }

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setIsSubmitting(true)
    window.setTimeout(() => {
      setIsSubmitting(false)
      onLogin()
    }, 700)
  }

  return (
    <Card
      className="rounded-lg border-border/80 bg-white shadow-sm"
      data-login-stagger="form"
    >
      <CardHeader className="space-y-2 pb-5">
        <CardTitle className="text-3xl font-semibold">
          Đăng nhập
        </CardTitle>
        <CardDescription className="text-base leading-7">
          Dùng email VNG và mật khẩu được cấp để tiếp tục.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" noValidate onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-semibold" htmlFor="email">
              Email VNG
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                aria-describedby={errors.email ? 'email-error' : undefined}
                aria-invalid={Boolean(errors.email)}
                autoComplete="email"
                className="h-12 bg-slate-50 pl-10 text-base focus-visible:border-blue-600 focus-visible:ring-blue-600/20"
                id="email"
                onChange={(event) => {
                  setEmail(event.target.value)
                  setErrors((current) => ({ ...current, email: undefined }))
                }}
                placeholder="ten.cua.ban@vng.com.vn"
                type="email"
                value={email}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive" id="email-error">
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold" htmlFor="password">
              Mật khẩu dùng chung
            </label>
            <div className="relative">
              <Input
                aria-describedby={
                  errors.password ? 'password-error' : undefined
                }
                aria-invalid={Boolean(errors.password)}
                autoComplete="current-password"
                className="h-12 bg-slate-50 pl-10 pr-11 text-base focus-visible:border-blue-600 focus-visible:ring-blue-600/20"
                id="password"
                onChange={(event) => {
                  setPassword(event.target.value)
                  setErrors((current) => ({
                    ...current,
                    password: undefined,
                  }))
                }}
                placeholder="Nhập mật khẩu"
                type={showPassword ? 'text' : 'password'}
                value={password}
              />
              <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Button
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                onClick={() => setShowPassword((current) => !current)}
                size="icon-sm"
                type="button"
                variant="ghost"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive" id="password-error">
                {errors.password}
              </p>
            )}
          </div>

          <label className="flex cursor-pointer items-center gap-3 text-sm text-muted-foreground">
            <input
              checked={rememberMe}
              className="size-5 rounded border border-input accent-blue-600 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-600/20"
              onChange={(event) => setRememberMe(event.target.checked)}
              type="checkbox"
            />
            <span>Ghi nhớ cho lần đăng nhập sau</span>
          </label>

          <Button
            className="h-12 w-full gap-2 bg-blue-700 text-base font-semibold hover:bg-blue-800"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                Đang đăng nhập
              </>
            ) : (
              <>
                Đăng nhập
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>

          <p className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm leading-6 text-emerald-800">
            <ShieldCheck
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0"
            />
            <span>
              Chỉ email có đuôi {INTERNAL_EMAIL_DOMAIN} được phép truy cập
            </span>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
