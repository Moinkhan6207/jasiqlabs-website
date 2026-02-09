import { useState, useEffect } from 'react';
import { testimonials as testimonialsApi } from '../../services/api';
import toast from 'react-hot-toast';

// Star Rating Component for Form
const StarRatingInput = ({ rating, onChange }) => {
  return (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, index) => (
        <button
          key={index}
          type="button"
          className={`w-8 h-8 transition-colors ${
            index < rating ? 'text-yellow-400 hover:text-yellow-500' : 'text-gray-300 hover:text-yellow-400'
          }`}
          onClick={() => onChange(index + 1)}
        >
          <svg className="w-full h-full fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
      <span className="ml-2 text-sm text-gray-600">({rating} stars)</span>
    </div>
  );
};

// Testimonial Form Component
const TestimonialForm = ({ testimonial, onSave, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: testimonial?.name || '',
    role: testimonial?.role || '',
    company: testimonial?.company || '',
    message: testimonial?.message || '',
    rating: testimonial?.rating || 5,
    status: testimonial?.status || 'ACTIVE',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(testimonial?.image || '');

  useEffect(() => {
    if (testimonial) {
      setFormData({
        name: testimonial.name || '',
        role: testimonial.role || '',
        company: testimonial.company || '',
        message: testimonial.message || '',
        rating: testimonial.rating || 5,
        status: testimonial.status || 'ACTIVE',
      });
      setImagePreview(testimonial.image || '');
    }
  }, [testimonial]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('role', formData.role);
    formDataToSend.append('company', formData.company);
    formDataToSend.append('message', formData.message);
    formDataToSend.append('rating', formData.rating);
    formDataToSend.append('status', formData.status);
    
    if (imageFile) {
      formDataToSend.append('image', imageFile);
    }

    onSave(formDataToSend);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role *
          </label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Company
        </label>
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Message *
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          required
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Rating *
        </label>
        <StarRatingInput rating={formData.rating} onChange={(rating) => 
          setFormData(prev => ({ ...prev, rating }))
        } />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status *
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {imagePreview && (
          <div className="mt-2">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
            />
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Saving...' : (testimonial ? 'Update' : 'Create')}
        </button>
      </div>
    </form>
  );
};

// Page Settings Form Component
const PageSettingsForm = ({ settings, onSave, loading }) => {
  const [formData, setFormData] = useState({
    title: settings?.title || 'What Our Clients Say',
    subtitle: settings?.subtitle || 'Testimonials from our valued clients and partners',
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        title: settings.title || 'What Our Clients Say',
        subtitle: settings.subtitle || 'Testimonials from our valued clients and partners',
      });
    }
  }, [settings]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Page Title *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Page Subtitle *
        </label>
        <textarea
          name="subtitle"
          value={formData.subtitle}
          onChange={handleInputChange}
          required
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Saving...' : 'Update Settings'}
        </button>
      </div>
    </form>
  );
};

export default function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState([]);
  const [pageSettings, setPageSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);

  useEffect(() => {
    fetchTestimonials();
    fetchPageSettings();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await testimonialsApi.getAll();
      setTestimonials(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast.error('Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  };

  const fetchPageSettings = async () => {
    try {
      const response = await testimonialsApi.getSettings();
      const data = response.data?.data;

      setPageSettings({
        title: data?.title || 'What Our Clients Say',
        subtitle: data?.subtitle || 'Testimonials from our valued clients and partners'
      });
    } catch (error) {
      console.error('Error fetching page settings:', error);
      toast.error('Failed to fetch page settings');
    }
  };

  const handleSaveTestimonial = async (formData) => {
    try {
      setFormLoading(true);
      
      if (editingTestimonial) {
        await testimonialsApi.update(editingTestimonial.id, formData);
        toast.success('Testimonial updated successfully');
      } else {
        await testimonialsApi.create(formData);
        toast.success('Testimonial created successfully');
      }
      
      setShowForm(false);
      setEditingTestimonial(null);
      fetchTestimonials();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast.error('Failed to save testimonial');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteTestimonial = async (id) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) {
      return;
    }

    try {
      await testimonialsApi.delete(id);
      toast.success('Testimonial deleted successfully');
      fetchTestimonials();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast.error('Failed to delete testimonial');
    }
  };

  const handleSavePageSettings = async (data) => {
    try {
      setSettingsLoading(true);
      await testimonialsApi.updatePageSettings(data);
      setPageSettings(data);
      toast.success('Page settings updated successfully');
    } catch (error) {
      console.error('Error updating page settings:', error);
      toast.error('Failed to update page settings');
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleEditTestimonial = (testimonial) => {
    setEditingTestimonial(testimonial);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingTestimonial(null);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTestimonial(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Testimonials Manager</h1>
        <p className="text-gray-600">Manage client testimonials and page settings</p>
      </div>

      {/* Page Settings Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Page Settings</h2>
        <PageSettingsForm
          settings={pageSettings}
          onSave={handleSavePageSettings}
          loading={settingsLoading}
        />
      </div>

      {/* Testimonials Management */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Testimonials</h2>
          <button
            onClick={handleAddNew}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New Testimonial
          </button>
        </div>

        {testimonials.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No testimonials found. Add your first testimonial!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="pb-3 text-sm font-medium text-gray-700">Name</th>
                  <th className="pb-3 text-sm font-medium text-gray-700">Role</th>
                  <th className="pb-3 text-sm font-medium text-gray-700">Company</th>
                  <th className="pb-3 text-sm font-medium text-gray-700">Rating</th>
                  <th className="pb-3 text-sm font-medium text-gray-700">Status</th>
                  <th className="pb-3 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {testimonials.map((testimonial) => (
                  <tr key={testimonial.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 text-sm text-gray-900">{testimonial.name}</td>
                    <td className="py-3 text-sm text-gray-900">{testimonial.role}</td>
                    <td className="py-3 text-sm text-gray-900">{testimonial.company || '-'}</td>
                    <td className="py-3 text-sm text-gray-900">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, index) => (
                          <svg
                            key={index}
                            className={`w-4 h-4 ${
                              index < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="ml-1 text-xs">({testimonial.rating})</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        testimonial.status === 'ACTIVE' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {testimonial.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditTestimonial(testimonial)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTestimonial(testimonial.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Testimonial Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
              </h3>
              <TestimonialForm
                testimonial={editingTestimonial}
                onSave={handleSaveTestimonial}
                onCancel={handleCancelForm}
                loading={formLoading}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
