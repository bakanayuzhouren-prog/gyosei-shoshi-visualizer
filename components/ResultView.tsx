import React from 'react';
import { DiagramResponse } from '../types';
import MermaidDiagram from './MermaidDiagram';

interface ResultViewProps {
  data: DiagramResponse;
}

const ResultView: React.FC<ResultViewProps> = ({ data }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title & Summary Card */}
      <div className="bg-white rounded-2xl shadow-md border-l-4 border-indigo-500 overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">{data.title}</h2>
          <p className="text-slate-600 leading-relaxed">{data.summary}</p>
        </div>
      </div>

      {/* Diagram Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-100 px-6 py-3 flex items-center justify-between">
          <h3 className="font-bold text-slate-700 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            関係図・フロー
          </h3>
          <span className="text-xs text-slate-400 bg-white px-2 py-1 rounded border border-slate-200">Mermaid.js Generated</span>
        </div>
        <div className="p-2 sm:p-6 bg-slate-50/50">
          <MermaidDiagram code={data.mermaidCode} />
        </div>
      </div>

      {/* Key Points Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.keyPoints.map((kp, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="bg-amber-100 text-amber-700 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0 text-sm">
                {idx + 1}
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-1">{kp.point}</h4>
                <p className="text-sm text-slate-600 leading-snug">{kp.explanation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultView;