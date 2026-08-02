import { useEffect, useState } from 'react'
import { Agentation } from 'agentation'

import { NotFound } from '@/components/hub/NotFound'
import { IntroductionPage } from '@/pages/IntroductionPage'

const LOGIN_ENABLED = false

function getInitialPath() {
  return window.location.pathname
}

function App() {
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

  function handleGoHome() {
    navigate('/#introduction')
  }

  let pageContent

  if (
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
