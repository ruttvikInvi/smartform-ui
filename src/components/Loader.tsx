
const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-black/60">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 rounded-full border-4 border-t-blue-600 border-gray-200 animate-spin" />
        <div className="text-gray-700 dark:text-gray-200 font-medium">
          Loading...
        </div>
      </div>
    </div>
  );
};

export default Loader;
