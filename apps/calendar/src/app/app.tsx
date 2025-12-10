import '../styles.css';
import * as React from 'react';
import {
  Button,
  Input,
  useGlobalStore,
  useThemeColor,
} from '@mfe-notion/shared';
import { Page, Task } from 'shared/src/types';
import { IoMdArrowRoundBack, IoMdArrowForward } from 'react-icons/io';
import { PageCard } from '../components/PageCard';
import { TaskCard } from '../components/TaskCard';

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
  const { getColor } = useThemeColor();

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
    <div
      className="h-full flex flex-col gap-4 p-4"
      style={{ color: getColor('text') }}
    >
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Calendar</h2>
          <p style={{ color: getColor('text_light') }} className="text-xs">
            Crea notas o tareas planificadas por día o rango de días.
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Button
            onClick={goPrevMonth}
            icon={<IoMdArrowRoundBack />}
            style={{
              backgroundColor: getColor('background_light'),
              borderColor: getColor('border'),
              color: getColor('text'),
            }}
          />
          <span className="px-2">{monthLabel}</span>
          <Button
            onClick={goNextMonth}
            icon={<IoMdArrowForward />}
            style={{
              backgroundColor: getColor('background_light'),
              borderColor: getColor('border'),
              color: getColor('text'),
            }}
          />
        </div>
      </header>

      {/* GRID LAYOUT */}
      <div
        className="grid grid-cols-1 md:grid-cols-[2fr,1.4fr] gap-6 h-[calc(100vh-120px)]"
        style={{ color: getColor('text') }}
      >
        {/* CALENDARIO MENSUAL */}
        <section
          className="rounded-lg p-3 flex flex-col"
          style={{
            backgroundColor: getColor('background_dark'),
            border: `1px solid ${getColor('border')}`,
          }}
        >
          {/* Cabecera días de la semana */}
          <div
            className="grid grid-cols-7 text-[11px] mb-1"
            style={{ color: getColor('text_light') }}
          >
            {weekDays.map((d) => (
              <div key={d} className="text-center py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Celdas del calendario */}
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
                  style={{
                    border: `1px solid ${
                      isSelected
                        ? getColor('primary')
                        : day.isCurrentMonth
                        ? getColor('border')
                        : getColor('border_light')
                    }`,
                    backgroundColor: day.isCurrentMonth
                      ? getColor('background')
                      : getColor('background_dark'),
                    outline: isToday
                      ? `1px solid ${getColor('success')}`
                      : 'none',
                    color: day.isCurrentMonth
                      ? getColor('text')
                      : getColor('text_light'),
                  }}
                  className="h-16 rounded-md text-xs flex flex-col items-center justify-center transition"
                >
                  <span className="text-sm font-medium">
                    {day.date.getDate()}
                  </span>

                  {items.length > 0 && (
                    <span
                      className="mt-1 inline-flex px-2 py-[1px] rounded-full text-[10px]"
                      style={{
                        backgroundColor: getColor('accent') + '33',
                        color: getColor('accent'),
                      }}
                    >
                      {items.length} item(s)
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* PANEL DERECHO */}
        <section
          className="rounded-lg p-3 flex flex-col gap-3"
          style={{
            backgroundColor: getColor('background_dark'),
            border: `1px solid ${getColor('border')}`,
            color: getColor('text'),
          }}
        >
          {/* FORMULARIO */}
          <form
            onSubmit={handleCreateItem}
            className="rounded p-3 flex flex-col gap-2"
            style={{
              border: `1px solid ${getColor('border')}`,
              backgroundColor: getColor('background'),
              color: getColor('text'),
            }}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-sm">Nuevo item</span>
              <span
                className="text-[10px]"
                style={{ color: getColor('text_light') }}
              >
                Día base: {selectedDayKey}
              </span>
            </div>

            {/* Radios: nota / task */}
            <div className="flex gap-2 text-[11px]">
              {['page', 'task'].map((opt) => (
                <label className="flex items-center gap-1" key={opt}>
                  <input
                    type="radio"
                    name="type"
                    value={opt}
                    checked={type === opt}
                    onChange={() => setType(opt as 'page' | 'task')}
                  />
                  <span>{opt === 'page' ? 'Nota' : 'Task'}</span>
                </label>
              ))}
            </div>

            {/* Radios: un día / rango */}
            <div className="flex gap-2 text-[11px]">
              {['single', 'range'].map((opt) => (
                <label className="flex items-center gap-1" key={opt}>
                  <input
                    type="radio"
                    name="mode"
                    value={opt}
                    checked={rangeMode === opt}
                    onChange={() => setRangeMode(opt as 'single' | 'range')}
                  />
                  <span>{opt === 'single' ? 'Un día' : 'Rango de días'}</span>
                </label>
              ))}
            </div>

            {/* Fechas */}
            <div className="flex gap-2">
              <div className="flex-1">
                <label
                  className="block text-[10px] mb-1"
                  style={{ color: getColor('text_light') }}
                >
                  Inicio
                </label>
                <input
                  type="date"
                  className="w-full rounded px-2 py-1 outline-none text-xs"
                  style={{
                    backgroundColor: getColor('background_dark'),
                    border: `1px solid ${getColor('border')}`,
                    color: getColor('text'),
                  }}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              {rangeMode === 'range' && (
                <div className="flex-1">
                  <label
                    className="block text-[10px] mb-1"
                    style={{ color: getColor('text_light') }}
                  >
                    Fin
                  </label>
                  <input
                    type="date"
                    className="w-full rounded px-2 py-1 outline-none text-xs"
                    style={{
                      backgroundColor: getColor('background_dark'),
                      border: `1px solid ${getColor('border')}`,
                      color: getColor('text'),
                    }}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Título */}
            <Input
              label="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                type === 'page' ? 'Título de la nota' : 'Título de la tarea'
              }
            />

            {/* Descripción */}
            <div>
              <label
                className="block text-[10px] mb-1"
                style={{ color: getColor('text_light') }}
              >
                Descripción / contenido
              </label>
              <textarea
                className="w-full rounded px-2 py-1 outline-none text-xs resize-none min-h-[60px]"
                style={{
                  backgroundColor: getColor('background_dark'),
                  border: `1px solid ${getColor('border')}`,
                  color: getColor('text'),
                }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="flex justify-end mt-1">
              <Button type="submit">Añadir al calendario</Button>
            </div>
          </form>

          {/* LISTA DEL DÍA */}
          <div className="flex-1 flex flex-col gap-2 overflow-auto text-xs">
            <h3 className="text-sm font-semibold mb-1">
              Items para el {selectedDayKey}
            </h3>

            {selectedItems.length === 0 && (
              <p style={{ color: getColor('text_light') }}>
                No hay notas ni tareas para esta fecha.
              </p>
            )}

            {selectedItems.map((item, idx) =>
              item.kind === 'page' ? (
                <PageCard key={idx} page={item.page} getColor={getColor} />
              ) : (
                <TaskCard key={idx} task={item.task} getColor={getColor} />
              )
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
