import React, { SVGProps, useState } from 'react';

interface SvgCopyProps extends SVGProps<SVGSVGElement> {
  textToCopy?: string;
}

export const SvgCopy: React.FC<SvgCopyProps> = ({ textToCopy, className, ...props }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Find the closest text content to copy
    const textElement = e.currentTarget.closest('.flex')?.querySelector('.whitespace-pre-wrap');
    const textContent = textToCopy || textElement?.textContent || '';
    
    navigator.clipboard.writeText(textContent).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      (err) => console.error('Could not copy text: ', err)
    );
  };

  return (
    <div className="relative" onClick={handleCopy}>
      {copied && (
        <span className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-700 text-xs rounded shadow">
          Copied!
        </span>
      )}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className || "w-5 h-5"}
        {...props}
      >
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
      </svg>
    </div>
  );
};
