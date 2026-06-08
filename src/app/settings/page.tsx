'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { paired, generateCode, pair, loading } = useAuth();
  const [nickname, setNickname] = useState('');
  const [pairCode, setPairCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getCurrentUser().then((u) => {
      if (u) {
        supabase.from('users').select('nickname').eq('id', u.id).single().then(({ data }) => {
          if (data) setNickname(data.nickname);
        });
      }
    });
  }, []);

  const updateNickname = async () => {
    const user = await getCurrentUser();
    if (!user || !nickname.trim()) return;
    await supabase.from('users').update({ nickname: nickname.trim() }).eq('id', user.id);
    toast.success('昵称已更新');
  };

  const handleGenerateCode = async () => {
    const code = await generateCode();
    setPairCode(code);
  };

  const handlePair = async () => {
    if (inputCode.length !== 6) return;
    const ok = await pair(inputCode);
    if (ok) toast.success('配对成功！');
    else toast.error('配对码无效');
  };

  if (loading) return <div className="pt-6 py-20 text-center text-gray-400">加载中...</div>;

  return (
    <div className="pt-6 space-y-6">
      <h1 className="text-lg font-bold text-gray-800">设置</h1>

      {/* 昵称 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-600">昵称</label>
        <div className="flex gap-2">
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary-400"
          />
          <button onClick={updateNickname} className="bg-primary-500 text-white px-4 py-2.5 rounded-xl text-sm">
            保存
          </button>
        </div>
      </div>

      {/* 配对状态 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-600">配对状态</label>
        <p className={`text-sm ${paired ? 'text-green-500' : 'text-gray-400'}`}>
          {paired ? '✅ 已配对' : '⚠️ 未配对'}
        </p>
      </div>

      {/* 配对操作 */}
      {!paired && (
        <div className="space-y-4">
          {/* 生成配对码 */}
          <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
            <p className="text-sm font-medium text-gray-600">生成配对码</p>
            <button onClick={handleGenerateCode} className="bg-primary-500 text-white w-full py-2.5 rounded-xl text-sm">
              生成
            </button>
            {pairCode && (
              <div className="text-center">
                <p
                  className="text-3xl font-bold tracking-widest text-primary-600 cursor-pointer"
                  onClick={() => { navigator.clipboard.writeText(pairCode); setCopied(true); }}
                >
                  {pairCode}
                </p>
                {copied && <p className="text-green-500 text-xs mt-1">已复制！</p>}
              </div>
            )}
          </div>

          {/* 输入对方配对码 */}
          <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
            <p className="text-sm font-medium text-gray-600">输入TA的配对码</p>
            <input
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.replace(/\D/g, ''))}
              placeholder="6位数字"
              inputMode="numeric"
              maxLength={6}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-center text-2xl tracking-widest outline-none focus:border-primary-400"
            />
            <button onClick={handlePair} disabled={inputCode.length !== 6} className="w-full bg-love-400 text-white py-2.5 rounded-xl text-sm disabled:opacity-40">
              绑定
            </button>
          </div>
        </div>
      )}

      {/* 版本信息 */}
      <div className="text-center pt-8">
        <p className="text-xs text-gray-300">我们的空间 v1.0</p>
      </div>
    </div>
  );
}
