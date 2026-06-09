'use client';
import { useMemo, useState, useRef } from 'react';
import { usePhotos, Photo } from '@/hooks/usePhotos';
import PhotoUpload from '@/components/Album/PhotoUpload';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';
import { getMonthTag } from '@/lib/utils';
import imageCompression from 'browser-image-compression';

export default function AlbumPage() {
  const { photos, loading, uploadPhotos, refresh } = usePhotos();

  // 菜单 & 编辑状态
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<{ key: string; caption: string; photos: Photo[]; date: string } | null>(null);
  const [addingPhotos, setAddingPhotos] = useState<{ key: string; caption: string; date: string } | null>(null);
  const [newCaption, setNewCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const addFileRef = useRef<HTMLInputElement>(null);
  const [addFiles, setAddFiles] = useState<File[]>([]);
  const [addPreviews, setAddPreviews] = useState<string[]>([]);

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
        return { key, dateKey, caption, photos: items };
      })
      .sort((a, b) => b.dateKey.localeCompare(a.dateKey));
  }, [photos]);

  const totalCount = photos.length;

  // 编辑文案
  const handleEditCaption = async () => {
    if (!editingPost) return;
    const ids = editingPost.photos.map(p => p.id);
    await supabase.from('photos').update({ caption: newCaption }).in('id', ids);
    toast.success('文案已更新');
    setEditingPost(null);
    refresh();
  };

  // 添加照片到已有动态
  const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;
    setAddFiles(prev => [...prev, ...selected]);
    setAddPreviews(prev => [...prev, ...selected.map(f => URL.createObjectURL(f))]);
    e.target.value = '';
  };

  const removeAddFile = (idx: number) => {
    setAddFiles(prev => prev.filter((_, i) => i !== idx));
    setAddPreviews(prev => {
      URL.revokeObjectURL(prev[idx]);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const handleUploadToPost = async () => {
    if (!addingPhotos || addFiles.length === 0) return;
    setUploading(true);
    try {
      const user = await getCurrentUser();
      if (!user) throw new Error('未登录');

      for (const file of addFiles) {
        const compressed = await imageCompression(file, {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1200,
          useWebWorker: true,
        });
        const fileName = `${user.id}/${Date.now()}-${file.name}`;
        await supabase.storage.from('photos').upload(fileName, compressed);
        const { data: urlData } = supabase.storage.from('photos').getPublicUrl(fileName);
        await supabase.from('photos').insert({
          image_url: urlData.publicUrl,
          caption: addingPhotos.caption,
          uploaded_by: user.id,
          date: addingPhotos.date,
          month_tag: getMonthTag(new Date(addingPhotos.date)),
        });
      }
      toast.success(`已添加 ${addFiles.length} 张照片`);
      setAddingPhotos(null);
      setAddFiles([]);
      setAddPreviews([]);
      refresh();
    } catch {
      toast.error('上传失败');
    } finally {
      setUploading(false);
    }
  };

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
              <div key={post.key} className="bg-white rounded-2xl border border-gray-100 card overflow-hidden">
                {/* 日期 + 三点菜单 */}
                <div className="px-4 pt-4 pb-2 flex items-center gap-2">
                  <span className="w-1 h-4 bg-amber-400 rounded-full inline-block" />
                  <span className="flex-1 text-sm font-bold text-gray-700">{formatDate(post.dateKey)}</span>
                  <span className="text-xs text-gray-400">{post.photos.length} 张</span>

                  {/* ⋯ 按钮 */}
                  <div className="relative">
                    <button
                      onClick={() => setOpenMenu(openMenu === post.key ? null : post.key)}
                      className="w-7 h-7 flex items-center justify-center rounded-full text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      ⋯
                    </button>
                    {openMenu === post.key && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setOpenMenu(null)} />
                        <div className="absolute right-0 top-full mt-1 z-50 bg-white rounded-xl shadow-lg border border-gray-100 py-1 min-w-[130px] animate-fade-in">
                          <button
                            onClick={() => {
                              setEditingPost({ key: post.key, caption: post.caption, photos: post.photos, date: post.dateKey });
                              setNewCaption(post.caption);
                              setOpenMenu(null);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            ✏️ 编辑文案
                          </button>
                          <button
                            onClick={() => {
                              setAddingPhotos({ key: post.key, caption: post.caption, date: post.dateKey });
                              setAddFiles([]);
                              setAddPreviews([]);
                              setOpenMenu(null);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            📷 添加照片
                          </button>
                        </div>
                      </>
                    )}
                  </div>
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

      {/* 编辑文案弹窗 */}
      {editingPost && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setEditingPost(null)} />
          <div className="relative w-[calc(100%-2rem)] max-w-lg bg-white rounded-3xl px-6 pt-6 pb-6 animate-slide-up shadow-2xl">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <h3 className="text-base font-bold text-gray-800 text-center mb-5">编辑文案</h3>
            <div className="space-y-4">
              <textarea
                value={newCaption}
                onChange={(e) => setNewCaption(e.target.value)}
                placeholder="写一句话..."
                rows={3}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-300 focus:bg-white transition-all resize-none"
              />
              <div className="flex gap-3">
                <button onClick={() => setEditingPost(null)} className="flex-1 bg-gray-100 text-gray-500 py-3 rounded-xl text-sm font-medium active:scale-[0.98] transition-all">
                  取消
                </button>
                <button onClick={handleEditCaption} className="flex-1 bg-gradient-to-r from-amber-400 to-amber-500 text-white py-3 rounded-xl text-sm font-medium active:scale-[0.98] transition-all shadow-sm shadow-amber-200/50">
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 添加照片弹窗 */}
      {addingPhotos && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => { setAddingPhotos(null); setAddFiles([]); setAddPreviews([]); }} />
          <div className="relative w-[calc(100%-2rem)] max-w-lg bg-white rounded-3xl px-6 pt-6 pb-6 animate-slide-up shadow-2xl max-h-[85vh] flex flex-col">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5 shrink-0" />
            <h3 className="text-base font-bold text-gray-800 text-center mb-4 shrink-0">添加照片</h3>
            <p className="text-xs text-gray-400 text-center mb-4 shrink-0">添加到「{formatDate(addingPhotos.date)}」{addingPhotos.caption ? ` · ${addingPhotos.caption}` : ''}</p>

            <input
              ref={addFileRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleAddFiles}
              className="hidden"
            />

            <div className="flex-1 overflow-y-auto space-y-4">
              {/* 预览 */}
              {addPreviews.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {addPreviews.map((src, i) => (
                    <div key={i} className="relative group">
                      <img src={src} alt="" className="w-full aspect-square object-cover rounded-lg" />
                      <button onClick={() => removeAddFile(i)} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-black/50 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                    </div>
                  ))}
                  <button onClick={() => addFileRef.current?.click()} className="aspect-square flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 hover:bg-gray-100 text-2xl">+</button>
                </div>
              ) : (
                <button onClick={() => addFileRef.current?.click()} className="w-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl py-10 text-gray-500 hover:bg-gray-100 transition-colors text-sm">
                  📷 从相册选择照片
                </button>
              )}
            </div>

            <div className="flex gap-3 pt-4 shrink-0">
              <button onClick={() => { setAddingPhotos(null); setAddFiles([]); setAddPreviews([]); }} className="flex-1 bg-gray-100 text-gray-500 py-3 rounded-xl text-sm font-medium active:scale-[0.98] transition-all">
                取消
              </button>
              <button
                onClick={handleUploadToPost}
                disabled={addFiles.length === 0 || uploading}
                className="flex-1 bg-gradient-to-r from-amber-400 to-amber-500 text-white py-3 rounded-xl text-sm font-medium disabled:opacity-40 active:scale-[0.98] transition-all shadow-sm shadow-amber-200/50"
              >
                {uploading ? '上传中...' : `添加 ${addFiles.length} 张`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
