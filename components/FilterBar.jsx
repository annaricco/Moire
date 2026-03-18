'use client';

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'top', label: 'Tops' },
  { value: 'bottom', label: 'Bottoms' },
  { value: 'shoes', label: 'Shoes' },
  { value: 'outerwear', label: 'Outerwear' },
  { value: 'accessory', label: 'Accessories' },
];

export default function FilterBar({ activeCategory, onCategoryChange }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onCategoryChange(cat.value)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
            activeCategory === cat.value
              ? 'bg-black text-white border-black'
              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
