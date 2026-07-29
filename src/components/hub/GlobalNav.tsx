import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { hubTabs, type HubTab } from '@/data/navigation'
import { cn } from '@/lib/utils'

type GlobalNavProps = {
  activeTab: HubTab
  onTabChange: (tab: HubTab) => void
}

export function GlobalNav({ activeTab, onTabChange }: GlobalNavProps) {
  return (
    <nav aria-label="Global navigation" className="hidden min-w-0 lg:block">
      <ul className="flex min-w-0 items-center gap-1">
        {hubTabs.map((tab) => (
          <li key={tab.id}>
            <Button
              aria-current={activeTab === tab.id ? 'page' : undefined}
              className={cn(
                'h-9 gap-2 px-3',
                activeTab === tab.id &&
                  'bg-blue-50 text-blue-700 hover:bg-blue-50 dark:bg-blue-950/40 dark:text-blue-200'
              )}
              onClick={() => onTabChange(tab.id)}
              type="button"
              variant="ghost"
            >
              {tab.label}
              {tab.status === 'soon' && (
                <Badge className="px-1.5 py-0 text-[10px]" variant="secondary">
                  Soon
                </Badge>
              )}
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
