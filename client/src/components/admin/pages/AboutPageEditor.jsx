import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { pageContent } from '../../../services/api';

const AboutPageEditor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
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
    const fetchContent = async () => {
      try {
        setLoading(true);

        const extractContent = (response) => {
          const backendData = response?.data;
          if (!backendData) return null;
          if (backendData.content) return backendData.content;
          return backendData;
        };

        const [
          heroRes,
          storyRes,
          differentRes,
          cultureRes,
          leadershipRes,
          ctaRes,
        ] = await Promise.all([
          pageContent.get('about', 'hero'),
          pageContent.get('about', 'story'),
          pageContent.get('about', 'different'),
          pageContent.get('about', 'culture'),
          pageContent.get('about', 'leadership'),
          pageContent.get('about', 'cta'),
        ]);

        const heroContent = extractContent(heroRes);
        const storyContent = extractContent(storyRes);
        const differentContent = extractContent(differentRes);
        const cultureContent = extractContent(cultureRes);
        const leadershipContent = extractContent(leadershipRes);
        const ctaContent = extractContent(ctaRes);

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
              title: (typeof it === 'string' ? it : it?.title) || '',
              desc: (typeof it === 'string' ? '' : it?.desc) || '',
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
              title: (typeof it === 'string' ? it : it?.title) || '',
              desc: (typeof it === 'string' ? '' : it?.desc) || '',
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
        toast.error('Failed to load about page content');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Leadership & Compliance</h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-700">Leadership</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={leadershipData.leadershipTitle}
                onChange={(e) => setLeadershipData(prev => ({ ...prev, leadershipTitle: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-3">
              {(leadershipData.leadershipParagraphs || []).map((p, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={p}
                    onChange={(e) => updateListItem(setLeadershipData, idx, 'leadershipParagraphs', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Paragraph"
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

          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-700">Compliance</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={leadershipData.complianceTitle}
                onChange={(e) => setLeadershipData(prev => ({ ...prev, complianceTitle: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-3">
              {(leadershipData.complianceParagraphs || []).map((p, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={p}
                    onChange={(e) => updateListItem(setLeadershipData, idx, 'complianceParagraphs', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Paragraph"
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
        </div>
      </div>

      {/* Hero Section Fields */}
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
              value={heroData.title}
              onChange={(e) => setHeroData(prev => ({ ...prev, title: e.target.value }))}
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
              value={heroData.subtitle}
              onChange={(e) => setHeroData(prev => ({ ...prev, subtitle: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter subtitle"
            />
          </div>
        </div>
      </div>

      {/* Mission & Vision Section */}
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
                value={heroData.missionTitle}
                onChange={(e) => setHeroData(prev => ({ ...prev, missionTitle: e.target.value }))}
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
                value={heroData.missionDesc}
                onChange={(e) => setHeroData(prev => ({ ...prev, missionDesc: e.target.value }))}
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
                value={heroData.visionTitle}
                onChange={(e) => setHeroData(prev => ({ ...prev, visionTitle: e.target.value }))}
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
                value={heroData.visionDesc}
                onChange={(e) => setHeroData(prev => ({ ...prev, visionDesc: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter vision description"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Company Story</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={storyData.title}
              onChange={(e) => setStoryData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="space-y-3">
            {(storyData.paragraphs || []).map((p, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <input
                  type="text"
                  value={p}
                  onChange={(e) => updateListItem(setStoryData, idx, 'paragraphs', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Paragraph"
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

      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">What Makes Us Different</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={differentData.title}
              onChange={(e) => setDifferentData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
            <input
              type="text"
              value={differentData.subtitle}
              onChange={(e) => setDifferentData(prev => ({ ...prev, subtitle: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="space-y-3">
            {differentData.items.map((item, idx) => (
              <div key={idx} className="p-4 border border-gray-200 rounded-lg space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Item title</label>
                    <input
                      type="text"
                      value={item.title || ''}
                      onChange={(e) => updateObjectListItem(setDifferentData, 'items', idx, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Item description</label>
                    <input
                      type="text"
                      value={item.desc || ''}
                      onChange={(e) => updateObjectListItem(setDifferentData, 'items', idx, 'desc', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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

      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Culture & Values</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={cultureData.title}
              onChange={(e) => setCultureData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
            <input
              type="text"
              value={cultureData.subtitle}
              onChange={(e) => setCultureData(prev => ({ ...prev, subtitle: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="space-y-3">
            {cultureData.items.map((item, idx) => (
              <div key={idx} className="p-4 border border-gray-200 rounded-lg space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Item title</label>
                    <input
                      type="text"
                      value={item.title || ''}
                      onChange={(e) => updateObjectListItem(setCultureData, 'items', idx, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Item description</label>
                    <input
                      type="text"
                      value={item.desc || ''}
                      onChange={(e) => updateObjectListItem(setCultureData, 'items', idx, 'desc', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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

      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">CTA</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={ctaData.title}
              onChange={(e) => setCtaData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
            <input
              type="text"
              value={ctaData.subtitle}
              onChange={(e) => setCtaData(prev => ({ ...prev, subtitle: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
