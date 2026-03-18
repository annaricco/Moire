'use client';

import { useState, useEffect, useCallback } from 'react';
import FilterBar from '@/components/FilterBar';
import ClosetGrid from '@/components/ClosetGrid';
import AddItemModal from '@/components/AddItemModal';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

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

  const handleOpenAdd = () => {
    setEditItem(null);
    setModalOpen(true);
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
              {items.length} {items.length === 1 ? 'piece' : 'pieces'}
            </span>
          )}
        </div>
        <button
          onClick={handleOpenAdd}
          className="text-[10px] tracking-widest uppercase bg-stone-900 text-stone-50 px-5 py-2.5 hover:bg-stone-700 transition-colors"
        >
          + Add Item
        </button>
      </header>

      {/* Filter Nav */}
      <FilterBar activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

      {/* Grid */}
      <div className="px-8 py-6">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <ClosetGrid
            items={items}
            onEdit={handleEdit}
            onDelete={handleDelete}
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
    </main>
  );
}
