import { useEffect, useMemo, useRef, useState } from 'react'

import { ComingSoon } from '@/components/hub/ComingSoon'
import { Header } from '@/components/hub/Header'
import { SidebarNav } from '@/components/hub/SidebarNav'
import { UIPrinciplePage } from '@/pages/UIPrinciplePage'
import { hubTabs, type HubTab } from '@/data/navigation'

type HubLayoutProps = {
  activeSection: string
  activeTab: HubTab
  onLogout: () => void
  onSectionChange: (sectionId: string) => void
  onTabChange: (tab: HubTab) => void
}

const TAB_TRANSITION_MS = 190
type TabTransitionDirection = 'forward' | 'backward'

export function HubLayout({
  activeSection,
  activeTab,
  onLogout,
  onSectionChange,
  onTabChange,
}: HubLayoutProps) {
  const [displayTab, setDisplayTab] = useState(activeTab)
  const [leavingTab, setLeavingTab] = useState<HubTab | null>(null)
  const [isSidebarScrolling, setIsSidebarScrolling] = useState(false)
  const [transitionDirection, setTransitionDirection] =
    useState<TabTransitionDirection>('forward')
  const displayTabRef = useRef(activeTab)
  const sidebarScrollTimeoutRef = useRef<number | null>(null)

  const tabLabels = useMemo(
    () =>
      Object.fromEntries(hubTabs.map((tab) => [tab.id, tab.label])) as Record<
        HubTab,
        string
      >,
    []
  )

  useEffect(() => {
    if (activeTab === displayTabRef.current) {
      return
    }

    const currentTabIndex = hubTabs.findIndex(
      (tab) => tab.id === displayTabRef.current
    )
    const nextTabIndex = hubTabs.findIndex((tab) => tab.id === activeTab)

    setTransitionDirection(
      nextTabIndex >= currentTabIndex ? 'forward' : 'backward'
    )
    setLeavingTab(displayTabRef.current)
    setDisplayTab(activeTab)
    displayTabRef.current = activeTab

    const timeoutId = window.setTimeout(() => {
      setLeavingTab(null)
    }, TAB_TRANSITION_MS)

    return () => window.clearTimeout(timeoutId)
  }, [activeTab])

  useEffect(() => {
    return () => {
      if (sidebarScrollTimeoutRef.current) {
        window.clearTimeout(sidebarScrollTimeoutRef.current)
      }
    }
  }, [])

  function handleTabChange(tab: HubTab) {
    if (tab === activeTab) {
      return
    }

    window.scrollTo({ top: 0, behavior: 'auto' })
    window.requestAnimationFrame(() => onTabChange(tab))
  }

  function handleSectionSelect(sectionId: string, anchorId?: string) {
    const currentTabIndex = hubTabs.findIndex(
      (tab) => tab.id === displayTabRef.current
    )
    const nextTabIndex = hubTabs.findIndex((tab) => tab.id === 'ui-principle')

    setTransitionDirection(
      nextTabIndex >= currentTabIndex ? 'forward' : 'backward'
    )
    onTabChange('ui-principle')
    onSectionChange(sectionId)
    window.history.replaceState(null, '', `#${sectionId}`)
    window.setTimeout(() => {
      document
        .getElementById(anchorId ?? sectionId)
        ?.scrollIntoView({ block: 'start' })
    }, 0)
  }

  function handleSidebarScroll() {
    setIsSidebarScrolling(true)

    if (sidebarScrollTimeoutRef.current) {
      window.clearTimeout(sidebarScrollTimeoutRef.current)
    }

    sidebarScrollTimeoutRef.current = window.setTimeout(() => {
      setIsSidebarScrolling(false)
      sidebarScrollTimeoutRef.current = null
    }, 1000)
  }

  function renderTabPanel(tab: HubTab, state: 'active' | 'leaving') {
    const isUIPrinciple = tab === 'ui-principle'
    const tabLabel = tabLabels[tab] ?? 'UI Hub'

    return (
      <div
        className="hub-tab-panel"
        data-direction={transitionDirection}
        data-state={state}
        key={`${tab}-${state}`}
      >
        {isUIPrinciple ? (
          <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 px-4 lg:grid-cols-[16rem_minmax(0,760px)] lg:gap-20 lg:px-6">
            <aside
              className="hub-sidebar-scroll sticky top-20 hidden max-h-[calc(100svh-5rem)] w-64 shrink-0 overflow-y-auto pb-20 pt-8 lg:block"
              data-scrolling={isSidebarScrolling ? 'true' : 'false'}
              onScroll={handleSidebarScroll}
            >
              <SidebarNav
                activeSection={activeSection}
                onSelect={handleSectionSelect}
              />
            </aside>

            <UIPrinciplePage
              activeSection={activeSection}
              onActiveSectionChange={onSectionChange}
            />
          </div>
        ) : (
          <ComingSoon
            onOpenUIPrinciple={() => handleSectionSelect('introduction')}
            title={tabLabel}
          />
        )}
      </div>
    )
  }

  return (
    <div className="min-h-svh bg-background text-foreground">
      <Header
        activeSection={activeSection}
        activeTab={activeTab}
        onLogout={onLogout}
        onSectionSelect={handleSectionSelect}
        onTabChange={handleTabChange}
      />

      <div className="hub-tab-viewport pt-16">
        {leavingTab && renderTabPanel(leavingTab, 'leaving')}
        {renderTabPanel(displayTab, 'active')}
      </div>
    </div>
  )
}
