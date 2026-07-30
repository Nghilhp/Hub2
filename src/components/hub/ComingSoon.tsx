import { ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'

type ComingSoonProps = {
  onOpenUIPrinciple: () => void
  title: string
}

export function ComingSoon({ onOpenUIPrinciple, title }: ComingSoonProps) {
  return (
    <main className="min-h-[calc(100svh-4rem)] bg-background">
      <section className="mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-[760px] items-center justify-center px-6 py-20">
        <div className="flex w-full flex-col items-center text-center">
          <div
            aria-hidden="true"
            className="hub-construction-illustration"
          >
            <svg
              className="hub-construction-scene"
              fill="none"
              viewBox="0 0 320 176"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                className="hub-construction-grid"
                height="120"
                rx="24"
                width="220"
                x="50"
                y="24"
              />
              <path
                className="hub-construction-shadow"
                d="M80 143C103 134 214 134 240 143C251 147 249 154 235 157C196 166 111 165 82 157C68 153 67 148 80 143Z"
              />
              <g className="hub-construction-board">
                <rect
                  className="hub-construction-board-face"
                  height="58"
                  rx="12"
                  width="136"
                  x="92"
                  y="58"
                />
                <path
                  className="hub-construction-stripe"
                  d="M104 75H216"
                />
                <path
                  className="hub-construction-stripe hub-construction-stripe-two"
                  d="M104 96H216"
                />
                <path
                  className="hub-construction-board-leg"
                  d="M126 116L112 146"
                />
                <path
                  className="hub-construction-board-leg"
                  d="M194 116L208 146"
                />
              </g>
              <g className="hub-construction-worker">
                <circle
                  className="hub-construction-head"
                  cx="160"
                  cy="48"
                  r="15"
                />
                <path
                  className="hub-construction-helmet"
                  d="M141 48C143 36 150 29 160 29C171 29 178 36 180 48H141Z"
                />
                <path
                  className="hub-construction-helmet-line"
                  d="M151 34V47M169 34V47"
                />
              </g>
              <g className="hub-construction-cone">
                <path d="M55 140L72 93L89 140H55Z" />
                <path d="M65 113H79" />
                <path d="M60 128H84" />
                <rect height="9" rx="4" width="48" x="48" y="138" />
              </g>
              <g className="hub-construction-dots">
                <circle cx="62" cy="52" r="5" />
                <circle cx="250" cy="62" r="4" />
                <circle cx="238" cy="110" r="6" />
              </g>
              <g className="hub-construction-spark">
                <path d="M247 35V53" />
                <path d="M238 44H256" />
              </g>
            </svg>
          </div>
          <h1 className="mt-8 font-sf-pro-display text-4xl font-semibold leading-tight tracking-normal text-foreground">
            {title}
          </h1>
          <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
            Khu vực này đang được hoàn thiện. Nội dung sẽ sớm được cập nhật để
            hỗ trợ team trong quá trình thiết kế, phát triển và cộng tác.
          </p>
          <Button
            className="mt-8 gap-2 border-[#CFE4FF] bg-white text-[#0033C9] hover:bg-[#F1F7FF] dark:border-blue-400/30 dark:bg-background dark:text-blue-200 dark:hover:bg-blue-950/40"
            onClick={onOpenUIPrinciple}
            type="button"
            variant="outline"
          >
            Xem UI Principles
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </section>
    </main>
  )
}
