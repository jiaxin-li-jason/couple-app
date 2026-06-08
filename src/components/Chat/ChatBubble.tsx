import { Message } from '@/hooks/useChat';
import { formatDate } from '@/lib/utils';

interface Props {
  message: Message;
  isMine: boolean;
  backgroundUrl?: string | null;
}

export default function ChatBubble({ message, isMine }: Props) {
  return (
    <div className={`flex mb-3 ${isMine ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[75%] ${isMine ? 'order-1' : ''}`}>
        {message.type === 'text' && (
          <div
            className={`rounded-2xl px-4 py-2.5 text-sm ${
              isMine
                ? 'bg-primary-500 text-white rounded-br-md'
                : 'bg-gray-100 text-gray-800 rounded-bl-md'
            }`}
          >
            {message.content}
          </div>
        )}
        {message.type === 'image' && (
          <img
            src={message.content}
            alt="聊天图片"
            className="rounded-2xl max-w-full max-h-64 object-cover"
            loading="lazy"
          />
        )}
        {message.type === 'voice' && (
          <div
            className={`rounded-2xl px-4 py-2.5 ${
              isMine ? 'bg-primary-500 text-white' : 'bg-gray-100'
            }`}
          >
            <audio controls src={message.content} className="h-8 max-w-[200px]" />
          </div>
        )}
        <div className={`flex items-center gap-1 mt-0.5 ${isMine ? 'justify-end' : 'justify-start'}`}>
          <p className="text-xs text-gray-300">{formatDate(message.created_at)}</p>
          {isMine && message.read && <span className="text-xs text-primary-400">已读</span>}
        </div>
      </div>
    </div>
  );
}
