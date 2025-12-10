import * as React from 'react';
import { ColorKey } from 'shared/src/theme/theme';

type TaskCardProps = {
  task: {
    id: string;
    title: string;
    description: string;
    updatedAt: string;
  };
  getColor: (token: ColorKey) => string;
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, getColor }) => {
  return (
    <div
      className="rounded p-2 text-xs"
      style={{
        border: `1px solid ${getColor('border')}`,
        backgroundColor: getColor('background'),
        color: getColor('text'),
      }}
    >
      {/* Header: badge + hora */}
      <div className="flex justify-between items-center mb-1">
        <span
          className="text-[10px] px-1 py-[1px] rounded"
          style={{
            backgroundColor: getColor('primary') + '33',
            color: getColor('primary'),
          }}
        >
          Task
        </span>
        <span className="text-[10px]" style={{ color: getColor('text_light') }}>
          {new Date(task.updatedAt).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>

      {/* Título */}
      <strong className="block text-[13px] mb-1">
        {task.title || 'Untitled task'}
      </strong>

      {/* Descripción */}
      <p
        className="text-[11px] line-clamp-3 whitespace-pre-line"
        style={{ color: getColor('text_light') }}
      >
        {task.description || 'Tarea sin descripción.'}
      </p>
    </div>
  );
};
