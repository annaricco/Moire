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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50">
      <div className="bg-stone-50 w-full max-w-md max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-stone-200">
          <h2
            style={{ fontFamily: "'EB Garamond', serif" }}
            className="text-xl font-normal tracking-wide text-stone-900"
          >
            {editItem ? 'Edit Item' : 'Add Item'}
          </h2>
          <button onClick={onClose} className="text-stone-300 hover:text-stone-600 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="px-8 py-6 space-y-5">
          {/* Image upload */}
          <div
            onClick={() => fileRef.current.click()}
            className="w-full aspect-[4/3] border border-stone-200 flex items-center justify-center cursor-pointer hover:border-stone-400 transition-colors overflow-hidden bg-stone-100 relative"
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center">
                <p className="text-[9px] tracking-widest uppercase text-stone-400">Click to upload photo</p>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
          </div>

          {/* Name */}
          <div>
            <label className="block text-[9px] tracking-widest uppercase text-stone-400 mb-2">Name *</label>
            <input
              name="name" value={form.name} onChange={handleChange}
              placeholder="Oversized Denim Jacket"
              className="w-full border-b border-stone-200 bg-transparent pb-2 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-stone-500 transition-colors"
            />
          </div>

          {/* Brand + Price */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[9px] tracking-widest uppercase text-stone-400 mb-2">Brand</label>
              <input
                name="brand" value={form.brand} onChange={handleChange}
                placeholder="Zara"
                className="w-full border-b border-stone-200 bg-transparent pb-2 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-stone-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[9px] tracking-widest uppercase text-stone-400 mb-2">Price</label>
              <input
                name="price" value={form.price} onChange={handleChange}
                type="number" step="0.01" placeholder="89.99"
                className="w-full border-b border-stone-200 bg-transparent pb-2 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-stone-500 transition-colors"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-[9px] tracking-widest uppercase text-stone-400 mb-2">Category *</label>
            <select
              name="category" value={form.category} onChange={handleChange}
              className="w-full border-b border-stone-200 bg-transparent pb-2 text-sm text-stone-900 focus:outline-none focus:border-stone-500 transition-colors"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Purchase date */}
          <div>
            <label className="block text-[9px] tracking-widest uppercase text-stone-400 mb-2">Purchase Date</label>
            <input
              name="purchaseDate" value={form.purchaseDate} onChange={handleChange}
              type="date"
              className="w-full border-b border-stone-200 bg-transparent pb-2 text-sm text-stone-900 focus:outline-none focus:border-stone-500 transition-colors"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-[9px] tracking-widest uppercase text-stone-400 mb-2">
              Tags <span className="text-stone-300 normal-case tracking-normal">(comma separated)</span>
            </label>
            <input
              name="tags" value={form.tags} onChange={handleChange}
              placeholder="casual, summer, work"
              className="w-full border-b border-stone-200 bg-transparent pb-2 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-stone-500 transition-colors"
            />
          </div>

          {/* Matching Set */}
          <div>
            <label className="block text-[9px] tracking-widest uppercase text-stone-400 mb-2">
              Matching Set <span className="text-stone-300 normal-case tracking-normal">(optional)</span>
            </label>
            <input
              name="matchingSet" value={form.matchingSet} onChange={handleChange}
              placeholder="Floral Set"
              className="w-full border-b border-stone-200 bg-transparent pb-2 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-stone-500 transition-colors"
            />
          </div>

          {error && <p className="text-red-400 text-xs tracking-wide">{error}</p>}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 border border-stone-200 text-[9px] tracking-widest uppercase text-stone-500 hover:border-stone-400 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 py-3 bg-stone-900 text-[9px] tracking-widest uppercase text-stone-50 hover:bg-stone-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : editItem ? 'Save Changes' : 'Add to Closet'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
