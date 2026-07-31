import { useCallback, useEffect, useState } from 'react'
import { Agentation } from 'agentation'

import { NotFound } from '@/components/hub/NotFound'
import { BRAND_STORAGE_NAMESPACE } from '@/data/brand'
import { IntroductionPage } from '@/pages/IntroductionPage'
import { LoadingPage } from '@/pages/LoadingPage'
import { LoginPage } from '@/pages/LoginPage'

const AUTH_KEY = `${BRAND_STORAGE_NAMESPACE}-authenticated`
const LOGIN_INTRO_KEY = `${BRAND_STORAGE_NAMESPACE}-login-intro-shown`

function getInitialPath() {
  return window.location.pathname
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => window.localStorage.getItem(AUTH_KEY) === 'true'
  )
  const [hasShownLoginIntro, setHasShownLoginIntro] = useState(
    () => window.sessionStorage.getItem(LOGIN_INTRO_KEY) === 'true'
  )
  const [isLoginIntroRevealing, setIsLoginIntroRevealing] = useState(false)
  const [path, setPath] = useState(getInitialPath)

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

  const handleLoginIntroExitStart = useCallback(() => {
    setIsLoginIntroRevealing(true)
  }, [])

  const handleLoginIntroComplete = useCallback(() => {
    window.sessionStorage.setItem(LOGIN_INTRO_KEY, 'true')
    setHasShownLoginIntro(true)
    setIsLoginIntroRevealing(false)

    if (path !== '/login') {
      window.history.pushState(null, '', '/login')
      setPath('/login')
    }
  }, [path])

  function handleLogin() {
    window.localStorage.setItem(AUTH_KEY, 'true')
    setIsAuthenticated(true)
    setIsLoginIntroRevealing(false)
    navigate('/')
  }

  function handleGoHome() {
    if (!isAuthenticated) {
      setIsLoginIntroRevealing(false)
      navigate('/login')
      return
    }

    navigate('/#introduction')
  }

  let pageContent
  const shouldShowLoginIntro =
    !isAuthenticated && !hasShownLoginIntro && (path === '/' || path === '/login')
  const loginIntroContent = (
    <div className="login-intro-stack">
      <div
        aria-hidden={!isLoginIntroRevealing}
        className="login-intro-page"
      >
        <LoginPage
          entrance={isLoginIntroRevealing ? 'enter' : 'pre-enter'}
          onLogin={handleLogin}
        />
      </div>
      <div className="login-intro-loading">
        <LoadingPage
          onExitStart={handleLoginIntroExitStart}
          onComplete={handleLoginIntroComplete}
        />
      </div>
    </div>
  )

  if (path === '/loading') {
    const loadingParams = new URLSearchParams(window.location.search)
    const isLoadingLoop = loadingParams.get('loop') === 'true'

    pageContent = isLoadingLoop ? (
      <LoadingPage
        isLooping={isLoadingLoop}
        onComplete={handleLoginIntroComplete}
      />
    ) : loginIntroContent
  } else if (shouldShowLoginIntro) {
    pageContent = loginIntroContent
  } else if (path !== '/' && path !== '/login') {
    pageContent = <NotFound onGoHome={handleGoHome} />
  } else if (!isAuthenticated || path === '/login') {
    pageContent = (
      <LoginPage
        entrance={hasShownLoginIntro ? 'none' : 'enter'}
        onLogin={handleLogin}
      />
    )
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
