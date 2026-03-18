'use client';

import Image from 'next/image';
import { useEffect } from 'react';

const CATEGORY_LABELS = {
  dress: 'Dress',
  top: 'Top',
  sweater: 'Sweater',
  jeans: 'Jeans',
  pants: 'Pants',
  skirt: 'Skirt',
  shorts: 'Shorts',
  jacket: 'Jacket & Coat',
  shoes: 'Shoes',
  accessory: 'Accessory',
};

export default function ItemDetailModal({ item, onClose, onEdit, onDelete }) {
  if (!item) return null;

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleDelete = () => {
    onDelete(item._id);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="bg-stone-50 w-full max-w-2xl flex overflow-hidden max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="w-1/2 bg-stone-200 relative flex-shrink-0">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              className="object-cover"
              sizes="400px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-300 min-h-[400px]">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="w-1/2 p-8 flex flex-col overflow-y-auto">
          {/* Close */}
          <button
            onClick={onClose}
            className="self-end text-stone-400 hover:text-stone-700 transition-colors mb-6"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          {/* Name + Brand */}
          {item.brand && (
            <p className="text-[9px] tracking-widest uppercase text-stone-400 mb-2">{item.brand}</p>
          )}
          <h2
            style={{ fontFamily: "'EB Garamond', serif" }}
            className="text-2xl font-normal text-stone-900 leading-snug mb-6"
          >
            {item.name}
          </h2>

          {/* Details */}
          <div className="space-y-4 flex-1">
            {item.price != null && (
              <div>
                <p className="text-[9px] tracking-widest uppercase text-stone-400 mb-1">Price</p>
                <p className="text-sm text-stone-700">${item.price.toFixed(2)}</p>
              </div>
            )}
            <div>
              <p className="text-[9px] tracking-widest uppercase text-stone-400 mb-1">Category</p>
              <p className="text-sm text-stone-700">{CATEGORY_LABELS[item.category] || item.category}</p>
            </div>
            {item.purchaseDate && (
              <div>
                <p className="text-[9px] tracking-widest uppercase text-stone-400 mb-1">Purchased</p>
                <p className="text-sm text-stone-700">{new Date(item.purchaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            )}
            {item.tags?.length > 0 && (
              <div>
                <p className="text-[9px] tracking-widest uppercase text-stone-400 mb-2">Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <span key={tag} className="text-[9px] tracking-widest uppercase border border-stone-200 px-2.5 py-1 text-stone-500">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {item.matchingSet && (
              <div>
                <p className="text-[9px] tracking-widest uppercase text-stone-400 mb-1">Matching Set</p>
                <p className="text-sm text-stone-700">{item.matchingSet}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-8 pt-6 border-t border-stone-200">
            <button
              onClick={() => { onEdit(item); onClose(); }}
              className="flex-1 text-[9px] tracking-widest uppercase py-3 bg-stone-900 text-stone-50 hover:bg-stone-700 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 text-[9px] tracking-widest uppercase py-3 border border-stone-200 text-stone-500 hover:border-stone-400 hover:text-stone-700 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}