import mongoose from 'mongoose';

const pageSeoSchema = new mongoose.Schema({
  pageSlug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    ref: 'Page'
  },
  metaTitle: {
    type: String,
    trim: true
  },
  metaDescription: {
    type: String,
    trim: true
  },
  metaKeywords: {
    type: [String],
    default: []
  },
  canonicalUrl: {
    type: String,
    trim: true
  },
  robots: {
    type: String,
    enum: ['index, follow', 'index, nofollow', 'noindex, follow', 'noindex, nofollow'],
    default: 'index, follow'
  },
  ogTitle: {
    type: String,
    trim: true
  },
  ogDescription: {
    type: String,
    trim: true
  },
  ogImage: {
    type: String,
    trim: true
  },
  twitterCard: {
    type: String,
    enum: ['summary', 'summary_large_image', 'app', 'player'],
    default: 'summary_large_image'
  }
}, {
  timestamps: true
});

const PageSeo = mongoose.model('PageSeo', pageSeoSchema);

export default PageSeo;

