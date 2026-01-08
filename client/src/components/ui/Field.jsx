export default function Field({ label, children, className = "" }) {
  return (
    <label className={`block mb-4 ${className}`}>
      {label && (
        <span className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </span>
      )}
      {children}
    </label>
  );
}
