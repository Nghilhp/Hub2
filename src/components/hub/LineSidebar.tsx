import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import { ChevronDown } from 'lucide-react'

import './LineSidebar.css'

const falloffCurves = {
  linear: (progress: number) => progress,
  smooth: (progress: number) => progress * progress * (3 - 2 * progress),
  sharp: (progress: number) => progress * progress * progress,
}

type Falloff = keyof typeof falloffCurves

export type LineSidebarItem = {
  active?: boolean
  depth?: number
  expanded?: boolean
  indexLabel?: string
  key?: string
  label: string
  onToggle?: () => void
}

type LineSidebarProps = {
  accentColor?: string
  className?: string
  defaultActive?: number | null
  falloff?: Falloff
  fontSize?: number
  itemGap?: number
  items: Array<string | LineSidebarItem>
  markerColor?: string
  markerGap?: number
  markerLength?: number
  maxShift?: number
  onItemClick?: (index: number, label: string) => void
  proximityRadius?: number
  scaleTick?: boolean
  showIndex?: boolean
  showMarker?: boolean
  smoothing?: number
  textColor?: string
  tickScale?: number
}

export function LineSidebar({
  accentColor = '#0033C9',
  className = '',
  defaultActive = null,
  falloff = 'smooth',
  fontSize = 0.875,
  itemGap = 18,
  items,
  markerColor = '#CCD2D8',
  markerGap = 12,
  markerLength = 60,
  maxShift = 30,
  onItemClick,
  proximityRadius = 110,
  scaleTick = true,
  showIndex = false,
  showMarker = true,
  smoothing = 100,
  textColor = '#99A5B2',
  tickScale = 0.5,
}: LineSidebarProps) {
  const listRef = useRef<HTMLUListElement | null>(null)
  const itemRefs = useRef<Array<HTMLLIElement | null>>([])
  const targetsRef = useRef<number[]>([])
  const currentRef = useRef<number[]>([])
  const rafRef = useRef<number | null>(null)
  const lastRef = useRef(0)
  const activeRef = useRef(defaultActive)
  const smoothingRef = useRef(smoothing)
  const [activeIndex, setActiveIndex] = useState(defaultActive)
  const normalizedItems = useMemo(
    () =>
      items.map((item) =>
        typeof item === 'string'
          ? { label: item }
          : item
      ),
    [items]
  )

  activeRef.current = activeIndex
  smoothingRef.current = smoothing

  const runFrame = useCallback((now: number) => {
    const delta = Math.min((now - lastRef.current) / 1000, 0.05)
    lastRef.current = now
    const tau = Math.max(smoothingRef.current, 1) / 1000
    const weight = 1 - Math.exp(-delta / tau)

    let moving = false

    itemRefs.current.forEach((element, index) => {
      if (!element) {
        return
      }

      const target = Math.max(
        targetsRef.current[index] || 0,
        activeRef.current === index ? 1 : 0
      )
      const current = currentRef.current[index] || 0
      const next = current + (target - current) * weight
      const settled = Math.abs(target - next) < 0.0015
      const value = settled ? target : next

      currentRef.current[index] = value
      element.style.setProperty('--effect', value.toFixed(4))

      if (!settled) {
        moving = true
      }
    })

    rafRef.current = moving ? window.requestAnimationFrame(runFrame) : null
  }, [])

  const startLoop = useCallback(() => {
    if (rafRef.current !== null) {
      return
    }

    lastRef.current = performance.now()
    rafRef.current = window.requestAnimationFrame(runFrame)
  }, [runFrame])

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLUListElement>) => {
      const list = listRef.current

      if (!list) {
        return
      }

      const rect = list.getBoundingClientRect()
      const pointerY = event.clientY - rect.top
      const ease = falloffCurves[falloff] ?? falloffCurves.linear

      itemRefs.current.forEach((element, index) => {
        if (!element) {
          return
        }

        const center = element.offsetTop + element.offsetHeight / 2
        const distance = Math.abs(pointerY - center)
        targetsRef.current[index] = ease(
          Math.max(0, 1 - distance / proximityRadius)
        )
      })

      startLoop()
    },
    [falloff, proximityRadius, startLoop]
  )

  const handlePointerLeave = useCallback(() => {
    targetsRef.current = targetsRef.current.map(() => 0)
    startLoop()
  }, [startLoop])

  const handleClick = useCallback(
    (index: number, label: string) => {
      setActiveIndex(index)
      onItemClick?.(index, label)
    },
    [onItemClick]
  )

  useEffect(() => {
    setActiveIndex(defaultActive)
  }, [defaultActive])

  useEffect(() => {
    startLoop()
  }, [activeIndex, startLoop])

  useEffect(
    () => () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current)
      }
    },
    []
  )

  return (
    <nav
      className={`line-sidebar${showMarker ? ' line-sidebar--markers' : ''}${scaleTick ? ' line-sidebar--scale-tick' : ''}${className ? ` ${className}` : ''}`}
      style={{
        '--accent-color': accentColor,
        '--font-size': `${fontSize}rem`,
        '--item-gap': `${itemGap}px`,
        '--marker-color': markerColor,
        '--marker-gap': `${markerGap}px`,
        '--marker-length': `${markerLength}px`,
        '--max-shift': `${maxShift}px`,
        '--smoothing': `${smoothing}ms`,
        '--text-color': textColor,
        '--tick-scale': tickScale,
      } as React.CSSProperties}
    >
      <ul
        className="line-sidebar__list"
        onPointerLeave={handlePointerLeave}
        onPointerMove={handlePointerMove}
        ref={listRef}
      >
        {normalizedItems.map((item, index) => (
          <li
            aria-current={
              item.active || activeIndex === index ? 'true' : undefined
            }
            className="line-sidebar__item"
            data-depth={item.depth ?? 0}
            key={item.key ?? `${item.label}-${index}`}
            onClick={() => handleClick(index, item.label)}
            ref={(element) => {
              itemRefs.current[index] = element
            }}
            style={{
              '--item-depth': item.depth ?? 0,
            } as CSSProperties}
          >
            {showMarker && (
              <span aria-hidden="true" className="line-sidebar__marker" />
            )}
            <span className="line-sidebar__label">
              {showIndex && (
                <span className="line-sidebar__index">
                  {item.indexLabel ?? String(index + 1).padStart(2, '0')}
                </span>
              )}
              <span className="line-sidebar__text">{item.label}</span>
            </span>
            {item.onToggle && (
              <button
                aria-expanded={item.expanded}
                aria-label={`${item.label} collapse toggle`}
                className="line-sidebar__toggle"
                onClick={(event) => {
                  event.stopPropagation()
                  item.onToggle?.()
                }}
                type="button"
              >
                <ChevronDown
                  className={item.expanded ? 'rotate-180' : 'rotate-0'}
                />
              </button>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}
