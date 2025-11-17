'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import 'highlight.js/styles/monokai-sublime.css';

// Dynamic import to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Tulis konten artikel...',
  height = '400px',
}: RichTextEditorProps) {
  const quillRef = useRef<any>(null);

  useEffect(() => {
    // Register syntax highlighting for code blocks
    if (typeof window !== 'undefined') {
      const hljs = require('highlight.js');
      (window as any).hljs = hljs;
    }
  }, []);

  // Quill modules configuration
  const modules = {
    syntax: true,
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ size: ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ align: [] }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean'],
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  // Quill formats
  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'script',
    'list',
    'bullet',
    'indent',
    'align',
    'blockquote',
    'code-block',
    'link',
    'image',
    'video',
  ];

  return (
    <div className="rich-text-editor">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{ height }}
      />
      <style jsx global>{`
        .rich-text-editor .quill {
          background: white;
          border-radius: 0.5rem;
        }

        .rich-text-editor .ql-container {
          font-size: 16px;
          min-height: ${height};
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
        }

        .rich-text-editor .ql-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          background: #f9fafb;
        }

        .rich-text-editor .ql-editor {
          min-height: ${height};
          max-height: 600px;
          overflow-y: auto;
        }

        .rich-text-editor .ql-editor pre {
          background-color: #23241f;
          color: #f8f8f2;
          border-radius: 0.375rem;
          padding: 1rem;
          overflow-x: auto;
        }

        .rich-text-editor .ql-editor pre.ql-syntax {
          background-color: #23241f;
          color: #f8f8f2;
          border-radius: 0.375rem;
          padding: 1rem;
          margin: 1rem 0;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 14px;
          line-height: 1.6;
        }

        .rich-text-editor .ql-editor code {
          background-color: #f3f4f6;
          color: #ef4444;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.875em;
        }

        .rich-text-editor .ql-editor blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1rem;
          margin-left: 0;
          margin-right: 0;
          color: #6b7280;
          font-style: italic;
        }

        .rich-text-editor .ql-editor h1 {
          font-size: 2em;
          font-weight: bold;
          margin-top: 0.67em;
          margin-bottom: 0.67em;
        }

        .rich-text-editor .ql-editor h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin-top: 0.83em;
          margin-bottom: 0.83em;
        }

        .rich-text-editor .ql-editor h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin-top: 1em;
          margin-bottom: 1em;
        }

        .rich-text-editor .ql-editor img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1rem 0;
        }

        .rich-text-editor .ql-editor a {
          color: #3b82f6;
          text-decoration: underline;
        }

        .rich-text-editor .ql-editor ul,
        .rich-text-editor .ql-editor ol {
          padding-left: 1.5rem;
        }

        .rich-text-editor .ql-snow .ql-picker.ql-header .ql-picker-label[data-value='1']::before,
        .rich-text-editor .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='1']::before {
          content: 'Heading 1';
        }

        .rich-text-editor .ql-snow .ql-picker.ql-header .ql-picker-label[data-value='2']::before,
        .rich-text-editor .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='2']::before {
          content: 'Heading 2';
        }

        .rich-text-editor .ql-snow .ql-picker.ql-header .ql-picker-label[data-value='3']::before,
        .rich-text-editor .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='3']::before {
          content: 'Heading 3';
        }

        .rich-text-editor .ql-snow .ql-picker.ql-header .ql-picker-label[data-value='4']::before,
        .rich-text-editor .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='4']::before {
          content: 'Heading 4';
        }

        /* Code block button tooltip */
        .rich-text-editor .ql-snow .ql-tooltip[data-mode='link']::before {
          content: 'Enter link URL:';
        }

        .rich-text-editor .ql-snow .ql-tooltip.ql-editing a.ql-action::after {
          content: 'Save';
        }
      `}</style>
    </div>
  );
}
