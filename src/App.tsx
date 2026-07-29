import { useEffect, useState } from 'react'
import { Agentation } from 'agentation'

import { HubLayout } from '@/components/hub/HubLayout'
import { NotFound } from '@/components/hub/NotFound'
import { BRAND_STORAGE_NAMESPACE } from '@/data/brand'
import type { HubTab } from '@/data/navigation'
import { LoginPage } from '@/pages/LoginPage'

const AUTH_KEY = `${BRAND_STORAGE_NAMESPACE}-authenticated`

function getInitialPath() {
  return window.location.pathname
}

function App() {
  const [activeSection, setActiveSection] = useState('introduction')
  const [activeTab, setActiveTab] = useState<HubTab>('ui-principle')
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => window.localStorage.getItem(AUTH_KEY) === 'true'
  )
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

  function handleLogin() {
    window.localStorage.setItem(AUTH_KEY, 'true')
    setIsAuthenticated(true)
    navigate('/')
  }

  function handleLogout() {
    window.localStorage.removeItem(AUTH_KEY)
    setIsAuthenticated(false)
    setActiveTab('ui-principle')
    setActiveSection('introduction')
    navigate('/login')
  }

  function handleGoHome() {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    setActiveTab('ui-principle')
    setActiveSection('introduction')
    navigate('/#introduction')
  }

  let pageContent

  if (path !== '/' && path !== '/login') {
    pageContent = <NotFound onGoHome={handleGoHome} />
  } else if (!isAuthenticated || path === '/login') {
    pageContent = <LoginPage onLogin={handleLogin} />
  } else {
    pageContent = (
      <HubLayout
        activeSection={activeSection}
        activeTab={activeTab}
        onLogout={handleLogout}
        onSectionChange={setActiveSection}
        onTabChange={setActiveTab}
      />
    )
  }

  return (
    <>
      {pageContent}
      {import.meta.env.DEV && <Agentation />}
    </>
  )
}

export default App
