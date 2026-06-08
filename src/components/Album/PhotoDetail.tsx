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
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="sticky top-0 bg-white border-b border-gray-200 flex items-center px-4 py-3 z-10">
        <button onClick={() => router.back()} className="text-gray-500 mr-4 font-medium text-sm hover:text-gray-700 transition-colors">← 返回</button>
        <span className="text-sm font-medium text-gray-500">
          {formatDate(photo.date || photo.created_at)}
          {groupPhotos.length > 1 && (
            <span className="text-gray-400 ml-2">
              {currentIndex + 1}/{groupPhotos.length}
            </span>
          )}
        </span>
      </div>

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
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center text-gray-700 shadow-md hover:bg-white transition-colors opacity-0 md:opacity-100"
          >
            ‹
          </button>
        )}
        {hasNext && (
          <button
            onClick={() => onNavigate(currentIndex + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center text-gray-700 shadow-md hover:bg-white transition-colors opacity-0 md:opacity-100"
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

      <div className="p-4 space-y-4">
        {photo.caption && <p className="text-gray-700 font-medium">{photo.caption}</p>}

        <div className="flex items-center gap-4">
          <button onClick={toggleLike} className={`text-lg ${liked ? 'text-red-500' : 'text-gray-400'}`}>
            {liked ? '❤️' : '🤍'} {likeCount}
          </button>
          <span className="text-gray-400">💬 {comments.length}</span>
        </div>

        <button
          onClick={async () => {
            if (window.confirm('确定要删除这张照片吗？')) {
              const { supabase } = await import('@/lib/supabase');
              await supabase.from('photos').delete().eq('id', photo.id);
              toast.success('已删除');
              router.back();
            }
          }}
          className="w-full py-2.5 text-sm text-red-400 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
        >
          删除照片
        </button>

        {comments.length > 0 && (
          <div className="space-y-3 pt-2">
            {comments.map((c) => (
              <div key={c.id} className="bg-white rounded-lg px-4 py-2.5 border border-gray-100">
                <p className="text-sm text-gray-700">{c.text}</p>
                <p className="text-xs text-gray-400 mt-1">{formatDate(c.created_at)}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="写评论..."
            className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-amber-500 transition-colors"
          />
          <button onClick={addComment} className="bg-amber-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium active:scale-[0.98] transition-all">
            发送
          </button>
        </div>
      </div>
    </div>
  );
}
