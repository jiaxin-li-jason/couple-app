import { AnniversaryWithDays } from '@/hooks/useAnniversaries';

interface Props {
  anniversaries: AnniversaryWithDays[];
  onDelete: (id: string) => void;
}

const typeColors: Record<string, string> = {
  love: 'bg-rose-400',
  birthday: 'bg-amber-400',
  trip: 'bg-blue-400',
  custom: 'bg-violet-400',
};

export default function CountdownList({ anniversaries, onDelete }: Props) {
  const upcoming = anniversaries.filter(a => !a.isPast);
  const past = anniversaries.filter(a => a.isPast);

  return (
    <div className="space-y-4">
      {upcoming.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 mb-3">即将到来</h3>
          {upcoming.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between bg-white rounded-xl px-4 py-3.5 mb-2 card border border-gray-100"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className={`w-2 h-2 rounded-full shrink-0 ${typeColors[a.type] || 'bg-gray-300'}`} />
                <div className="min-w-0">
                  <p className="font-medium text-gray-800 truncate">{a.title}</p>
                  <p className="text-xs text-gray-400">{a.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                <span className="text-rose-500 font-semibold text-sm">
                  {a.daysUntil === 0 ? '今天' : `${a.daysUntil}天后`}
                </span>
                <button
                  onClick={() => onDelete(a.id)}
                  className="text-gray-300 text-sm hover:text-red-400 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {past.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-400 mb-3">回忆</h3>
          {past.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between bg-white rounded-xl px-4 py-3.5 mb-2 card border border-gray-100"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className={`w-2 h-2 rounded-full shrink-0 ${typeColors[a.type] || 'bg-gray-200'}`} />
                <div className="min-w-0">
                  <p className="font-medium text-gray-600 truncate">{a.title}</p>
                  <p className="text-xs text-gray-400">{a.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                <span className="text-gray-400 text-sm">{a.daysSince}天前</span>
                <button
                  onClick={() => onDelete(a.id)}
                  className="text-gray-300 text-sm hover:text-red-400 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
