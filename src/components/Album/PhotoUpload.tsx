'use client';
import { useRef, useState } from 'react';

interface Props {
  onUpload: (file: File, caption: string) => Promise<void>;
}

export default function PhotoUpload({ onUpload }: Props) {
  const [show, setShow] = useState(false);
  const [caption, setCaption] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  if (!show) {
    return (
      <button
        onClick={() => setShow(true)}
        className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm active:border-primary-300"
      >
        + 上传照片
      </button>
    );
  }

  return (
    <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
      <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleFile} className="hidden" />
      {!preview ? (
        <button onClick={() => fileRef.current?.click()} className="w-full bg-white border border-gray-200 rounded-xl py-8 text-gray-400">
          📷 选择照片或拍照
        </button>
      ) : (
        <img src={preview} alt="预览" className="w-full rounded-xl max-h-64 object-cover" />
      )}
      <input
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="写一句话..."
        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary-400"
      />
      <div className="flex gap-2">
        <button
          onClick={async () => {
            const file = fileRef.current?.files?.[0];
            if (!file) return;
            setUploading(true);
            await onUpload(file, caption);
            setUploading(false);
            setCaption(''); setPreview(null); setShow(false);
          }}
          disabled={!fileRef.current?.files?.[0] || uploading}
          className="flex-1 bg-primary-500 text-white py-2.5 rounded-xl font-medium disabled:opacity-40"
        >
          {uploading ? '上传中...' : '上传'}
        </button>
        <button onClick={() => setShow(false)} className="flex-1 bg-white text-gray-400 py-2.5 rounded-xl">取消</button>
      </div>
    </div>
  );
}
