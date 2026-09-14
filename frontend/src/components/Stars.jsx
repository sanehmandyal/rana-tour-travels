import { Star } from "lucide-react";

export default function Stars({ rating = 5, size = 16 }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          className={n <= Math.round(rating) ? "fill-gold text-gold" : "text-gray-300"}
        />
      ))}
    </div>
  );
}
