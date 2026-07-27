import React, { useEffect, useMemo, useState } from "react"
import { jsonRequest } from "../lib/http"

const SORT_OPTIONS = [
  { value: "date_asc", label: "Date: nearest first" },
  { value: "date_desc", label: "Date: farthest first" },
  { value: "name_asc", label: "Name: A → Z" },
  { value: "name_desc", label: "Name: Z → A" },
  { value: "recently_added", label: "Recently added" }
]

function buildQuery(filters) {
  const params = new URLSearchParams()

  if (filters.q.trim()) params.set("q", filters.q.trim())
  if (filters.location) params.set("location", filters.location)
  if (filters.from_date) params.set("from_date", filters.from_date)
  if (filters.to_date) params.set("to_date", filters.to_date)
  if (filters.sort) params.set("sort", filters.sort)

  return params.toString()
}

export default function ConferenceHubApp() {
  const [filters, setFilters] = useState({ q: "", location: "", from_date: "", to_date: "", sort: "date_asc" })
  const [conferences, setConferences] = useState([])
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    let ignore = false
    const controller = new AbortController()

    const timeoutId = setTimeout(async () => {
      setLoading(true)
      setError("")

      try {
        const query = buildQuery(filters)
        const data = await jsonRequest(`/api/conferences${query ? `?${query}` : ""}`, {
          signal: controller.signal
        })

        if (!ignore) {
          setConferences(data.conferences || [])
          setLocations(data.available_locations || [])
        }
      } catch (requestError) {
        if (!ignore && requestError.name !== "AbortError") {
          setError(requestError.message)
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }, 250)

    return () => {
      ignore = true
      controller.abort()
      clearTimeout(timeoutId)
    }
  }, [filters])

  const stats = useMemo(() => {
    if (!conferences.length) return "No conferences found"
    const minDate = conferences.map((item) => item.starts_on).sort()[0]
    const maxDate = conferences.map((item) => item.ends_on).sort().reverse()[0]
    return `${conferences.length} conference(s), range: ${minDate} → ${maxDate}`
  }, [conferences])

  return (
    <div className="space-y-4">
      <div className="panel space-y-4">
        <div className="grid gap-3 md:grid-cols-5">
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Search</label>
            <input
              className="input"
              placeholder="name, location, description..."
              value={filters.q}
              onChange={(event) => setFilters((prev) => ({ ...prev, q: event.target.value }))}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Location</label>
            <select
              className="input"
              value={filters.location}
              onChange={(event) => setFilters((prev) => ({ ...prev, location: event.target.value }))}
            >
              <option value="">All</option>
              {locations.map((location) => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">From</label>
            <input
              type="date"
              className="input"
              value={filters.from_date}
              onChange={(event) => setFilters((prev) => ({ ...prev, from_date: event.target.value }))}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">To</label>
            <input
              type="date"
              className="input"
              value={filters.to_date}
              onChange={(event) => setFilters((prev) => ({ ...prev, to_date: event.target.value }))}
            />
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label className="text-sm font-medium text-slate-700">Sort</label>
            <select
              className="input"
              value={filters.sort}
              onChange={(event) => setFilters((prev) => ({ ...prev, sort: event.target.value }))}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              className="btn-ghost"
              onClick={() => setFilters({ q: "", location: "", from_date: "", to_date: "", sort: "date_asc" })}
            >
              Reset filters
            </button>
          </div>

          <div className="flex items-end text-sm text-slate-600">{loading ? "Loading..." : stats}</div>
        </div>

        {error && <div className="rounded-xl border border-rosepastel-300 bg-rosepastel-100 px-4 py-3 text-rosepastel-500">{error}</div>}
      </div>

      <ul className="grid list-none gap-4 p-0 sm:grid-cols-2">
        {conferences.map((conference) => (
          <li key={conference.id} className="panel">
            <h2 className="mb-2 text-xl">
              <a href={`/conferences/${conference.id}`} className="no-underline hover:underline">{conference.name}</a>
            </h2>
            <p className="mb-2 text-sm text-slate-700"><span className="font-semibold text-slate-900">{conference.location}</span></p>
            <p className="mb-2 text-sm text-slate-600">{conference.starts_on} → {conference.ends_on} ({conference.duration_days} day(s))</p>
            {conference.website_url && (
              <p className="mb-2 text-sm"><a href={conference.website_url} target="_blank" rel="noopener noreferrer">Website</a></p>
            )}
            {conference.description && (
              <p className="text-sm text-slate-700">{conference.description}</p>
            )}
            <p className="mt-3 text-xs text-slate-500">Bookmarks: {conference.bookmarks_count}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
