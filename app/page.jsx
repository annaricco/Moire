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
      const url = category === 'all' ? '/api/items' : `/api/items?category=${category}`;
      const res = await fetch(url);
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error('Failed to fetch items:', err);
    } finally {
      setLoading(false);
    }
  }, [activeCategory]);

  useEffect(() => {
    fetchItems(activeCategory);
  }, [activeCategory]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const handleSave = (savedItem, isEdit) => {
    if (isEdit) {
      setItems((prev) => prev.map((i) => (i._id === savedItem._id ? savedItem : i)));
    } else {
      // Re-fetch to respect active filter
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
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="flex items-center justify-between py-6 border-b border-gray-200">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Moire</h1>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 bg-black text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Item
          </button>
        </header>

        {/* Filter Bar */}
        <div className="py-4">
          <FilterBar activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />
        </div>

        {/* Count */}
        {!loading && (
          <p className="text-xs text-gray-400 mb-4">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </p>
        )}

        {/* Grid */}
        {loading ? <LoadingSpinner /> : (
          <ClosetGrid
            items={items}
            onEdit={handleEdit}
            onDelete={handleDelete}
            activeCategory={activeCategory}
          />
        )}
      </div>

      {/* Modal */}
      <AddItemModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditItem(null); }}
        onSave={handleSave}
        editItem={editItem}
      />
    </main>
  );
}
