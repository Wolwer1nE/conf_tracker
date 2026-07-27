export function csrfToken() {
  return document.querySelector("meta[name='csrf-token']")?.getAttribute("content")
}

export async function jsonRequest(url, options = {}) {
  const response = await fetch(url, {
    credentials: "same-origin",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken(),
      ...(options.headers || {})
    },
    ...options
  })

  const contentType = response.headers.get("content-type") || ""
  const isJson = contentType.includes("application/json")
  const payload = isJson ? await response.json() : null

  if (!response.ok) {
    const errorMessage = payload?.error || payload?.errors?.join(", ") || `Request failed with status ${response.status}`
    throw new Error(errorMessage)
  }

  return payload
}
