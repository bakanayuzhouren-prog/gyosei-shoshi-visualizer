import React, { useState } from 'react';
import Header from './components/Header';
import InputArea from './components/InputArea';
import ResultView from './components/ResultView';
import { DiagramResponse, LoadingState } from './types';
import { generateDiagram } from './services/geminiService';

const App: React.FC = () => {
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [result, setResult] = useState<DiagramResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (text: string, imageBase64?: string) => {
    setLoadingState(LoadingState.READING);
    setError(null);
    setResult(null);

    // Simulate phases for better UX (optional but nice)
    setTimeout(() => setLoadingState(LoadingState.THINKING), 1000);

    try {
      const data = await generateDiagram(text, imageBase64);
      setLoadingState(LoadingState.DRAWING);

      // Small delay to show the "Drawing" state
      setTimeout(() => {
        setResult(data);
        setLoadingState(LoadingState.COMPLETE);
      }, 800);

    } catch (err: any) {
      console.error(err);
      setError(err instanceof Error ? err.message : "エラーが発生しました。もう一度お試しください。");
      setLoadingState(LoadingState.ERROR);
    }
  };

  const renderLoadingMessage = () => {
    switch (loadingState) {
      case LoadingState.READING: return "条文・メモを読み込んでいます...";
      case LoadingState.THINKING: return "法的論点を整理中...";
      case LoadingState.DRAWING: return "図解を描画しています...";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Header />

      <main className="flex-grow w-full max-w-5xl mx-auto px-4 py-8 flex flex-col gap-8">

        {/* Intro / Description */}
        {!result && loadingState === LoadingState.IDLE && (
          <div className="text-center py-10 px-4">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              難解な条文を、<span className="text-indigo-600">一瞬で図解</span>。
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto mb-8">
              行政書士試験の学習において、「文字だけでは理解しにくい」条文や判例、手書きのメモをアップロードしてください。
              AIが法的関係性を整理し、分かりやすい図とポイントにまとめます。
            </p>
          </div>
        )}

        {/* Input Section */}
        <div className="w-full">
          <InputArea onGenerate={handleGenerate} loadingState={loadingState} />
        </div>

        {/* Loading Indicator */}
        {loadingState !== LoadingState.IDLE && loadingState !== LoadingState.COMPLETE && loadingState !== LoadingState.ERROR && (
          <div className="flex flex-col items-center justify-center py-12 animate-pulse">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-indigo-800 font-medium text-lg">{renderLoadingMessage()}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <div>
              <p className="font-bold">生成エラー</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Result Section */}
        {result && loadingState === LoadingState.COMPLETE && (
          <ResultView data={result} />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-5xl mx-auto px-4 text-center text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} Gyosei Shoshi Visualizer. Powered by Google Gemini.
        </div>
      </footer>
    </div>
  );
};

export default App;