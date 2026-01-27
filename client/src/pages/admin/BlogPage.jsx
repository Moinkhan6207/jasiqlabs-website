import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, RefreshCw, Eye, EyeOff, FileText, Calendar } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  // 1. Initial State with NEW Fields
  const [formData, setFormData] = useState({
    title: '',
    category: 'Tech',
    tags: '', // String for input
    summary: '',
    content: '',
    coverImage: '',
    author: '',
    isFeatured: false, // Boolean
    published: false
  });

  const CATEGORIES = [
    "Tech", "Career Advice", "Web Development", 
    "Artificial Intelligence", "Internship Stories", "Entrepreneurship"
  ];

  const formatDate = (dateString) => {
    if (!dateString) return 'Not Published';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await api.blog.getAll();
      setPosts(response.data?.data?.posts || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await api.blog.delete(id);
        toast.success('Post deleted successfully');
        fetchPosts();
      } catch (error) {
        toast.error('Failed to delete post');
      }
    }
  };

  const togglePublish = async (post) => {
    try {
      await api.blog.update(post.id, { published: !post.published });
      toast.success(post.published ? 'Unpublished' : 'Published Live');
      fetchPosts();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  // 2. Updated Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Tags string ko Array me convert karein
      const processedData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
      };

      if (editingPost) {
        await api.blog.update(editingPost.id, processedData);
        toast.success('Post updated successfully');
      } else {
        await api.blog.create(processedData);
        toast.success('Post created successfully');
      }
      closeModal();
      fetchPosts();
    } catch (error) {
      console.error(error);
      toast.error('Operation failed');
    }
  };

  const openEditModal = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      category: post.category || 'Tech',
      // Array to String for Display
      tags: post.tags ? post.tags.join(', ') : '', 
      summary: post.summary,
      content: post.content,
      coverImage: post.coverImage || '',
      author: post.author || '',
      isFeatured: post.isFeatured || false,
      published: post.published
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPost(null);
    setFormData({ 
      title: '', category: 'Tech', tags: '', summary: '', content: '', 
      coverImage: '', author: '', isFeatured: false, published: false 
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-gray-500 text-sm">Manage your website articles and news</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={20} /> Create New Post
        </button>
      </div>

      {/* Content Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Post Details</th>
                <th className="p-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Meta Info</th>
                <th className="p-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="p-5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="4" className="p-10 text-center text-gray-500"><RefreshCw className="animate-spin h-6 w-6 mx-auto mb-2"/>Loading posts...</td></tr>
              ) : posts.length === 0 ? (
                <tr><td colSpan="4" className="p-10 text-center text-gray-500">No blog posts found.</td></tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-5">
                      <div className="font-medium text-gray-900 flex items-center gap-2">
                        {post.title}
                        {post.isFeatured && <span className="text-[10px] bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded border border-yellow-200">Featured</span>}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 truncate max-w-xs">{post.summary}</div>
                      <div className="mt-1 flex gap-2">
                         <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                           {post.category || 'Tech'}
                         </span>
                         {post.tags && post.tags.length > 0 && (
                           <span className="text-xs text-gray-400 self-center">
                             +{post.tags.length} tags
                           </span>
                         )}
                      </div>
                    </td>
                    <td className="p-5 text-sm text-gray-600">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">{post.author || 'Admin'}</span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Calendar size={10} /> 
                          {formatDate(post.createdAt)}
                        </span>
                      </div>
                    </td>
                    <td className="p-5">
                      <button 
                        onClick={() => togglePublish(post)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                          post.published 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        }`}
                      >
                        {post.published ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-3">
                        <button onClick={() => openEditModal(post)} className="text-blue-600 hover:text-blue-800 transition-colors" title="Edit">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(post.id)} className="text-red-500 hover:text-red-700 transition-colors" title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-800">
                {editingPost ? 'Edit Blog Post' : 'Create New Post'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Title (Full Width) */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g., The Future of AI"
                    required 
                  />
                </div>

                {/* Category Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select 
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Author Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author Name (Optional)</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.author}
                    onChange={(e) => setFormData({...formData, author: e.target.value})}
                    placeholder="e.g. Admin User"
                  />
                </div>

                {/* 👇 NEW TAGS INPUT (Placed Here) */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags (Comma Separated)</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    placeholder="e.g. React, Coding, Career"
                  />
                </div>

                {/* Cover Image */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({...formData, coverImage: e.target.value})}
                    placeholder="https://..."
                  />
                </div>

                {/* Summary */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Summary (Short Description)</label>
                  <textarea 
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.summary}
                    onChange={(e) => setFormData({...formData, summary: e.target.value})}
                    rows="2"
                    required
                  />
                </div>

                {/* Content */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content (HTML Supported)</label>
                  <div className="relative">
                    <textarea 
                      className="w-full border border-gray-300 rounded-lg p-3 font-mono text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      rows="8"
                      placeholder="<p>Write your article content here...</p>"
                      required
                    />
                    <FileText className="absolute top-3 right-3 text-gray-400" size={18} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">You can use HTML tags like &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, etc.</p>
                </div>

                {/* 👇 NEW FEATURED TOGGLE (Placed Here) */}
                <div className="md:col-span-2">
                   <div className="flex flex-col sm:flex-row gap-4">
                     
                     {/* Publish Toggle */}
                     <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100 flex-1">
                        <div className="relative inline-block w-12 mr-2 align-middle select-none">
                            <input 
                            type="checkbox" 
                            id="published"
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                            checked={formData.published}
                            onChange={(e) => setFormData({...formData, published: e.target.checked})}
                            />
                            <label htmlFor="published" className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${formData.published ? 'bg-green-500' : 'bg-gray-300'}`}></label>
                        </div>
                        <label htmlFor="published" className="text-sm font-medium text-gray-700">
                            {formData.published ? 'Publish Immediately' : 'Save as Draft'}
                        </label>
                     </div>

                     {/* Featured Toggle */}
                     <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-100 flex-1">
                        <div className="relative inline-block w-12 mr-2 align-middle select-none">
                            <input 
                            type="checkbox" 
                            id="featured"
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                            checked={formData.isFeatured}
                            onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                            />
                            <label htmlFor="featured" className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${formData.isFeatured ? 'bg-yellow-500' : 'bg-gray-300'}`}></label>
                        </div>
                        <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                            {formData.isFeatured ? 'Featured Post (Pin to Top)' : 'Standard Post'}
                        </label>
                     </div>

                   </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md">
                  {editingPost ? 'Update Post' : 'Create Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

};

export default BlogPage;