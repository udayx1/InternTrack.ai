import React from 'react'
import clsx from 'clsx'
import { LucideIcon } from 'lucide-react'

// -----------------------------------------------------------------------------
// Button
// -----------------------------------------------------------------------------

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
  isLoading?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm',
  secondary: 'bg-white text-ink-700 border border-ink-300/40 hover:bg-surface-muted',
  ghost: 'bg-transparent text-ink-700 hover:bg-surface-muted',
  danger: 'bg-red-600 text-white hover:bg-red-700',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'text-sm px-3 py-1.5 gap-1.5',
  md: 'text-sm px-4 py-2.5 gap-2',
  lg: 'text-base px-5 py-3 gap-2',
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  isLoading,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'focus-ring inline-flex items-center justify-center rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="h-4 w-4" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="h-4 w-4" />}
        </>
      )}
    </button>
  )
}

// -----------------------------------------------------------------------------
// Card
// -----------------------------------------------------------------------------

export function Card({ className, children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx('rounded-2xl border border-ink-300/25 bg-white p-6 shadow-card', className)}
      {...rest}
    >
      {children}
    </div>
  )
}

// -----------------------------------------------------------------------------
// Badge
// -----------------------------------------------------------------------------

type BadgeTone = 'brand' | 'green' | 'amber' | 'red' | 'gray'

const badgeTones: Record<BadgeTone, string> = {
  brand: 'bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-200',
  green: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200',
  amber: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200',
  red: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-200',
  gray: 'bg-ink-900/5 text-ink-500 ring-1 ring-inset ring-ink-300/40',
}

export function Badge({ tone = 'gray', children }: { tone?: BadgeTone; children: React.ReactNode }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        badgeTones[tone],
      )}
    >
      {children}
    </span>
  )
}

// -----------------------------------------------------------------------------
// StatCard
// -----------------------------------------------------------------------------

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
}: {
  label: string
  value: string | number
  icon: LucideIcon
  hint?: string
}) {
  return (
    <Card className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm text-ink-500">{label}</p>
        <p className="mt-1.5 text-2xl font-semibold text-ink-900">{value}</p>
        {hint && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
      </div>
      <div className="rounded-xl bg-brand-50 p-2.5 text-brand-600">
        <Icon className="h-5 w-5" />
      </div>
    </Card>
  )
}

// -----------------------------------------------------------------------------
// Progress bar
// -----------------------------------------------------------------------------

export function ProgressBar({ value, tone = 'brand' }: { value: number; tone?: 'brand' | 'green' | 'amber' | 'red' }) {
  const toneClasses: Record<string, string> = {
    brand: 'bg-brand-500',
    green: 'bg-emerald-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
  }
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-ink-900/5">
      <div
        className={clsx('h-full rounded-full transition-all', toneClasses[tone])}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}

// -----------------------------------------------------------------------------
// Score ring (compact circular score indicator)
// -----------------------------------------------------------------------------

export function ScoreRing({ score, size = 96 }: { score: number; size?: number }) {
  const stroke = 8
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const tone = score >= 80 ? '#16a34a' : score >= 60 ? '#d97706' : '#dc2626'

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#eef0fa" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={tone}
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        className="rotate-90"
        style={{ transform: 'rotate(90deg)', transformOrigin: 'center', fill: '#14152b', fontSize: size * 0.22, fontWeight: 700 }}
      >
        {score}%
      </text>
    </svg>
  )
}
