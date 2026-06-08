import { AnniversaryWithDays } from '@/hooks/useAnniversaries';

interface Props {
  anniversaries: AnniversaryWithDays[];
  onDelete: (id: string) => void;
}

const typeIcons: Record<string, string> = {
  love: '❤️',
  birthday: '🎂',
  trip: '✈️',
  custom: '⭐',
};

export default function CountdownList({ anniversaries, onDelete }: Props) {
  const upcoming = anniversaries.filter(a => !a.isPast);
  const past = anniversaries.filter(a => a.isPast);

  const isUrgent = (days: number) => days <= 3 && days > 0;
  const isTodayEvent = (days: number) => days === 0;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-500 tracking-wide">
        即将到来的甜蜜
      </h3>

      {upcoming.length > 0 && (
        <div className="space-y-3">
          {upcoming.map((a) => (
            <div
              key={a.id}
              className={`relative flex items-center rounded-2xl px-5 py-4 overflow-hidden transition-all
                ${isTodayEvent(a.daysUntil)
                  ? 'bg-gradient-to-br from-amber-50 to-amber-100/60 border border-amber-200/80'
                  : 'bg-white border border-gray-100'
                }`}
              style={{
                boxShadow: isTodayEvent(a.daysUntil)
                  ? '0 4px 16px rgba(251,191,36,0.12)'
                  : '0 2px 8px rgba(0,0,0,0.03)',
              }}
            >
              {/* 左侧大数字区域 */}
              <div className="flex items-center justify-center w-16 shrink-0">
                <span className={`text-3xl font-black leading-none
                  ${isTodayEvent(a.daysUntil) ? 'text-amber-500' : 'text-rose-400'}`}
                >
                  {isTodayEvent(a.daysUntil) ? (
                    <span className="text-base font-bold">今天</span>
                  ) : (
                    a.daysUntil
                  )}
                </span>
                {!isTodayEvent(a.daysUntil) && (
                  <span className="text-[10px] text-gray-400 ml-0.5 mt-2 self-start">天</span>
                )}
              </div>

              {/* 右侧信息 */}
              <div className="ml-4 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{typeIcons[a.type] || '⭐'}</span>
                  <p className={`font-semibold truncate ${isTodayEvent(a.daysUntil) ? 'text-amber-800' : 'text-gray-800'}`}>
                    {a.title}
                  </p>
                  {isUrgent(a.daysUntil) && (
                    <span className="shrink-0 text-[10px] font-medium text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200/60">
                      即将
                    </span>
                  )}
                </div>
                <p className={`text-xs mt-0.5 ${isTodayEvent(a.daysUntil) ? 'text-amber-500/70' : 'text-gray-400'}`}>
                  {a.date}
                </p>
              </div>

              {/* 删除按钮 */}
              <button
                onClick={() => onDelete(a.id)}
                className={`shrink-0 ml-2 w-7 h-7 flex items-center justify-center rounded-full text-xs transition-colors
                  ${isTodayEvent(a.daysUntil)
                    ? 'text-amber-300 hover:text-red-400 hover:bg-amber-100'
                    : 'text-gray-300 hover:text-red-400 hover:bg-gray-100'}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {past.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-400 mb-3 tracking-wide">回忆</h3>
          <div className="space-y-2">
            {past.map((a) => (
              <div
                key={a.id}
                className="flex items-center bg-white/60 rounded-xl px-4 py-3 border border-gray-100/60"
              >
                <div className="flex items-center justify-center w-12 shrink-0">
                  <span className="text-xl text-gray-300 font-light">{a.daysSince}</span>
                  <span className="text-[9px] text-gray-300 ml-0.5">天前</span>
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs">{typeIcons[a.type] || '⭐'}</span>
                    <p className="text-sm font-medium text-gray-500 truncate">{a.title}</p>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5">{a.date}</p>
                </div>
                <button
                  onClick={() => onDelete(a.id)}
                  className="shrink-0 text-gray-200 hover:text-red-400 transition-colors text-xs w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {upcoming.length === 0 && past.length === 0 && (
        <p className="text-center text-gray-400 text-sm py-8">还没有纪念日，点击右下角 + 添加</p>
      )}
    </div>
  );
}
