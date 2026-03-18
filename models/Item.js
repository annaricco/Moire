import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
      default: '',
    },
    price: {
      type: Number,
      min: 0,
      default: null,
    },
    purchaseDate: {
      type: Date,
      default: null,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['dress', 'top', 'sweater', 'jeans', 'pants', 'skirt', 'shorts', 'jacket', 'shoes', 'accessory'],
      required: [true, 'Category is required'],
    },
    tags: {
      type: [String],
      default: [],
    },
    matchingSet: {
      type: String,
      default: '',
    },
    source: {
      type: String,
      enum: ['manual', 'gmail'],
      default: 'manual',
    },
    sourceUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Item || mongoose.model('Item', ItemSchema);
