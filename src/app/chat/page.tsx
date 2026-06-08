'use client';
import { useChat } from '@/hooks/useChat';
import MessageList from '@/components/Chat/MessageList';
import ChatInput from '@/components/Chat/ChatInput';
import toast from 'react-hot-toast';

export default function ChatPage() {
  const { messages, userId, userInfo, partnerInfo, loading, sendText, sendImage } = useChat();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-gray-400">加载中...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* 固定顶部标题 */}
      <div className="shrink-0 pb-2 pt-2">
        <div className="h-1 w-16 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full mb-3" />
        <h1 className="text-lg font-bold text-gray-900">我们的聊天</h1>
        <p className="text-gray-500 text-xs mt-0.5">分享每一个甜蜜瞬间</p>
      </div>

      {/* 可滚动消息列表 */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <MessageList messages={messages} userId={userId} userInfo={userInfo} partnerInfo={partnerInfo} />
      </div>

      {/* 固定底部输入框 */}
      <div className="shrink-0 border-t border-gray-100 py-2">
        <ChatInput
          onSendText={sendText}
          onSendImage={async (file) => {
            await sendImage(file);
            toast.success('图片已发送');
          }}
        />
      </div>
    </div>
  );
}
