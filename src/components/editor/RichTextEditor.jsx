import React, { useRef } from 'react';
import { 
  FiBold, 
  FiItalic, 
  FiUnderline, 
  FiList, 
  FiAlignLeft, 
  FiAlignCenter, 
  FiAlignRight,
  FiLink
} from 'react-icons/fi';

const RichTextEditor = ({ value, onChange, placeholder = "Write something..." }) => {
  const editorRef = useRef();

  // Execute editor command
  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
    onChange(editorRef.current.innerHTML);
  };

  // Handle paste to clean formatting
  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50 dark:bg-gray-800">
        <button
          onClick={() => execCommand('bold')}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded 
                   text-gray-700 dark:text-gray-300 transition-colors"
          title="Bold (Ctrl+B)"
          type="button"
        >
          <FiBold className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => execCommand('italic')}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded 
                   text-gray-700 dark:text-gray-300 transition-colors"
          title="Italic (Ctrl+I)"
          type="button"
        >
          <FiItalic className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => execCommand('underline')}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded 
                   text-gray-700 dark:text-gray-300 transition-colors"
          title="Underline (Ctrl+U)"
          type="button"
        >
          <FiUnderline className="w-4 h-4" />
        </button>
        
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
        
        <button
          onClick={() => execCommand('insertUnorderedList')}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded 
                   text-gray-700 dark:text-gray-300 transition-colors"
          title="Bullet List"
          type="button"
        >
          <FiList className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => execCommand('justifyLeft')}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded 
                   text-gray-700 dark:text-gray-300 transition-colors"
          title="Align Left"
          type="button"
        >
          <FiAlignLeft className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => execCommand('justifyCenter')}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded 
                   text-gray-700 dark:text-gray-300 transition-colors"
          title="Align Center"
          type="button"
        >
          <FiAlignCenter className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => execCommand('justifyRight')}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded 
                   text-gray-700 dark:text-gray-300 transition-colors"
          title="Align Right"
          type="button"
        >
          <FiAlignRight className="w-4 h-4" />
        </button>
        
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
        
        <button
          onClick={() => {
            const url = prompt('Enter URL:');
            if (url) execCommand('createLink', url);
          }}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded 
                   text-gray-700 dark:text-gray-300 transition-colors"
          title="Insert Link"
          type="button"
        >
          <FiLink className="w-4 h-4" />
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className="p-4 min-h-[200px] outline-none bg-white dark:bg-gray-900
                 text-gray-900 dark:text-gray-100 prose dark:prose-invert max-w-none"
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        onPaste={handlePaste}
        dangerouslySetInnerHTML={{ __html: value }}
        data-placeholder={placeholder}
      />
    </div>
  );
};

export default RichTextEditor;