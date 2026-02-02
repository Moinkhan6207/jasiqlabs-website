import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { pageContent } from '../../../services/api';

const HomePageEditor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [heroData, setHeroData] = useState({
    title: '',
    subtitle: '',
    description: '',
    buttons: {
      training: '',
      services: '',
      products: '',
    },
  });

  const [whatWeDoData, setWhatWeDoData] = useState({
    title: '',
    items: [{ title: '', text: '' }],
  });

  const [divisionsData, setDivisionsData] = useState({
    title: '',
    cards: [{ id: '', title: '', for: '', solves: '', cta: '' }],
  });

  const [whyData, setWhyData] = useState({
    title: '',
    points: [''],
  });

  const [whoWeWorkWithData, setWhoWeWorkWithData] = useState({
    title: '',
    items: [''],
  });

  const [leadCaptureData, setLeadCaptureData] = useState({
    title: '',
    supportingLine: '',
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
          whatWeDoRes,
          divisionsRes,
          whyRes,
          whoWeWorkWithRes,
          leadCaptureRes,
        ] = await Promise.all([
          pageContent.get('home', 'hero'),
          pageContent.get('home', 'what_we_do'),
          pageContent.get('home', 'divisions'),
          pageContent.get('home', 'why'),
          pageContent.get('home', 'who_we_work_with'),
          pageContent.get('home', 'lead_capture'),
        ]);

        const heroContent = extractContent(heroRes);
        const whatWeDoContent = extractContent(whatWeDoRes);
        const divisionsContent = extractContent(divisionsRes);
        const whyContent = extractContent(whyRes);
        const whoWeWorkWithContent = extractContent(whoWeWorkWithRes);
        const leadCaptureContent = extractContent(leadCaptureRes);

        if (heroContent) {
          setHeroData({
            title: heroContent.title || '',
            subtitle: heroContent.subtitle || '',
            description: heroContent.description || '',
            buttons: {
              training: heroContent.buttons?.training || '',
              services: heroContent.buttons?.services || '',
              products: heroContent.buttons?.products || '',
            },
          });
        }

        if (whatWeDoContent) {
          setWhatWeDoData({
            title: whatWeDoContent.title || '',
            items: Array.isArray(whatWeDoContent.items) && whatWeDoContent.items.length > 0
              ? whatWeDoContent.items
              : [{ title: '', text: '' }],
          });
        }

        if (divisionsContent) {
          setDivisionsData({
            title: divisionsContent.title || '',
            cards: Array.isArray(divisionsContent.cards) && divisionsContent.cards.length > 0
              ? divisionsContent.cards
              : [{ id: '', title: '', for: '', solves: '', cta: '' }],
          });
        }

        if (whyContent) {
          setWhyData({
            title: whyContent.title || '',
            points: Array.isArray(whyContent.points) && whyContent.points.length > 0
              ? whyContent.points
              : [''],
          });
        }

        if (whoWeWorkWithContent) {
          setWhoWeWorkWithData({
            title: whoWeWorkWithContent.title || '',
            items: Array.isArray(whoWeWorkWithContent.items) && whoWeWorkWithContent.items.length > 0
              ? whoWeWorkWithContent.items
              : [''],
          });
        }

        if (leadCaptureContent) {
          setLeadCaptureData({
            title: leadCaptureContent.title || '',
            supportingLine: leadCaptureContent.supportingLine || '',
          });
        }
      } catch (error) {
        console.error('Error fetching home page content:', error);
        toast.error('Failed to load home page content');
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

      const sanitizeArray = (arr) => (Array.isArray(arr) ? arr.filter(Boolean) : []);

      const updates = [
        pageContent.update({
          pageName: 'home',
          sectionKey: 'hero',
          content: {
            title: heroData.title,
            subtitle: heroData.subtitle,
            description: heroData.description,
            buttons: {
              training: heroData.buttons.training,
              services: heroData.buttons.services,
              products: heroData.buttons.products,
            },
          },
        }),
        pageContent.update({
          pageName: 'home',
          sectionKey: 'what_we_do',
          content: {
            title: whatWeDoData.title,
            items: Array.isArray(whatWeDoData.items) ? whatWeDoData.items : [],
          },
        }),
        pageContent.update({
          pageName: 'home',
          sectionKey: 'divisions',
          content: {
            title: divisionsData.title,
            cards: Array.isArray(divisionsData.cards) ? divisionsData.cards : [],
          },
        }),
        pageContent.update({
          pageName: 'home',
          sectionKey: 'why',
          content: {
            title: whyData.title,
            points: sanitizeArray(whyData.points.map((x) => (typeof x === 'string' ? x.trim() : x))),
          },
        }),
        pageContent.update({
          pageName: 'home',
          sectionKey: 'who_we_work_with',
          content: {
            title: whoWeWorkWithData.title,
            items: sanitizeArray(whoWeWorkWithData.items.map((x) => (typeof x === 'string' ? x.trim() : x))),
          },
        }),
        pageContent.update({
          pageName: 'home',
          sectionKey: 'lead_capture',
          content: {
            title: leadCaptureData.title,
            supportingLine: leadCaptureData.supportingLine,
          },
        }),
      ];

      await Promise.all(updates);
      toast.success('Home page content updated successfully!');
    } catch (error) {
      console.error('Error updating home page content:', error);
      toast.error('Failed to update home page content');
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

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              value={heroData.description}
              onChange={(e) => setHeroData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Button: Training
              </label>
              <input
                type="text"
                value={heroData.buttons.training}
                onChange={(e) => setHeroData(prev => ({ ...prev, buttons: { ...prev.buttons, training: e.target.value } }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Training button text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Button: Services
              </label>
              <input
                type="text"
                value={heroData.buttons.services}
                onChange={(e) => setHeroData(prev => ({ ...prev, buttons: { ...prev.buttons, services: e.target.value } }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Services button text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Button: Products
              </label>
              <input
                type="text"
                value={heroData.buttons.products}
                onChange={(e) => setHeroData(prev => ({ ...prev, buttons: { ...prev.buttons, products: e.target.value } }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Products button text"
              />
            </div>
          </div>
        </div>
      </div>

      {/* What We Do */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">What We Do</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={whatWeDoData.title}
              onChange={(e) => setWhatWeDoData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="space-y-3">
            {whatWeDoData.items.map((item, idx) => (
              <div key={idx} className="p-4 border border-gray-200 rounded-lg space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card title</label>
                    <input
                      type="text"
                      value={item.title || ''}
                      onChange={(e) => updateObjectListItem(setWhatWeDoData, 'items', idx, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card text</label>
                    <input
                      type="text"
                      value={item.text || ''}
                      onChange={(e) => updateObjectListItem(setWhatWeDoData, 'items', idx, 'text', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => removeObjectListItem(setWhatWeDoData, 'items', idx)}
                    className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addObjectListItem(setWhatWeDoData, 'items', { title: '', text: '' })}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Add item
            </button>
          </div>
        </div>
      </div>

      {/* Our Divisions */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Our Divisions</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={divisionsData.title}
              onChange={(e) => setDivisionsData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="space-y-3">
            {divisionsData.cards.map((card, idx) => (
              <div key={idx} className="p-4 border border-gray-200 rounded-lg space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card id</label>
                    <input
                      type="text"
                      value={card.id || ''}
                      onChange={(e) => updateObjectListItem(setDivisionsData, 'cards', idx, 'id', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="realworkstudio / techworksstudio / products"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={card.title || ''}
                      onChange={(e) => updateObjectListItem(setDivisionsData, 'cards', idx, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Who it is for</label>
                    <input
                      type="text"
                      value={card.for || ''}
                      onChange={(e) => updateObjectListItem(setDivisionsData, 'cards', idx, 'for', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">What it solves</label>
                    <input
                      type="text"
                      value={card.solves || ''}
                      onChange={(e) => updateObjectListItem(setDivisionsData, 'cards', idx, 'solves', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">CTA Button Text</label>
                    <input
                      type="text"
                      value={card.cta || ''}
                      onChange={(e) => updateObjectListItem(setDivisionsData, 'cards', idx, 'cta', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => removeObjectListItem(setDivisionsData, 'cards', idx)}
                    className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addObjectListItem(setDivisionsData, 'cards', { id: '', title: '', for: '', solves: '', cta: '' })}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Add card
            </button>
          </div>
        </div>
      </div>

      {/* Why */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Why JASIQ Labs</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={whyData.title}
              onChange={(e) => setWhyData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="space-y-3">
            {whyData.points.map((p, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <input
                  type="text"
                  value={p}
                  onChange={(e) => updateListItem(setWhyData, idx, 'points', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Point"
                />
                <button
                  type="button"
                  onClick={() => removeObjectListItem(setWhyData, 'points', idx)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addObjectListItem(setWhyData, 'points', '')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Add point
            </button>
          </div>
        </div>
      </div>

      {/* Who We Work With */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Who We Work With</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={whoWeWorkWithData.title}
              onChange={(e) => setWhoWeWorkWithData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="space-y-3">
            {whoWeWorkWithData.items.map((x, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <input
                  type="text"
                  value={x}
                  onChange={(e) => updateListItem(setWhoWeWorkWithData, idx, 'items', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Chip text"
                />
                <button
                  type="button"
                  onClick={() => removeObjectListItem(setWhoWeWorkWithData, 'items', idx)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addObjectListItem(setWhoWeWorkWithData, 'items', '')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Add item
            </button>
          </div>
        </div>
      </div>

      {/* Lead Capture */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Lead Capture</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={leadCaptureData.title}
              onChange={(e) => setLeadCaptureData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Supporting line</label>
            <input
              type="text"
              value={leadCaptureData.supportingLine}
              onChange={(e) => setLeadCaptureData(prev => ({ ...prev, supportingLine: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
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

export default HomePageEditor;
