import { type CSSProperties } from 'react'

import { HUB_NAME } from '@/data/brand'

type LoginLoadingScreenProps = {
  isExiting?: boolean
  isLooping?: boolean
  cycleDurationMs?: number
}

export function LoginLoadingScreen({
  isExiting = false,
  isLooping = false,
  cycleDurationMs = 1500,
}: LoginLoadingScreenProps) {
  return (
    <main
      className={`loading-motion min-h-svh ${isExiting ? 'is-exiting' : ''} ${
        isLooping ? 'is-looping' : ''
      }`}
      aria-busy="true"
      aria-labelledby="loading-title"
      style={
        {
          '--loading-logo-cycle': `${cycleDurationMs}ms`,
        } as CSSProperties
      }
    >
      <div className="loading-motion-bg" aria-hidden="true" />

      <section className="loading-motion-content">
        <h1 className="loading-motion-title" id="loading-title">
          <span className="sr-only">Đang tải {HUB_NAME}</span>
        </h1>

        <img
          alt=""
          className="loading-motion-brand-lockup"
          src="/zalopay-design-hub-logo-color.svg"
        />
      </section>
    </main>
  )
}
