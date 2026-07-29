import { useEffect, useState, type CSSProperties } from 'react'

import { HUB_NAME } from '@/data/brand'

type LoadingPageProps = {
  isLooping?: boolean
  onComplete: () => void
}

const STARS = [
  ['7%', '17%', '4px', '-1s', '3.6s'],
  ['16%', '31%', '3px', '-0.2s', '4.2s'],
  ['9%', '72%', '4px', '-2.4s', '3.6s'],
  ['22%', '63%', '3px', '-0.6s', '3s'],
  ['28%', '87%', '4px', '-0.7s', '3.6s'],
  ['38%', '42%', '3px', '-1.4s', '4.8s'],
  ['55%', '18%', '3px', '-1.8s', '3.6s'],
  ['61%', '70%', '4px', '-0.3s', '3.3s'],
  ['66%', '25%', '4px', '-2.8s', '3.6s'],
  ['79%', '84%', '3px', '-1.2s', '4.5s'],
  ['83%', '8%', '3px', '-1.2s', '3.6s'],
  ['88%', '58%', '4px', '-0.8s', '3.7s'],
  ['94%', '27%', '3px', '-2.1s', '3.6s'],
  ['96%', '78%', '4px', '-0.4s', '4.1s'],
  ['3%', '48%', '2px', '-0.4s', '2.7s'],
  ['12%', '8%', '3px', '-1.9s', '3.2s'],
  ['14%', '88%', '2px', '-2.6s', '4.6s'],
  ['20%', '19%', '4px', '-0.9s', '3.8s'],
  ['25%', '46%', '2px', '-2.2s', '2.9s'],
  ['31%', '73%', '3px', '-1.3s', '4.4s'],
] as const

const LOADING_DURATION = 2500
const EXIT_START = 2500
const COMPLETE_DURATION = 2860
const REDUCED_MOTION_DURATION = 520

export function LoadingPage({
  isLooping = false,
  onComplete,
}: LoadingPageProps) {
  const [phase, setPhase] = useState<'loading' | 'exiting'>('loading')
  const [progress, setProgress] = useState(0)
  const logoCycleDuration = isLooping ? LOADING_DURATION : EXIT_START

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    const progressDuration = prefersReducedMotion
      ? REDUCED_MOTION_DURATION
      : logoCycleDuration
    const startedAt = performance.now()
    let animationFrame = 0

    function tick(now: number) {
      const elapsed = now - startedAt
      const progressRatio = isLooping
        ? (elapsed % progressDuration) / progressDuration
        : Math.min(elapsed / progressDuration, 1)

      setProgress(Math.round(progressRatio * 100))

      if (isLooping || progressRatio < 1) {
        animationFrame = window.requestAnimationFrame(tick)
      }
    }

    setPhase('loading')
    animationFrame = window.requestAnimationFrame(tick)

    if (isLooping) {
      return () => window.cancelAnimationFrame(animationFrame)
    }

    const exitStart = prefersReducedMotion ? 880 : EXIT_START
    const completeDuration = prefersReducedMotion ? 1040 : COMPLETE_DURATION
    const exitTimer = window.setTimeout(() => {
      setProgress(100)
      setPhase('exiting')
    }, exitStart)
    const completeTimer = window.setTimeout(onComplete, completeDuration)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.clearTimeout(exitTimer)
      window.clearTimeout(completeTimer)
    }
  }, [isLooping, logoCycleDuration, onComplete])

  return (
    <main
      className={`loading-motion min-h-svh is-${phase} ${
        isLooping ? 'is-looping' : ''
      }`}
      aria-labelledby="loading-title"
      style={
        {
          '--loading-logo-cycle': `${logoCycleDuration}ms`,
        } as CSSProperties
      }
    >
      <div className="loading-motion-bg" aria-hidden="true">
        <span className="loading-motion-glow" />
        {STARS.map(([x, y, size, delay, speed]) => (
          <i
            className="loading-motion-star"
            key={`${x}-${y}`}
            style={
              {
                '--x': x,
                '--y': y,
                '--size': size,
                '--delay': delay,
                '--speed': speed,
              } as CSSProperties
            }
          />
        ))}
      </div>

      <section className="loading-motion-content">
        <h1 className="loading-motion-title" id="loading-title">
          <img
            alt="Zalopay | Design Hub"
            className="loading-motion-logo"
            src="/zalopay-design-hub-logo-dark.svg"
          />
        </h1>

        <div
          aria-label={`Đang tải ${HUB_NAME}`}
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={progress}
          className="loading-motion-progress"
          role="progressbar"
        >
          <div className="loading-motion-track" aria-hidden="true">
            <span
              className="loading-motion-fill"
              style={{ width: `${progress}%` }}
            />
            <span className="loading-motion-shine" />
          </div>
          <output className="loading-motion-value">{progress}%</output>
        </div>
      </section>

    </main>
  )
}
