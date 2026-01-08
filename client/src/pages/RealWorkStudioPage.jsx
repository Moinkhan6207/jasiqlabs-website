import BuildMeta from "../components/seo/buildMeta";
import { trackPageView } from '../analytics/trackEvent.js';
import { useEffect } from 'react';

const TechWorksStudioPage = () => {
  useEffect(() => {
    trackPageView('/techworksstudio');
  }, []);

  return (
    <>
      <BuildMeta slug="/techworksstudio" />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">TechWorks Studio</h1>
        <p className="mt-4 text-gray-600">This is a placeholder for the TechWorks Studio page.</p>
      </div>
    </>
  );
};

export default TechWorksStudioPage;

