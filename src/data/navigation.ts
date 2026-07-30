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
  { id: 'introduction', label: 'Giới thiệu' },
  { id: 'goal', label: 'Mục tiêu' },
  { id: 'definition-and-scope', label: 'Định nghĩa và phạm vi' },
  {
    id: 'information-priority-levels',
    label: 'Phân loại mức độ ưu tiên thông tin',
  },
  { id: 'how-to-use-this-framework', label: 'Cách sử dụng framework này' },
  { id: 'related-guidelines', label: 'Guideline liên quan' },
  { id: 'design-review-checklist', label: 'Checklist review thiết kế' },
]
