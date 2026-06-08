'use client';
import { useChat } from '@/hooks/useChat';
import MessageList from '@/components/Chat/MessageList';
import ChatInput from '@/components/Chat/ChatInput';
import toast from 'react-hot-toast';

export default function ChatPage() {
  const { messages, userId, userInfo, partnerInfo, loading, sendText, sendImage } = useChat();

  if (loading) {
    return <div className="pt-6 text-center text-gray-400 py-20">加载中...</div>;
  }

  return (
    <div className="pt-0 h-[calc(100vh-8rem)] flex flex-col">
      <div className="pb-3 pt-6">
        <div className="h-1 w-16 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full mb-3" />
        <h1 className="text-lg font-bold text-gray-900">我们的聊天</h1>
        <p className="text-gray-500 text-xs mt-0.5">分享每一个甜蜜瞬间</p>
      </div>
      <MessageList messages={messages} userId={userId} userInfo={userInfo} partnerInfo={partnerInfo} />
      <ChatInput
        onSendText={sendText}
        onSendImage={async (file) => {
          await sendImage(file);
          toast.success('图片已发送');
        }}
      />
    </div>
  );
}
