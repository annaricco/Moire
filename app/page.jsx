'use client';

import { useState, useEffect, useCallback } from 'react';
import FilterBar from '@/components/FilterBar';
import ClosetGrid from '@/components/ClosetGrid';
import AddItemModal from '@/components/AddItemModal';
import ItemDetailModal from '@/components/ItemDetailModal';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');

  const fetchItems = useCallback(async (category = activeCategory) => {
    setLoading(true);
    try {
      const url = category === 'sets' || category === 'all'
        ? '/api/items'
        : `/api/items?category=${category}`;
      const res = await fetch(url);
      const data = await res.json();

      if (category === 'sets') {
        setItems(data.filter((item) => item.matchingSet));
      } else {
        setItems(data);
      }
    } catch (err) {
      console.error('Failed to fetch items:', err);
    } finally {
      setLoading(false);
    }
  }, [activeCategory]);

  useEffect(() => {
    fetchItems(activeCategory);
  }, [activeCategory]);

  // Filter by search
  const filtered = items.filter((item) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      item.name?.toLowerCase().includes(q) ||
      item.brand?.toLowerCase().includes(q) ||
      item.tags?.some((t) => t.toLowerCase().includes(q))
    );
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sort === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    if (sort === 'price-high') return (b.price || 0) - (a.price || 0);
    if (sort === 'price-low') return (a.price || 0) - (b.price || 0);
    if (sort === 'brand') return (a.brand || '').localeCompare(b.brand || '');
    return 0;
  });

  const handleSave = (savedItem, isEdit) => {
    if (isEdit) {
      setItems((prev) => prev.map((i) => (i._id === savedItem._id ? savedItem : i)));
    } else {
      fetchItems(activeCategory);
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this item from your closet?')) return;
    try {
      await fetch(`/api/items/${id}`, { method: 'DELETE' });
      setItems((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  return (
    <main className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="border-b border-stone-200 px-8 py-5 flex items-center justify-between">
        <div className="flex items-baseline gap-5">
          <h1
            style={{ fontFamily: "'EB Garamond', serif" }}
            className="text-3xl tracking-widest uppercase font-normal text-stone-900"
          >
            Moire
          </h1>
          {!loading && (
            <span className="text-[10px] tracking-widest uppercase text-stone-400">
              {sorted.length} {sorted.length === 1 ? 'piece' : 'pieces'}
            </span>
          )}
        </div>

        {/* Search + Sort + Add */}
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="text-xs bg-transparent border-b border-stone-200 pb-1 w-36 placeholder:text-stone-300 text-stone-700 focus:outline-none focus:border-stone-500 transition-colors"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="text-[9px] tracking-widest uppercase bg-transparent text-stone-400 focus:outline-none cursor-pointer hover:text-stone-700 transition-colors"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="price-high">Price ↓</option>
            <option value="price-low">Price ↑</option>
            <option value="brand">Brand</option>
          </select>
          <button
            onClick={() => { setEditItem(null); setModalOpen(true); }}
            className="text-[10px] tracking-widest uppercase bg-stone-900 text-stone-50 px-5 py-2.5 hover:bg-stone-700 transition-colors"
          >
            + Add Item
          </button>
        </div>
      </header>

      {/* Filter Nav */}
      <FilterBar activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

      {/* Grid */}
      <div className="px-8 py-6">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <ClosetGrid
            items={sorted}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={setViewItem}
            activeCategory={activeCategory}
          />
        )}
      </div>

      <AddItemModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditItem(null); }}
        onSave={handleSave}
        editItem={editItem}
      />

      <ItemDetailModal
        item={viewItem}
        onClose={() => setViewItem(null)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </main>
  );
}
