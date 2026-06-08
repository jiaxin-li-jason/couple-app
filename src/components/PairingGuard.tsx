'use client';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function PairingGuard({ children }: { children: React.ReactNode }) {
  const { loading, user, userProfile, paired, signInPassword, signUp, generateCode, pair } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [code, setCode] = useState('');
  const [myCode, setMyCode] = useState('');
  const [copied, setCopied] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      await signInPassword(email.trim(), password);
    } catch (err: any) {
      setError(err.message || '登录失败，请检查邮箱和密码');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async () => {
    if (!email.trim() || !password.trim()) return;
    if (password !== confirmPassword) {
      setError('两次密码不一致');
      return;
    }
    if (password.length < 6) {
      setError('密码至少 6 位');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await signUp(email.trim(), password);
      setTab('login');
      setError('注册成功，请登录');
    } catch (err: any) {
      setError(err.message || '注册失败');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
        <p className="text-gray-400 text-lg">加载中...</p>
      </div>
    );
  }

  // 未登录 → 邮箱+密码界面
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAF8] p-6">
        <div className="text-center mb-8 animate-fade-in-up">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">我们的空间</h1>
          <p className="text-gray-500 text-sm">登录或注册，开始你们的专属空间</p>
        </div>

        <div className="w-full max-w-sm">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            {/* Tab 切换 */}
            <div className="flex bg-gray-100 rounded-lg p-0.5 mb-4">
              <button
                onClick={() => { setTab('login'); setError(''); }}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${tab === 'login' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
              >
                登录
              </button>
              <button
                onClick={() => { setTab('register'); setError(''); }}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${tab === 'register' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
              >
                注册
              </button>
            </div>

            {error && (
              <p className={`text-center text-sm mb-3 font-medium ${error === '注册成功，请登录' ? 'text-green-600' : 'text-red-500'}`}>
                {error}
              </p>
            )}

            {tab === 'login' ? (
              <div className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="邮箱"
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-center text-gray-900 outline-none placeholder-gray-400 focus:border-amber-500 transition-colors text-sm"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="密码"
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-center text-gray-900 outline-none placeholder-gray-400 focus:border-amber-500 transition-colors text-sm"
                />
                <button
                  onClick={handleLogin}
                  disabled={!email.trim() || !password.trim() || submitting}
                  className="w-full bg-amber-500 text-white py-2.5 rounded-lg text-sm font-medium disabled:opacity-40 active:scale-[0.98] transition-all"
                >
                  {submitting ? '登录中...' : '登录'}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
                  placeholder="邮箱"
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-center text-gray-900 outline-none placeholder-gray-400 focus:border-amber-500 transition-colors text-sm"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
                  placeholder="密码"
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-center text-gray-900 outline-none placeholder-gray-400 focus:border-amber-500 transition-colors text-sm"
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
                  placeholder="确认密码"
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-center text-gray-900 outline-none placeholder-gray-400 focus:border-amber-500 transition-colors text-sm"
                />
                <button
                  onClick={handleRegister}
                  disabled={!email.trim() || !password.trim() || !confirmPassword.trim() || submitting}
                  className="w-full bg-amber-500 text-white py-2.5 rounded-lg text-sm font-medium disabled:opacity-40 active:scale-[0.98] transition-all"
                >
                  {submitting ? '注册中...' : '注册'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 已登录但未配对 → 配对界面
  if (!paired) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAF8] p-6">
        <div className="text-center mb-8 animate-fade-in-up">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">我们的空间</h1>
          <p className="text-gray-500 text-sm">先和你的另一半配对吧</p>
        </div>

        <div className="w-full max-w-sm space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">我还没配对</h2>
            <button
              onClick={async () => {
                const c = await generateCode();
                setMyCode(c);
              }}
              className="w-full bg-amber-500 text-white py-2.5 rounded-lg text-sm font-medium active:scale-[0.98] transition-all"
            >
              生成配对码
            </button>
            {myCode && (
              <div className="mt-4 text-center animate-fade-in-up">
                <p className="text-gray-500 text-xs mb-1">你的配对码</p>
                <p
                  className="text-3xl font-bold tracking-widest text-amber-600 cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(myCode);
                    setCopied(true);
                  }}
                >
                  {myCode}
                </p>
                {copied && <p className="text-green-600 text-xs mt-1">已复制！</p>}
                <p className="text-gray-400 text-xs mt-2">发送给你的另一半</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">我有配对码</h2>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="输入6位配对码"
              className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-center text-2xl tracking-widest outline-none text-gray-900 placeholder-gray-400 focus:border-amber-500 transition-colors"
            />
            <button
              onClick={async () => {
                if (code.length !== 6) return;
                const ok = await pair(code);
                if (!ok) alert('配对码无效，请检查');
              }}
              disabled={code.length !== 6}
              className="w-full mt-3 bg-amber-500 text-white py-2.5 rounded-lg text-sm font-medium disabled:opacity-40 active:scale-[0.98] transition-all"
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
