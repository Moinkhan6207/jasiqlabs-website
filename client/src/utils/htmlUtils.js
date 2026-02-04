// Utility functions for HTML content handling

// Decode HTML entities
export const decodeHTMLEntities = (str) => {
  if (!str || typeof str !== 'string') return str;
  
  const textarea = document.createElement('textarea');
  textarea.innerHTML = str;
  return textarea.value;
};

// Safe parse HTML content with entity decoding
export const safeParseHTML = (content) => {
  if (!content || typeof content !== 'string') return content;
  
  try {
    // First decode HTML entities
    const decoded = decodeHTMLEntities(content);
    
    // Then parse the HTML
    const { parse } = require('html-react-parser');
    return parse(decoded);
  } catch (error) {
    console.error('Error parsing HTML:', error);
    return content;
  }
};
