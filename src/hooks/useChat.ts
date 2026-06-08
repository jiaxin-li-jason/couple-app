'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';
import { sendLocalNotification } from '@/lib/notifications';
import imageCompression from 'browser-image-compression';

export interface Message {
  id: string;
  sender_id: string;
  type: 'text' | 'image' | 'voice';
  content: string;
  read: boolean;
  created_at: string;
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getCurrentUser().then((u) => {
      if (u) setUserId(u.id);
    });
  }, []);

  useEffect(() => {
    fetchMessages();

    const channel = supabase
      .channel('chat')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new as Message]);
        const msg = payload.new as Message;
        if (msg.sender_id !== userId) {
          supabase.from('messages').update({ read: true }).eq('id', msg.id).then(() => {});
          if (msg.type === 'text') {
            sendLocalNotification('新消息', msg.content);
          } else if (msg.type === 'image') {
            sendLocalNotification('新消息', '[图片]');
          } else if (msg.type === 'voice') {
            sendLocalNotification('新消息', '[语音]');
          }
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(200);
    if (data) setMessages(data);
    setLoading(false);
  };

  const sendText = useCallback(async (text: string) => {
    if (!text.trim()) return;
    const { error } = await supabase.from('messages').insert({
      sender_id: userId,
      type: 'text',
      content: text.trim(),
    });
    if (error) throw error;
  }, [userId]);

  const sendImage = useCallback(async (file: File) => {
    const compressed = await imageCompression(file, {
      maxSizeMB: 0.3,
      maxWidthOrHeight: 800,
      useWebWorker: true,
    });
    const fileName = `chat/${userId}/${Date.now()}.jpg`;
    await supabase.storage.from('chat-images').upload(fileName, compressed);
    const { data: urlData } = supabase.storage.from('chat-images').getPublicUrl(fileName);

    await supabase.from('messages').insert({
      sender_id: userId,
      type: 'image',
      content: urlData.publicUrl,
    });
  }, [userId]);

  const sendVoice = useCallback(async (blob: Blob) => {
    const fileName = `chat/${userId}/${Date.now()}.webm`;
    await supabase.storage.from('chat-voice').upload(fileName, blob);
    const { data: urlData } = supabase.storage.from('chat-voice').getPublicUrl(fileName);

    await supabase.from('messages').insert({
      sender_id: userId,
      type: 'voice',
      content: urlData.publicUrl,
    });
  }, [userId]);

  return { messages, userId, loading, sendText, sendImage, sendVoice, bottomRef };
}
