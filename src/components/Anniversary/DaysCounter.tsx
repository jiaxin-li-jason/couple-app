interface Props {
  days: number;
  loveDate: string | null;
}

export default function DaysCounter({ days, loveDate }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 px-6 py-8 text-center">
      <p className="text-gray-500 text-sm mb-1">我们已经在一起</p>
      <p className="text-5xl font-bold text-gray-900">
        {days}
        <span className="text-lg text-gray-400 font-normal ml-1">天</span>
      </p>
      {loveDate && (
        <p className="text-gray-400 text-xs mt-2">
          始于 {new Date(loveDate).toLocaleDateString('zh-CN')}
        </p>
      )}
    </div>
  );
}
