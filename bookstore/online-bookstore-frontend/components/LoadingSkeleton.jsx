export default function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-4 border rounded">
      <div className="h-40 bg-gray-300 rounded" />
      <div className="h-4 bg-gray-300 rounded w-3/4" />
      <div className="h-4 bg-gray-300 rounded w-1/2" />
    </div>
  );
}
