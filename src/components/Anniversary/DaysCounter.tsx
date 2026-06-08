interface Props {
  days: number;
  loveDate: string | null;
}

const typeColors: Record<string, string> = {
  love: 'bg-rose-400',
  birthday: 'bg-amber-400',
  trip: 'bg-blue-400',
  custom: 'bg-violet-400',
};

export default function DaysCounter({ days, loveDate }: Props) {
  return (
    <div className="relative bg-white rounded-3xl px-8 py-10 text-center overflow-hidden"
      style={{
        boxShadow: '0 4px 20px rgba(0,0,0,0.04), 0 12px 40px rgba(0,0,0,0.04), 0 2px 8px rgba(244,63,94,0.06)',
      }}
    >
      {/* 顶部小字 */}
      <p className="text-rose-400/80 text-xs tracking-widest uppercase font-medium mb-3">
        We have been together
      </p>

      {/* 超大天数 */}
      <p className="text-[4.5rem] font-black leading-none tracking-tight text-rose-500 select-none">
        {days}
        <span className="text-xl font-normal text-rose-300 ml-1 align-middle">天</span>
      </p>

      {/* 日期范围 */}
      {loveDate && (
        <p className="text-gray-400 text-xs mt-3">
          {new Date(loveDate).toLocaleDateString('zh-CN', {
            year: 'numeric', month: '2-digit', day: '2-digit'
          }).replace(/\//g, '.')} — 今
        </p>
      )}

      {/* 底部渐变装饰线 */}
      <div className="absolute bottom-0 left-8 right-8 h-[2px] rounded-full bg-gradient-to-r from-rose-400 via-rose-300 to-amber-400 opacity-70" />
    </div>
  );
}
