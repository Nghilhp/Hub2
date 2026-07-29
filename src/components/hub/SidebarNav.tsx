import { Button } from '@/components/ui/button'
import { localSections } from '@/data/navigation'
import { cn } from '@/lib/utils'

type SidebarNavProps = {
  activeSection: string
  onSelect: (sectionId: string) => void
}

export function SidebarNav({ activeSection, onSelect }: SidebarNavProps) {
  return (
    <nav aria-label="UI Principle sections" className="space-y-1">
      {localSections.map((section) => (
        <Button
          aria-current={activeSection === section.id ? 'location' : undefined}
          className={cn(
            'h-auto w-full justify-start rounded-md px-3 py-2 text-left text-sm font-normal leading-5',
            activeSection === section.id
              ? 'bg-blue-50 text-blue-700 hover:bg-blue-50 dark:bg-blue-950/40 dark:text-blue-200'
              : 'text-muted-foreground hover:text-foreground'
          )}
          key={section.id}
          onClick={() => onSelect(section.id)}
          type="button"
          variant="ghost"
        >
          {section.label}
        </Button>
      ))}
    </nav>
  )
}
