export function Input({ className, ...props }) {
  return (
    <input
      className={`w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none ${className || ""}`}
      {...props}
    />
  );
}
