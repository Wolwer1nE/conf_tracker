import React from "react"
import { createRoot } from "react-dom/client"
import AdminSpaApp from "./components/AdminSpaApp"

function mountAdminSpa() {
  const rootElement = document.getElementById("admin-spa-root")
  if (!rootElement || rootElement.dataset.mounted === "true") return

  const root = createRoot(rootElement)
  root.render(<AdminSpaApp />)
  rootElement.dataset.mounted = "true"
}

document.addEventListener("turbo:load", mountAdminSpa)
mountAdminSpa()
