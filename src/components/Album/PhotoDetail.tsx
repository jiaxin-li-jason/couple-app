'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';
import { formatDate } from '@/lib/utils';
import { Photo } from '@/hooks/usePhotos';
import toast from 'react-hot-toast';

interface Props {
  photo: Photo;
}

interface Comment {
  id: string;
  user_id: string;
  text: string;
  created_at: string;
}

export default function PhotoDetail({ photo }: Props) {
  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>([]);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [userId, setUserId] = useState('');

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

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 bg-white/90 backdrop-blur flex items-center px-4 py-3 border-b border-gray-100 z-10">
        <button onClick={() => router.back()} className="text-gray-500 mr-4">← 返回</button>
        <span className="text-sm font-medium">{formatDate(photo.created_at)}</span>
      </div>

      <img src={photo.image_url} alt={photo.caption} className="w-full aspect-square object-cover" />

      <div className="p-4 space-y-4">
        {photo.caption && <p className="text-gray-700">{photo.caption}</p>}

        <div className="flex items-center gap-4">
          <button onClick={toggleLike} className={`text-lg ${liked ? 'text-love-400' : 'text-gray-400'}`}>
            {liked ? '❤️' : '🤍'} {likeCount}
          </button>
          <span className="text-gray-300">💬 {comments.length}</span>
        </div>

        {/* 评论列表 */}
        {comments.length > 0 && (
          <div className="space-y-3 pt-2">
            {comments.map((c) => (
              <div key={c.id} className="bg-gray-50 rounded-xl px-4 py-2.5">
                <p className="text-sm text-gray-700">{c.text}</p>
                <p className="text-xs text-gray-400 mt-1">{formatDate(c.created_at)}</p>
              </div>
            ))}
          </div>
        )}

        {/* 发送评论 */}
        <div className="flex gap-2 pt-2">
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="写评论..."
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary-400 text-sm"
          />
          <button onClick={addComment} className="bg-primary-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium">
            发送
          </button>
        </div>
      </div>
    </div>
  );
}
