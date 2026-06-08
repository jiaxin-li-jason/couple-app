'use client';
import { useState, useRef } from 'react';
import ImagePicker from './ImagePicker';

interface Props {
  onSendText: (text: string) => Promise<void>;
  onSendImage: (file: File) => Promise<void>;
}

export default function ChatInput({ onSendText, onSendImage }: Props) {
  const [text, setText] = useState('');
  const [showImagePicker, setShowImagePicker] = useState(false);

  const handleSend = async () => {
    if (!text.trim()) return;
    await onSendText(text);
    setText('');
  };

  return (
    <div className="border-t border-rose-100 pt-2 pb-safe bg-white rounded-t-2xl shadow-sm">
      {showImagePicker && (
        <ImagePicker
          onPick={async (file) => {
            await onSendImage(file);
            setShowImagePicker(false);
          }}
          onClose={() => setShowImagePicker(false)}
        />
      )}
      <div className="flex items-center gap-2 px-2">
        <button onClick={() => setShowImagePicker(true)} className="text-xl text-gray-400 active:text-rose-500">📷</button>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
          placeholder="输入消息..."
          className="flex-1 bg-rose-50 rounded-full px-4 py-2.5 outline-none text-sm focus:bg-white focus:ring-2 focus:ring-rose-200 transition-all"
        />
        <button onClick={handleSend} className="bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-full w-9 h-9 flex items-center justify-center text-sm active:scale-90 transition-transform shadow-lg shadow-rose-500/20">
          ↑
        </button>
      </div>
    </div>
  );
}
