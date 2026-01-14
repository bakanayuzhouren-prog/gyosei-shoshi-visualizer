import React, { useState, useRef } from 'react';
import { LoadingState } from '../types';

interface InputAreaProps {
  onGenerate: (text: string, imageBase64?: string) => void;
  loadingState: LoadingState;
}

const InputArea: React.FC<InputAreaProps> = ({ onGenerate, loadingState }) => {
  const [text, setText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Utility to compress/resize image
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1280; // Reasonable size for text readability
          const MAX_HEIGHT = 1280;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            // Fill white background for transparent PNGs converted to JPEG
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
            // Compress to JPEG at 70% quality
            resolve(canvas.toDataURL('image/jpeg', 0.7));
          } else {
            reject(new Error("Failed to get canvas context"));
          }
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedBase64 = await compressImage(file);
        setSelectedImage(compressedBase64);
      } catch (err) {
        console.error("Image compression failed", err);
        // Fallback or alert user? For now just log.
      }
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !selectedImage) return;

    // Clean base64 for service
    let cleanBase64: string | undefined = undefined;
    if (selectedImage) {
      cleanBase64 = selectedImage.split(',')[1];
    }

    onGenerate(text, cleanBase64);
  };

  const isLoading = loadingState !== LoadingState.IDLE && loadingState !== LoadingState.COMPLETE && loadingState !== LoadingState.ERROR;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-50">
      <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
        学習メモ・条文を入力
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image Preview Area */}
        {selectedImage && (
          <div className="relative inline-block group">
            <img
              src={selectedImage}
              alt="Preview"
              className="h-32 w-auto rounded-lg border border-slate-200 object-cover"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
        )}

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="ここに条文や、わからなかった判例の要旨、あるいは自分の手書きメモの補足を入力してください..."
          className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all min-h-[120px] resize-y text-slate-700 placeholder-slate-400"
          disabled={isLoading}
        />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-dashed border-indigo-300 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 cursor-pointer transition-colors w-full sm:w-auto ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleImageUpload}
                disabled={isLoading}
              />
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
              <span>カメラで撮る</span>
            </label>

            <label className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-dashed border-indigo-300 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 cursor-pointer transition-colors w-full sm:w-auto ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={isLoading}
              />
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
              <span>画像を追加</span>
            </label>
            <span className="text-xs text-slate-400 hidden sm:inline">メモや条文の写真</span>
          </div>

          <button
            type="submit"
            disabled={isLoading || (!text && !selectedImage)}
            className={`w-full sm:w-auto px-8 py-3 rounded-lg font-bold text-white shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95
              ${isLoading || (!text && !selectedImage)
                ? 'bg-slate-300 cursor-not-allowed shadow-none'
                : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>図解中...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                <span>図解する</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputArea;