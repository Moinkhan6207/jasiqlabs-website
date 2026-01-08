import mongoose from 'mongoose';

const pageSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  pageType: {
    type: String,
    required: true,
    enum: ['MAIN_SITE', 'REALWORK_STUDIO', 'TECHWORKS_STUDIO', 'PRODUCT'],
    default: 'MAIN_SITE'
  },
  isIndexable: {
    type: Boolean,
    default: true
  },
  lastModified: {
    type: Date,
    default: Date.now
  },
  changeFrequency: {
    type: String,
    enum: ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'],
    default: 'weekly'
  },
  priority: {
    type: Number,
    min: 0,
    max: 1,
    default: 0.5
  }
}, {
  timestamps: true
});

const Page = mongoose.model('Page', pageSchema);

export default Page;

