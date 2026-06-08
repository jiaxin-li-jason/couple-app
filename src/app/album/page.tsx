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
    <div className="pt-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold text-gray-800">我们的回忆</h1>
        <div className="flex bg-gray-100 rounded-lg p-0.5">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 rounded-md text-xs ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
          >
            🟩 网格
          </button>
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-3 py-1 rounded-md text-xs ${viewMode === 'timeline' ? 'bg-white shadow-sm' : ''}`}
          >
            📅 时间线
          </button>
        </div>
      </div>

      <PhotoUpload
        onUpload={async (file, caption) => {
          await uploadPhoto(file, caption);
          toast.success('照片已上传！');
        }}
      />

      {loading ? (
        <p className="text-center text-gray-400 py-20">加载中...</p>
      ) : photos.length === 0 ? (
        <p className="text-center text-gray-400 py-20">还没有照片，上传第一张吧 📷</p>
      ) : viewMode === 'grid' ? (
        <PhotoGrid photos={photos} onDelete={deletePhoto} />
      ) : (
        <Timeline photos={photos} />
      )}
    </div>
  );
}
