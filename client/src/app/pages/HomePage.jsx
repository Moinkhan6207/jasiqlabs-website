import BuildMeta from '../seo/buildMeta.jsx';
import { trackPageView } from '../analytics/trackEvent.js';
import { useEffect } from 'react';

const HomePage = () => {
  useEffect(() => {
    trackPageView('/');
  }, []);

  return (
    <>
      <BuildMeta slug="/" />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">Home Page</h1>
        <p className="mt-4 text-gray-600">This is a placeholder for the home page.</p>
      </div>
    </>
  );
};

export default HomePage;

