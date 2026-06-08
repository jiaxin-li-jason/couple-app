interface Props {
  days: number;
  loveDate: string | null;
}

export default function DaysCounter({ days, loveDate }: Props) {
  return (
    <div className="bg-rose-50 rounded-2xl px-6 py-8 text-center card border border-rose-100">
      <p className="text-rose-400 text-sm mb-1 font-medium">我们已经在一起</p>
      <p className="text-5xl font-bold text-rose-500">
        {days}
        <span className="text-lg text-rose-300 font-normal ml-1">天</span>
      </p>
      {loveDate && (
        <p className="text-rose-300 text-xs mt-2">
          始于 {new Date(loveDate).toLocaleDateString('zh-CN')}
        </p>
      )}
    </div>
  );
}
