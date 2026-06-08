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
  const albumRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  if (!show) {
    return (
      <button
        onClick={() => setShow(true)}
        className="w-14 h-14 bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-full shadow-xl shadow-rose-500/30 flex items-center justify-center text-2xl active:scale-90 transition-transform hover:shadow-2xl hover:shadow-rose-500/40"
      >
        +
      </button>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 space-y-3 shadow-lg border border-rose-100 relative z-20">
      <input ref={albumRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={handleFile} className="hidden" />
      {!preview ? (
        <div className="flex gap-2">
          <button onClick={() => albumRef.current?.click()} className="flex-1 bg-rose-50 border-2 border-dashed border-rose-200 rounded-xl py-8 text-rose-400 hover:bg-rose-100 transition-colors">
            📁 从相册选择
          </button>
          <button onClick={() => cameraRef.current?.click()} className="flex-1 bg-rose-50 border-2 border-dashed border-rose-200 rounded-xl py-8 text-rose-400 hover:bg-rose-100 transition-colors">
            📷 拍照
          </button>
        </div>
      ) : (
        <img src={preview} alt="预览" className="w-full rounded-xl max-h-64 object-cover shadow-sm" />
      )}
      <input
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="写一句话..."
        className="w-full bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 outline-none focus:border-rose-400 focus:bg-white transition-colors"
      />
      <div className="flex gap-2">
        <button
          onClick={async () => {
            const file = albumRef.current?.files?.[0] || cameraRef.current?.files?.[0];
            if (!file) return;
            setUploading(true);
            await onUpload(file, caption);
            setUploading(false);
            setCaption(''); setPreview(null); setShow(false);
          }}
          disabled={(!albumRef.current?.files?.[0] && !cameraRef.current?.files?.[0]) || uploading}
          className="flex-1 bg-gradient-to-r from-rose-400 to-pink-500 text-white py-2.5 rounded-xl font-medium disabled:opacity-40 shadow-lg shadow-rose-500/20"
        >
          {uploading ? '上传中...' : '上传'}
        </button>
        <button onClick={() => setShow(false)} className="flex-1 bg-gray-100 text-gray-400 py-2.5 rounded-xl">取消</button>
      </div>
    </div>
  );
}
