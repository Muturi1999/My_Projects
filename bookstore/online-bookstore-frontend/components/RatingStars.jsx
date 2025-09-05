export default function RatingStars({ rating }) {
  return (
    <div className="flex gap-1 text-yellow-500">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i}>{i < rating ? '★' : '☆'}</span>
      ))}
    </div>
  );
}
