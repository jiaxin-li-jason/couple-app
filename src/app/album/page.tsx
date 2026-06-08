'use client';
import { useMemo, useState } from 'react';
import { usePhotos } from '@/hooks/usePhotos';
import PhotoUpload from '@/components/Album/PhotoUpload';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

export default function AlbumPage() {
  const { photos, loading, uploadPhotos, deletePhoto } = usePhotos();

  // 按日期分组
  const grouped = useMemo(() => {
    const map = new Map<string, typeof photos>();
    for (const p of photos) {
      const key = p.date || p.created_at.split('T')[0];
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(p);
    }
    // 按日期降序排列组
    return Array.from(map.entries()).sort(([a], [b]) => b.localeCompare(a));
  }, [photos]);

  const totalCount = photos.length;

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-rose-400 to-pink-500 -mx-4 px-4 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white">我们的回忆</h1>
            <p className="text-rose-100 text-xs mt-0.5">记录每个美好瞬间</p>
          </div>
        </div>
        {!loading && totalCount > 0 && (
          <p className="text-rose-100 text-xs mt-2 opacity-80">共 {totalCount} 张照片 · {grouped.length} 天</p>
        )}
      </div>

      {loading ? (
        <p className="text-center text-rose-300 py-20">加载中...</p>
      ) : totalCount === 0 ? (
        <div className="text-center py-20 space-y-4">
          <div className="text-7xl animate-bounce">📸</div>
          <p className="text-rose-300 text-lg font-medium">还没有照片</p>
          <p className="text-rose-200 text-sm">点击右下角的 + 按钮上传第一张照片</p>
        </div>
      ) : (
        <div className="space-y-6 pb-4">
          {grouped.map(([dateKey, groupPhotos]) => (
            <div key={dateKey}>
              <h2 className="text-base font-bold text-gray-700 px-1 mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-gradient-to-b from-rose-400 to-pink-500 rounded-full inline-block" />
                {formatDate(dateKey)}
                <span className="text-xs text-gray-400 font-normal">{groupPhotos.length} 张</span>
              </h2>
              {/* 横向滚动轮播 */}
              <div className="flex overflow-x-auto gap-3 pb-1 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
                {groupPhotos.map((photo) => (
                  <Link
                    key={photo.id}
                    href={`/album/${photo.id}`}
                    className="flex-shrink-0 w-72 snap-center"
                  >
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                        <img
                          src={photo.image_url}
                          alt={photo.caption}
                          className="w-full h-64 object-cover"
                          loading="lazy"
                        />
                      {photo.caption && (
                        <div className="px-3 py-2.5">
                          <p className="text-sm text-gray-700 line-clamp-2">{photo.caption}</p>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FAB */}
      <div className="fixed bottom-24 right-6 z-30">
        <PhotoUpload
          onUpload={async (files, caption, date) => {
            await uploadPhotos(files, caption, date);
            toast.success(`成功上传 ${files.length} 张照片！`);
          }}
        />
      </div>
    </div>
  );
}
