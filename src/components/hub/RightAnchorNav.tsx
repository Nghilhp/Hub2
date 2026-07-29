import { localSections } from '@/data/navigation'
import { uiPrinciples } from '@/data/ui-principles'
import { cn } from '@/lib/utils'

type RightAnchorNavProps = {
  activeSection: string
  onSelect: (sectionId: string) => void
}

export function RightAnchorNav({
  activeSection,
  onSelect,
}: RightAnchorNavProps) {
  return (
    <aside
      aria-label="On this page"
      className="hidden xl:block xl:w-64 xl:shrink-0"
    >
      <div className="sticky top-20 space-y-6">
        <div>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-normal text-muted-foreground">
            On this page
          </h2>
          <nav className="space-y-1">
            {localSections.map((section) => (
              <button
                className={cn(
                  'block w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
                  activeSection === section.id
                    ? 'font-medium text-blue-700 dark:text-blue-200'
                    : 'text-muted-foreground'
                )}
                key={section.id}
                onClick={() => onSelect(section.id)}
                type="button"
              >
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        <div>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-normal text-muted-foreground">
            Principles
          </h2>
          <ol className="space-y-2 text-sm text-muted-foreground">
            {uiPrinciples.map((principle) => (
              <li className="flex gap-2" key={principle.number}>
                <span className="tabular-nums text-blue-700 dark:text-blue-200">
                  {principle.number}.
                </span>
                <span>{principle.title}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </aside>
  )
}
