'use client';
import { useRef } from 'react';

interface Props {
  onPick: (file: File) => void;
  onClose: () => void;
}

export default function ImagePicker({ onPick, onClose }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onPick(file);
  };

  return (
    <div className="bg-gray-50 rounded-xl p-3 mb-2">
      <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleFile} className="hidden" />
      <div className="flex gap-2">
        <button onClick={() => fileRef.current?.click()} className="flex-1 bg-white rounded-xl py-6 text-gray-500 text-sm">
          📷 拍照
        </button>
        <button onClick={onClose} className="flex-1 bg-white rounded-xl py-6 text-gray-400 text-sm">
          ✕ 取消
        </button>
      </div>
    </div>
  );
}
