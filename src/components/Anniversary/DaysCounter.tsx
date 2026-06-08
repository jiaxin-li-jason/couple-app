interface Props {
  days: number;
  loveDate: string | null;
}

export default function DaysCounter({ days, loveDate }: Props) {
  return (
    <div className="text-center py-8">
      <p className="text-gray-400 text-sm mb-2">我们已经在一起</p>
      <p className="text-5xl font-bold text-love-400">
        {days}
        <span className="text-xl text-gray-400 font-normal ml-2">天</span>
      </p>
      {loveDate && (
        <p className="text-gray-400 text-xs mt-2">
          始于 {new Date(loveDate).toLocaleDateString('zh-CN')}
        </p>
      )}
    </div>
  );
}
