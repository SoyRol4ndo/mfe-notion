import * as React from 'react';
import { Button } from './Button';
import { useThemeColor } from '..';

export interface ModalProps {
  open: boolean;
  title: string;
  children?: React.ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  showActions?: boolean;
  onDisabled?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  title,
  children,
  onClose,
  onConfirm,
  confirmText = 'Aceptar',
  cancelText = 'Cancelar',
  showActions = true,
  onDisabled,
}) => {
  const { getColor } = useThemeColor();

  console.log(onDisabled);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        // overlay semitransparente adaptado al tema
        backgroundColor:
          getColor('background') === '#FFFFFF'
            ? 'rgba(0,0,0,0.40)'
            : 'rgba(0,0,0,0.60)',
      }}
    >
      <div
        className="w-full max-w-md rounded-lg border shadow-xl"
        style={{
          backgroundColor: getColor('background'),
          borderColor: getColor('border'),
          color: getColor('text'),
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{
            borderColor: getColor('border'),
          }}
        >
          <h2
            className="text-sm font-semibold"
            style={{ color: getColor('header') }}
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-lg leading-none"
            style={{ color: getColor('icons') }}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-3 text-sm" style={{ color: getColor('text') }}>
          {children}
        </div>

        {/* Footer */}
        {showActions && (
          <div
            className="flex justify-end gap-2 px-4 py-3 border-t"
            style={{ borderColor: getColor('border') }}
          >
            <Button
              size="md"
              variant="secondary"
              onClick={onClose}
              style={{
                backgroundColor: getColor('secondary'),
                color: getColor('text'),
                borderColor: getColor('border'),
              }}
            >
              {cancelText}
            </Button>
            {onConfirm && (
              <Button
                disabled={onDisabled}
                size="md"
                variant="primary"
                onClick={onConfirm}
                style={{
                  backgroundColor: getColor('primary'),
                  color: getColor('text_i'),
                  borderColor: getColor('primary'),
                }}
              >
                {confirmText}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
