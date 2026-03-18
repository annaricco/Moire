'use client';

import ItemCard from './ItemCard';
import EmptyState from './EmptyState';

function groupBySets(items) {
  const sets = {};
  items.forEach((item) => {
    if (item.matchingSet) {
      if (!sets[item.matchingSet]) sets[item.matchingSet] = [];
      sets[item.matchingSet].push(item);
    }
  });
  return sets;
}

export default function ClosetGrid({ items, onEdit, onDelete, activeCategory }) {
  if (!items || !Array.isArray(items) || items.length === 0) {
    return <EmptyState category={activeCategory} />;
  }

  if (activeCategory === 'sets') {
    const sets = groupBySets(items);
    const setNames = Object.keys(sets);

    if (setNames.length === 0) {
      return <EmptyState category="sets" />;
    }

    return (
      <div className="space-y-10">
        {setNames.map((setName) => (
          <div key={setName}>
            <p style={{ fontFamily: "'EB Garamond', serif" }}
              className="text-lg text-stone-900 mb-4 tracking-wide">{setName}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1">
              {sets[setName].map((item) => (
                <ItemCard key={item._id} item={item} onEdit={onEdit} onDelete={onDelete} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1">
      {items.map((item) => (
        <ItemCard key={item._id} item={item} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}