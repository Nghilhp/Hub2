import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
} from 'react'

import DotGrid from '@/components/DotGrid'
import { LoginForm } from '@/components/hub/LoginForm'

type LoginPageProps = {
  entrance?: 'enter' | 'pre-enter' | 'none'
  onLogin: () => void
}

export function LoginPage({ entrance = 'enter', onLogin }: LoginPageProps) {
  const pageRef = useRef<HTMLElement>(null)
  const visualRef = useRef<HTMLElement>(null)
  const [shouldRenderCollabCursor, setShouldRenderCollabCursor] = useState(false)
  const entranceClass =
    entrance === 'enter'
      ? 'login-form-enter'
      : entrance === 'pre-enter'
        ? 'login-pre-enter'
        : ''

  const canMoveBackground = useCallback(() => {
    if (typeof window === 'undefined') {
      return false
    }

    return (
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
  }, [])

  const handleVisualPointerMove = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (!canMoveBackground()) {
        return
      }

      const visualElement = visualRef.current

      if (!visualElement) {
        return
      }

      const bounds = visualElement.getBoundingClientRect()
      const x = event.clientX - bounds.left
      const y = event.clientY - bounds.top
      const normalizedX = x / bounds.width - 0.5
      const normalizedY = y / bounds.height - 0.5

      visualElement.style.setProperty('--login-cursor-opacity', '1')
      visualElement.style.setProperty('--login-cursor-x', `${x}px`)
      visualElement.style.setProperty('--login-cursor-y', `${y}px`)
      visualElement.style.setProperty('--login-blob-1-x', `${normalizedX * 16}px`)
      visualElement.style.setProperty('--login-blob-1-y', `${normalizedY * 12}px`)
      visualElement.style.setProperty('--login-blob-2-x', `${normalizedX * -22}px`)
      visualElement.style.setProperty('--login-blob-2-y', `${normalizedY * -16}px`)
      visualElement.style.setProperty('--login-blob-3-x', `${normalizedX * 10}px`)
      visualElement.style.setProperty('--login-blob-3-y', `${normalizedY * -20}px`)
      visualElement.style.setProperty('--login-blob-4-x', `${normalizedX * -12}px`)
      visualElement.style.setProperty('--login-blob-4-y', `${normalizedY * 24}px`)
    },
    [canMoveBackground]
  )

  const handleVisualPointerLeave = useCallback(() => {
    const visualElement = visualRef.current

    if (!visualElement) {
      return
    }

    visualElement.style.setProperty('--login-cursor-opacity', '0')
    visualElement.style.setProperty('--login-blob-1-x', '0px')
    visualElement.style.setProperty('--login-blob-1-y', '0px')
    visualElement.style.setProperty('--login-blob-2-x', '0px')
    visualElement.style.setProperty('--login-blob-2-y', '0px')
    visualElement.style.setProperty('--login-blob-3-x', '0px')
    visualElement.style.setProperty('--login-blob-3-y', '0px')
    visualElement.style.setProperty('--login-blob-4-x', '0px')
    visualElement.style.setProperty('--login-blob-4-y', '0px')
  }, [])

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)')

    function updateCollabCursorPreference() {
      setShouldRenderCollabCursor(pointerQuery.matches && !motionQuery.matches)
    }

    updateCollabCursorPreference()
    motionQuery.addEventListener('change', updateCollabCursorPreference)
    pointerQuery.addEventListener('change', updateCollabCursorPreference)

    return () => {
      motionQuery.removeEventListener('change', updateCollabCursorPreference)
      pointerQuery.removeEventListener('change', updateCollabCursorPreference)
    }
  }, [])

  const handlePagePointerMove = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (!shouldRenderCollabCursor) {
        return
      }

      const pageElement = pageRef.current

      if (!pageElement) {
        return
      }

      const bounds = pageElement.getBoundingClientRect()
      const x = event.clientX - bounds.left
      const y = event.clientY - bounds.top

      pageElement.style.setProperty('--login-you-cursor-opacity', '1')
      pageElement.style.setProperty('--login-you-cursor-x', `${x}px`)
      pageElement.style.setProperty('--login-you-cursor-y', `${y}px`)
    },
    [shouldRenderCollabCursor]
  )

  const handlePagePointerLeave = useCallback(() => {
    const pageElement = pageRef.current

    if (!pageElement) {
      return
    }

    pageElement.style.setProperty('--login-you-cursor-opacity', '0')
  }, [])

  return (
    <main
      className={`login-split-page ${entranceClass} ${
        shouldRenderCollabCursor ? 'login-collab-cursor-enabled' : ''
      } text-foreground`}
      onPointerLeave={handlePagePointerLeave}
      onPointerMove={handlePagePointerMove}
      ref={pageRef}
    >
      <section
        aria-hidden="true"
        className="login-split-visual"
        onPointerLeave={handleVisualPointerLeave}
        onPointerMove={handleVisualPointerMove}
        ref={visualRef}
      >
        <DotGrid
          activeColor="#3dff1e"
          baseColor="#354154"
          dotSize={5}
          gap={20}
          maxSpeed={3600}
          proximity={128}
          resistance={980}
          returnDuration={1.2}
          shockRadius={190}
          shockStrength={3.2}
          speedTrigger={110}
        />
        <div className="login-ambient-blobs">
          <div className="login-cursor-glow" />
          <div className="login-ambient-blob login-ambient-blob-1" />
          <div className="login-ambient-blob login-ambient-blob-2" />
          <div className="login-ambient-blob login-ambient-blob-3" />
          <div className="login-ambient-blob login-ambient-blob-4" />
        </div>
        <div className="login-split-visual-overlay" />
      </section>

      <div className="login-layout-shell">
        <section aria-hidden="true" className="login-brand-panel">
          <img
            alt=""
            className="login-split-logo"
            src="/zalopay-design-hub-logo-dark.svg"
          />
          <div className="login-split-copy">
            <p className="login-split-eyebrow">Internal workspace</p>
            <h2>Một ngôn ngữ chung cho trải nghiệm nhất quán</h2>
            <p>
              Design System - UI Principles - Knowledge Hub dành cho đội ngũ sản
              phẩm Zalopay
            </p>
          </div>
        </section>

        <section
          aria-labelledby="login-title"
          className="login-split-form-panel"
        >
          <div className="login-form-content w-full">
            <LoginForm isFlat onLogin={onLogin} titleId="login-title" />
          </div>
        </section>
      </div>

      {shouldRenderCollabCursor && (
        <div className="login-you-cursor" aria-hidden="true">
          <div className="login-you-cursor-arrow" />
          <div className="login-you-cursor-pill">You</div>
        </div>
      )}
    </main>
  )
}
