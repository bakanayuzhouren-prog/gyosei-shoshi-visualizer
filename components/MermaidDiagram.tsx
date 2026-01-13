import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  code: string;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ code }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      themeVariables: {
        primaryColor: '#e0e7ff', // Indigo 100
        primaryTextColor: '#1e1b4b', // Indigo 950
        primaryBorderColor: '#4338ca', // Indigo 700
        lineColor: '#6366f1', // Indigo 500
        secondaryColor: '#fef3c7', // Amber 100
        tertiaryColor: '#f3f4f6', // Gray 100
      },
      fontFamily: '"Noto Sans JP", sans-serif',
    });
  }, []);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!containerRef.current) return;
      
      try {
        setError(null);
        // Generate a unique ID for each render to prevent collisions
        const uniqueId = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(uniqueId, code);
        setSvgContent(svg);
      } catch (err) {
        console.error("Mermaid Render Error:", err);
        setError("図解の生成に失敗しました。(Syntax Error)");
        // Fallback or retry logic could go here, but usually it's bad syntax
      }
    };

    if (code) {
      renderDiagram();
    }
  }, [code]);

  return (
    <div className="w-full overflow-x-auto p-4 bg-white rounded-xl shadow-sm border border-slate-200 min-h-[300px] flex items-center justify-center">
      {error ? (
        <div className="text-red-500 flex flex-col items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          <p>{error}</p>
          <pre className="text-xs text-gray-400 mt-2 bg-gray-50 p-2 rounded">{code}</pre>
        </div>
      ) : (
        <div 
          ref={containerRef}
          className="mermaid-output w-full h-full flex justify-center"
          dangerouslySetInnerHTML={{ __html: svgContent }} 
        />
      )}
    </div>
  );
};

export default MermaidDiagram;