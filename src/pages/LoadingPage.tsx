import { useEffect, useState } from 'react'

import { LoginLoadingScreen } from '@/components/hub/LoginLoadingScreen'

type LoadingPageProps = {
  isLooping?: boolean
  onComplete: () => void
  onExitStart?: () => void
}

const LOGO_REVEAL_DURATION = 2400
const LOOP_DURATION = 2800
const EXIT_START = 2600
const COMPLETE_DURATION = 3400

export function LoadingPage({
  isLooping = false,
  onComplete,
  onExitStart,
}: LoadingPageProps) {
  const [phase, setPhase] = useState<'loading' | 'exiting'>('loading')
  const logoCycleDuration = isLooping ? LOOP_DURATION : LOGO_REVEAL_DURATION

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    setPhase('loading')

    if (isLooping) {
      return undefined
    }

    const exitStart = prefersReducedMotion ? 880 : EXIT_START
    const completeDuration = prefersReducedMotion ? 1040 : COMPLETE_DURATION
    const exitTimer = window.setTimeout(() => {
      setPhase('exiting')
      onExitStart?.()
    }, exitStart)
    const completeTimer = window.setTimeout(onComplete, completeDuration)

    return () => {
      window.clearTimeout(exitTimer)
      window.clearTimeout(completeTimer)
    }
  }, [isLooping, logoCycleDuration, onComplete, onExitStart])

  return (
    <LoginLoadingScreen
      cycleDurationMs={logoCycleDuration}
      isExiting={phase === 'exiting'}
      isLooping={isLooping}
    />
  )
}
