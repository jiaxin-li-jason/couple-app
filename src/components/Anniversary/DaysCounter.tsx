interface Props {
  days: number;
  loveDate: string | null;
}

export default function DaysCounter({ days, loveDate }: Props) {
  return (
    <div
      className="relative rounded-[2rem] px-8 pt-10 pb-9 text-center overflow-hidden bg-warm-gradient texture-dots"
      style={{
        boxShadow:
          '0 2px 8px rgba(244,63,94,0.04), 0 4px 20px rgba(244,63,94,0.04), 0 12px 40px rgba(61,55,49,0.03)',
      }}
    >
      {/* 顶部：齐齐 & Jerry */}
      <p className="text-warm-400/80 text-[0.7rem] tracking-[0.25em] uppercase mb-3 select-none">
        齐齐 <span className="text-rose-300/50 mx-1.5">&</span> Jerry
      </p>

      {/* 大号天数 — serif */}
      <div className="relative inline-flex items-baseline">
        <span
          className="text-[5.5rem] font-bold leading-none tracking-tight text-rose-500 select-none"
          style={{ fontFamily: '"Noto Serif SC", "Noto Serif", Georgia, serif' }}
        >
          {days}
        </span>
        <span className="text-xl font-normal text-rose-300/70 ml-1.5 select-none"
          style={{ fontFamily: '"Noto Serif SC", "Noto Serif", Georgia, serif' }}>
          天
        </span>
      </div>

      {/* 日期范围 */}
      {loveDate && (
        <p className="text-warm-400/70 text-[0.7rem] mt-4 tracking-wider">
          {new Date(loveDate).toLocaleDateString('zh-CN', {
            year: 'numeric', month: '2-digit', day: '2-digit'
          }).replace(/\//g, ' · ')}&nbsp;&nbsp;—&nbsp;&nbsp;{new Date().toLocaleDateString('zh-CN', {
            year: 'numeric', month: '2-digit', day: '2-digit'
          }).replace(/\//g, ' · ')}
        </p>
      )}

      {/* 底部装饰线 — 更柔和 */}
      <div className="absolute bottom-0 left-10 right-10 h-px rounded-full bg-gradient-to-r from-transparent via-rose-300/30 to-transparent" />
    </div>
  );
}
