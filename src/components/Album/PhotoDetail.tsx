'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';
import { formatDate } from '@/lib/utils';
import { Photo } from '@/hooks/usePhotos';
import toast from 'react-hot-toast';

interface Props {
  photo: Photo;
  groupPhotos: Photo[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

interface Comment {
  id: string;
  user_id: string;
  text: string;
  created_at: string;
}

export default function PhotoDetail({ photo, groupPhotos, currentIndex, onNavigate }: Props) {
  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>([]);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [userId, setUserId] = useState('');
  const [userMap, setUserMap] = useState<Record<string, { nickname: string; avatar_url: string | null }>>({});
  const [editingCaption, setEditingCaption] = useState(false);
  const [newCaption, setNewCaption] = useState(photo.caption || '');
  const [showMenu, setShowMenu] = useState(false);
  const touchStart = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchMeta = useCallback(async () => {
    const user = await getCurrentUser();
    if (user) setUserId(user.id);

    const { data: likes } = await supabase.from('likes').select('*').eq('photo_id', photo.id);
    setLikeCount(likes?.length || 0);
    setLiked(likes?.some((l) => l.user_id === user?.id) || false);

    const { data: cmts } = await supabase.from('comments').select('*').eq('photo_id', photo.id).order('created_at', { ascending: true });
    setComments(cmts || []);

    const userIds = (cmts || []).map(c => c.user_id).filter((id, i, arr) => arr.indexOf(id) === i);
    if (userIds.length > 0) {
      const { data: users } = await supabase.from('users').select('id, nickname, avatar_url').in('id', userIds);
      if (users) {
        const map: Record<string, { nickname: string; avatar_url: string | null }> = {};
        users.forEach(u => { map[u.id] = { nickname: u.nickname, avatar_url: u.avatar_url }; });
        setUserMap(map);
      }
    }
  }, [photo.id]);

  useEffect(() => { fetchMeta(); }, [fetchMeta]);

  const toggleLike = async () => {
    const user = await getCurrentUser();
    if (!user) return;
    if (liked) {
      await supabase.from('likes').delete().eq('photo_id', photo.id).eq('user_id', user.id);
      setLikeCount((c) => c - 1);
      setLiked(false);
    } else {
      await supabase.from('likes').insert({ photo_id: photo.id, user_id: user.id });
      setLikeCount((c) => c + 1);
      setLiked(true);
    }
  };

  const addComment = async () => {
    if (!commentText.trim()) return;
    const user = await getCurrentUser();
    if (!user) return;
    await supabase.from('comments').insert({ photo_id: photo.id, user_id: user.id, text: commentText.trim() });
    setCommentText('');
    toast.success('评论成功');
    fetchMeta();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < groupPhotos.length - 1) {
        onNavigate(currentIndex + 1);
      } else if (diff < 0 && currentIndex > 0) {
        onNavigate(currentIndex - 1);
      }
    }
  };

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < groupPhotos.length - 1;

  return (
    <div className="h-full flex flex-col bg-[#FAFAF8]">
      {/* 顶部导航栏 */}
      <div className="shrink-0 bg-white border-b border-gray-200 flex items-center px-4 py-3 z-10">
        <button onClick={() => router.back()} className="text-gray-500 mr-4 font-medium text-sm hover:text-gray-700 transition-colors">← 返回</button>
        <span className="flex-1 text-sm font-medium text-gray-500">
          {formatDate(photo.date || photo.created_at)}
          {groupPhotos.length > 1 && (
            <span className="text-gray-400 ml-2">
              {currentIndex + 1}/{groupPhotos.length}
            </span>
          )}
        </span>

        {/* 三点菜单 */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors text-lg"
          >
            ⋯
          </button>
          {showMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-full mt-1 z-50 bg-white rounded-xl shadow-lg border border-gray-100 py-1 min-w-[120px] animate-fade-in">
                <button onClick={() => { setNewCaption(photo.caption || ''); setEditingCaption(true); setShowMenu(false); }} className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  ✏️ 编辑
                </button>
                <div className="h-px bg-gray-100 mx-2" />
                <button onClick={async () => { setShowMenu(false); if (window.confirm('确定要删除这张照片吗？')) { await supabase.from('photos').delete().eq('id', photo.id); toast.success('已删除'); router.back(); } }} className="w-full px-4 py-2.5 text-left text-sm text-red-500 hover:bg-red-50 flex items-center gap-2">
                  🗑️ 删除
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 可滚动内容区 */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {/* 照片 */}
        <div
          ref={containerRef}
          className="bg-black relative select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <img src={photo.image_url} alt={photo.caption} className="w-full aspect-square object-cover" />

          {hasPrev && (
            <button
              onClick={() => onNavigate(currentIndex - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center text-gray-700 shadow-md hover:bg-white transition-colors"
            >
              ‹
            </button>
          )}
          {hasNext && (
            <button
              onClick={() => onNavigate(currentIndex + 1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center text-gray-700 shadow-md hover:bg-white transition-colors"
            >
              ›
            </button>
          )}

          {groupPhotos.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {groupPhotos.map((_, i) => (
                <span
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    i === currentIndex ? 'bg-white w-3' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* 文案 + 互动 */}
        <div className="p-4 space-y-4">
          {photo.caption && <p className="text-gray-700 font-medium">{photo.caption}</p>}

          <div className="flex items-center gap-4">
            <button onClick={toggleLike} className={`text-lg ${liked ? 'text-red-500' : 'text-gray-400'}`}>
              {liked ? '❤️' : '🤍'} {likeCount}
            </button>
            <span className="text-gray-400">💬 {comments.length}</span>
          </div>

          {/* 评论列表 */}
          {comments.length > 0 && (
            <div className="space-y-3 pt-2">
              {comments.map((c) => {
                const user = userMap[c.user_id];
                return (
                  <div key={c.id} className="bg-white rounded-lg px-4 py-2.5 border border-gray-100">
                    <div className="flex items-center gap-2 mb-1.5">
                      {user?.avatar_url ? (
                        <img src={user.avatar_url} alt="" className="w-6 h-6 rounded-full object-cover" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-500">
                          {user?.nickname?.charAt(0) || '?'}
                        </div>
                      )}
                      <span className="text-xs font-medium text-gray-600">{user?.nickname || '匿名'}</span>
                    </div>
                    <p className="text-sm text-gray-700">{c.text}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(c.created_at)}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* 底部留白，确保最后一条评论不被输入框遮挡 */}
          <div className="h-20" />
        </div>
      </div>

      {/* 固定底部评论输入框 */}
      <div className="shrink-0 bg-white border-t border-gray-200 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
        <div className="flex gap-2">
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') addComment(); }}
            placeholder="写评论..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:bg-white transition-colors"
          />
          <button onClick={addComment} className="bg-amber-500 text-white px-4 py-2.5 rounded-full text-sm font-medium active:scale-[0.98] transition-all">
            发送
          </button>
        </div>
      </div>

      {/* 编辑文案弹窗 */}
      {editingCaption && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setEditingCaption(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl rounded-b-none px-6 pt-6 pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))] animate-slide-up">
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
              <div className="flex gap-3 pt-1">
                <button onClick={() => setEditingCaption(false)} className="flex-1 bg-gray-100 text-gray-500 py-3 rounded-xl text-sm font-medium active:scale-[0.98] transition-all">
                  取消
                </button>
                <button
                  onClick={async () => {
                    await supabase.from('photos').update({ caption: newCaption }).eq('id', photo.id);
                    toast.success('已更新');
                    setEditingCaption(false);
                    router.refresh();
                  }}
                  className="flex-1 bg-gradient-to-r from-amber-400 to-amber-500 text-white py-3 rounded-xl text-sm font-medium active:scale-[0.98] transition-all shadow-sm shadow-amber-200/50"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
