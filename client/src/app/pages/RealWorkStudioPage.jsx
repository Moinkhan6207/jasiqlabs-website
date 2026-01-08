import BuildMeta from '../seo/buildMeta.jsx';
import { trackPageView } from '../analytics/trackEvent.js';
import { useEffect } from 'react';

const RealWorkStudioPage = () => {
  useEffect(() => {
    trackPageView('/realworkstudio');
  }, []);

  return (
    <>
      <BuildMeta slug="/realworkstudio" />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">RealWork Studio</h1>
        <p className="mt-4 text-gray-600">This is a placeholder for the RealWork Studio page.</p>
      </div>
    </>
  );
};

export default RealWorkStudioPage;

