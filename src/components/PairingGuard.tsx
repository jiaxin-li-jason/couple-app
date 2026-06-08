'use client';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function PairingGuard({ children }: { children: React.ReactNode }) {
  const { loading, paired, generateCode, pair } = useAuth();
  const [code, setCode] = useState('');
  const [myCode, setMyCode] = useState('');
  const [copied, setCopied] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-400">加载中...</p>
      </div>
    );
  }

  if (!paired) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">我们的空间 💑</h1>
        <p className="text-gray-500 text-sm mb-8">先和你的另一半配对吧</p>

        <div className="w-full max-w-sm space-y-6">
          {/* 创建配对码 */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">我还没配对</h2>
            <button
              onClick={async () => {
                const c = await generateCode();
                setMyCode(c);
              }}
              className="w-full bg-primary-500 text-white py-3 rounded-xl font-medium active:scale-95 transition-transform"
            >
              生成配对码
            </button>
            {myCode && (
              <div className="mt-3 text-center">
                <p className="text-gray-500 text-xs mb-1">你的配对码</p>
                <p
                  className="text-3xl font-bold tracking-widest text-primary-600 cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(myCode);
                    setCopied(true);
                  }}
                >
                  {myCode}
                </p>
                {copied && <p className="text-green-500 text-xs mt-1">已复制！</p>}
                <p className="text-gray-400 text-xs mt-2">发送给你的另一半</p>
              </div>
            )}
          </div>

          {/* 输入配对码 */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">我有配对码</h2>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="输入6位配对码"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-center text-2xl tracking-widest outline-none focus:border-primary-400"
            />
            <button
              onClick={async () => {
                if (code.length !== 6) return;
                const ok = await pair(code);
                if (!ok) alert('配对码无效，请检查');
              }}
              disabled={code.length !== 6}
              className="w-full mt-3 bg-love-400 text-white py-3 rounded-xl font-medium disabled:opacity-40 active:scale-95 transition-transform"
            >
              绑定
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
