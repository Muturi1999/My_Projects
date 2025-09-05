// components/CategoryFilter.jsx
export default function CategoryFilter({ categories = [], selected, onSelect }) {
  return (
    <div className="flex gap-2 flex-wrap mb-4">
      {categories.length === 0 ? (
        <p className="text-gray-500">No categories found.</p>
      ) : (
        categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.name)}
            className={`px-4 py-2 rounded border transition ${
              selected === cat.name
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-800 hover:bg-gray-100'
            }`}
          >
            {cat.name}
          </button>
        ))
      )}
    </div>
  );
}
