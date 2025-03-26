'use client';

import { useMemo } from 'react';
import '@mdxeditor/editor/style.css';
import { MDXEditor } from '@mdxeditor/editor/MDXEditor';
import { headingsPlugin } from '@mdxeditor/editor/plugins/headings';
import { listsPlugin } from '@mdxeditor/editor/plugins/lists';
import { linkPlugin } from '@mdxeditor/editor/plugins/link';
import { quotePlugin } from '@mdxeditor/editor/plugins/quote';
import { thematicBreakPlugin } from '@mdxeditor/editor/plugins/thematic-break';
import { toolbarPlugin } from '@mdxeditor/editor/plugins/toolbar';
import { imagePlugin } from '@mdxeditor/editor/plugins/image';
import { codeBlockPlugin } from '@mdxeditor/editor/plugins/codeblock';
import { markdownShortcutPlugin } from '@mdxeditor/editor/plugins/markdown-shortcut';
import { tablePlugin } from '@mdxeditor/editor/plugins/table';
import { AdmonitionDirectiveDescriptor, directivesPlugin } from '@mdxeditor/editor/plugins/directives';
import { diffSourcePlugin } from '@mdxeditor/editor/plugins/diff-source';

interface MarkdownEditorProps {
  markdown: string;
  onChange: (markdown: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  editorStyles?: React.CSSProperties;
}

export default function MarkdownEditorComponent({
  markdown,
  onChange,
  placeholder = 'Write your content here...',
  readOnly = false,
  editorStyles = { height: '500px' }
}: MarkdownEditorProps) {
  // Memoize plugins to prevent unnecessary re-renders
  const plugins = useMemo(() => [
    toolbarPlugin({
      toolbarContents: () => (
        <>
          {/* Add your toolbar items here */}
          <div className="flex flex-wrap gap-2">
            {/* Headings */}
            <div className="flex">
              <select
                className="bg-gray-700 border border-gray-600 text-white px-2 py-1 rounded text-sm"
                onChange={(e) => {
                  document.execCommand('formatBlock', false, e.target.value);
                }}
              >
                <option value="p">Paragraph</option>
                <option value="h1">Heading 1</option>
                <option value="h2">Heading 2</option>
                <option value="h3">Heading 3</option>
                <option value="h4">Heading 4</option>
              </select>
            </div>

            {/* Basic formatting */}
            <button
              className="bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded px-2 py-1"
              title="Bold"
            >
              <strong>B</strong>
            </button>
            <button
              className="bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded px-2 py-1"
              title="Italic"
            >
              <em>I</em>
            </button>
            <button
              className="bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded px-2 py-1"
              title="Link"
            >
              <span className="underline">Link</span>
            </button>

            {/* Lists */}
            <button
              className="bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded px-2 py-1"
              title="Bullet List"
            >
              • List
            </button>
            <button
              className="bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded px-2 py-1"
              title="Numbered List"
            >
              1. List
            </button>

            {/* Code block */}
            <button
              className="bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded px-2 py-1"
              title="Code Block"
            >
              Code
            </button>

            {/* View source */}
            <button
              className="bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded px-2 py-1 ml-auto"
              title="View Source"
            >
              Source
            </button>
          </div>
        </>
      )
    }),
    headingsPlugin(),
    listsPlugin(),
    linkPlugin(),
    quotePlugin(),
    thematicBreakPlugin(),
    codeBlockPlugin({ defaultCodeBlockLanguage: 'js' }),
    markdownShortcutPlugin(),
    imagePlugin(),
    tablePlugin(),
    directivesPlugin({ directiveDescriptors: [AdmonitionDirectiveDescriptor] }),
    diffSourcePlugin()
  ], []);

  return (
    <div className="w-full bg-gray-750 border border-gray-700 rounded-lg overflow-hidden">
      <MDXEditor
        markdown={markdown}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        contentEditableClassName="prose prose-invert max-w-none px-4 py-2 min-h-[300px]"
        plugins={plugins}
        className="bg-gray-700 text-white"
        style={editorStyles}
      />
    </div>
  );
}
