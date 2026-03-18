import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Item from '@/models/Item';
import { uploadImage } from '@/lib/cloudinary';

// GET /api/items — fetch all items, optional ?category= filter
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const query = category && category !== 'all' ? { category } : {};
    const items = await Item.find(query).sort({ createdAt: -1 });

    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
}

// POST /api/items — create a new item
export async function POST(request) {
  try {
    await connectDB();

    const formData = await request.formData();

    const data = {
      name: formData.get('name'),
      brand: formData.get('brand'),
      price: formData.get('price') ? parseFloat(formData.get('price')) : null,
      purchaseDate: formData.get('purchaseDate') || null,
      category: formData.get('category'),
      tags: formData.get('tags')
        ? formData.get('tags').split(',').map((t) => t.trim()).filter(Boolean)
        : [],
      source: formData.get('source') || 'manual',
      sourceUrl: formData.get('sourceUrl') || '',
    };

    // Handle image upload
    const imageFile = formData.get('image');
    if (imageFile && imageFile.size > 0) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      const dataUri = `data:${imageFile.type};base64,${base64}`;
      data.imageUrl = await uploadImage(dataUri);
    }

    const item = await Item.create(data);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('POST /api/items error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create item' }, { status: 500 });
  }
}
