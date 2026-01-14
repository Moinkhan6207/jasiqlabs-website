import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[\d\s\-+()]*$/, 'Please provide a valid phone number']
    },
    interestType: {
      type: String,
      required: [true, 'Interest type is required'],
      enum: {
        values: ['Student', 'Client', 'Partner'],
        message: 'Invalid interest type'
      }
    },
    division: {
      type: String,
      required: [true, 'Division is required'],
      enum: {
        values: ['RealWorkStudio', 'TechWorksStudio', 'Products & AI'],
        message: 'Invalid division'
      }
    },
    message: {
      type: String,
      trim: true,
      maxlength: [1000, 'Message cannot be more than 1000 characters']
    },
    source: {
      type: String,
      default: 'Website',
      enum: ['Website', 'Other']
    },
    status: {
      type: String,
      default: 'New',
      enum: {
        values: ['New', 'Contacted', 'Qualified', 'Converted', 'Rejected'],
        message: 'Invalid status'
      }
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better query performance
leadSchema.index({ email: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ interestType: 1 });
leadSchema.index({ division: 1 });
leadSchema.index({ createdAt: -1 });

// Index for faster queries
leadSchema.index({ email: 1, createdAt: -1 });
leadSchema.index({ interestType: 1, status: 1 });

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;

