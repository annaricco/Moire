'use client';

import { useState, useRef } from 'react';

const CATEGORIES = [
  { value: 'dress', label: 'Dress' },
  { value: 'top', label: 'Top' },
  { value: 'sweater', label: 'Sweater' },
  { value: 'jeans', label: 'Jeans' },
  { value: 'pants', label: 'Pants' },
  { value: 'skirt', label: 'Skirt' },
  { value: 'shorts', label: 'Shorts' },
  { value: 'jacket', label: 'Jacket & Coat' },
  { value: 'shoes', label: 'Shoes' },
  { value: 'accessory', label: 'Accessory' },
];

const EMPTY_FORM = {
  name: '',
  brand: '',
  price: '',
  purchaseDate: '',
  category: 'top',
  tags: '',
  matchingSet: '',
  sourceUrl: '',
};

export default function AddItemModal({ isOpen, onClose, onSave, editItem = null }) {
  const [form, setForm] = useState(editItem || EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(editItem?.imageUrl || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef();

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    setError('');
    if (!form.name.trim()) return setError('Name is required.');
    if (!form.category) return setError('Category is required.');

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (imageFile) formData.append('image', imageFile);

      const url = editItem ? `/api/items/${editItem._id}` : '/api/items';
      const method = editItem ? 'PUT' : 'POST';

      const res = await fetch(url, { method, body: formData });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to save');

      const saved = await res.json();
      onSave(saved, !!editItem);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-base font-semibold">{editItem ? 'Edit Item' : 'Add Item'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Image upload */}
          <div
            onClick={() => fileRef.current.click()}
            className="w-full aspect-[4/3] rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-gray-300 transition-colors overflow-hidden bg-gray-50 relative"
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center">
                <div className="text-gray-300 mb-1">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto">
                    <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" />
                  </svg>
                </div>
                <p className="text-xs text-gray-400">Click to upload photo</p>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Name *</label>
            <input
              name="name" value={form.name} onChange={handleChange}
              placeholder="Oversized Denim Jacket"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>

          {/* Brand + Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Brand</label>
              <input
                name="brand" value={form.brand} onChange={handleChange}
                placeholder="Zara"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Price</label>
              <input
                name="price" value={form.price} onChange={handleChange}
                type="number" step="0.01" placeholder="89.99"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Category *</label>
            <select
              name="category" value={form.category} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400 bg-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Purchase date */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Purchase Date</label>
            <input
              name="purchaseDate" value={form.purchaseDate} onChange={handleChange}
              type="date"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Tags <span className="text-gray-300">(comma separated)</span></label>
            <input
              name="tags" value={form.tags} onChange={handleChange}
              placeholder="casual, summer, work"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          {/* Matching Set */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Matching Set <span className="text-gray-300">(optional — e.g. "Floral Set")</span>
            </label>
            <input
              name="matchingSet" value={form.matchingSet} onChange={handleChange}
              placeholder="Floral Set"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 py-2.5 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : editItem ? 'Save Changes' : 'Add to Closet'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
