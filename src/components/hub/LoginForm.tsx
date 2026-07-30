import {
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type FormEvent,
} from 'react'
import { Eye, EyeOff } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { BRAND_STORAGE_NAMESPACE, INTERNAL_EMAIL_DOMAIN } from '@/data/brand'

type LoginFormProps = {
  isFlat?: boolean
  onLogin: () => void
  titleId?: string
}

type LoginErrors = {
  email?: string
  password?: string
}

const REMEMBERED_LOGIN_KEY = `${BRAND_STORAGE_NAMESPACE}-remembered-login`
const SHARED_LOGIN_PASSWORD = 'designhub'

type RememberedLogin = {
  email: string
  password: string
}

function validateVngEmail(email: string) {
  return /^[^\s@]+@vng\.com\.vn$/.test(email.trim().toLowerCase())
}

function buildVngEmail(emailInput: string) {
  const trimmedEmailInput = emailInput.trim()

  if (trimmedEmailInput.includes('@')) {
    return trimmedEmailInput
  }

  return `${trimmedEmailInput}${INTERNAL_EMAIL_DOMAIN}`
}

function getEmailDomainInput(email: string) {
  const trimmedEmail = email.trim()
  const normalizedEmail = trimmedEmail.toLowerCase()

  if (normalizedEmail.endsWith(INTERNAL_EMAIL_DOMAIN)) {
    return trimmedEmail.slice(0, -INTERNAL_EMAIL_DOMAIN.length)
  }

  return trimmedEmail
}

function getRememberedLogin(): RememberedLogin | null {
  try {
    const rememberedLogin = window.localStorage.getItem(REMEMBERED_LOGIN_KEY)

    if (!rememberedLogin) {
      return null
    }

    const parsedLogin = JSON.parse(rememberedLogin) as Partial<RememberedLogin>

    if (typeof parsedLogin.email !== 'string' || typeof parsedLogin.password !== 'string') {
      return null
    }

    return {
      email: parsedLogin.email,
      password: parsedLogin.password,
    }
  } catch {
    return null
  }
}

export function LoginForm({ isFlat = false, onLogin, titleId }: LoginFormProps) {
  const emailFieldRef = useRef<HTMLDivElement>(null)
  const passwordFieldRef = useRef<HTMLDivElement>(null)
  const submitButtonRef = useRef<HTMLButtonElement>(null)
  const [rememberedLogin] = useState(getRememberedLogin)
  const [email, setEmail] = useState(() =>
    getEmailDomainInput(rememberedLogin?.email ?? '')
  )
  const [password, setPassword] = useState(() => rememberedLogin?.password ?? '')
  const [rememberMe, setRememberMe] = useState(() => Boolean(rememberedLogin))
  const [errors, setErrors] = useState<LoginErrors>({})
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  function clearErrorOnFieldExit(
    field: keyof LoginErrors,
    event: FocusEvent<HTMLDivElement>
  ) {
    const nextFocusedElement = event.relatedTarget

    if (
      nextFocusedElement instanceof Node &&
      event.currentTarget.contains(nextFocusedElement)
    ) {
      return
    }

    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  function clearErrorsOutsideClickedFields(clickedElement: Node) {
    if (submitButtonRef.current?.contains(clickedElement)) {
      return
    }

    setErrors((current) => ({
      email:
        current.email && !emailFieldRef.current?.contains(clickedElement)
          ? undefined
          : current.email,
      password:
        current.password && !passwordFieldRef.current?.contains(clickedElement)
          ? undefined
          : current.password,
    }))
  }

  useEffect(() => {
    function handleDocumentPointerDown(event: globalThis.PointerEvent) {
      const clickedElement = event.target

      if (!(clickedElement instanceof Node)) {
        return
      }

      clearErrorsOutsideClickedFields(clickedElement)
    }

    document.addEventListener('pointerdown', handleDocumentPointerDown)

    return () => {
      document.removeEventListener('pointerdown', handleDocumentPointerDown)
    }
  }, [])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors: LoginErrors = {}

    const fullEmail = buildVngEmail(email)

    if (!email.trim()) {
      nextErrors.email = 'Vui lòng nhập email VNG'
    } else if (!validateVngEmail(fullEmail)) {
      nextErrors.email = `Vui lòng sử dụng email VNG có đuôi ${INTERNAL_EMAIL_DOMAIN}`
    }

    if (!password.trim()) {
      nextErrors.password = 'Vui lòng nhập mật khẩu'
    } else if (password !== SHARED_LOGIN_PASSWORD) {
      nextErrors.password = 'Mật khẩu không đúng'
    }

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    if (rememberMe) {
      window.localStorage.setItem(
        REMEMBERED_LOGIN_KEY,
        JSON.stringify({
          email: fullEmail,
          password,
        })
      )
    } else {
      window.localStorage.removeItem(REMEMBERED_LOGIN_KEY)
    }

    onLogin()
  }

  return (
    <Card
      className={`w-full gap-0 overflow-visible border-0 text-[#001f3e] ring-0 ${
        isFlat
          ? 'rounded-none bg-transparent px-0 py-0 shadow-none'
          : 'rounded-[32px] bg-white px-8 py-10 shadow-[0_28px_80px_rgb(0_51_201_/_14%)] sm:px-12 sm:py-12'
      }`}
      data-login-stagger="form"
    >
      <CardHeader className="gap-3 px-0 pb-8 text-center" data-login-stagger="header">
        <p
          className="font-['Aeonik_Pro','SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif] text-[25.6px] font-bold leading-8 text-[#0033c9]"
          id={titleId}
        >
          Chào Mừng tới <span className="text-[#00a655]">Design Hub</span>
        </p>
        <CardDescription className="mx-auto w-fit max-w-full text-[14.4px] font-medium leading-6 text-[#001f3e]/55 sm:whitespace-nowrap">
          Dùng tài khoản VNG của bạn để tiếp tục vào Zalopay UI Hub.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <form
          autoComplete="off"
          className="space-y-0"
          noValidate
          onSubmit={handleSubmit}
        >
          <div data-login-stagger="email">
            <label
              className="block px-1 text-sm font-bold text-[#001f3e]"
              htmlFor="email"
            >
              Email VNG <span className="text-[#e3173c]">*</span>
            </label>
            <div
              className="login-input-shell relative pt-2"
              onBlur={(event) => clearErrorOnFieldExit('email', event)}
              ref={emailFieldRef}
            >
              <Input
                aria-describedby={errors.email ? 'email-error' : undefined}
                aria-invalid={Boolean(errors.email)}
                autoComplete={rememberMe ? 'username' : 'off'}
                className="login-input h-14 rounded-[14px] border-[#f2f6f7] bg-white pl-[22px] pr-[126px] text-sm font-normal text-[#001f3e] shadow-none transition-colors placeholder:font-normal placeholder:text-[#001f3e]/28 focus-visible:border-[#0033c9] focus-visible:ring-3 focus-visible:ring-[#0033c9]/15 focus-visible:ring-inset aria-invalid:ring-inset"
                data-completed={email.trim() ? 'true' : undefined}
                id="email"
                onChange={(event) => {
                  setEmail(getEmailDomainInput(event.target.value))
                  setErrors((current) => ({ ...current, email: undefined }))
                }}
                placeholder="domain"
                type="text"
                value={email}
              />
              <span className="pointer-events-none absolute right-[22px] top-[calc(50%+4px)] -translate-y-1/2 text-sm font-semibold text-[#001f3e]">
                {INTERNAL_EMAIL_DOMAIN}
              </span>
            </div>
            {errors.email && (
              <p className="mt-2 px-1 text-xs text-destructive" id="email-error">
                {errors.email}
              </p>
            )}
          </div>

          <div className="pt-5" data-login-stagger="password">
            <label
              className="block px-1 text-sm font-bold text-[#001f3e]"
              htmlFor="password"
            >
              Mật khẩu <span className="text-[#e3173c]">*</span>
            </label>
            <div
              className="login-input-shell relative pt-2"
              onBlur={(event) => clearErrorOnFieldExit('password', event)}
              ref={passwordFieldRef}
            >
              <Input
                aria-describedby={
                  errors.password ? 'password-error' : undefined
                }
                aria-invalid={Boolean(errors.password)}
                autoComplete={rememberMe ? 'current-password' : 'new-password'}
                className="login-input h-14 rounded-[14px] border-[#f2f6f7] bg-white pl-[22px] pr-[58px] text-sm font-normal text-[#001f3e] shadow-none transition-colors placeholder:font-normal placeholder:text-[#001f3e]/28 focus-visible:border-[#0033c9] focus-visible:ring-3 focus-visible:ring-[#0033c9]/15 focus-visible:ring-inset aria-invalid:ring-inset"
                data-completed={password.trim() ? 'true' : undefined}
                id="password"
                onChange={(event) => {
                  setPassword(event.target.value)
                  setErrors((current) => ({
                    ...current,
                    password: undefined,
                  }))
                }}
                placeholder="Nhập mật khẩu"
                type={isPasswordVisible ? 'text' : 'password'}
                value={password}
              />
              <button
                aria-label={
                  isPasswordVisible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'
                }
                className="absolute right-4 top-[calc(50%+4px)] inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-[#001f3e]/45 transition-colors hover:bg-[#f5f9ff] hover:text-[#001f3e] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#0033c9]/15"
                onClick={() => setIsPasswordVisible((current) => !current)}
                type="button"
              >
                {isPasswordVisible ? (
                  <Eye aria-hidden="true" className="size-4" />
                ) : (
                  <EyeOff aria-hidden="true" className="size-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-2 px-1 text-xs text-destructive" id="password-error">
                {errors.password}
              </p>
            )}
          </div>

          <label
            className="flex h-16 cursor-pointer items-center gap-2 px-1 pb-5 pt-6 text-sm font-normal leading-[18px] text-[#001f3e]"
            data-login-stagger="remember"
          >
            <input
              checked={rememberMe}
              className="login-checkbox"
              onChange={(event) => {
                setRememberMe(event.target.checked)

                if (!event.target.checked) {
                  window.localStorage.removeItem(REMEMBERED_LOGIN_KEY)
                }
              }}
              type="checkbox"
            />
            <span>Ghi nhớ cho lần đăng nhập sau</span>
          </label>

          <Button
            className="login-submit-button mt-3 h-14 w-full rounded-[14px] bg-[#0033c9] text-[15.36px] font-bold text-white shadow-none transition-colors disabled:opacity-70"
            data-login-stagger="cta"
            ref={submitButtonRef}
            type="submit"
          >
            Đăng nhập
          </Button>

          <p
            className="mx-auto w-fit max-w-full px-0 pt-9 text-center text-sm font-medium leading-6 text-[#001f3e]/45"
            data-login-stagger="note"
          >
            Chỉ email có đuôi{' '}
            <span className="font-semibold text-[#001f3e]">
              {INTERNAL_EMAIL_DOMAIN}
            </span>{' '}
            được phép truy cập
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
