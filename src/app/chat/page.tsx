'use client';
import { useChat } from '@/hooks/useChat';
import MessageList from '@/components/Chat/MessageList';
import ChatInput from '@/components/Chat/ChatInput';
import toast from 'react-hot-toast';

export default function ChatPage() {
  const { messages, userId, loading, sendText, sendImage, sendVoice } = useChat();

  if (loading) {
    return <div className="pt-6 text-center text-gray-400 py-20">加载中...</div>;
  }

  return (
    <div className="pt-6 h-[calc(100vh-8rem)] flex flex-col">
      <h1 className="text-lg font-bold text-gray-800 mb-3">我们的聊天</h1>
      <MessageList messages={messages} userId={userId} />
      <ChatInput
        onSendText={sendText}
        onSendImage={async (file) => {
          await sendImage(file);
          toast.success('图片已发送');
        }}
        onSendVoice={async (blob) => {
          await sendVoice(blob);
          toast.success('语音已发送');
        }}
      />
    </div>
  );
}
