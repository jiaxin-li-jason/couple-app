import { Message, UserInfo } from '@/hooks/useChat';
import { formatDate } from '@/lib/utils';

interface Props {
  message: Message;
  isMine: boolean;
  userInfo?: UserInfo | null;
  partnerInfo?: UserInfo | null;
}

function DefaultAvatar({ name }: { name: string }) {
  const firstChar = name?.charAt(0) || '?';
  const colors = ['#f59e0b', '#6b7280', '#8b5cf6', '#38bdf8', '#34d399', '#f97316', '#ec4899'];
  const colorIndex = firstChar.charCodeAt(0) % colors.length;

  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium shrink-0"
      style={{ backgroundColor: colors[colorIndex] }}
    >
      {firstChar}
    </div>
  );
}

function Avatar({ info, fallback }: { info?: UserInfo | null; fallback: string }) {
  if (info?.avatar_url) {
    return <img src={info.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />;
  }
  return <DefaultAvatar name={info?.nickname || fallback} />;
}

export default function ChatBubble({ message, isMine, userInfo, partnerInfo }: Props) {
  const info = isMine ? userInfo : partnerInfo;

  return (
    <div className={`flex mb-3 gap-2 items-end ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
      <Avatar info={info} fallback={isMine ? '我' : 'TA'} />

      <div className="max-w-[75%]">
        {!isMine && info?.nickname && (
          <p className="text-xs text-gray-400 mb-1 ml-1">{info.nickname}</p>
        )}
        {message.type === 'text' && (
          <div
            className={`w-fit max-w-full rounded-2xl px-4 py-2.5 text-sm leading-relaxed break-words ${
              isMine
                ? 'bg-amber-500 text-white rounded-br-md shadow-sm'
                : 'bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-200'
            }`}
          >
            {message.content}
          </div>
        )}
        {message.type === 'image' && (
          <img
            src={message.content}
            alt="聊天图片"
            className="rounded-2xl max-w-full max-h-64 object-cover shadow-sm"
            loading="lazy"
          />
        )}
        <div className={`flex items-center gap-1 mt-0.5 ${isMine ? 'justify-end' : 'justify-start'}`}>
          <p className="text-xs text-gray-400">{formatDate(message.created_at)}</p>
          {isMine && message.read && <span className="text-xs text-amber-500">已读</span>}
        </div>
      </div>
    </div>
  );
}
