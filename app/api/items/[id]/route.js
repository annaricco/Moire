import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Item from '@/models/Item';
import { uploadImage } from '@/lib/cloudinary';

// PUT /api/items/:id — update an item
export async function PUT(request, { params }) {
  try {
    await connectDB();

    const { id } = params;
    const formData = await request.formData();

    const updates = {
      name: formData.get('name'),
      brand: formData.get('brand'),
      price: formData.get('price') ? parseFloat(formData.get('price')) : null,
      purchaseDate: formData.get('purchaseDate') || null,
      category: formData.get('category'),
      tags: formData.get('tags')
        ? formData.get('tags').split(',').map((t) => t.trim()).filter(Boolean)
        : [],
      sourceUrl: formData.get('sourceUrl') || '',
    };

    // Handle image upload if a new image is provided
    const imageFile = formData.get('image');
    if (imageFile && imageFile.size > 0) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      const dataUri = `data:${imageFile.type};base64,${base64}`;
      updates.imageUrl = await uploadImage(dataUri);
    }

    const item = await Item.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error('PUT /api/items/[id] error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update item' }, { status: 500 });
  }
}

// DELETE /api/items/:id — delete an item
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { id } = params;
    const item = await Item.findByIdAndDelete(id);

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/items/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
