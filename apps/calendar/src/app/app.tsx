import '../styles.css';
import * as React from 'react';
import { Button, Input, useGlobalStore } from '@mfe-notion/shared';
import { Page, Task } from 'shared/src/types';
import { IoMdArrowRoundBack, IoMdArrowForward } from 'react-icons/io';

type CalendarItem =
  | { kind: 'page'; page: Page; dateKey: string }
  | { kind: 'task'; task: Task; dateKey: string };

type CalendarDay = {
  date: Date;
  key: string; // 'YYYY-MM-DD'
  isCurrentMonth: boolean;
};

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

function rangeKeys(start: string, end: string): string[] {
  const result: string[] = [];
  const startDate = new Date(start);
  const endDate = new Date(end);
  const d = new Date(startDate);

  while (d <= endDate) {
    result.push(toDateKey(d));
    d.setDate(d.getDate() + 1);
  }

  return result;
}

export function App() {
  const pages = useGlobalStore((s) => s.pages);
  const tasks = useGlobalStore((s) => s.tasks);
  const selectedWorkspaceId = useGlobalStore((s) => s.selectedWorkspaceId);

  const createPageWithSchedule = useGlobalStore(
    (s) => s.createPageWithSchedule
  );
  const createTaskWithSchedule = useGlobalStore(
    (s) => s.createTaskWithSchedule
  );

  const today = new Date();
  const [currentYear, setCurrentYear] = React.useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = React.useState(today.getMonth()); // 0-11
  const [selectedDayKey, setSelectedDayKey] = React.useState(toDateKey(today));

  // FORMULARIO: tipo de item + rango/fecha
  const [type, setType] = React.useState<'page' | 'task'>('page');
  const [rangeMode, setRangeMode] = React.useState<'single' | 'range'>(
    'single'
  );
  const [startDate, setStartDate] = React.useState(selectedDayKey);
  const [endDate, setEndDate] = React.useState(selectedDayKey);
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');

  // cuando cambio de día seleccionado, si estoy en modo "single", sincronizo start/end
  React.useEffect(() => {
    if (rangeMode === 'single') {
      setStartDate(selectedDayKey);
      setEndDate(selectedDayKey);
    } else {
      // si es rango y el día seleccionado se sale del rango actual,
      // puedes decidir si lo metes o no; por ahora no tocamos nada.
    }
  }, [selectedDayKey, rangeMode]);

  // Construir items por día a partir de PAGES + TASKS con scheduledStart/End
  const itemsByDay = React.useMemo(() => {
    const map = new Map<string, CalendarItem[]>();

    const addItem = (key: string, item: CalendarItem) => {
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    };

    // Pages
    for (const page of pages) {
      if (page.scheduledStart) {
        const start = page.scheduledStart;
        const end = page.scheduledEnd ?? page.scheduledStart;
        const keys = rangeKeys(start, end);
        for (const key of keys) {
          addItem(key, { kind: 'page', page, dateKey: key });
        }
      }
    }

    // Tasks
    for (const task of tasks) {
      if (task.scheduledStart) {
        const start = task.scheduledStart;
        const end = task.scheduledEnd ?? task.scheduledStart;
        const keys = rangeKeys(start, end);
        for (const key of keys) {
          addItem(key, { kind: 'task', task, dateKey: key });
        }
      }
    }

    return map;
  }, [pages, tasks]);

  const todayKey = toDateKey(today);
  const selectedItems = itemsByDay.get(selectedDayKey) ?? [];

  const calendarDays = React.useMemo(() => {
    const firstOfMonth = new Date(currentYear, currentMonth, 1);
    const firstDayOfWeek = firstOfMonth.getDay(); // 0-6, 0 = Sunday
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const days: CalendarDay[] = [];

    // días previos al inicio de mes (del mes anterior)
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth, 1 - i - 1);
      days.push({
        date: d,
        key: toDateKey(d),
        isCurrentMonth: false,
      });
    }

    // días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(currentYear, currentMonth, day);
      days.push({
        date: d,
        key: toDateKey(d),
        isCurrentMonth: true,
      });
    }

    // completar hasta múltiplo de 7
    while (days.length % 7 !== 0) {
      const last = days[days.length - 1].date;
      const d = new Date(last);
      d.setDate(d.getDate() + 1);
      days.push({
        date: d,
        key: toDateKey(d),
        isCurrentMonth: false,
      });
    }

    return days;
  }, [currentYear, currentMonth]);

  const goPrevMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 0) {
        setCurrentYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const goNextMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 11) {
        setCurrentYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  const monthLabel = new Date(currentYear, currentMonth, 1).toLocaleString(
    'es-ES',
    { month: 'long', year: 'numeric' }
  );

  const weekDays = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !description.trim()) return;

    const finalStart = startDate || selectedDayKey;
    const finalEnd =
      rangeMode === 'single' ? finalStart : endDate || finalStart;

    if (type === 'page') {
      createPageWithSchedule({
        title: title.trim() || 'Untitled',
        content: description.trim(),
        workspaceId: selectedWorkspaceId ?? undefined,
        startDate: finalStart,
        endDate: finalEnd,
      });
    } else {
      createTaskWithSchedule({
        title: title.trim() || 'Untitled task',
        description: description.trim(),
        workspaceId: selectedWorkspaceId ?? undefined,
        startDate: finalStart,
        endDate: finalEnd,
      });
    }

    // limpiar form
    setTitle('');
    setDescription('');
    setRangeMode('single');
    setStartDate(selectedDayKey);
    setEndDate(selectedDayKey);
  };

  return (
    <div className="h-full flex flex-col gap-4 text-slate-100">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Calendar</h2>
          <p className="text-xs text-slate-400">
            Crea notas o tareas planificadas por día o rango de días.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Button onClick={goPrevMonth} icon={<IoMdArrowRoundBack />} />
          <span className="px-2">{monthLabel}</span>
          <Button onClick={goNextMonth} icon={<IoMdArrowForward />} />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-[2fr,1.4fr] gap-6 h-[calc(100vh-120px)]">
        {/* Calendario mensual */}
        <section className="border border-slate-800 rounded-lg p-3 bg-slate-900/60 flex flex-col">
          <div className="grid grid-cols-7 text-[11px] text-slate-400 mb-1">
            {weekDays.map((d) => (
              <div key={d} className="text-center py-1">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 flex-1">
            {calendarDays.map((day) => {
              const key = day.key;
              const items = itemsByDay.get(key) ?? [];
              const isSelected = key === selectedDayKey;
              const isToday = key === todayKey;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedDayKey(key)}
                  className={[
                    'h-16 rounded-md border text-xs flex flex-col items-center justify-center transition',
                    day.isCurrentMonth
                      ? 'border-slate-700 bg-slate-900 hover:border-sky-400'
                      : 'border-slate-800 bg-slate-950/40 text-slate-600 hover:border-slate-700',
                    isSelected && 'border-sky-500 ring-1 ring-sky-500',
                    isToday && 'outline outline-1 outline-emerald-500/60',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <span className="text-sm font-medium">
                    {day.date.getDate()}
                  </span>

                  {items.length > 0 && (
                    <span className="mt-1 inline-flex px-2 py-[1px] rounded-full bg-sky-600/20 text-[10px] text-sky-300">
                      {items.length} item(s)
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Panel derecho: formulario + lista del día */}
        <section className="border border-slate-800 rounded-lg p-3 bg-slate-900/60 flex flex-col gap-3">
          {/* Formulario */}
          <form
            onSubmit={handleCreateItem}
            className="border border-slate-700 rounded p-3 text-xs flex flex-col gap-2 bg-slate-950/60"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-sm">
                Nuevo item para calendario
              </span>
              <span className="text-[10px] text-slate-400">
                Día base: {selectedDayKey}
              </span>
            </div>

            <div className="flex gap-2">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="type"
                  value="page"
                  checked={type === 'page'}
                  onChange={() => setType('page')}
                />
                <span>Nota</span>
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="type"
                  value="task"
                  checked={type === 'task'}
                  onChange={() => setType('task')}
                />
                <span>Task</span>
              </label>
            </div>

            <div className="flex gap-2 text-[11px]">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="mode"
                  value="single"
                  checked={rangeMode === 'single'}
                  onChange={() => setRangeMode('single')}
                />
                <span>Un día</span>
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="mode"
                  value="range"
                  checked={rangeMode === 'range'}
                  onChange={() => setRangeMode('range')}
                />
                <span>Rango de días</span>
              </label>
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-[10px] text-slate-400 mb-1">
                  Inicio
                </label>
                <input
                  type="date"
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 outline-none text-xs"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              {rangeMode === 'range' && (
                <div className="flex-1">
                  <label className="block text-[10px] text-slate-400 mb-1">
                    Fin
                  </label>
                  <input
                    type="date"
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 outline-none text-xs"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div>
              <Input
                className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 outline-none text-xs"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  type === 'page' ? 'Título de la nota' : 'Título de la tarea'
                }
                label="Título"
              />
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 mb-1">
                Descripción / contenido
              </label>
              <textarea
                className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 outline-none text-xs resize-none min-h-[60px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={
                  type === 'page'
                    ? 'Contenido inicial de la nota...'
                    : 'Descripción de la tarea...'
                }
              />
            </div>

            <div className="flex justify-end mt-1">
              <Button type="submit">Añadir al calendario</Button>
            </div>
          </form>

          {/* Lista de items del día seleccionado */}
          <div className="flex-1 flex flex-col gap-2 overflow-auto text-xs">
            <h3 className="text-sm font-semibold mb-1">
              Items para el {selectedDayKey}
            </h3>

            {selectedItems.length === 0 && (
              <p className="text-[11px] text-slate-500">
                No hay notas ni tareas planificadas para esta fecha.
              </p>
            )}

            {selectedItems.map((item, idx) => {
              if (item.kind === 'page') {
                const page = item.page;
                return (
                  <div
                    key={`page-${page.id}-${idx}`}
                    className="border border-slate-700 rounded p-2 bg-slate-950/60"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] px-1 py-[1px] rounded bg-emerald-600/20 text-emerald-300">
                        Nota
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(page.updatedAt).toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <strong className="block text-[13px] mb-1">
                      {page.title || 'Untitled'}
                    </strong>
                    <p className="text-[11px] text-slate-400 line-clamp-3 whitespace-pre-line">
                      {page.content || 'Nota sin contenido.'}
                    </p>
                  </div>
                );
              }

              const task = item.task;
              return (
                <div
                  key={`task-${task.id}-${idx}`}
                  className="border border-slate-700 rounded p-2 bg-slate-950/60"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] px-1 py-[1px] rounded bg-sky-600/20 text-sky-300">
                      Task
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(task.updatedAt).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <strong className="block text-[13px] mb-1">
                    {task.title || 'Untitled task'}
                  </strong>
                  <p className="text-[11px] text-slate-400 line-clamp-3 whitespace-pre-line">
                    {task.description || 'Tarea sin descripción.'}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
