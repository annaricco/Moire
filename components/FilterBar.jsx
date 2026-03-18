'use client';

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'sets', label: 'Sets' },
  { value: 'dress', label: 'Dresses' },
  { value: 'top', label: 'Tops' },
  { value: 'sweater', label: 'Sweaters' },
  { value: 'jeans', label: 'Jeans' },
  { value: 'pants', label: 'Pants' },
  { value: 'skirt', label: 'Skirts' },
  { value: 'shorts', label: 'Shorts' },
  { value: 'jacket', label: 'Jackets & Coats' },
  { value: 'shoes', label: 'Shoes' },
  { value: 'accessory', label: 'Accessories' },
];

export default function FilterBar({ activeCategory, onCategoryChange }) {
  return (
    <div className="border-b border-stone-200 px-8 flex overflow-x-auto">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onCategoryChange(cat.value)}
          className={`px-5 py-3.5 text-[10px] tracking-widest uppercase whitespace-nowrap transition-colors ${
            activeCategory === cat.value
              ? 'text-stone-900 border-b border-stone-900 -mb-px'
              : 'text-stone-400 border-b border-transparent -mb-px hover:text-stone-600'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
