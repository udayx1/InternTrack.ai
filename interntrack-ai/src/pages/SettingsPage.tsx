import React, { useEffect, useState } from 'react'
import { Save } from 'lucide-react'
import { Button, Card } from '@/components/ui'
import { ErrorState, LoadingState } from '@/components/States'
import { userService } from '@/services/userService'
import { AccountSettings } from '@/types'

export default function SettingsPage() {
  const [settings, setSettings] = useState<AccountSettings | null>(null)
  const [status, setStatus] = useState<'loading' | 'error' | 'ready'>('loading')
  const [saved, setSaved] = useState(false)

  async function load() {
    setStatus('loading')
    try {
      const data = await userService.getSettings()
      setSettings(data)
      setStatus('ready')
    } catch {
      setStatus('error')
    }
  }

  useEffect(() => {
    load()
  }, [])

  function toggle(key: keyof AccountSettings['notifications']) {
    if (!settings) return
    setSettings({
      ...settings,
      notifications: { ...settings.notifications, [key]: !settings.notifications[key] },
    })
    setSaved(false)
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (status === 'loading') return <LoadingState label="Loading settings…" />
  if (status === 'error' || !settings) return <ErrorState onRetry={load} />

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink-900">Settings</h1>
        <p className="mt-1 text-sm text-ink-500">Manage your account, notifications and career preferences.</p>
      </div>

      <Card>
        <h2 className="mb-4 font-semibold text-ink-900">Account</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-ink-400">Name</p>
            <p className="mt-1 text-sm text-ink-900">{settings.user.name}</p>
          </div>
          <div>
            <p className="text-xs text-ink-400">Email</p>
            <p className="mt-1 text-sm text-ink-900">{settings.user.email}</p>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 font-semibold text-ink-900">Notification Preferences</h2>
        <div className="flex flex-col divide-y divide-ink-300/15">
          <ToggleRow
            label="Deadline reminders"
            description="Get notified before application deadlines."
            checked={settings.notifications.deadlineReminders}
            onChange={() => toggle('deadlineReminders')}
          />
          <ToggleRow
            label="Weekly digest"
            description="A weekly summary of your applications and progress."
            checked={settings.notifications.weeklyDigest}
            onChange={() => toggle('weeklyDigest')}
          />
          <ToggleRow
            label="AI insight alerts"
            description="Get notified when a new AI career insight is available."
            checked={settings.notifications.aiInsightAlerts}
            onChange={() => toggle('aiInsightAlerts')}
          />
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 font-semibold text-ink-900">Career Preferences</h2>
        <p className="text-sm text-ink-500">
          Preferred roles and locations can be edited from your{' '}
          <span className="font-medium text-ink-800">Career Profile</span>.
        </p>
      </Card>

      <div className="flex items-center gap-3">
        <Button icon={Save} onClick={handleSave}>
          Save changes
        </Button>
        {saved && <span className="text-sm text-emerald-600">Settings saved</span>}
      </div>
    </div>
  )
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <div className="flex items-center justify-between py-3.5">
      <div>
        <p className="text-sm font-medium text-ink-900">{label}</p>
        <p className="text-xs text-ink-500">{description}</p>
      </div>
      <button
        onClick={onChange}
        className={`focus-ring relative h-6 w-11 rounded-full transition-colors ${
          checked ? 'bg-brand-600' : 'bg-ink-300/50'
        }`}
        aria-pressed={checked}
        aria-label={label}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  )
}
