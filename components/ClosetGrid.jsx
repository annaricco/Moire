'use client';

import ItemCard from './ItemCard';
import EmptyState from './EmptyState';

export default function ClosetGrid({ items, onEdit, onDelete, activeCategory }) {
  if (items.length === 0) {
    return <EmptyState category={activeCategory} />;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {items.map((item) => (
        <ItemCard
          key={item._id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
