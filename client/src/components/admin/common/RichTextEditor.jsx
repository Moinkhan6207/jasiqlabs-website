import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RichTextEditor = ({ 
  value, 
  onChange, 
  placeholder = "Enter content...",
  label 
}) => {
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

  // Clean the content to remove extra <p> tags
  const handleChange = (content) => {
    // Remove outer <p><p> tags and clean up content
    const cleanContent = content
      .replace(/^<p><p>/, '<p>')
      .replace(/<\/p><\/p>$/, '</p>')
      .replace(/<\/p><p>/g, '</p><p>')
      .replace(/<p><br><\/p>/g, '<br>')
      .replace(/<p>(.*?)<\/p>/g, (match, p1) => {
        // If content is simple text without other HTML, return it without <p> tags
        if (!p1.includes('<') && !p1.includes('>')) {
          return p1;
        }
        return match;
      });
    
    onChange(cleanContent);
  };

  return (
    <div className="rich-text-editor">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <ReactQuill
        theme="snow"
        value={value || ''}
        onChange={handleChange}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
        className="bg-white rounded-lg"
      />
    </div>
  );
};

export default RichTextEditor;
