'use client';
import { useState } from 'react';
import { AnniversaryWithDays } from '@/hooks/useAnniversaries';

interface Props {
  anniversaries: AnniversaryWithDays[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: { title?: string; date?: string }) => Promise<void>;
}

const typeIcons: Record<string, string> = {
  love: '❤️',
  birthday: '🎂',
  trip: '✈️',
  custom: '⭐',
};

export default function CountdownList({ anniversaries, onDelete, onUpdate }: Props) {
  const upcoming = anniversaries.filter(a => !a.isPast);
  const past = anniversaries.filter(a => a.isPast);

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [editing, setEditing] = useState<{ id: string; field: 'title' | 'date'; value: string } | null>(null);

  const isUrgent = (days: number) => days <= 3 && days > 0;
  const isTodayEvent = (days: number) => days === 0;

  const renderMenu = (a: AnniversaryWithDays) => (
    openMenu === a.id && (
      <>
        <div className="fixed inset-0 z-40" onClick={() => setOpenMenu(null)} />
        <div className="absolute right-4 top-full mt-1 z-50 bg-white rounded-xl shadow-lg border border-gray-100 py-1 min-w-[120px] animate-fade-in">
          <button onClick={() => { setEditing({ id: a.id, field: 'title', value: a.title }); setOpenMenu(null); }} className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            ✏️ 更改内容
          </button>
          <button onClick={() => { setEditing({ id: a.id, field: 'date', value: a.date }); setOpenMenu(null); }} className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            📅 更改日期
          </button>
          <div className="h-px bg-gray-100 mx-2" />
          <button onClick={() => { onDelete(a.id); setOpenMenu(null); }} className="w-full px-4 py-2.5 text-left text-sm text-red-500 hover:bg-red-50 flex items-center gap-2">
            🗑️ 删除
          </button>
        </div>
      </>
    )
  );

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
              className={`relative flex items-center rounded-2xl px-5 py-4 transition-all
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

              {/* 三点菜单按钮 */}
              <button
                onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === a.id ? null : a.id); }}
                className={`shrink-0 ml-2 w-8 h-8 flex items-center justify-center rounded-full text-lg transition-colors
                  ${isTodayEvent(a.daysUntil)
                    ? 'text-amber-300 hover:text-gray-600 hover:bg-amber-100'
                    : 'text-gray-300 hover:text-gray-600 hover:bg-gray-100'}`}
              >
                ⋯
              </button>
              {renderMenu(a)}
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
                className="relative flex items-center bg-white/60 rounded-xl px-4 py-3 border border-gray-100/60"
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
                  onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === a.id ? null : a.id); }}
                  className="shrink-0 text-gray-200 hover:text-gray-600 transition-colors text-lg w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                >
                  ⋯
                </button>
                {renderMenu(a)}
              </div>
            ))}
          </div>
        </div>
      )}

      {upcoming.length === 0 && past.length === 0 && (
        <p className="text-center text-gray-400 text-sm py-8">还没有纪念日，点击右下角 + 添加</p>
      )}

      {/* 编辑弹窗 */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setEditing(null)} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl rounded-b-none px-6 pt-6 pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))] animate-slide-up">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <h3 className="text-base font-bold text-gray-800 text-center mb-5">
              {editing.field === 'title' ? '更改内容' : '更改日期'}
            </h3>
            <div className="space-y-4">
              {editing.field === 'title' ? (
                <input
                  value={editing.value}
                  onChange={(e) => setEditing({ ...editing, value: e.target.value })}
                  placeholder="纪念日名称"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-rose-300 focus:bg-white transition-all"
                />
              ) : (
                <input
                  type="date"
                  value={editing.value}
                  onChange={(e) => setEditing({ ...editing, value: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-rose-300 focus:bg-white transition-all"
                />
              )}
              <div className="flex gap-3 pt-1">
                <button onClick={() => setEditing(null)} className="flex-1 bg-gray-100 text-gray-500 py-3 rounded-xl text-sm font-medium active:scale-[0.98] transition-all">
                  取消
                </button>
                <button
                  onClick={async () => {
                    await onUpdate(editing.id, { [editing.field]: editing.value });
                    setEditing(null);
                  }}
                  className="flex-1 bg-gradient-to-r from-rose-400 to-rose-500 text-white py-3 rounded-xl text-sm font-medium active:scale-[0.98] transition-all shadow-sm shadow-rose-200/50"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
