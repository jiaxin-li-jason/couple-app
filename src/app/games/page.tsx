'use client';
import { useState, useCallback } from 'react';
import MemoryGame from '@/components/Games/MemoryGame';
import CoupleDice from '@/components/Games/CoupleDice';
import TruthOrDare from '@/components/Games/TruthOrDare';
import Scoreboard from '@/components/Play/Scoreboard';

export default function GamesPage() {
  const [activeGame, setActiveGame] = useState<string | null>(null);

  if (activeGame) {
    return (
      <div className="h-full flex flex-col pt-6">
        <div className="shrink-0 flex items-center gap-3 mb-4">
          <button onClick={() => setActiveGame(null)} className="text-gray-500 hover:text-gray-700 text-sm font-medium">← 返回</button>
          <h1 className="text-lg font-bold text-gray-900">
            {activeGame === 'memory' && '🃏 记忆翻牌'}
            {activeGame === 'dice' && '🎲 情侣骰子'}
            {activeGame === 'truth' && '🎭 真心话大冒险'}
          </h1>
        </div>
        <div className="flex-1 overflow-y-auto min-h-0">
          {activeGame === 'memory' && <MemoryGame />}
          {activeGame === 'dice' && <CoupleDice />}
          {activeGame === 'truth' && <TruthOrDare />}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col pt-6">
      <div className="shrink-0 space-y-2 mb-4">
        <div className="h-1 w-16 bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full" />
        <h1 className="text-lg font-bold text-gray-900">游戏中心</h1>
        <p className="text-gray-500 text-xs mt-0.5">一起玩，更甜蜜</p>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 space-y-6">
        {/* 游戏卡片 */}
        <div className="grid grid-cols-1 gap-3">
          <button onClick={() => setActiveGame('memory')} className="bg-white rounded-2xl border border-gray-100 p-5 text-left card hover:shadow-md transition-all active:scale-[0.99]">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-2xl">🃏</div>
              <div className="flex-1">
                <p className="font-bold text-gray-800">记忆翻牌</p>
                <p className="text-xs text-gray-500 mt-0.5">经典配对游戏，考验你的记忆力</p>
              </div>
              <span className="text-gray-300 text-lg">›</span>
            </div>
          </button>

          <button onClick={() => setActiveGame('dice')} className="bg-white rounded-2xl border border-gray-100 p-5 text-left card hover:shadow-md transition-all active:scale-[0.99]">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl">🎲</div>
              <div className="flex-1">
                <p className="font-bold text-gray-800">情侣骰子</p>
                <p className="text-xs text-gray-500 mt-0.5">掷骰子，完成甜蜜任务</p>
              </div>
              <span className="text-gray-300 text-lg">›</span>
            </div>
          </button>

          <button onClick={() => setActiveGame('truth')} className="bg-white rounded-2xl border border-gray-100 p-5 text-left card hover:shadow-md transition-all active:scale-[0.99]">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-2xl">🎭</div>
              <div className="flex-1">
                <p className="font-bold text-gray-800">真心话大冒险</p>
                <p className="text-xs text-gray-500 mt-0.5">勇敢说出心里话</p>
              </div>
              <span className="text-gray-300 text-lg">›</span>
            </div>
          </button>
        </div>

        {/* 积分榜 */}
        <Scoreboard />
      </div>
    </div>
  );
}
