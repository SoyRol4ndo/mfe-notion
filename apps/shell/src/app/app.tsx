import { Loading, useThemeColor } from '@mfe-notion/shared';
import clsx from 'clsx';
import * as React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import '../styles.css';
import { ThemeSwitch } from '../components/ThemeSwitch';

// Ajusta los nombres de los remotes según tu config
const Workspace = React.lazy(() => import('workspace/Module'));
const Notes = React.lazy(() => import('notes/Module'));
const Tasks = React.lazy(() => import('tasks/Module'));
const Calendar = React.lazy(() => import('calendar/Module'));

export function App() {
  const { getColor } = useThemeColor();

  return (
    <React.Suspense fallback={<Loading />}>
      <div
        className={clsx('min-h-screen flex')}
        style={{
          backgroundColor: getColor('background'),
          color: getColor('text'),
        }}
      >
        {/* Sidebar */}
        <aside
          className="w-64 p-4 flex flex-col border-r"
          style={{
            backgroundColor: getColor('secondary'),
            borderColor: getColor('border'),
          }}
        >
          <h1
            className="text-xl font-bold mb-4"
            style={{ color: getColor('header') }}
          >
            Notion MFE
          </h1>

          <nav className="flex flex-col gap-2 text-sm mb-4">
            <Link
              className="hover:underline"
              style={{ color: getColor('text') }}
              to="/"
            >
              Workspace
            </Link>
            <Link
              className="hover:underline"
              style={{ color: getColor('text') }}
              to="/notes"
            >
              Notes
            </Link>
            <Link
              className="hover:underline"
              style={{ color: getColor('text') }}
              to="/tasks"
            >
              Tasks
            </Link>
            <Link
              className="hover:underline"
              style={{ color: getColor('text') }}
              to="/calendar"
            >
              Calendar
            </Link>
          </nav>

          <div
            className="mt-auto text-xs"
            style={{
              color: getColor('text_light'),
            }}
          >
            <ThemeSwitch />
            <p>Demo modular con microfrontends</p>
          </div>
        </aside>

        {/* Contenido principal */}
        <main className="flex-1 flex flex-col">
          {/* Router outlet */}
          <section
            className="flex-1 overflow-auto"
            style={{
              backgroundColor: getColor('background_light'),
              color: getColor('text'),
            }}
          >
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
