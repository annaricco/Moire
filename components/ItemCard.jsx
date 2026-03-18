'use client';

import Image from 'next/image';

const CATEGORY_LABELS = {
  top: 'Top',
  bottom: 'Bottom',
  shoes: 'Shoes',
  outerwear: 'Outerwear',
  accessory: 'Accessory',
};

export default function ItemCard({ item, onEdit, onDelete }) {
  return (
    <div className="group relative bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="aspect-[3/4] bg-gray-50 relative overflow-hidden">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          </div>
        )}

        {/* Hover actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={() => onEdit(item)}
            className="bg-white text-black px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-100 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(item._id)}
            className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
            {item.brand && (
              <p className="text-xs text-gray-400 truncate">{item.brand}</p>
            )}
          </div>
          {item.price != null && (
            <p className="text-sm font-medium text-gray-700 whitespace-nowrap">
              ${item.price.toFixed(2)}
            </p>
          )}
        </div>

        <div className="mt-2 flex items-center gap-1.5 flex-wrap">
          <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
            {CATEGORY_LABELS[item.category]}
          </span>
          {item.source === 'gmail' && (
            <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-500 text-xs rounded-full">
              Gmail
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
