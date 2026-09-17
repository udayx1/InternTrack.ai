import React, { useEffect, useState } from 'react'
import { Pencil, Save, X, Plus } from 'lucide-react'
import { Badge, Button, Card } from '@/components/ui'
import { ErrorState, LoadingState } from '@/components/States'
import { userService } from '@/services/userService'
import { Profile } from '@/types'

export default function CareerProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [status, setStatus] = useState<'loading' | 'error' | 'ready'>('loading')
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState<Profile | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [skillInput, setSkillInput] = useState('')

  async function load() {
    setStatus('loading')
    try {
      const data = await userService.getProfile()
      setProfile(data)
      setStatus('ready')
    } catch {
      setStatus('error')
    }
  }

  useEffect(() => {
    load()
  }, [])

  function startEditing() {
    if (!profile) return
    setDraft(structuredClone(profile))
    setIsEditing(true)
  }

  function cancelEditing() {
    setDraft(null)
    setIsEditing(false)
  }

  async function saveChanges() {
    if (!draft) return
    setIsSaving(true)
    try {
      const updated = await userService.updateProfile(draft)
      setProfile(updated)
      setIsEditing(false)
      setDraft(null)
    } finally {
      setIsSaving(false)
    }
  }

  function addSkill() {
    if (!draft || !skillInput.trim()) return
    setDraft({ ...draft, skills: [...draft.skills, skillInput.trim()] })
    setSkillInput('')
  }

  function removeSkill(skill: string) {
    if (!draft) return
    setDraft({ ...draft, skills: draft.skills.filter((s) => s !== skill) })
  }

  if (status === 'loading') return <LoadingState label="Loading your profile…" />
  if (status === 'error' || !profile) return <ErrorState onRetry={load} />

  const view = isEditing && draft ? draft : profile

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink-900">Career Profile</h1>
          <p className="mt-1 text-sm text-ink-500">This powers your resume analysis and job match scoring.</p>
        </div>
        {isEditing ? (
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" icon={X} onClick={cancelEditing}>
              Cancel
            </Button>
            <Button size="sm" icon={Save} isLoading={isSaving} onClick={saveChanges}>
              Save
            </Button>
          </div>
        ) : (
          <Button variant="secondary" size="sm" icon={Pencil} onClick={startEditing}>
            Edit profile
          </Button>
        )}
      </div>

      <Card>
        <h2 className="mb-4 font-semibold text-ink-900">Personal Information</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" value={view.fullName} editing={isEditing} onChange={(v) => draft && setDraft({ ...draft, fullName: v })} />
          <Field label="Headline" value={view.headline} editing={isEditing} onChange={(v) => draft && setDraft({ ...draft, headline: v })} />
          <Field label="Phone" value={view.phone ?? ''} editing={isEditing} onChange={(v) => draft && setDraft({ ...draft, phone: v })} />
          <Field label="Location" value={view.location ?? ''} editing={isEditing} onChange={(v) => draft && setDraft({ ...draft, location: v })} />
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 font-semibold text-ink-900">Education</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="University"
            value={view.education.university}
            editing={isEditing}
            onChange={(v) => draft && setDraft({ ...draft, education: { ...draft.education, university: v } })}
          />
          <Field
            label="Degree"
            value={view.education.degree}
            editing={isEditing}
            onChange={(v) => draft && setDraft({ ...draft, education: { ...draft.education, degree: v } })}
          />
          <Field
            label="Branch"
            value={view.education.branch}
            editing={isEditing}
            onChange={(v) => draft && setDraft({ ...draft, education: { ...draft.education, branch: v } })}
          />
          <Field
            label="Graduation year"
            value={String(view.education.graduationYear)}
            editing={isEditing}
            onChange={(v) =>
              draft && setDraft({ ...draft, education: { ...draft.education, graduationYear: Number(v) || draft.education.graduationYear } })
            }
          />
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 font-semibold text-ink-900">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {view.skills.map((skill) => (
            <span key={skill}>
              {isEditing ? (
                <Badge tone="brand">
                  <span className="flex items-center gap-1">
                    {skill}
                    <button onClick={() => removeSkill(skill)} aria-label={`Remove ${skill}`}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                </Badge>
              ) : (
                <Badge tone="brand">{skill}</Badge>
              )}
            </span>
          ))}
        </div>
        {isEditing && (
          <div className="mt-3 flex gap-2">
            <input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              placeholder="Add a skill"
              className="focus-ring w-48 rounded-lg border border-ink-300/40 px-3 py-2 text-sm"
            />
            <Button type="button" variant="secondary" size="sm" icon={Plus} onClick={addSkill}>
              Add
            </Button>
          </div>
        )}
      </Card>

      <Card>
        <h2 className="mb-4 font-semibold text-ink-900">Projects</h2>
        <div className="flex flex-col gap-4">
          {view.projects.map((p) => (
            <div key={p.id} className="rounded-xl border border-ink-300/20 p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium text-ink-900">{p.title}</p>
                {p.link && (
                  <a href={p.link} target="_blank" rel="noreferrer" className="text-xs text-brand-600 hover:text-brand-700">
                    View
                  </a>
                )}
              </div>
              <p className="mt-1 text-sm text-ink-500">{p.description}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {p.techStack.map((t) => (
                  <Badge key={t}>{t}</Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 font-semibold text-ink-900">Career Preferences</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-medium text-ink-500">Preferred roles</p>
            <div className="flex flex-wrap gap-2">
              {view.preferences.preferredRoles.map((r) => (
                <Badge key={r}>{r}</Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-ink-500">Preferred locations</p>
            <div className="flex flex-wrap gap-2">
              {view.preferences.preferredLocations.map((l) => (
                <Badge key={l}>{l}</Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

function Field({
  label,
  value,
  editing,
  onChange,
}: {
  label: string
  value: string
  editing: boolean
  onChange: (value: string) => void
}) {
  return (
    <label className="block text-sm font-medium text-ink-700">
      {label}
      {editing ? (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="focus-ring mt-1.5 w-full rounded-lg border border-ink-300/40 px-3 py-2.5 text-sm"
        />
      ) : (
        <p className="mt-1.5 text-sm font-normal text-ink-900">{value || '—'}</p>
      )}
    </label>
  )
}
