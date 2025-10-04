export function Card({ children, className }) {
  return (
    <div className={`bg-white rounded-xl shadow-lg ${className || ""}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className }) {
  return <div className={`p-6 ${className || ""}`}>{children}</div>;
}
