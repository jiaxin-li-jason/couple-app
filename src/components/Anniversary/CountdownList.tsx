import { AnniversaryWithDays } from '@/hooks/useAnniversaries';

interface Props {
  anniversaries: AnniversaryWithDays[];
  onDelete: (id: string) => void;
}

export default function CountdownList({ anniversaries, onDelete }: Props) {
  const upcoming = anniversaries.filter(a => !a.isPast);
  const past = anniversaries.filter(a => a.isPast);

  return (
    <div className="space-y-4">
      {/* 即将到来 */}
      {upcoming.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 mb-2">即将到来</h3>
          {upcoming.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-4 py-3 mb-2"
            >
              <div>
                <p className="font-medium text-gray-800">{a.title}</p>
                <p className="text-xs text-gray-400">{a.date}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary-500 font-bold">
                  {a.daysUntil === 0 ? '今天！🎉' : `${a.daysUntil}天后`}
                </span>
                <button
                  onClick={() => onDelete(a.id)}
                  className="text-gray-300 text-sm active:text-love-400"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 已过去 */}
      {past.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-400 mb-2">回忆</h3>
          {past.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 mb-2"
            >
              <div>
                <p className="font-medium text-gray-600">{a.title}</p>
                <p className="text-xs text-gray-400">{a.date}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">{a.daysSince}天前</span>
                <button
                  onClick={() => onDelete(a.id)}
                  className="text-gray-300 text-sm active:text-love-400"
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
