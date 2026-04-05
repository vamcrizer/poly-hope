'use client';

import { useState } from 'react';

interface DocsCodeTabsProps {
  curlExample: string;
  pythonExample: string;
}

export function DocsCodeTabs({ curlExample, pythonExample }: DocsCodeTabsProps) {
  const [active, setActive] = useState<'curl' | 'python'>('curl');

  return (
    <div className="rounded-xl border border-gray-800 overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-gray-800 bg-gray-900/60">
        <button
          onClick={() => setActive('curl')}
          className={`px-5 py-3 text-sm font-medium font-mono transition-colors ${
            active === 'curl'
              ? 'text-white border-b-2 border-emerald-500 bg-gray-950/60'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          curl
        </button>
        <button
          onClick={() => setActive('python')}
          className={`px-5 py-3 text-sm font-medium font-mono transition-colors ${
            active === 'python'
              ? 'text-white border-b-2 border-emerald-500 bg-gray-950/60'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Python
        </button>
      </div>

      {/* Code panel */}
      <pre className="p-5 text-sm font-mono text-gray-300 overflow-x-auto bg-gray-950 leading-relaxed">
        {active === 'curl' ? curlExample : pythonExample}
      </pre>
    </div>
  );
}
