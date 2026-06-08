'use client';
import { useMemo, useState } from 'react';
import { usePhotos } from '@/hooks/usePhotos';
import PhotoUpload from '@/components/Album/PhotoUpload';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

export default function AlbumPage() {
  const { photos, loading, uploadPhotos, deletePhoto } = usePhotos();

  // 按 (date, caption) 分组为"帖子"
  const grouped = useMemo(() => {
    const map = new Map<string, typeof photos>();
    for (const p of photos) {
      const dateKey = p.date || p.created_at.split('T')[0];
      const key = `${dateKey}|||${p.caption || ''}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(p);
    }
    return Array.from(map.entries())
      .map(([key, items]) => {
        const [dateKey, caption] = key.split('|||');
        return { dateKey, caption, photos: items };
      })
      .sort((a, b) => b.dateKey.localeCompare(a.dateKey));
  }, [photos]);

  const totalCount = photos.length;

  return (
    <div className="h-full flex flex-col pt-6">
      {/* 固定头部 */}
      <div className="shrink-0 space-y-4">
        <div className="h-1 w-16 bg-gradient-to-r from-amber-400 to-amber-300 rounded-full" />
        <div className="pb-1">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-900">我们的回忆</h1>
              <p className="text-gray-500 text-xs mt-0.5">记录每个美好瞬间</p>
            </div>
          </div>
          {!loading && totalCount > 0 && (
            <p className="text-gray-400 text-xs mt-1">共 {totalCount} 张照片 · {grouped.length} 篇</p>
          )}
        </div>
      </div>

      {/* 可滚动内容 */}
      <div className="flex-1 overflow-y-auto min-h-0 mt-4 space-y-4">
        {loading ? (
          <p className="text-center text-gray-400 py-20">加载中...</p>
        ) : totalCount === 0 ? (
          <div className="text-center py-20 space-y-4">
            <div className="text-6xl text-gray-300">📸</div>
            <p className="text-gray-500 text-base font-medium">还没有照片</p>
            <p className="text-gray-400 text-sm">点击右下角的 + 按钮上传第一张照片</p>
          </div>
        ) : (
          <div className="space-y-4 pb-4">
            {grouped.map((post) => (
              <div key={post.dateKey + post.caption} className="bg-white rounded-2xl border border-gray-100 card overflow-hidden">
                {/* 日期标题 */}
                <div className="px-4 pt-4 pb-2 flex items-center gap-2">
                  <span className="w-1 h-4 bg-amber-400 rounded-full inline-block" />
                  <span className="text-sm font-bold text-gray-700">{formatDate(post.dateKey)}</span>
                  <span className="text-xs text-gray-400">{post.photos.length} 张</span>
                </div>

                {/* 文案在上 */}
                {post.caption && (
                  <div className="px-4 pb-3">
                    <p className="text-sm text-gray-600">{post.caption}</p>
                  </div>
                )}

                {/* 照片网格 */}
                <div className={`grid gap-0.5 ${post.photos.length === 1 ? 'grid-cols-1' : post.photos.length === 2 ? 'grid-cols-2' : 'grid-cols-2'}`}>
                  {post.photos.map((photo) => (
                    <Link key={photo.id} href={`/album/${photo.id}`}>
                      <img
                        src={photo.image_url}
                        alt={photo.caption}
                        className={`w-full object-cover ${post.photos.length === 1 ? 'h-72' : 'h-48'}`}
                        loading="lazy"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
