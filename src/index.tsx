import { render } from 'preact';
import { LocationProvider, Router, Route } from 'preact-iso';

import { Header } from './components/Header.jsx';
import { Home } from './pages/Home/index.jsx';
import { NotFound } from './pages/_404.jsx';
import './style.css';
import { TurningTableRowsToCommands } from './pages/1_TurningTableRowsToCommands/index.jsx';
import { DummyPost } from './pages/2_DummyPost/index.jsx';

export function App() {
  return (
    <LocationProvider>
      <Router>
        <Route path="/" component={Home} />
        <Route path="/turning-table-rows-to-commands" component={TurningTableRowsToCommands} />
        <Route path="/dummy-post" component={DummyPost} />
        <Route default component={NotFound} />
      </Router>
    </LocationProvider>
  );
}

render(<App />, document.getElementById('app'));
