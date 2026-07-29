import { LogOut, Menu, Search, UserRound } from 'lucide-react'

import { GlobalNav } from '@/components/hub/GlobalNav'
import { SidebarNav } from '@/components/hub/SidebarNav'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { hubTabs, type HubTab } from '@/data/navigation'
import { cn } from '@/lib/utils'

type HeaderProps = {
  activeTab: HubTab
  activeSection: string
  onLogout: () => void
  onSectionSelect: (sectionId: string) => void
  onTabChange: (tab: HubTab) => void
}

export function Header({
  activeTab,
  activeSection,
  onLogout,
  onSectionSelect,
  onTabChange,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/85">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <Sheet>
          <SheetTrigger
            className="lg:hidden"
            render={
              <Button aria-label="Open section navigation" size="icon" variant="ghost" />
            }
          >
            <Menu />
          </SheetTrigger>
          <SheetContent className="w-[86vw] max-w-sm" side="left">
            <SheetHeader>
              <SheetTitle>ZaloPay UI Hub</SheetTitle>
              <SheetDescription>Navigate UI Principle sections.</SheetDescription>
            </SheetHeader>
            <div className="border-t px-3 py-4">
              <SidebarNav
                activeSection={activeSection}
                onSelect={onSectionSelect}
              />
            </div>
          </SheetContent>
        </Sheet>

        <button
          className="flex shrink-0 items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          onClick={() => onTabChange('ui-principle')}
          type="button"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-semibold text-white">
            ZP
          </span>
          <span className="hidden text-sm font-semibold sm:inline">
            ZaloPay UI Hub
          </span>
        </button>

        <GlobalNav activeTab={activeTab} onTabChange={onTabChange} />

        <div className="ml-auto hidden w-full max-w-xs items-center lg:flex">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              aria-label="Search UI Hub"
              className="pl-8"
              placeholder="Search guidelines..."
              type="search"
            />
          </div>
        </div>

        <div className="flex min-w-0 items-center gap-2 lg:hidden">
          <select
            aria-label="Global navigation"
            className="h-9 max-w-[44vw] rounded-lg border bg-background px-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            onChange={(event) => onTabChange(event.target.value as HubTab)}
            value={activeTab}
          >
            {hubTabs.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.label}
              </option>
            ))}
          </select>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                aria-label="Open user menu"
                className="shrink-0"
                size="icon"
                variant="outline"
              />
            }
          >
            <UserRound />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <span className="block text-foreground">Product Team</span>
              <span className="font-normal">uihub@zalopay.vn</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className={cn('cursor-pointer text-destructive')}
              onClick={onLogout}
            >
              <LogOut />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
