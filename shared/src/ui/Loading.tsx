export const Loading = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-black">
      <div
        className="w-12 h-12 rounded-full animate-spin
                    border-4 border-dashed border-gray-500 border-t-transparent"
      ></div>
    </div>
  );
};
