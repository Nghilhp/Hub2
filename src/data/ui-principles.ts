import { BRAND_NAME } from '@/data/brand'

export type PriorityLevel = {
  level: string
  title: string
  description: string
}

export type Principle = {
  number: number
  title: string
  vietnameseTitle?: string
  summary: string
  description: string
  guidelines: string[]
  dos?: string[]
  donts?: string[]
  examples?: string[]
}

export const priorityLevels: PriorityLevel[] = [
  {
    level: 'P0',
    title: 'Critical task and risk',
    description:
      'Primary user action, payment confirmation, account security, error prevention, and legal or compliance notice.',
  },
  {
    level: 'P1',
    title: 'Decision support',
    description:
      'Context, fee, status, eligibility, balance, and other information users need before deciding.',
  },
  {
    level: 'P2',
    title: 'Helpful detail',
    description:
      'Secondary explanation, tips, metadata, and content that supports confidence without blocking the task.',
  },
  {
    level: 'P3',
    title: 'Enhancement',
    description:
      'Decorative, promotional, or nice-to-have elements that must never compete with task-critical information.',
  },
]

export const uiPrinciples: Principle[] = [
  {
    number: 1,
    title: 'Clear Hierarchy',
    vietnameseTitle: 'Phân cấp rõ ràng',
    summary:
      'Make the most important content and action immediately recognizable.',
    description:
      'Users should know what screen they are on, what matters most, and what to do next without decoding the layout.',
    guidelines: [
      'Give the primary task one clear visual center.',
      'Use size, spacing, placement, and contrast to separate primary, secondary, and tertiary information.',
      'Keep high-risk information near the action it affects.',
      'Avoid competing CTAs with similar weight in the same decision area.',
    ],
    dos: [
      'Place payment amount, recipient, and confirmation action in a clear reading order.',
      'Use muted treatment for optional helper content.',
    ],
    donts: [
      'Make banners or cross-sell modules stronger than the task users came to finish.',
      'Use color alone to define importance.',
    ],
  },
  {
    number: 2,
    title: 'Structure and Clarity',
    vietnameseTitle: 'Cấu trúc và sự rõ nghĩa',
    summary:
      'Group related information so users can scan, compare, and understand state quickly.',
    description:
      'A strong structure reduces memory load. It helps product, design, and engineering teams make consistent decisions across complex financial flows.',
    guidelines: [
      'Group information by user decision, not by internal system ownership.',
      'Use concise section headings that describe the content below.',
      'Prefer predictable lists, tables, and cards over dense mixed layouts.',
      'Keep labels and values close enough to be read as a pair.',
    ],
    examples: [
      'Transaction detail can be grouped into Status, Payment method, Recipient, Fee, and Support.',
      'A settings screen should separate security, notification, and linked accounts.',
    ],
  },
  {
    number: 3,
    title: 'Consistent Experience',
    vietnameseTitle: 'Trải nghiệm nhất quán',
    summary:
      'Reuse patterns, language, components, and behavior across similar tasks.',
    description:
      `Consistency lets users transfer knowledge from one ${BRAND_NAME} journey to another. It also makes review faster because teams can focus on exceptions.`,
    guidelines: [
      'Use shared components for buttons, inputs, status, dialogs, and navigation.',
      'Keep naming consistent for the same concept across entry points.',
      'Use the same interaction pattern for similar risk levels.',
      'Document intentional exceptions and the reason behind them.',
    ],
    dos: [
      'Use the same confirmation pattern for comparable payment actions.',
      'Keep empty, loading, error, and success states aligned across features.',
    ],
    donts: [
      'Invent a custom control when a design-system component already covers the need.',
    ],
  },
  {
    number: 4,
    title: 'Action Clarity',
    vietnameseTitle: 'Hành động dễ hiểu',
    summary:
      'Every action should communicate what will happen, when it happens, and whether it can be undone.',
    description:
      'Financial products need explicit action language. Button text, placement, disabled states, and confirmation copy should remove ambiguity.',
    guidelines: [
      'Use verb-first labels that match the user outcome.',
      'Make destructive, irreversible, or money-moving actions visually and verbally explicit.',
      'Explain why an action is disabled when the reason is not obvious.',
      'Keep secondary actions available without distracting from the primary path.',
    ],
    examples: [
      'Use “Confirm payment” instead of “OK” for payment confirmation.',
      'Use “Remove bank account” instead of “Delete” when the object matters.',
    ],
  },
  {
    number: 5,
    title: 'Feedback and System Status',
    vietnameseTitle: 'Phản hồi và trạng thái hệ thống',
    summary:
      'Always show users what the system is doing and what changed after an action.',
    description:
      'Users need confidence during asynchronous tasks such as payment processing, linking accounts, OTP validation, and dispute submission.',
    guidelines: [
      'Show loading, progress, success, empty, error, and retry states intentionally.',
      'Keep feedback close to the action or object it belongs to.',
      'Use plain language for errors and include the next available step.',
      'Avoid silent failures or sudden state changes without explanation.',
    ],
    dos: [
      'Show pending payment status with a timestamp and refresh affordance.',
      'Preserve user input after validation errors when possible.',
    ],
  },
  {
    number: 6,
    title: `${BRAND_NAME} Identity in UI`,
    vietnameseTitle: `Bản sắc ${BRAND_NAME} trong giao diện`,
    summary:
      'Express the brand through purposeful color, tone, motion, and trust signals.',
    description:
      `Brand identity should support usability. It should make important ${BRAND_NAME} moments recognizable without weakening readability or trust.`,
    guidelines: [
      `Use ${BRAND_NAME}-inspired blue as an accent for focus, selection, and primary moments.`,
      'Keep illustration, icon, and motion aligned with the task context.',
      'Balance product personality with clarity in financial decisions.',
      'Use brand elements to reinforce trust, not to decorate every surface.',
    ],
    donts: [
      'Use heavy gradients or decorative color that competes with content.',
      'Let brand expression reduce contrast or accessibility.',
    ],
  },
  {
    number: 7,
    title: 'Accessibility and Adaptability',
    vietnameseTitle: 'Khả năng tiếp cận và thích ứng',
    summary:
      'Design for different devices, contexts, abilities, and language lengths.',
    description:
      'A usable interface remains clear when text expands, viewport changes, network is slow, or users rely on keyboard and assistive technology.',
    guidelines: [
      'Maintain readable contrast for text, controls, and state indicators.',
      'Support keyboard focus, screen-reader labels, and visible focus states.',
      'Design responsive layouts without horizontal scroll or overlapping content.',
      'Plan for Vietnamese and English strings with different lengths.',
    ],
    dos: [
      'Use semantic headings and landmarks for documentation and product screens.',
      'Test common flows on small mobile widths.',
    ],
  },
  {
    number: 8,
    title: 'Trust and Safety',
    vietnameseTitle: 'Tin cậy và an toàn',
    summary:
      'Reduce risk, prevent mistakes, and make sensitive flows transparent.',
    description:
      'Trust is a product quality. UI should protect users before errors happen and help them recover when something goes wrong.',
    guidelines: [
      'Surface fee, recipient, amount, and risk information before final confirmation.',
      'Use confirmation only when it genuinely protects users from meaningful risk.',
      'Make support, dispute, and recovery paths easy to find after critical flows.',
      'Avoid dark patterns, hidden costs, and unclear opt-ins.',
    ],
    dos: [
      'Require explicit confirmation for money movement or security changes.',
      'Show masked sensitive data with clear reveal behavior when needed.',
    ],
    donts: [
      'Hide important constraints in tooltip-only content.',
      'Make cancellation, refund, or support paths unnecessarily hard to locate.',
    ],
  },
]

export const relatedGuidelines = [
  'Use shared status language for loading, pending, success, failed, and expired states.',
  'Review every money-moving flow against hierarchy, action clarity, feedback, and trust principles.',
  'Treat empty, error, disabled, and edge states as part of the designed experience.',
  'Escalate exceptions when a feature needs to break a shared pattern.',
]

export const reviewChecklist = [
  'Can users identify the main task and primary action within five seconds?',
  'Are amount, recipient, fee, and risk information visible before confirmation?',
  'Do disabled, loading, error, success, and empty states exist?',
  'Can the flow be completed on mobile without overlap or horizontal scroll?',
  `Are labels, terminology, and components consistent with nearby ${BRAND_NAME} flows?`,
  'Is there a clear recovery or support path for critical failures?',
]
