'use client';
import { useState } from 'react';
import { usePhotos } from '@/hooks/usePhotos';
import PhotoGrid from '@/components/Album/PhotoGrid';
import Timeline from '@/components/Album/Timeline';
import PhotoUpload from '@/components/Album/PhotoUpload';
import toast from 'react-hot-toast';

export default function AlbumPage() {
  const { photos, loading, uploadPhoto, deletePhoto } = usePhotos();
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-rose-400 to-pink-500 -mx-4 px-4 pt-6 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-lg font-bold text-white">我们的回忆</h1>
          <p className="text-rose-100 text-xs mt-0.5">记录每个美好瞬间</p>
        </div>
        <div className="flex bg-white/20 rounded-lg p-0.5 backdrop-blur">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 rounded-md text-xs ${viewMode === 'grid' ? 'bg-white text-rose-500 shadow-sm' : 'text-white/80'}`}
          >
            🟩 网格
          </button>
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-3 py-1 rounded-md text-xs ${viewMode === 'timeline' ? 'bg-white text-rose-500 shadow-sm' : 'text-white/80'}`}
          >
            📅 时间线
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-rose-300 py-20">加载中...</p>
      ) : photos.length === 0 ? (
        <p className="text-center text-rose-300 py-20">还没有照片，上传第一张吧 📷</p>
      ) : viewMode === 'grid' ? (
        <PhotoGrid photos={photos} onDelete={deletePhoto} />
      ) : (
        <Timeline photos={photos} />
      )}

      {/* FAB */}
      <div className="fixed bottom-24 right-6 z-30">
        <PhotoUpload
          onUpload={async (file, caption) => {
            await uploadPhoto(file, caption);
            toast.success('照片已上传！');
          }}
        />
      </div>
    </div>
  );
}
