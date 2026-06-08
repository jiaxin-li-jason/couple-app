'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';
import { getMonthTag } from '@/lib/utils';
import imageCompression from 'browser-image-compression';

export interface Photo {
  id: string;
  image_url: string;
  caption: string;
  uploaded_by: string;
  month_tag: string;
  created_at: string;
}

export function usePhotos() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPhotos = useCallback(async () => {
    const { data } = await supabase
      .from('photos')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setPhotos(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchPhotos(); }, [fetchPhotos]);

  /** 上传照片（含压缩） */
  const uploadPhoto = useCallback(async (file: File, caption: string) => {
    const user = await getCurrentUser();
    if (!user) throw new Error('未登录');

    // 压缩图片（max 1200px, 0.7 quality）
    const compressed = await imageCompression(file, {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
    });

    // 上传到 Supabase Storage
    const fileName = `${user.id}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('photos')
      .upload(fileName, compressed);

    if (uploadError) throw uploadError;

    // 获取公开 URL
    const { data: urlData } = supabase.storage
      .from('photos')
      .getPublicUrl(fileName);

    // 写入数据库
    const { error: dbError } = await supabase.from('photos').insert({
      image_url: urlData.publicUrl,
      caption,
      uploaded_by: user.id,
      month_tag: getMonthTag(),
    });

    if (dbError) throw dbError;
    await fetchPhotos();
  }, [fetchPhotos]);

  const deletePhoto = useCallback(async (id: string) => {
    const { error } = await supabase.from('photos').delete().eq('id', id);
    if (error) throw error;
    await fetchPhotos();
  }, [fetchPhotos]);

  return { photos, loading, uploadPhoto, deletePhoto, refresh: fetchPhotos };
}
