import { ComingSoon } from '@/components/hub/ComingSoon'
import { Header } from '@/components/hub/Header'
import { RightAnchorNav } from '@/components/hub/RightAnchorNav'
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

export function HubLayout({
  activeSection,
  activeTab,
  onLogout,
  onSectionChange,
  onTabChange,
}: HubLayoutProps) {
  function handleSectionSelect(sectionId: string) {
    onTabChange('ui-principle')
    onSectionChange(sectionId)
    window.history.replaceState(null, '', `#${sectionId}`)
    document.getElementById(sectionId)?.scrollIntoView({ block: 'start' })
  }

  const activeTabLabel =
    hubTabs.find((tab) => tab.id === activeTab)?.label ?? 'UI Hub'

  return (
    <div className="min-h-svh bg-background text-foreground">
      <Header
        activeSection={activeSection}
        activeTab={activeTab}
        onLogout={onLogout}
        onSectionSelect={handleSectionSelect}
        onTabChange={onTabChange}
      />

      {activeTab === 'ui-principle' ? (
        <div className="mx-auto flex w-full max-w-[1440px]">
          <aside className="hidden w-72 shrink-0 border-r px-4 py-6 lg:block">
            <div className="sticky top-20">
              <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-normal text-muted-foreground">
                UI Principle
              </p>
              <SidebarNav
                activeSection={activeSection}
                onSelect={handleSectionSelect}
              />
            </div>
          </aside>

          <UIPrinciplePage
            activeSection={activeSection}
            onActiveSectionChange={onSectionChange}
          />

          <div className="border-l px-6 py-8">
            <RightAnchorNav
              activeSection={activeSection}
              onSelect={handleSectionSelect}
            />
          </div>
        </div>
      ) : (
        <ComingSoon title={activeTabLabel} />
      )}
    </div>
  )
}
