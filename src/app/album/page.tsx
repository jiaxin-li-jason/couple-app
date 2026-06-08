'use client';
import { useState } from 'react';
import { usePhotos } from '@/hooks/usePhotos';
import PhotoUpload from '@/components/Album/PhotoUpload';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

export default function AlbumPage() {
  const { photos, loading, uploadPhoto, deletePhoto } = usePhotos();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-rose-400 to-pink-500 -mx-4 px-4 pt-6 pb-4">
        <div>
          <h1 className="text-lg font-bold text-white">我们的回忆</h1>
          <p className="text-rose-100 text-xs mt-0.5">记录每个美好瞬间</p>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-rose-300 py-20">加载中...</p>
      ) : photos.length === 0 ? (
        <p className="text-center text-rose-300 py-20">还没有照片，上传第一张吧 📷</p>
      ) : (
        <div className="space-y-4 pb-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <Link
                href={`/album/${photo.id}`}
                className="block"
              >
                <div className="px-4 pt-3 pb-1">
                  <p className="text-xs text-rose-400 font-medium">
                    {formatDate(photo.date || photo.created_at)}
                  </p>
                </div>
                <img
                  src={photo.image_url}
                  alt={photo.caption}
                  className="w-full aspect-square object-cover"
                  loading="lazy"
                />
                {photo.caption && (
                  <div className="px-4 py-3">
                    <p className="text-sm text-gray-700">{photo.caption}</p>
                  </div>
                )}
              </Link>
              <button
                onClick={async (e) => {
                  e.preventDefault();
                  if (deletingId === photo.id) {
                    try {
                      await deletePhoto(photo.id);
                      toast.success('已删除');
                    } catch {
                      toast.error('删除失败');
                    }
                    setDeletingId(null);
                  } else {
                    setDeletingId(photo.id);
                  }
                }}
                className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-black/40 text-white text-sm hover:bg-black/60 transition-colors"
              >
                {deletingId === photo.id ? '✓' : '✕'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* FAB */}
      <div className="fixed bottom-24 right-6 z-30">
        <PhotoUpload
          onUpload={async (file, caption, date) => {
            await uploadPhoto(file, caption, date);
            toast.success('照片已上传！');
          }}
        />
      </div>
    </div>
  );
}
