import { useThemeColor } from '..';

export const Loading = () => {
  const { getColor } = useThemeColor();
  return (
    <div
      style={{ backgroundColor: getColor('background2') }}
      className="flex h-screen w-screen items-center justify-center"
    >
      <div
        className="w-12 h-12 rounded-full animate-spin
                    border-4 border-dashed border-gray-500 border-t-transparent"
      ></div>
    </div>
  );
};
