'use client';
import { useEffect, useRef } from 'react';
import { Message } from '@/hooks/useChat';
import ChatBubble from './ChatBubble';

interface Props {
  messages: Message[];
  userId: string;
}

export default function MessageList({ messages, userId }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-1 pb-2">
      {messages.length === 0 && (
        <p className="text-center text-gray-400 py-20">还没有消息，发点什么吧 💬</p>
      )}
      {messages.map((msg) => (
        <ChatBubble key={msg.id} message={msg} isMine={msg.sender_id === userId} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
