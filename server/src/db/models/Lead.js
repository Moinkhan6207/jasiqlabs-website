import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  
  phone: {
    type: String,
    trim: true
  },
  interestType: {
    type: String,
    required: true,
    enum: ['STUDENT', 'CLIENT', 'PARTNER'],
    default: 'CLIENT'
  },
  division: {
    type: String,
    trim: true,
    enum: ['REALWORK_STUDIO', 'TECHWORKS_STUDIO', 'MAIN_SITE', ''],
    default: ''
  },
  message: {
    type: String,
    trim: true
  },
  source: {
    type: String,
    trim: true,
    default: 'website'
  },
  status: {
    type: String,
    enum: ['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'REJECTED'],
    default: 'NEW'
  }
}, {
  timestamps: true
});

// Index for faster queries
leadSchema.index({ email: 1, createdAt: -1 });
leadSchema.index({ interestType: 1, status: 1 });

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;

