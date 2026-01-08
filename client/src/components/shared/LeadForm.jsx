import { useState } from 'react';
import { Field } from '../ui/Field.jsx';
import { Button } from '../ui/Button.jsx';
import { api } from '../../services/api.js';
import { trackFormSubmit } from '../../analytics/trackEvent.js';

/**
 * Lead Form Component
 * Used on Home and Contact pages
 */
export const LeadForm = ({ sourcePage = 'home', onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interestType: 'CLIENT'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length > 80) {
      newErrors.name = 'Name must be 80 characters or less';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (formData.email.length > 120) {
      newErrors.email = 'Email must be 120 characters or less';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (formData.phone.length < 7) {
      newErrors.phone = 'Phone must be at least 7 characters';
    }

    if (!['STUDENT', 'CLIENT', 'PARTNER'].includes(formData.interestType)) {
      newErrors.interestType = 'Please select a valid interest type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await api.submitLead({
        ...formData,
        sourcePage
      });

      trackFormSubmit('lead-form', sourcePage, { interestType: formData.interestType });
      
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', interestType: 'CLIENT' });

      if (onSuccess) {
        onSuccess();
      }

      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to submit. Please try again.';
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <p className="text-green-800 font-medium">Thank you! We'll get back to you soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{errors.submit}</p>
        </div>
      )}

      <Field
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        required
        placeholder="Your full name"
      />

      <Field
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        required
        placeholder="your.email@example.com"
      />

      <Field
        label="Phone"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
        error={errors.phone}
        required
        placeholder="Your phone number"
      />

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          I am interested in <span className="text-red-500">*</span>
        </label>
        <select
          name="interestType"
          value={formData.interestType}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="STUDENT">Training & Internships</option>
          <option value="CLIENT">Software & AI Services</option>
          <option value="PARTNER">Partnership Opportunities</option>
        </select>
        {errors.interestType && (
          <p className="mt-1 text-sm text-red-500">{errors.interestType}</p>
        )}
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  );
};

