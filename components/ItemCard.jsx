'use client';

import Image from 'next/image';

export default function ItemCard({ item, onEdit, onDelete }) {
  return (
    <div className="group relative bg-stone-100">
      {/* Image */}
      <div className="aspect-[3/4] bg-stone-200 relative overflow-hidden">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-300">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </div>
        )}

        {/* Hover actions */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center gap-2 pb-4">
          <button
            onClick={() => onEdit(item)}
            className="text-[9px] tracking-widest uppercase bg-white text-stone-900 px-4 py-2 hover:bg-stone-100 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(item._id)}
            className="text-[9px] tracking-widest uppercase bg-stone-900 text-white px-4 py-2 hover:bg-stone-700 transition-colors"
          >
            Remove
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="pt-3 pb-4 px-1">
        {item.brand && (
          <p className="text-[9px] tracking-widest uppercase text-stone-400 mb-1">{item.brand}</p>
        )}
        <p style={{ fontFamily: "'EB Garamond', serif" }} className="text-sm text-stone-900 leading-snug">
          {item.name}
        </p>
        {item.price != null && (
          <p className="text-[11px] text-stone-500 mt-1">${item.price.toFixed(2)}</p>
        )}
      </div>
    </div>
  );
}
