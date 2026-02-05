import React from 'react';
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

  const handleChange = (content, _delta, source) => {
    try {
      // Avoid feedback loops when the editor is updated programmatically.
      if (source !== 'user') return;
      if (typeof content !== 'string') {
        onChange(String(content || ''));
        return;
      }
      onChange(content);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('RichTextEditor handleChange error:', err);
      onChange(String(content || ''));
    }
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
