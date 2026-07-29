import { useState, type FormEvent } from 'react'
import { Eye, EyeOff } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'

const VNG_EMAIL_DOMAIN = '@vng.com.vn'

type LoginFormProps = {
  onLogin: () => void
}

type LoginErrors = {
  email?: string
  password?: string
}

function validateVngEmail(email: string) {
  return email.trim().toLowerCase().endsWith(VNG_EMAIL_DOMAIN)
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('nghilhp@vng.com.vn')
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
      nextErrors.email = 'Vui lòng sử dụng email VNG có đuôi @vng.com.vn'
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
    <Card className="border-border/80 shadow-sm">
      <CardHeader className="space-y-2 pb-5">
        <CardTitle className="text-3xl font-semibold tracking-normal">
          Đăng nhập
        </CardTitle>
        <CardDescription className="text-base leading-7">
          Dùng tài khoản VNG của bạn để tiếp tục vào ZaloPay UI Hub.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" noValidate onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-semibold" htmlFor="email">
              Email VNG
            </label>
            <Input
              aria-describedby={errors.email ? 'email-error' : undefined}
              aria-invalid={Boolean(errors.email)}
              autoComplete="email"
              className="h-12 bg-blue-50/70 text-base focus-visible:border-blue-600 focus-visible:ring-blue-600/20"
              id="email"
              onChange={(event) => {
                setEmail(event.target.value)
                setErrors((current) => ({ ...current, email: undefined }))
              }}
              placeholder="ten.cua.ban@vng.com.vn"
              type="email"
              value={email}
            />
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
                className="h-12 bg-blue-50/70 pr-11 text-base focus-visible:border-blue-600 focus-visible:ring-blue-600/20"
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
            className="h-12 w-full bg-blue-700 text-base font-semibold hover:bg-blue-800"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>

          <p className="flex items-start gap-2 text-sm leading-6 text-muted-foreground">
            <span
              aria-hidden="true"
              className="mt-2 size-2 shrink-0 rounded-full bg-emerald-500"
            />
            <span>Chỉ email có đuôi @vng.com.vn được phép truy cập</span>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
