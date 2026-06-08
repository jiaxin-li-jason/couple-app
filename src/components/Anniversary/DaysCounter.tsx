interface Props {
  days: number;
  loveDate: string | null;
}

export default function DaysCounter({ days, loveDate }: Props) {
  return (
    <div className="bg-gradient-rose rounded-3xl px-6 py-10 text-center shadow-lg shadow-rose-500/20 animate-fade-in-up">
      <p className="text-rose-100 text-sm mb-2">我们已经在一起</p>
      <p className="text-6xl font-bold text-white animate-pulse-heart">
        {days}
        <span className="text-xl text-rose-200 font-normal ml-2">天</span>
      </p>
      {loveDate && (
        <p className="text-rose-200 text-xs mt-3">
          始于 {new Date(loveDate).toLocaleDateString('zh-CN')}
        </p>
      )}
    </div>
  );
}
