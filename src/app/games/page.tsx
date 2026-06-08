'use client';
import { useState } from 'react';
import RockPaperScissors from '@/components/Games/RockPaperScissors';
import CoupleDice from '@/components/Games/CoupleDice';
import DecisionWheel from '@/components/Games/DecisionWheel';
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
            {activeGame === 'rps' && '✊ 石头剪刀布'}
            {activeGame === 'dice' && '🎲 情侣骰子'}
            {activeGame === 'wheel' && '🎯 转盘决定'}
            {activeGame === 'truth' && '🎭 真心话大冒险'}
          </h1>
        </div>
        <div className="flex-1 overflow-y-auto min-h-0">
          {activeGame === 'rps' && <RockPaperScissors />}
          {activeGame === 'dice' && <CoupleDice />}
          {activeGame === 'wheel' && <DecisionWheel />}
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
        <div className="grid grid-cols-2 gap-3">
          {/* 石头剪刀布 */}
          <button onClick={() => setActiveGame('rps')} className="bg-white rounded-2xl border border-gray-100 p-4 text-center card hover:shadow-md transition-all active:scale-[0.99]">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-xl mx-auto mb-2">✊</div>
            <p className="font-bold text-gray-800 text-sm">石头剪刀布</p>
            <p className="text-[10px] text-gray-400 mt-0.5">输的人有惩罚</p>
          </button>

          {/* 情侣骰子 */}
          <button onClick={() => setActiveGame('dice')} className="bg-white rounded-2xl border border-gray-100 p-4 text-center card hover:shadow-md transition-all active:scale-[0.99]">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xl mx-auto mb-2">🎲</div>
            <p className="font-bold text-gray-800 text-sm">情侣骰子</p>
            <p className="text-[10px] text-gray-400 mt-0.5">甜蜜任务随机</p>
          </button>

          {/* 转盘决定 */}
          <button onClick={() => setActiveGame('wheel')} className="bg-white rounded-2xl border border-gray-100 p-4 text-center card hover:shadow-md transition-all active:scale-[0.99]">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-xl mx-auto mb-2">🎯</div>
            <p className="font-bold text-gray-800 text-sm">转盘决定</p>
            <p className="text-[10px] text-gray-400 mt-0.5">选择困难症克星</p>
          </button>

          {/* 真心话大冒险 */}
          <button onClick={() => setActiveGame('truth')} className="bg-white rounded-2xl border border-gray-100 p-4 text-center card hover:shadow-md transition-all active:scale-[0.99]">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-xl mx-auto mb-2">🎭</div>
            <p className="font-bold text-gray-800 text-sm">真心话大冒险</p>
            <p className="text-[10px] text-gray-400 mt-0.5">勇敢说出心里话</p>
          </button>
        </div>

        {/* 积分榜 */}
        <Scoreboard />
      </div>
    </div>
  );
}
