import * as React from 'react';
import { Link, Route, Routes } from 'react-router-dom';

// Ajusta los nombres de los remotes según tu config
const Workspace = React.lazy(() => import('workspace/Module'));
const Notes = React.lazy(() => import('notes/Module'));
const Tasks = React.lazy(() => import('tasks/Module'));
const Calendar = React.lazy(() => import('calendar/Module'));

export function App() {
  return (
    <React.Suspense fallback={<div className="p-4">Loading module...</div>}>
      <div className="min-h-screen flex bg-slate-950 text-slate-100">
        {/* Sidebar */}
        <aside className="w-64 border-r border-slate-800 bg-slate-900/80 p-4 flex flex-col">
          <h1 className="text-xl font-bold mb-4">Notion MFE</h1>

          <nav className="flex flex-col gap-2 text-sm mb-4">
            <Link className="hover:text-sky-400" to="/">
              Workspace
            </Link>
            <Link className="hover:text-sky-400" to="/notes">
              Notes
            </Link>
            <Link className="hover:text-sky-400" to="/tasks">
              Tasks
            </Link>
            <Link className="hover:text-sky-400" to="/calendar">
              Calendar
            </Link>
          </nav>

          <div className="mt-auto text-xs text-slate-500">
            <p>Demo modular con microfrontends</p>
          </div>
        </aside>

        {/* Contenido principal */}
        <main className="flex-1 flex flex-col">
          {/* Top bar */}
          <header className="h-12 border-b border-slate-800 flex items-center px-4 text-sm">
            <span className="text-slate-400">Notion-like workspace · demo</span>
          </header>

          {/* Router outlet */}
          <section className="flex-1 p-4 overflow-auto">
            <Routes>
              <Route path="/" element={<Workspace />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/calendar" element={<Calendar />} />
            </Routes>
          </section>
        </main>
      </div>
    </React.Suspense>
  );
}

export default App;
