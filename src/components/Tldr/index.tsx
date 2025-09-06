import "./style.css"

export function Tldr({ children }: { children: preact.ComponentChildren }) {
  return (
    <div className="tldr-container">
      <h2 className="tldr-title">TL;DR</h2>
      <div className="tldr-content">{children}</div>
    </div>
  )
}
