import { h } from 'preact';
import './style.css';

export function PageSection({ children }) {
  return (
    <div class="page-section">
      {children}
    </div>
  );
}
