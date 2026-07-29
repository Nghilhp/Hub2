import { useEffect, useState } from 'react'

import { HubLayout } from '@/components/hub/HubLayout'
import { NotFound } from '@/components/hub/NotFound'
import type { HubTab } from '@/data/navigation'
import { LoginPage } from '@/pages/LoginPage'

const AUTH_KEY = 'zalopay-ui-hub-authenticated'

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

  if (path !== '/' && path !== '/login') {
    return <NotFound onGoHome={handleGoHome} />
  }

  if (!isAuthenticated || path === '/login') {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <HubLayout
      activeSection={activeSection}
      activeTab={activeTab}
      onLogout={handleLogout}
      onSectionChange={setActiveSection}
      onTabChange={setActiveTab}
    />
  )
}

export default App
