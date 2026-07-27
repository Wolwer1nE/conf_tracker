import React from "react"
import { createRoot } from "react-dom/client"
import ConferenceHubApp from "./components/ConferenceHubApp"

function mountConferenceHub() {
  const rootElement = document.getElementById("conferences-hub-root")
  if (!rootElement || rootElement.dataset.mounted === "true") return

  const root = createRoot(rootElement)
  root.render(<ConferenceHubApp />)
  rootElement.dataset.mounted = "true"
}

document.addEventListener("turbo:load", mountConferenceHub)
mountConferenceHub()
