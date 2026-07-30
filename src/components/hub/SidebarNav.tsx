import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { localSections } from '@/data/navigation'
import { uiPrinciples } from '@/data/ui-principles'
import { cn } from '@/lib/utils'

type SidebarNavProps = {
  activeSection: string
  onSelect: (sectionId: string, anchorId?: string) => void
}

type SidebarItem = {
  anchorId?: string
  id: string
  label: string
}

export function SidebarNav({ activeSection, onSelect }: SidebarNavProps) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    overview: true,
    principle: true,
    other: true,
  })
  const overviewSectionIds = [
    'introduction',
    'goal',
    'definition-and-scope',
    'information-priority-levels',
    'how-to-use-this-framework',
  ]
  const otherSectionIds = [
    'related-guidelines',
    'design-review-checklist',
  ]
  const overviewSections: SidebarItem[] = localSections.filter((section) =>
    overviewSectionIds.includes(section.id)
  )
  const otherSections: SidebarItem[] = localSections.filter((section) =>
    otherSectionIds.includes(section.id)
  )
  const principleSections: SidebarItem[] = uiPrinciples.map((principle) => ({
    id: `principle-${principle.number}`,
    label: principle.title,
  }))
  const navGroups = [
    { id: 'overview', title: 'Tổng quan', sections: overviewSections },
    { id: 'principle', title: '8 UI Principles', sections: principleSections },
    { id: 'other', title: 'Khác', sections: otherSections },
  ]
  const activeGroupId = navGroups.find((group) =>
    group.sections.some((section) => section.id === activeSection)
  )?.id

  useEffect(() => {
    if (!activeGroupId) {
      return
    }

    setOpenGroups((current) => ({
      ...current,
      [activeGroupId]: true,
    }))
  }, [activeGroupId])

  return (
    <nav aria-label="UI Principle sections" className="space-y-4">
      {navGroups.map((group) => (
        <div key={group.id}>
          <button
            aria-expanded={openGroups[group.id]}
            className="mb-1.5 flex w-full items-center justify-between rounded-lg px-4 py-1.5 text-left text-sm font-normal uppercase tracking-normal text-muted-foreground transition-colors hover:bg-[#F1F7FF] hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#BFEFD8] dark:hover:bg-blue-950/30"
            onClick={() =>
              setOpenGroups((current) => ({
                ...current,
                [group.id]: !current[group.id],
              }))
            }
            type="button"
          >
            <span>{group.title}</span>
            <ChevronDown
              className={cn(
                'size-4 transition-transform',
                openGroups[group.id] ? 'rotate-0' : '-rotate-90'
              )}
            />
          </button>
          <div
            className="hub-sidebar-accordion"
            data-state={openGroups[group.id] ? 'open' : 'closed'}
          >
            <div className="hub-sidebar-accordion-content">
              <div className="space-y-0.5 pl-4">
                {group.sections.map((section) => (
                  <Button
                    aria-current={activeSection === section.id ? 'location' : undefined}
                    className={cn(
                      'h-auto w-full min-w-0 justify-start rounded-xl px-4 py-2 text-left text-sm font-normal leading-5 text-foreground transition-colors focus-visible:ring-3 focus-visible:ring-[#BFEFD8]',
                      activeSection === section.id
                        ? 'bg-[#F1F7FF] text-[#0033C9] hover:bg-[#F1F7FF] hover:text-[#0033C9] dark:bg-blue-950/40 dark:text-blue-200 dark:hover:bg-blue-950/40 dark:hover:text-blue-200'
                        : 'hover:bg-[#F1F7FF] dark:hover:bg-blue-950/30'
                    )}
                    key={section.anchorId ?? section.id}
                    onClick={() => onSelect(section.id, section.anchorId)}
                    tabIndex={openGroups[group.id] ? 0 : -1}
                    title={section.label}
                    type="button"
                    variant="ghost"
                  >
                    <span className="block min-w-0 truncate">{section.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </nav>
  )
}
