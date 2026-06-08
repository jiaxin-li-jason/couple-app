'use client';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

function FloatingHearts() {
  const [hearts, setHearts] = useState<{ id: number; left: string; delay: string; size: string }[]>([]);

  useState(() => {
    const interval = setInterval(() => {
      setHearts((prev) => [
        ...prev.slice(-5),
        {
          id: Date.now(),
          left: `${Math.random() * 100}%`,
          delay: `${Math.random() * 2}s`,
          size: `${12 + Math.random() * 16}px`,
        },
      ]);
    }, 800);
    return () => clearInterval(interval);
  });

  return (
    <>
      {hearts.map((h) => (
        <span
          key={h.id}
          className="heart-float"
          style={{
            left: h.left,
            animationDelay: h.delay,
            fontSize: h.size,
            bottom: '-20px',
          }}
        >
          ❤️
        </span>
      ))}
    </>
  );
}

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-300 via-pink-400 to-rose-500">
        <p className="text-white/80 text-lg animate-pulse">加载中...</p>
      </div>
    );
  }

  // 未登录 → 邮箱+密码界面
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600 p-6 relative overflow-hidden">
        <FloatingHearts />
        <div className="relative z-10 text-center mb-8 animate-fade-in-up">
          <h1 className="text-3xl font-bold text-white mb-2">我们的空间 💑</h1>
          <p className="text-white/90 text-base">登录或注册，开始你们的专属空间</p>
        </div>

        <div className="w-full max-w-sm relative z-10">
          <div className="glass rounded-3xl p-6">
            {/* Tab 切换 */}
            <div className="flex bg-white/10 rounded-xl p-1 mb-5">
              <button
                onClick={() => { setTab('login'); setError(''); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${tab === 'login' ? 'bg-white text-rose-600 shadow-sm' : 'text-white/80'}`}
              >
                登录
              </button>
              <button
                onClick={() => { setTab('register'); setError(''); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${tab === 'register' ? 'bg-white text-rose-600 shadow-sm' : 'text-white/80'}`}
              >
                注册
              </button>
            </div>

            {error && (
              <p className={`text-center text-sm mb-3 font-medium ${error === '注册成功，请登录' ? 'text-green-200' : 'text-white'}`}>
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
                  className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-center text-white outline-none placeholder-white/60 focus:border-white/50 backdrop-blur"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="密码"
                  className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-center text-white outline-none placeholder-white/60 focus:border-white/50 backdrop-blur"
                />
                <button
                  onClick={handleLogin}
                  disabled={!email.trim() || !password.trim() || submitting}
                  className="w-full bg-gradient-to-r from-rose-400 to-pink-500 text-white py-3 rounded-xl font-medium disabled:opacity-40 active:scale-95 transition-transform shadow-lg shadow-rose-500/30"
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
                  className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-center text-white outline-none placeholder-white/60 focus:border-white/50 backdrop-blur"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
                  placeholder="密码"
                  className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-center text-white outline-none placeholder-white/60 focus:border-white/50 backdrop-blur"
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
                  placeholder="确认密码"
                  className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-center text-white outline-none placeholder-white/60 focus:border-white/50 backdrop-blur"
                />
                <button
                  onClick={handleRegister}
                  disabled={!email.trim() || !password.trim() || !confirmPassword.trim() || submitting}
                  className="w-full bg-gradient-to-r from-rose-400 to-pink-500 text-white py-3 rounded-xl font-medium disabled:opacity-40 active:scale-95 transition-transform shadow-lg shadow-rose-500/30"
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600 p-6 relative overflow-hidden">
        <FloatingHearts />

        <div className="relative z-10 text-center mb-8 animate-fade-in-up">
          <h1 className="text-3xl font-bold text-white mb-2">我们的空间 💑</h1>
          <p className="text-white/90 text-base">先和你的另一半配对吧</p>
        </div>

        <div className="w-full max-w-sm space-y-4 relative z-10">
          <div className="glass rounded-3xl p-6">
            <h2 className="text-base font-semibold text-white mb-3">我还没配对</h2>
            <button
              onClick={async () => {
                const c = await generateCode();
                setMyCode(c);
              }}
              className="w-full bg-gradient-to-r from-rose-400 to-pink-500 text-white py-3 rounded-xl font-medium active:scale-95 transition-transform shadow-lg shadow-rose-500/30"
            >
              生成配对码
            </button>
            {myCode && (
              <div className="mt-4 text-center animate-fade-in-up">
                <p className="text-white/80 text-sm mb-1">你的配对码</p>
                <p
                  className="text-3xl font-bold tracking-widest text-white cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(myCode);
                    setCopied(true);
                  }}
                >
                  {myCode}
                </p>
                {copied && <p className="text-green-200 text-sm mt-1">已复制！</p>}
                <p className="text-white/70 text-sm mt-2">发送给你的另一半</p>
              </div>
            )}
          </div>

          <div className="glass rounded-3xl p-6">
            <h2 className="text-base font-semibold text-white mb-3">我有配对码</h2>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="输入6位配对码"
              className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-center text-2xl tracking-widest outline-none text-white placeholder-white/60 focus:border-white/50 backdrop-blur"
            />
            <button
              onClick={async () => {
                if (code.length !== 6) return;
                const ok = await pair(code);
                if (!ok) alert('配对码无效，请检查');
              }}
              disabled={code.length !== 6}
              className="w-full mt-3 bg-gradient-to-r from-rose-400 to-pink-500 text-white py-3 rounded-xl font-medium disabled:opacity-40 active:scale-95 transition-transform shadow-lg shadow-rose-500/30"
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
