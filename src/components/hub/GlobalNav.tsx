import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { hubTabs, type HubTab } from '@/data/navigation'
import { cn } from '@/lib/utils'

type GlobalNavProps = {
  activeTab: HubTab
  onTabChange: (tab: HubTab) => void
}

type IndicatorStyle = {
  left: number
  width: number
}

export function GlobalNav({ activeTab, onTabChange }: GlobalNavProps) {
  const listRef = useRef<HTMLUListElement>(null)
  const tabRefs = useRef(new Map<HubTab, HTMLLIElement>())
  const [indicatorStyle, setIndicatorStyle] = useState<IndicatorStyle>({
    left: 0,
    width: 0,
  })

  useEffect(() => {
    function updateIndicator() {
      const listElement = listRef.current
      const activeElement = tabRefs.current.get(activeTab)

      if (!listElement || !activeElement) {
        return
      }

      const listRect = listElement.getBoundingClientRect()
      const activeRect = activeElement.getBoundingClientRect()

      setIndicatorStyle({
        left: activeRect.left - listRect.left,
        width: activeRect.width,
      })
    }

    updateIndicator()
    window.addEventListener('resize', updateIndicator)
    return () => window.removeEventListener('resize', updateIndicator)
  }, [activeTab])

  return (
    <nav aria-label="Global navigation" className="hidden min-w-0 lg:block">
      <ul
        className="hub-global-tabs relative flex min-w-0 items-center gap-1"
        ref={listRef}
      >
        <span
          aria-hidden="true"
          className="hub-global-tabs-indicator"
          style={{
            opacity: indicatorStyle.width > 0 ? 1 : 0,
            transform: `translate3d(${indicatorStyle.left}px, 0, 0)`,
            width: indicatorStyle.width,
          }}
        />
        {hubTabs.map((tab) => (
          <li
            key={tab.id}
            ref={(element) => {
              if (element) {
                tabRefs.current.set(tab.id, element)
              } else {
                tabRefs.current.delete(tab.id)
              }
            }}
          >
            <Button
              aria-current={activeTab === tab.id ? 'page' : undefined}
              className={cn(
                'relative z-10 h-9 bg-transparent px-3 transition-colors duration-150 ease-out hover:bg-transparent hover:text-[#0033C9] dark:hover:text-blue-200',
                activeTab === tab.id &&
                  'text-[#0033C9] hover:bg-transparent dark:text-blue-200'
              )}
              onClick={() => onTabChange(tab.id)}
              type="button"
              variant="ghost"
            >
              {tab.label}
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
