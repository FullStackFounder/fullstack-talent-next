'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link as LinkIcon,
  Code,
  Quote,
  Heading1,
  Heading2,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  label?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Tulis sesuatu...',
  minHeight = '200px',
  label,
}: RichTextEditorProps) {
  const [isFocused, setIsFocused] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    updateContent();
  };

  const updateContent = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  const ToolbarButton = ({
    icon: Icon,
    command,
    value,
    title
  }: {
    icon: any;
    command: string;
    value?: string;
    title: string;
  }) => (
    <button
      type="button"
      onClick={() => executeCommand(command, value)}
      className="p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded transition-colors"
      title={title}
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div
        className={`border rounded-lg overflow-hidden transition-colors ${
          isFocused ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-20' : 'border-gray-300'
        }`}
      >
        {/* Toolbar */}
        <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-1">
          {/* Text Formatting */}
          <div className="flex gap-1 pr-2 border-r border-gray-300">
            <ToolbarButton icon={Bold} command="bold" title="Bold (Ctrl+B)" />
            <ToolbarButton icon={Italic} command="italic" title="Italic (Ctrl+I)" />
            <ToolbarButton icon={Underline} command="underline" title="Underline (Ctrl+U)" />
          </div>

          {/* Headings */}
          <div className="flex gap-1 pr-2 border-r border-gray-300">
            <ToolbarButton icon={Heading1} command="formatBlock" value="h1" title="Heading 1" />
            <ToolbarButton icon={Heading2} command="formatBlock" value="h2" title="Heading 2" />
          </div>

          {/* Lists */}
          <div className="flex gap-1 pr-2 border-r border-gray-300">
            <ToolbarButton icon={List} command="insertUnorderedList" title="Bullet List" />
            <ToolbarButton icon={ListOrdered} command="insertOrderedList" title="Numbered List" />
          </div>

          {/* Alignment */}
          <div className="flex gap-1 pr-2 border-r border-gray-300">
            <ToolbarButton icon={AlignLeft} command="justifyLeft" title="Align Left" />
            <ToolbarButton icon={AlignCenter} command="justifyCenter" title="Align Center" />
            <ToolbarButton icon={AlignRight} command="justifyRight" title="Align Right" />
          </div>

          {/* Other */}
          <div className="flex gap-1">
            <button
              type="button"
              onClick={insertLink}
              className="p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded transition-colors"
              title="Insert Link"
            >
              <LinkIcon className="w-4 h-4" />
            </button>
            <ToolbarButton icon={Quote} command="formatBlock" value="blockquote" title="Quote" />
            <ToolbarButton icon={Code} command="formatBlock" value="pre" title="Code Block" />
          </div>
        </div>

        {/* Editor */}
        <div
          ref={editorRef}
          contentEditable
          onInput={updateContent}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onPaste={handlePaste}
          className="px-4 py-3 focus:outline-none prose prose-sm max-w-none"
          style={{ minHeight }}
          data-placeholder={placeholder}
        />
      </div>

      {/* Info */}
      <p className="text-xs text-gray-500">
        Gunakan toolbar di atas untuk memformat teks Anda
      </p>

      {/* Styles for placeholder and content */}
      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          cursor: text;
        }

        [contenteditable] {
          background: white;
        }

        [contenteditable] h1 {
          font-size: 2em;
          font-weight: bold;
          margin-top: 0.5em;
          margin-bottom: 0.5em;
        }

        [contenteditable] h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin-top: 0.5em;
          margin-bottom: 0.5em;
        }

        [contenteditable] blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1em;
          margin-left: 0;
          font-style: italic;
          color: #6b7280;
        }

        [contenteditable] pre {
          background: #f3f4f6;
          padding: 1em;
          border-radius: 0.375rem;
          overflow-x: auto;
          font-family: 'Courier New', monospace;
        }

        [contenteditable] ul,
        [contenteditable] ol {
          padding-left: 2em;
          margin: 0.5em 0;
        }

        [contenteditable] a {
          color: #3b82f6;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}