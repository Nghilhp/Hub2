import { useEffect, useState } from 'react'
import { Agentation } from 'agentation'

import { NotFound } from '@/components/hub/NotFound'
import { IntroductionPage } from '@/pages/IntroductionPage'
import { LoadingPage } from '@/pages/LoadingPage'

const LOGIN_ENABLED = false

function getInitialPath() {
  return window.location.pathname
}

function shouldShowLandingIntro(path: string) {
  const hash = window.location.hash.replace('#', '')

  return path !== '/loading' && (!hash || hash === 'landing')
}

function App() {
  const [path, setPath] = useState(getInitialPath)
  const [showLandingIntro, setShowLandingIntro] = useState(() =>
    shouldShowLandingIntro(getInitialPath())
  )

  useEffect(() => {
    function handlePopState() {
      setPath(window.location.pathname)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  function navigate(nextUrl: string) {
    window.history.pushState(null, '', nextUrl)
    setPath(new URL(nextUrl, window.location.origin).pathname)
  }

  function handleGoHome() {
    navigate('/#introduction')
  }

  function handleLandingIntroComplete() {
    setShowLandingIntro(false)
    if (!window.location.hash) {
      window.history.replaceState(null, '', '/#landing')
      setPath('/')
    }
  }

  let pageContent

  if (path === '/loading') {
    pageContent = <LoadingPage isLooping onComplete={() => undefined} />
  } else if (
    !LOGIN_ENABLED &&
    (path === '/' || path === '/login')
  ) {
    pageContent = (
      <div className="login-intro-stack">
        <div
          className="login-intro-page"
          aria-hidden={showLandingIntro ? 'true' : undefined}
        >
          <IntroductionPage />
        </div>
        {showLandingIntro && (
          <div className="login-intro-loading">
            <LoadingPage onComplete={handleLandingIntroComplete} />
          </div>
        )}
      </div>
    )
  } else if (
    !LOGIN_ENABLED &&
    (path === '/' ||
      path === '/login' ||
      path === '/loading' ||
      path === '/docs/uxr/methods/survey')
  ) {
    pageContent = <IntroductionPage />
  } else if (path !== '/' && path !== '/login') {
    pageContent = <NotFound onGoHome={handleGoHome} />
  } else {
    pageContent = <IntroductionPage />
  }

  return (
    <>
      {pageContent}
      {import.meta.env.DEV && <Agentation />}
    </>
  )
}

export default App
