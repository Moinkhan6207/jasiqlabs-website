import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { pageContent } from '../../services/api';
import LegalPageManager from '../../components/admin/legal/LegalPageManager';
import BlogPageEditor from '../../components/admin/blog/BlogPageEditor';

const PageContentEditor = () => {
  const navigate = useNavigate();
  const { pageName } = useParams();
  const currentPage = pageName || 'home';
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const quillRef = useRef(null);
  
  // Initialize state based on current pageName immediately
  const [formData, setFormData] = useState({
    pageName: pageName || 'home',
    sectionKey: 'hero',
    title: '',
    subtitle: '',
    description: '',
    visionTitle: '',
    visionDesc: '',
    missionTitle: '',
    missionDesc: '',
    // Careers page specific fields
    whyUs: [
      { title: '', desc: '' },
      { title: '', desc: '' },
      { title: '', desc: '' }
    ],
    whoCanApply: [
      { title: '', desc: '' },
      { title: '', desc: '' },
      { title: '', desc: '' }
    ],
    applyText: '',
    applyEmail: ''
  });



  // ReactQuill modules configuration to avoid findDOMNode warning
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],
      ['link', 'image', 'video']
    ],
    clipboard: {
      matchVisual: false,
    }
  };

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent', 'script', 'align', 'direction',
    'color', 'background', 'font', 'link', 'image', 'video', 'code-block'
  ];

  // 🟢 EFFECT: Fetch data whenever pageName changes
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        
        const currentSection = currentPage === 'about' ? 'hero' : 'hero';

        // 1. Reset Form first to prevent mixing data
        setFormData({
          pageName: currentPage,
          sectionKey: currentSection,
          title: '',
          subtitle: '',
          description: '',
          visionTitle: '',
          visionDesc: '',
          missionTitle: '',
          missionDesc: '',
          // Careers page specific fields
          whyUs: [
            { title: '', desc: '' },
            { title: '', desc: '' },
            { title: '', desc: '' }
          ],
          whoCanApply: [
            { title: '', desc: '' },
            { title: '', desc: '' },
            { title: '', desc: '' }
          ],
          applyText: '',
          applyEmail: ''
        });

        // 2. Fetch new data
        const { data } = await pageContent.get(currentPage, currentSection);
        
        if (data?.data) {
          // Update generic form data
          setFormData(prev => ({
            ...prev,
            title: data.data.title || '',
            subtitle: data.data.subtitle || '',
            description: data.data.description || '',
            visionTitle: data.data.visionTitle || '',
            visionDesc: data.data.visionDesc || '',
            missionTitle: data.data.missionTitle || '',
            missionDesc: data.data.missionDesc || '',
            // Careers page specific fields from content
            whyUs: data.data.content?.whyUs || prev.whyUs,
            whoCanApply: data.data.content?.whoCanApply || prev.whoCanApply,
            applyText: data.data.content?.applyText || '',
            applyEmail: data.data.content?.applyEmail || ''
          }));
        }
      } catch (error) {
        console.error('Error fetching page content:', error);
        toast.error('Failed to load page content');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [currentPage]);


  // 🟢 HANDLE CHANGE FUNCTION (Ye missing tha)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };



  // Handle nested array changes for careers sections
  const handleNestedChange = (section, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      // Prepare the payload with correct structure as expected by backend
      const data = {
        pageName: formData.pageName,
        sectionKey: formData.sectionKey,
        content: {
          title: formData.title,
          subtitle: formData.subtitle,
          description: formData.description,
          visionTitle: formData.visionTitle,
          visionDesc: formData.visionDesc,
          missionTitle: formData.missionTitle,
          missionDesc: formData.missionDesc,
          // Include careers-specific content if applicable
          ...(currentPage === 'careers' && {
            whyUs: formData.whyUs,
            whoCanApply: formData.whoCanApply,
            applyText: formData.applyText,
            applyEmail: formData.applyEmail
          })
        }
      };
      
      await pageContent.update(data);
      toast.success('Content updated successfully!');
    } catch (error) {
      console.error('Error updating page content:', error);
      toast.error('Failed to update content');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Get page title and description based on pageName
  const getPageInfo = () => {
    const currentPage = pageName || 'home';
    switch (currentPage) {
      case 'about':
        return {
          title: 'About Page Content Editor',
          description: 'Edit the content for the About Page Hero and Mission sections'
        };
      case 'contact':
        return {
          title: 'Contact Page Content Editor',
          description: 'Edit the content for the Contact Page'
        };
      case 'careers':
        return {
          title: 'Careers Page Content Editor',
          description: 'Edit the content for the Careers Page'
        };
      case 'legal':
        return {
          title: 'Legal Pages Content Editor',
          description: 'Edit the content for all Legal Pages (Privacy, Terms, Refund, Disclaimer, Cookies)'
        };
      case 'blog':
        return {
          title: 'Blog Page Content Editor',
          description: 'Edit the content for the Blog Page Hero and Newsletter sections'
        };
      case 'system':
        return {
          title: 'System Page Content Editor',
          description: 'Edit the content for the 404 Error Page'
        };
      case 'home':
      default:
        return {
          title: 'Home Page Content Editor',
          description: 'Edit the content for the Home Page Hero Section'
        };
    }
  };

  const pageInfo = getPageInfo();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{pageInfo.title}</h1>
          <p className="text-gray-600">{pageInfo.description}</p>
        </div>

        {/* Legal Pages UI - Delegated to LegalPageManager */}
        {currentPage === 'legal' && <LegalPageManager />}
        
        {/* Blog Page UI - Delegated to BlogPageEditor */}
        {currentPage === 'blog' && <BlogPageEditor />}

        {/* Generic Pages UI - Mutually exclusive */}
        {currentPage !== 'legal' && currentPage !== 'blog' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Hero Section Fields - Common for both Home and About */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Hero Section</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter title"
                  />
                </div>

                <div>
                  <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    id="subtitle"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter subtitle"
                  />
                </div>
              </div>
            </div>

            {/* Mission & Vision Section - Only for About Page */}
            {currentPage === 'about' && (
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Mission & Vision Section</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Mission Fields */}
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-700">Mission</h4>
                    <div>
                      <label htmlFor="missionTitle" className="block text-sm font-medium text-gray-700 mb-1">
                        Mission Title
                      </label>
                      <input
                        type="text"
                        id="missionTitle"
                        name="missionTitle"
                        value={formData.missionTitle}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter mission title"
                      />
                    </div>
                    <div>
                      <label htmlFor="missionDesc" className="block text-sm font-medium text-gray-700 mb-1">
                        Mission Description
                      </label>
                      <textarea
                        id="missionDesc"
                        name="missionDesc"
                        rows={4}
                        value={formData.missionDesc}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter mission description"
                      />
                    </div>
                  </div>

                  {/* Vision Fields */}
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-700">Vision</h4>
                    <div>
                      <label htmlFor="visionTitle" className="block text-sm font-medium text-gray-700 mb-1">
                        Vision Title
                      </label>
                      <input
                        type="text"
                        id="visionTitle"
                        name="visionTitle"
                        value={formData.visionTitle}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter vision title"
                      />
                    </div>
                    <div>
                      <label htmlFor="visionDesc" className="block text-sm font-medium text-gray-700 mb-1">
                        Vision Description
                      </label>
                      <textarea
                        id="visionDesc"
                        name="visionDesc"
                        rows={4}
                        value={formData.visionDesc}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter vision description"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Careers Specific Sections */}
            {currentPage === 'careers' && (
              <>
                {/* Why Us Section */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Why Us Section</h3>
                  <div className="space-y-4">
                    {formData.whyUs.map((item, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg">
                        <h4 className="text-md font-medium text-gray-700 mb-3">Item {index + 1}</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Title {index + 1}
                            </label>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => handleNestedChange('whyUs', index, 'title', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              placeholder={`Enter title ${index + 1}`}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Description {index + 1}
                            </label>
                            <textarea
                              rows={3}
                              value={item.desc}
                              onChange={(e) => handleNestedChange('whyUs', index, 'desc', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              placeholder={`Enter description ${index + 1}`}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Who Can Apply Section */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Who Can Apply Section</h3>
                  <div className="space-y-4">
                    {formData.whoCanApply.map((item, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg">
                        <h4 className="text-md font-medium text-gray-700 mb-3">Item {index + 1}</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Title {index + 1}
                            </label>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => handleNestedChange('whoCanApply', index, 'title', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              placeholder={`Enter title ${index + 1}`}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Description {index + 1}
                            </label>
                            <textarea
                              rows={3}
                              value={item.desc}
                              onChange={(e) => handleNestedChange('whoCanApply', index, 'desc', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              placeholder={`Enter description ${index + 1}`}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* How to Apply Section */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">How to Apply Section</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="applyText" className="block text-sm font-medium text-gray-700 mb-1">
                        "Don't see a role?" Text
                      </label>
                      <textarea
                        id="applyText"
                        name="applyText"
                        rows={3}
                        value={formData.applyText}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter the text for 'Don't see a role?' section"
                      />
                    </div>
                    <div>
                      <label htmlFor="applyEmail" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="applyEmail"
                        name="applyEmail"
                        value={formData.applyEmail}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Description Field - Only for Home Page and new pages */}
            {(currentPage === 'home' || currentPage === 'contact' || currentPage === 'careers' || currentPage === 'system') && (
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter description"
                />
              </div>
            )}

            <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PageContentEditor;