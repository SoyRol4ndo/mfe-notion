import * as React from 'react';
import { ColorKey } from 'shared/src/theme/theme';

type PageCardProps = {
  page: {
    id: string;
    title: string;
    content: string;
    updatedAt: string;
  };
  getColor: (token: ColorKey) => string;
};

export const PageCard: React.FC<PageCardProps> = ({ page, getColor }) => {
  return (
    <div
      className="rounded p-2 text-xs"
      style={{
        border: `1px solid ${getColor('border')}`,
        backgroundColor: getColor('background'),
        color: getColor('text'),
      }}
    >
      {/* Header badge + hora */}
      <div className="flex justify-between items-center mb-1">
        <span
          className="text-[10px] px-1 py-[1px] rounded"
          style={{
            backgroundColor: getColor('success') + '33',
            color: getColor('success'),
          }}
        >
          Nota
        </span>
        <span className="text-[10px]" style={{ color: getColor('text_light') }}>
          {new Date(page.updatedAt).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>

      {/* Título */}
      <strong className="block text-[13px] mb-1">
        {page.title || 'Untitled'}
      </strong>

      {/* Contenido */}
      <p
        className="text-[11px] line-clamp-3 whitespace-pre-line"
        style={{ color: getColor('text_light') }}
      >
        {page.content || 'Nota sin contenido.'}
      </p>
    </div>
  );
};
