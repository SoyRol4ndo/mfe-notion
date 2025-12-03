import { MouseEventHandler } from 'react';

interface Props {
  text: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export function Button({ text, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-base px-8 py-3 rounded shadow-md hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
      type="button"
    >
      {text}
    </button>
  );
}
