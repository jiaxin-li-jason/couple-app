'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';
import { sendLocalNotification } from '@/lib/notifications';
import imageCompression from 'browser-image-compression';

export interface Message {
  id: string;
  sender_id: string;
  type: 'text' | 'image';
  content: string;
  read: boolean;
  created_at: string;
}

export interface UserInfo {
  id: string;
  nickname: string;
  avatar_url: string | null;
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userId, setUserId] = useState('');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [partnerInfo, setPartnerInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const userIdRef = useRef('');

  // Step 1: Load current user + partner info
  useEffect(() => {
    getCurrentUser().then(async (u) => {
      if (u) {
        setUserId(u.id);
        userIdRef.current = u.id;

        const { data: myInfo } = await supabase
          .from('users')
          .select('id, nickname, avatar_url')
          .eq('id', u.id)
          .single();
        if (myInfo) setUserInfo(myInfo);

        if (u.partner_id) {
          const { data: pInfo } = await supabase
            .from('users')
            .select('id, nickname, avatar_url')
            .eq('id', u.partner_id)
            .single();
          if (pInfo) setPartnerInfo(pInfo);
        }
      }
    });
  }, []);

  // Step 2: Fetch messages after userId is known
  useEffect(() => {
    if (!userId) return;
    supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(200)
      .then(({ data }) => {
        if (data) setMessages(data);
        setLoading(false);
      });
  }, [userId]);

  // Step 3: Realtime subscription (once, uses ref for userId)
  useEffect(() => {
    const channel = supabase
      .channel('chat')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
      }, (payload) => {
        const msg = payload.new as Message;
        setMessages((prev) => [...prev, msg]);
        if (msg.sender_id !== userIdRef.current) {
          supabase.from('messages').update({ read: true }).eq('id', msg.id).then(() => {});
          if (msg.type === 'text') {
            sendLocalNotification('新消息', msg.content);
          } else if (msg.type === 'image') {
            sendLocalNotification('新消息', '[图片]');
          }
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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

  return { messages, userId, userInfo, partnerInfo, loading, sendText, sendImage, bottomRef };
}
