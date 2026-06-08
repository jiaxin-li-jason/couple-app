'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import PhotoDetail from '@/components/Album/PhotoDetail';
import { Photo } from '@/hooks/usePhotos';

export default function PhotoDetailPage() {
  const { id } = useParams();
  const [photo, setPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    supabase.from('photos').select('*').eq('id', id as string).single().then(({ data }) => {
      if (data) setPhoto(data);
    });
  }, [id]);

  if (!photo) return <div className="py-20 text-center text-gray-400">加载中...</div>;
  return <PhotoDetail photo={photo} />;
}
