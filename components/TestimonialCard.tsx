interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  stars?: number;
}

export function TestimonialCard({ quote, author, role, stars = 5 }: TestimonialCardProps) {
  return (
    <div className="relative flex flex-col bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors duration-200">
      {/* Stars */}
      <div className="flex items-center gap-0.5 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < stars ? 'text-emerald-400' : 'text-gray-700'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      {/* Quote mark */}
      <svg
        className="w-8 h-8 text-emerald-500/20 mb-3 shrink-0"
        fill="currentColor"
        viewBox="0 0 32 32"
      >
        <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
      </svg>

      {/* Quote text */}
      <p className="text-gray-300 text-sm leading-relaxed flex-1 mb-6">{quote}</p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-800">
        <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
          <span className="text-sm font-bold text-emerald-400">
            {author.charAt(0)}
          </span>
        </div>
        <div>
          <p className="text-white text-sm font-semibold">{author}</p>
          <p className="text-gray-500 text-xs">{role}</p>
        </div>
      </div>
    </div>
  );
}
