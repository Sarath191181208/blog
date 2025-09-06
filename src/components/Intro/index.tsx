import "./style.css"

export function Intro({ children }: { children: preact.ComponentChildren }) {
  return <div className="intro-container">{children}</div>
}
