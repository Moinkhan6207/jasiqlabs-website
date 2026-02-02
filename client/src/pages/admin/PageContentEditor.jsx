import React from 'react';
import { useParams } from 'react-router-dom';
import LegalPageManager from '../../components/admin/legal/LegalPageManager';
import BlogPageEditor from '../../components/admin/blog/BlogPageEditor';
import HomePageEditor from '../../components/admin/pages/HomePageEditor';
import AboutPageEditor from '../../components/admin/pages/AboutPageEditor';
import ContactPageEditor from '../../components/admin/pages/ContactPageEditor';
import CareersPageEditor from '../../components/admin/pages/CareersPageEditor';
import RealWorkPageEditor from '../../components/admin/pages/RealWorkPageEditor';
import TechWorkPageEditor from '../../components/admin/pages/TechWorkPageEditor';
import ProductsPageEditor from '../../components/admin/pages/ProductsPageEditor';

const PageContentEditor = () => {
  const { pageName } = useParams();
  const currentPage = pageName || 'home';

  // Get page title and description based on pageName
  const getPageInfo = () => {
    switch (currentPage) {
      case 'realworkstudio':
        return {
          title: 'RealWork Studio Content Editor',
          description: 'Edit the content for the RealWork Studio Home Page Hero Section'
        };
      case 'techworksstudio':
        return {
          title: 'TechWork Studio Content Editor',
          description: 'Edit the content for the TechWork Studio Home Page Hero Section'
        };
      case 'products':
        return {
          title: 'Products Content Editor',
          description: 'Edit the content for the Products Home Page Hero Section'
        };
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

  // Render the appropriate component based on pageName
  const renderPageEditor = () => {
    switch (currentPage) {
      case 'realworkstudio':
        return <RealWorkPageEditor />;
      case 'techworksstudio':
        return <TechWorkPageEditor />;
      case 'products':
        return <ProductsPageEditor />;
      case 'legal':
        return <LegalPageManager />;
      case 'blog':
        return <BlogPageEditor />;
      case 'about':
        return <AboutPageEditor />;
      case 'contact':
        return <ContactPageEditor />;
      case 'careers':
        return <CareersPageEditor />;
      case 'system':
        return (
          <div className="text-gray-600">
            This page content editor is not available.
          </div>
        );
      case 'home':
      default:
        return <HomePageEditor />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{pageInfo.title}</h1>
          <p className="text-gray-600">{pageInfo.description}</p>
        </div>
        
        {renderPageEditor()}
      </div>
    </div>
  );
};

export default PageContentEditor;