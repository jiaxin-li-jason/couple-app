'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import PhotoDetail from '@/components/Album/PhotoDetail';
import { Photo } from '@/hooks/usePhotos';

export default function PhotoDetailView({ photoId }: { photoId: string }) {
  const router = useRouter();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('photos')
      .select('*')
      .order('date', { ascending: false, nullsFirst: false })
      .then(({ data }) => {
        if (data) setPhotos(data);
        setLoading(false);
      });
  }, []);

  // 找到当前照片所在日期组
  const currentPhoto = photos.find((p) => p.id === photoId);
  const groupPhotos = useCallback(() => {
    if (!currentPhoto) return [];
    const dateKey = currentPhoto.date || currentPhoto.created_at.split('T')[0];
    return photos.filter((p) => (p.date || p.created_at.split('T')[0]) === dateKey);
  }, [currentPhoto, photos])();

  const currentIndex = currentPhoto ? groupPhotos.indexOf(currentPhoto) : 0;

  const handleNavigate = useCallback((index: number) => {
    const target = groupPhotos[index];
    if (target) {
      router.replace(`/album?photo=${target.id}`);
    }
  }, [groupPhotos, router]);

  if (loading) return <div className="py-20 text-center text-gray-400">加载中...</div>;
  if (!currentPhoto) return <div className="py-20 text-center text-gray-400">照片不存在</div>;

  return (
    <PhotoDetail
      photo={currentPhoto}
      groupPhotos={groupPhotos}
      currentIndex={currentIndex}
      onNavigate={handleNavigate}
    />
  );
}
