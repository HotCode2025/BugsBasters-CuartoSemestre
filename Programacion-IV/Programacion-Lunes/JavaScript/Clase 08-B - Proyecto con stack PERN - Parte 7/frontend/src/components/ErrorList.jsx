export default function ErrorList({ errors = [] }) {
  if (errors.length === 0) return null;

  return (
    <>
      {errors.map((error, i) => (
        <div
          key={i}
          className="bg-red-500 text-white text-sm font-medium p-2 mb-2 rounded-md border border-red-700"
        >
          {error}
        </div>
      ))}
    </>
  );
}