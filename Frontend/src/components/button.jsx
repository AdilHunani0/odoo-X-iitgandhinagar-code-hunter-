export function Button({ children, className, ...props }) {
  return (
    <button
      className={`bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-xl transition ${className || ""}`}
      {...props}
    >
      {children}
    </button>
  );
}
