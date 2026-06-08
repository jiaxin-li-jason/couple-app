'use client';
import { useChat } from '@/hooks/useChat';
import MessageList from '@/components/Chat/MessageList';
import ChatInput from '@/components/Chat/ChatInput';
import toast from 'react-hot-toast';

export default function ChatPage() {
  const { messages, userId, loading, sendText, sendImage, sendVoice } = useChat();

  if (loading) {
    return <div className="pt-6 text-center text-rose-300 py-20">加载中...</div>;
  }

  return (
    <div className="pt-0 h-[calc(100vh-8rem)] flex flex-col">
      <div className="bg-gradient-to-r from-rose-400 to-pink-500 -mx-4 px-4 pt-6 pb-4 mb-3">
        <h1 className="text-lg font-bold text-white">我们的聊天</h1>
        <p className="text-rose-100 text-xs mt-0.5">分享每一个甜蜜瞬间</p>
      </div>
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
