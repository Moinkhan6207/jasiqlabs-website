import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { pageContent } from '../../../services/api';
import RichTextEditor from '../common/RichTextEditor';

const AboutPageEditor = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('leadership');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Initial State with Default Values to prevent undefined errors
  const [heroData, setHeroData] = useState({
    title: '',
    subtitle: '',
    visionTitle: '',
    visionDesc: '',
    missionTitle: '',
    missionDesc: '',
  });
  
  const [storyData, setStoryData] = useState({
    title: '',
    paragraphs: [''],
  });

  const [differentData, setDifferentData] = useState({
    title: '',
    subtitle: '',
    items: [{ title: '', desc: '' }],
  });

  const [cultureData, setCultureData] = useState({
    title: '',
    subtitle: '',
    items: [{ title: '', desc: '' }],
  });

  const [leadershipData, setLeadershipData] = useState({
    leadershipTitle: '',
    leadershipParagraphs: [''],
    complianceTitle: '',
    complianceParagraphs: [''],
  });

  const [ctaData, setCtaData] = useState({
    title: '',
    subtitle: '',
    buttonText: '',
    buttonLink: '',
  });

  useEffect(() => {
    let isMounted = true;

    const fetchContent = async () => {
      try {
        console.log('Starting to fetch About page content...');
        if (isMounted) setLoading(true);

        // Helper function to safely extract data
        const extractContent = (response) => {
          const backendData = response?.data;
          
          if (!backendData) return null;
          
          // Case 1: Content is nested in a 'content' field
          // Fix: Added check for (backendData.content !== null) to prevent crash
          if (backendData.content && typeof backendData.content === 'object') {
            const content = backendData.content;
            const cleanContent = {};
            
            Object.keys(content).forEach(key => {
              // Safe html tag removal
              if (typeof content[key] === 'string') {
                cleanContent[key] = content[key].replace(/<[^>]*>/g, '');
              } else {
                cleanContent[key] = content[key];
              }
            });
            return cleanContent;
          }
          
          // Case 2: Direct fields
          if (backendData.title || backendData.subtitle || backendData.visionTitle) {
            const cleanData = {};
            Object.keys(backendData).forEach(key => {
              if (typeof backendData[key] === 'string' && key !== 'id' && key !== 'pageName' && key !== 'sectionKey') {
                cleanData[key] = backendData[key].replace(/<[^>]*>/g, '');
              } else {
                cleanData[key] = backendData[key];
              }
            });
            return cleanData;
          }
          
          return backendData;
        };

        // Create a timeout promise to fix infinite spinner
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 10000)
        );

        // Define API calls
        const apiCalls = Promise.all([
          pageContent.get('about', 'hero').catch(err => ({ data: null })),
          pageContent.get('about', 'story').catch(err => ({ data: null })),
          pageContent.get('about', 'different').catch(err => ({ data: null })),
          pageContent.get('about', 'culture').catch(err => ({ data: null })),
          pageContent.get('about', 'leadership').catch(err => ({ data: null })),
          pageContent.get('about', 'cta').catch(err => ({ data: null })),
        ]);

        // Race between API calls and Timeout
        const [
          heroRes,
          storyRes,
          differentRes,
          cultureRes,
          leadershipRes,
          ctaRes,
        ] = await Promise.race([apiCalls, timeoutPromise]);

        if (!isMounted) return;

        const heroContent = extractContent(heroRes);
        const storyContent = extractContent(storyRes);
        const differentContent = extractContent(differentRes);
        const cultureContent = extractContent(cultureRes);
        const leadershipContent = extractContent(leadershipRes);
        const ctaContent = extractContent(ctaRes);

        // Safely set state with fallbacks to empty strings
        if (heroContent) {
          setHeroData({
            title: heroContent.title || '',
            subtitle: heroContent.subtitle || '',
            visionTitle: heroContent.visionTitle || '',
            visionDesc: heroContent.visionDesc || '',
            missionTitle: heroContent.missionTitle || '',
            missionDesc: heroContent.missionDesc || '',
          });
        }

        if (storyContent) {
          setStoryData({
            title: storyContent.title || '',
            paragraphs: Array.isArray(storyContent.paragraphs) && storyContent.paragraphs.length > 0
              ? storyContent.paragraphs
              : [''],
          });
        }

        if (differentContent) {
          const items = Array.isArray(differentContent.items) && differentContent.items.length > 0
            ? differentContent.items
            : [{ title: '', desc: '' }];

          setDifferentData({
            title: differentContent.title || '',
            subtitle: differentContent.subtitle || '',
            items: items.map((it) => ({
              title: (it && (typeof it === 'string' ? it : it.title)) || '',
              desc: (it && (typeof it === 'string' ? '' : it.desc)) || '',
            })),
          });
        }

        if (cultureContent) {
          const items = Array.isArray(cultureContent.items) && cultureContent.items.length > 0
            ? cultureContent.items
            : [{ title: '', desc: '' }];

          setCultureData({
            title: cultureContent.title || '',
            subtitle: cultureContent.subtitle || '',
            items: items.map((it) => ({
              title: (it && (typeof it === 'string' ? it : it.title)) || '',
              desc: (it && (typeof it === 'string' ? '' : it.desc)) || '',
            })),
          });
        }

        if (leadershipContent) {
          setLeadershipData({
            leadershipTitle: leadershipContent.leadershipTitle || '',
            leadershipParagraphs: Array.isArray(leadershipContent.leadershipParagraphs) && leadershipContent.leadershipParagraphs.length > 0
              ? leadershipContent.leadershipParagraphs
              : [''],
            complianceTitle: leadershipContent.complianceTitle || '',
            complianceParagraphs: Array.isArray(leadershipContent.complianceParagraphs) && leadershipContent.complianceParagraphs.length > 0
              ? leadershipContent.complianceParagraphs
              : [''],
          });
        }

        if (ctaContent) {
          setCtaData({
            title: ctaContent.title || '',
            subtitle: ctaContent.subtitle || '',
            buttonText: ctaContent.buttonText || '',
            buttonLink: ctaContent.buttonLink || '',
          });
        }

      } catch (error) {
        console.error('Error fetching about page content:', error);
        if (isMounted) toast.error('Failed to load content (or timeout)');
      } finally {
        if (isMounted) {
          console.log('Finished loading, setting loading to false');
          setLoading(false);
        }
      }
    };

    fetchContent();

    return () => {
      isMounted = false;
    };
  }, []);

  const updateListItem = (setter, index, key, value) => {
    setter(prev => {
      const next = { ...prev };
      const list = [...(next[key] || [])];
      list[index] = value;
      next[key] = list;
      return next;
    });
  };

  const updateObjectListItem = (setter, listKey, index, field, value) => {
    setter(prev => {
      const next = { ...prev };
      const list = Array.isArray(next[listKey]) ? [...next[listKey]] : [];
      const item = { ...(list[index] || {}) };
      item[field] = value;
      list[index] = item;
      next[listKey] = list;
      return next;
    });
  };

  const addObjectListItem = (setter, listKey, emptyItem) => {
    setter(prev => ({
      ...prev,
      [listKey]: [...(Array.isArray(prev[listKey]) ? prev[listKey] : []), emptyItem],
    }));
  };

  const removeObjectListItem = (setter, listKey, index) => {
    setter(prev => {
      const list = Array.isArray(prev[listKey]) ? [...prev[listKey]] : [];
      list.splice(index, 1);
      return { ...prev, [listKey]: list.length ? list : prev[listKey] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);

      const sanitizeArray = (arr) => (Array.isArray(arr) ? arr.map((x) => (typeof x === 'string' ? x.trim() : x)).filter(Boolean) : []);

      const updates = [
        pageContent.update({
          pageName: 'about',
          sectionKey: 'hero',
          content: {
            title: heroData.title,
            subtitle: heroData.subtitle,
            visionTitle: heroData.visionTitle,
            visionDesc: heroData.visionDesc,
            missionTitle: heroData.missionTitle,
            missionDesc: heroData.missionDesc,
          },
        }),
        pageContent.update({
          pageName: 'about',
          sectionKey: 'story',
          content: {
            title: storyData.title,
            paragraphs: sanitizeArray(storyData.paragraphs),
          },
        }),
        pageContent.update({
          pageName: 'about',
          sectionKey: 'different',
          content: {
            title: differentData.title,
            subtitle: differentData.subtitle,
            items: Array.isArray(differentData.items) ? differentData.items : [],
          },
        }),
        pageContent.update({
          pageName: 'about',
          sectionKey: 'culture',
          content: {
            title: cultureData.title,
            subtitle: cultureData.subtitle,
            items: Array.isArray(cultureData.items) ? cultureData.items : [],
          },
        }),
        pageContent.update({
          pageName: 'about',
          sectionKey: 'leadership',
          content: {
            leadershipTitle: leadershipData.leadershipTitle,
            leadershipParagraphs: sanitizeArray(leadershipData.leadershipParagraphs),
            complianceTitle: leadershipData.complianceTitle,
            complianceParagraphs: sanitizeArray(leadershipData.complianceParagraphs),
          },
        }),
        pageContent.update({
          pageName: 'about',
          sectionKey: 'cta',
          content: {
            title: ctaData.title,
            subtitle: ctaData.subtitle,
            buttonText: ctaData.buttonText,
            buttonLink: ctaData.buttonLink,
          },
        }),
      ];

      await Promise.all(updates);
      toast.success('About page content updated successfully!');
    } catch (error) {
      console.error('Error updating about page content:', error);
      toast.error('Failed to update about page content');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading About page content...</p>
          <button 
            onClick={() => setLoading(false)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Force Continue
          </button>
        </div>
      </div>
    );
  }

  const SectionTabs = () => (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8 overflow-x-auto">
        {[
          { id: 'leadership', label: 'Leadership & Compliance' },
          { id: 'hero', label: 'Hero Section' },
          { id: 'mission', label: 'Mission & Vision' },
          { id: 'story', label: 'Company Story' },
          { id: 'different', label: 'What Makes Us Different' },
          { id: 'culture', label: 'Culture & Values' },
          { id: 'cta', label: 'CTA' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
              activeSection === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <SectionTabs />
      
      {/* Leadership Section */}
      {activeSection === 'leadership' && (
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Leadership & Compliance</h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-700">Compliance</h4>
              <div>
                <RichTextEditor
                  value={leadershipData.complianceTitle}
                  onChange={(value) => setLeadershipData(prev => ({ ...prev, complianceTitle: value }))}
                  placeholder="Enter compliance title"
                  label="Title"
                />
              </div>

              <div className="space-y-3">
                {(leadershipData.complianceParagraphs || []).map((p, idx) => (
                  <div key={idx} className="space-y-2">
                    <RichTextEditor
                      value={p}
                      onChange={(value) => updateListItem(setLeadershipData, idx, 'complianceParagraphs', value)}
                      placeholder={`Paragraph ${idx + 1}`}
                      label={`Paragraph ${idx + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeObjectListItem(setLeadershipData, 'complianceParagraphs', idx)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addObjectListItem(setLeadershipData, 'complianceParagraphs', '')}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Add paragraph
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-700">Leadership</h4>
              <div>
                <RichTextEditor
                  value={leadershipData.leadershipTitle}
                  onChange={(value) => setLeadershipData(prev => ({ ...prev, leadershipTitle: value }))}
                  placeholder="Enter leadership title"
                  label="Title"
                />
              </div>

              <div className="space-y-3">
                {(leadershipData.leadershipParagraphs || []).map((p, idx) => (
                  <div key={idx} className="space-y-2">
                    <RichTextEditor
                      value={p}
                      onChange={(value) => updateListItem(setLeadershipData, idx, 'leadershipParagraphs', value)}
                      placeholder={`Paragraph ${idx + 1}`}
                      label={`Paragraph ${idx + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeObjectListItem(setLeadershipData, 'leadershipParagraphs', idx)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addObjectListItem(setLeadershipData, 'leadershipParagraphs', '')}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Add paragraph
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      {activeSection === 'hero' && (
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Hero Section</h3>
          
          <div className="space-y-4">
            <div>
              <RichTextEditor
                value={heroData.title}
                onChange={(value) => setHeroData(prev => ({ ...prev, title: value }))}
                placeholder="Enter title"
                label="Title"
              />
            </div>

            <div>
              <RichTextEditor
                value={heroData.subtitle}
                onChange={(value) => setHeroData(prev => ({ ...prev, subtitle: value }))}
                placeholder="Enter subtitle"
                label="Subtitle"
              />
            </div>
          </div>
        </div>
      )}

      {/* Mission Section */}
      {activeSection === 'mission' && (
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Mission & Vision Section</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-700">Mission</h4>
              <div>
                <RichTextEditor
                  value={heroData.missionTitle}
                  onChange={(value) => setHeroData(prev => ({ ...prev, missionTitle: value }))}
                  placeholder="Enter mission title"
                  label="Mission Title"
                />
              </div>
              <div>
                <RichTextEditor
                  value={heroData.missionDesc}
                  onChange={(value) => setHeroData(prev => ({ ...prev, missionDesc: value }))}
                  placeholder="Enter mission description"
                  label="Mission Description"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-700">Vision</h4>
              <div>
                <RichTextEditor
                  value={heroData.visionTitle}
                  onChange={(value) => setHeroData(prev => ({ ...prev, visionTitle: value }))}
                  placeholder="Enter vision title"
                  label="Vision Title"
                />
              </div>
              <div>
                <RichTextEditor
                  value={heroData.visionDesc}
                  onChange={(value) => setHeroData(prev => ({ ...prev, visionDesc: value }))}
                  placeholder="Enter vision description"
                  label="Vision Description"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Story Section */}
      {activeSection === 'story' && (
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Company Story</h3>
          <div className="space-y-4">
            <div>
              <RichTextEditor
                value={storyData.title}
                onChange={(value) => setStoryData(prev => ({ ...prev, title: value }))}
                placeholder="Enter story title"
                label="Title"
              />
            </div>

            <div className="space-y-3">
              {(storyData.paragraphs || []).map((p, idx) => (
                <div key={idx} className="space-y-2">
                  <RichTextEditor
                    value={p}
                    onChange={(value) => updateListItem(setStoryData, idx, 'paragraphs', value)}
                    placeholder={`Paragraph ${idx + 1}`}
                    label={`Paragraph ${idx + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeObjectListItem(setStoryData, 'paragraphs', idx)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addObjectListItem(setStoryData, 'paragraphs', '')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Add paragraph
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Different Section */}
      {activeSection === 'different' && (
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">What Makes Us Different</h3>
          <div className="space-y-4">
            <div>
              <RichTextEditor
                value={differentData.title}
                onChange={(value) => setDifferentData(prev => ({ ...prev, title: value }))}
                placeholder="Enter title"
                label="Title"
              />
            </div>
            <div>
              <RichTextEditor
                value={differentData.subtitle}
                onChange={(value) => setDifferentData(prev => ({ ...prev, subtitle: value }))}
                placeholder="Enter subtitle"
                label="Subtitle"
              />
            </div>

            <div className="space-y-3">
              {differentData.items.map((item, idx) => (
                <div key={idx} className="p-4 border border-gray-200 rounded-lg space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <RichTextEditor
                        value={item.title || ''}
                        onChange={(value) => updateObjectListItem(setDifferentData, 'items', idx, 'title', value)}
                        placeholder="Item title"
                        label="Item title"
                      />
                    </div>
                    <div>
                      <RichTextEditor
                        value={item.desc || ''}
                        onChange={(value) => updateObjectListItem(setDifferentData, 'items', idx, 'desc', value)}
                        placeholder="Item description"
                        label="Item description"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => removeObjectListItem(setDifferentData, 'items', idx)}
                      className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addObjectListItem(setDifferentData, 'items', { title: '', desc: '' })}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Add item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Culture Section */}
      {activeSection === 'culture' && (
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Culture & Values</h3>
          <div className="space-y-4">
            <div>
              <RichTextEditor
                value={cultureData.title}
                onChange={(value) => setCultureData(prev => ({ ...prev, title: value }))}
                placeholder="Enter title"
                label="Title"
              />
            </div>
            <div>
              <RichTextEditor
                value={cultureData.subtitle}
                onChange={(value) => setCultureData(prev => ({ ...prev, subtitle: value }))}
                placeholder="Enter subtitle"
                label="Subtitle"
              />
            </div>

            <div className="space-y-3">
              {cultureData.items.map((item, idx) => (
                <div key={idx} className="p-4 border border-gray-200 rounded-lg space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <RichTextEditor
                        value={item.title || ''}
                        onChange={(value) => updateObjectListItem(setCultureData, 'items', idx, 'title', value)}
                        placeholder="Item title"
                        label="Item title"
                      />
                    </div>
                    <div>
                      <RichTextEditor
                        value={item.desc || ''}
                        onChange={(value) => updateObjectListItem(setCultureData, 'items', idx, 'desc', value)}
                        placeholder="Item description"
                        label="Item description"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => removeObjectListItem(setCultureData, 'items', idx)}
                      className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addObjectListItem(setCultureData, 'items', { title: '', desc: '' })}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Add item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      {activeSection === 'cta' && (
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">CTA</h3>
          <div className="space-y-4">
            <div>
              <RichTextEditor
                value={ctaData.title}
                onChange={(value) => setCtaData(prev => ({ ...prev, title: value }))}
                placeholder="Enter title"
                label="Title"
              />
            </div>
            <div>
              <RichTextEditor
                value={ctaData.subtitle}
                onChange={(value) => setCtaData(prev => ({ ...prev, subtitle: value }))}
                placeholder="Enter subtitle"
                label="Subtitle"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Button text</label>
                <input
                  type="text"
                  value={ctaData.buttonText}
                  onChange={(e) => setCtaData(prev => ({ ...prev, buttonText: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Button link</label>
                <input
                  type="text"
                  value={ctaData.buttonLink}
                  onChange={(e) => setCtaData(prev => ({ ...prev, buttonLink: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="/contact"
                />
              </div>
            </div>
          </div>
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
  );
};

export default AboutPageEditor;