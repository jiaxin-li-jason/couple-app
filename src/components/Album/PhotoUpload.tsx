'use client';
import { useRef, useState } from 'react';

interface Props {
  onUpload: (files: File[], caption: string, date: string) => Promise<void>;
}

export default function PhotoUpload({ onUpload }: Props) {
  const [show, setShow] = useState(false);
  const [caption, setCaption] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const albumRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;
    setFiles((prev) => [...prev, ...selected]);
    setPreviews((prev) => [...prev, ...selected.map((f) => URL.createObjectURL(f))]);
    // 重置 input 值，允许重复选择同一文件
    e.target.value = '';
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[idx]);
      return prev.filter((_, i) => i !== idx);
    });
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
    <div className="bg-white rounded-2xl p-4 space-y-3 shadow-lg border border-rose-100 relative z-20 max-h-[80vh] overflow-y-auto">
      <input
        ref={albumRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFile}
        className="hidden"
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFile}
        className="hidden"
      />

      {previews.length === 0 ? (
        <div className="flex gap-2">
          <button onClick={() => albumRef.current?.click()} className="flex-1 bg-rose-50 border-2 border-dashed border-rose-200 rounded-xl py-8 text-rose-400 hover:bg-rose-100 transition-colors">
            📁 从相册选择
          </button>
          <button onClick={() => cameraRef.current?.click()} className="flex-1 bg-rose-50 border-2 border-dashed border-rose-200 rounded-xl py-8 text-rose-400 hover:bg-rose-100 transition-colors">
            📷 拍照
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {previews.map((src, i) => (
            <div key={i} className="relative group">
              <img src={src} alt={`预览 ${i + 1}`} className="w-full aspect-square object-cover rounded-xl shadow-sm" />
              <button
                onClick={() => removeFile(i)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-black/50 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            onClick={() => albumRef.current?.click()}
            className="aspect-square flex items-center justify-center bg-rose-50 border-2 border-dashed border-rose-200 rounded-xl text-rose-400 hover:bg-rose-100 transition-colors text-2xl"
          >
            +
          </button>
        </div>
      )}

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 outline-none focus:border-rose-400 focus:bg-white transition-colors text-sm text-gray-700"
      />
      <input
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="写一句话（所有照片共用）..."
        className="w-full bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 outline-none focus:border-rose-400 focus:bg-white transition-colors"
      />

      <div className="flex gap-2">
        <button
          onClick={async () => {
            if (files.length === 0) return;
            setUploading(true);
            try {
              await onUpload(files, caption, date);
            } finally {
              setUploading(false);
              setFiles([]);
              setPreviews([]);
              setCaption('');
              setDate(new Date().toISOString().split('T')[0]);
              setShow(false);
            }
          }}
          disabled={files.length === 0 || uploading}
          className="flex-1 bg-gradient-to-r from-rose-400 to-pink-500 text-white py-2.5 rounded-xl font-medium disabled:opacity-40 shadow-lg shadow-rose-500/20"
        >
          {uploading ? '上传中...' : `上传 ${files.length} 张`}
        </button>
        <button onClick={() => {
          setFiles([]);
          setPreviews([]);
          setShow(false);
        }} className="flex-1 bg-gray-100 text-gray-400 py-2.5 rounded-xl">
          取消
        </button>
      </div>
    </div>
  );
}
