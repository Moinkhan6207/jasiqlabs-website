// Test script to verify AboutPageEditor functionality
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AboutPageEditor from '../client/src/components/admin/pages/AboutPageEditor';

// Mock the API service
jest.mock('../client/src/services/api', () => ({
  pageContent: {
    get: jest.fn()
  }
}));

// Mock ReactQuill
jest.mock('react-quill', () => {
  return function MockReactQuill({ value, onChange }) {
    return <textarea data-testid="rich-text-editor" value={value} onChange={(e) => onChange(e.target.value)} />;
  };
});

const MockedAboutPageEditor = () => {
  return (
    <BrowserRouter>
      <Toaster />
      <AboutPageEditor />
    </BrowserRouter>
  );
};

describe('AboutPageEditor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    const { pageContent } = require('../client/src/services/api');
    
    // Mock API calls to return pending promises
    pageContent.get.mockImplementation(() => new Promise(() => {}));
    
    render(<MockedAboutPageEditor />);
    
    expect(screen.getByText('Loading About page content...')).toBeInTheDocument();
    expect(screen.getByText('Force Continue')).toBeInTheDocument();
  });

  test('loads content successfully', async () => {
    const { pageContent } = require('../client/src/services/api');
    
    // Mock successful API responses
    pageContent.get.mockImplementation((page, section) => {
      return Promise.resolve({
        data: {
          content: {
            title: `Test ${section} title`,
            subtitle: `Test ${section} subtitle`
          }
        }
      });
    });
    
    render(<MockedAboutPageEditor />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading About page content...')).not.toBeInTheDocument();
    }, { timeout: 5000 });
    
    // Verify that API calls were made
    expect(pageContent.get).toHaveBeenCalledTimes(6);
    expect(pageContent.get).toHaveBeenCalledWith('about', 'hero');
    expect(pageContent.get).toHaveBeenCalledWith('about', 'story');
    expect(pageContent.get).toHaveBeenCalledWith('about', 'different');
    expect(pageContent.get).toHaveBeenCalledWith('about', 'culture');
    expect(pageContent.get).toHaveBeenCalledWith('about', 'leadership');
    expect(pageContent.get).toHaveBeenCalledWith('about', 'cta');
  });

  test('handles API errors gracefully', async () => {
    const { pageContent } = require('../client/src/services/api');
    
    // Mock API errors
    pageContent.get.mockImplementation(() => Promise.reject(new Error('Network error')));
    
    render(<MockedAboutPageEditor />);
    
    // Wait for loading to complete and error handling
    await waitFor(() => {
      expect(screen.queryByText('Loading About page content...')).not.toBeInTheDocument();
    }, { timeout: 5000 });
    
    // Should still render the form with default values
    expect(screen.getByText('Leadership & Compliance')).toBeInTheDocument();
  });

  test('force continue button works', () => {
    const { pageContent } = require('../client/src/services/api');
    
    // Mock API calls to return pending promises
    pageContent.get.mockImplementation(() => new Promise(() => {}));
    
    render(<MockedAboutPageEditor />);
    
    const forceContinueButton = screen.getByText('Force Continue');
    forceContinueButton.click();
    
    // Loading should be false and form should appear
    expect(screen.queryByText('Loading About page content...')).not.toBeInTheDocument();
    expect(screen.getByText('Leadership & Compliance')).toBeInTheDocument();
  });
});

console.log('AboutPageEditor test completed successfully!');
