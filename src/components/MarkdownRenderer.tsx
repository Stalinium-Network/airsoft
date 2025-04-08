"use client";

import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  // Note: useEffect is an example of client-side hydration that might be used
  // for things like syntax highlighting libraries that need DOM access
  useEffect(() => {
    // Any initialization code that needs to run in the browser
    // For example, if we wanted to activate specific plugins on rendered elements

    // Находим все элементы с классом card-container и добавляем интерактивность при необходимости
    const cardContainers = document.querySelectorAll(".card-container");
    cardContainers.forEach((container) => {
      // Здесь можно добавить любую нужную клиентскую логику для карточек
    });
  }, []);

  // Преобразуем markdown контент для поддержки разметки карточек
  const processedContent = content.replace(
    /:::card\s+(.*?)\s*\n([\s\S]*?)\n:::/g,
    (_, title, content) => {
      return `<div class="card">
        <div class="card-title">${title}</div>
        <div class="card-content">${content.trim()}</div>
      </div>`;
    }
  );

  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1
              className="text-3xl font-bold mt-8 mb-4 text-zone-gold-lite"
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <h2
              className="mb-2 text-2xl bg-gradient-to-r from-60% from-white to bg-zone-gold-lite bg-clip-text text-transparent w-fit pr-4"
              {...props}
            />
          ),
          h3: ({ node, ...props }) => (
            <h3
              className="text-xl font-bold mt-4 mb-2 text-zone-gold-lite"
              {...props}
            />
          ),
          h4: ({ node, ...props }) => (
            <h3
              className="text-lg font-bold mt-4 mb-2 text-zone-gold-lite"
              {...props}
            />
          ),
          p: ({ node, ...props }) => (
            <p className="mb-4 text-gray-300" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-6 mb-4" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-6 mb-4" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="mb-1 text-gray-300" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a
              className="text-zone-gold-lite hover:text-zone-gold underline"
              {...props}
            />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-zone-gold-lite pl-4 italic text-gray-400 my-4"
              {...props}
            />
          ),
          img: ({ node, alt, src, ...props }) => (
            <div className="my-4">
              <img
                src={src}
                alt={alt || ""}
                className="rounded-lg max-w-full mx-auto"
                {...props}
              />
              {alt && (
                <p className="text-center text-sm text-gray-500 mt-2">{alt}</p>
              )}
            </div>
          ),
          code: ({ node, inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                className="rounded-md my-4"
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code
                className="bg-zone-dark-brown/40 px-1.5 py-0.5 rounded text-sm text-zone-gold-lite"
                {...props}
              >
                {children}
              </code>
            );
          },
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-4">
              <table
                className="min-w-full divide-y divide-gray-700 border border-gray-700"
                {...props}
              />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-zone-dark-brown/80" {...props} />
          ),
          tbody: ({ node, ...props }) => (
            <tbody
              className="bg-zone-dark divide-y divide-gray-800"
              {...props}
            />
          ),
          th: ({ node, ...props }) => (
            <th
              className="px-4 py-3 text-left text-xs font-medium text-zone-gold-lite uppercase tracking-wider"
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td
              className="px-4 py-3 whitespace-nowrap text-sm text-gray-300"
              {...props}
            />
          ),
          hr: ({ node, ...props }) => (
            <hr className="my-6 border-zone-dark-brown/60" {...props} />
          ),

          // Обработка DIV и других HTML элементов для карточек
          div: ({ node, className, children, ...props }) => {
            if (className === "card") {
              return (
                <div
                  className="bg-zone-dark-light rounded-lg px-6 py-6 my-6"
                  {...props}
                >
                  {children}
                </div>
              );
            }
            if (className === "card-title") {
              return (
                <h3
                  className="text-xl font-bold mb-3 text-zone-gold-lite"
                  {...props}
                >
                  {children}
                </h3>
              );
            }
            if (className === "card-content") {
              return (
                <div className="text-gray-300" {...props}>
                  {children}
                </div>
              );
            }
            if (className === "card-container") {
              return (
                <div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-6 my-4"
                  {...props}
                >
                  {children}
                </div>
              );
            }
            return (
              <div className={className} {...props}>
                {children}
              </div>
            );
          },
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
