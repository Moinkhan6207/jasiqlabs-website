import mongoose from 'mongoose';

const seoSettingsSchema = new mongoose.Schema({
  siteName: {
    type: String,
    required: true,
    default: 'JASIQ Labs'
  },
  titleTemplate: {
    type: String,
    required: true,
    default: '%s | JASIQ Labs'
  },
  defaultMetaDescription: {
    type: String,
    required: true,
    default: 'JASIQ Labs - Innovation in Technology and Training'
  },
  defaultMetaKeywords: {
    type: [String],
    default: ['JASIQ Labs', 'Technology', 'Training', 'Innovation']
  },
  siteUrl: {
    type: String,
    required: true,
    default: 'https://jasiqlabs.com'
  },
  ogImage: {
    type: String,
    default: ''
  },
  twitterHandle: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Ensure only one document exists
seoSettingsSchema.statics.getDefaults = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const SeoSettings = mongoose.model('SeoSettings', seoSettingsSchema);

export default SeoSettings;

