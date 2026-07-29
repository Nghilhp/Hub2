export type HubTab = 'ui-principle' | 'ux-patterns' | 'design-system' | 'knowledge-hub'

export type NavItem = {
  id: string
  label: string
}

export type HubTabItem = {
  id: HubTab
  label: string
  status: 'ready' | 'soon'
}

export const hubTabs: HubTabItem[] = [
  { id: 'ui-principle', label: 'UI Principle', status: 'ready' },
  { id: 'ux-patterns', label: 'UX Patterns', status: 'soon' },
  { id: 'design-system', label: 'Design System', status: 'soon' },
  { id: 'knowledge-hub', label: 'Knowledge Hub', status: 'soon' },
]

export const localSections: NavItem[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'goal', label: 'Goal' },
  { id: 'definition-and-scope', label: 'Definition and Scope' },
  { id: 'information-priority-levels', label: 'Information Priority Levels' },
  { id: 'how-to-use-this-framework', label: 'How to Use This Framework' },
  { id: 'ui-principles', label: 'UI Principles' },
  { id: 'related-guidelines', label: 'Related Guidelines' },
  { id: 'design-review-checklist', label: 'Design Review Checklist' },
]
