import { toChildArray } from "preact"
import { useState } from "preact/hooks"
import "./style.css"

interface CodeOutputProps {
  title: string
  children: preact.ComponentChildren
}
export function CodeOutput({ children }: CodeOutputProps) {
  return <>{children}</>
}

export function Code({ children }: { children: string }) {
  return (
    <div className="code-panel">
      <div className="panel-header">
        <span className="panel-title">Code</span>
        <div className="panel-dots">
          <div className="dot red"></div>
          <div className="dot yellow"></div>
          <div className="dot green"></div>
        </div>
      </div>
      <div className="code-content">
        <pre>
          <code>{children}</code>
        </pre>
      </div>
    </div>
  )
}

export function Output({ children }: { children: string }) {
  return (
    <div className="output-panel">
      <div className="panel-header">
        <span className="panel-title">Output</span>
        <div className="terminal-icon">▶</div>
      </div>
      <div className="output-content">
        <pre>{children}</pre>
      </div>
    </div>
  )
}

export function CodeOutputViewer({ children }: { children: preact.ComponentChildren }) {
  const items = toChildArray(children)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const total = items.length
  const current = items[currentIndex] as preact.VNode<CodeOutputProps>

  const handleNext = () => {
    if (isAnimating) return
    setIsAnimating(true)

    setTimeout(() => {
      setCurrentIndex((i) => (i + 1) % total)
      setIsAnimating(false)
    }, 400)
  }

  const handlePrev = () => {
    if (isAnimating) return
    setIsAnimating(true)

    setTimeout(() => {
      setCurrentIndex((i) => (i - 1 + total) % total)
      setIsAnimating(false)
    }, 400)
  }

  return (
    <div className="code-viewer-container">
      <div className="code-viewer-header">
        <h2 className="code-viewer-title">{current.props.title}</h2>
        <div className="code-viewer-counter">
          {currentIndex + 1} / {total}
        </div>
      </div>

      <div className={`code-viewer-content ${isAnimating ? "scroll-fade-out" : ""}`}>
        {current}
      </div>

      <div className="code-viewer-navigation">
        <button onClick={handlePrev} disabled={isAnimating} className="nav-button prev-button">
          ← Previous
        </button>
        <button onClick={handleNext} disabled={isAnimating} className="nav-button next-button">
          Next →
        </button>
      </div>
    </div>
  )
}
