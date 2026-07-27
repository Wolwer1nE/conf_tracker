import React, { useEffect, useState } from "react"
import { jsonRequest } from "../lib/http"

const EMPTY_FORM = {
  name: "",
  location: "",
  starts_on: "",
  ends_on: "",
  website_url: "",
  description: ""
}

function normalizeConference(conference) {
  return {
    id: conference.id,
    name: conference.name || "",
    location: conference.location || "",
    starts_on: conference.starts_on || "",
    ends_on: conference.ends_on || "",
    website_url: conference.website_url || "",
    description: conference.description || ""
  }
}

export default function AdminSpaApp() {
  const [conferences, setConferences] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")

  const loadConferences = async () => {
    setLoading(true)
    setError("")

    try {
      const data = await jsonRequest("/api/admin/conferences")
      setConferences((data.conferences || []).map(normalizeConference))
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadConferences()
  }, [])

  const onSubmit = async (event) => {
    event.preventDefault()
    setError("")
    setNotice("")

    const payload = { conference: form }

    try {
      if (editingId) {
        await jsonRequest(`/api/admin/conferences/${editingId}`, {
          method: "PATCH",
          body: JSON.stringify(payload)
        })
        setNotice("Conference updated")
      } else {
        await jsonRequest("/api/admin/conferences", {
          method: "POST",
          body: JSON.stringify(payload)
        })
        setNotice("Conference created")
      }

      setForm(EMPTY_FORM)
      setEditingId(null)
      await loadConferences()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const onEdit = (conference) => {
    setEditingId(conference.id)
    setForm({
      name: conference.name,
      location: conference.location,
      starts_on: conference.starts_on,
      ends_on: conference.ends_on,
      website_url: conference.website_url,
      description: conference.description
    })
    setNotice("")
    setError("")
  }

  const onDelete = async (conferenceId) => {
    if (!window.confirm("Delete this conference?")) return

    setError("")
    setNotice("")

    try {
      await jsonRequest(`/api/admin/conferences/${conferenceId}`, { method: "DELETE" })
      setNotice("Conference deleted")
      if (editingId === conferenceId) {
        setEditingId(null)
        setForm(EMPTY_FORM)
      }
      await loadConferences()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <div className="panel lg:col-span-2">
        <h2 className="mb-4 text-xl">{editingId ? "Edit conference" : "Add conference"}</h2>

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="text-sm font-medium text-slate-700">Name</label>
            <input className="input" value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} required />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Location</label>
            <input className="input" value={form.location} onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))} required />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700">Starts on</label>
              <input type="date" className="input" value={form.starts_on} onChange={(event) => setForm((prev) => ({ ...prev, starts_on: event.target.value }))} required />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Ends on</label>
              <input type="date" className="input" value={form.ends_on} onChange={(event) => setForm((prev) => ({ ...prev, ends_on: event.target.value }))} required />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Website URL</label>
            <input type="url" className="input" value={form.website_url} onChange={(event) => setForm((prev) => ({ ...prev, website_url: event.target.value }))} />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Description</label>
            <textarea className="input" rows={5} value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} />
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <button className="btn-primary" type="submit">{editingId ? "Save changes" : "Create conference"}</button>
            {editingId && (
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  setEditingId(null)
                  setForm(EMPTY_FORM)
                }}
              >
                Cancel edit
              </button>
            )}
          </div>
        </form>

        {notice && <div className="mt-3 rounded-xl border border-emerald-200 bg-mint-100 px-4 py-3 text-emerald-900">{notice}</div>}
        {error && <div className="mt-3 rounded-xl border border-rosepastel-300 bg-rosepastel-100 px-4 py-3 text-rosepastel-500">{error}</div>}
      </div>

      <div className="lg:col-span-3">
        <div className="panel">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl">Conference list</h2>
            <button type="button" className="btn-ghost" onClick={loadConferences} disabled={loading}>{loading ? "Refreshing..." : "Refresh"}</button>
          </div>

          <ul className="space-y-3">
            {conferences.map((conference) => (
              <li key={conference.id} className="rounded-xl border border-emerald-100 bg-white p-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">{conference.name}</h3>
                    <p className="text-sm text-slate-600">{conference.location} • {conference.starts_on} → {conference.ends_on}</p>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" className="btn-ghost" onClick={() => onEdit(conference)}>Edit</button>
                    <button type="button" className="btn-soft" onClick={() => onDelete(conference.id)}>Delete</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
