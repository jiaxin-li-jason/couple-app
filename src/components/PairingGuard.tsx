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
  const { loading, user, userProfile, paired, signIn, generateCode, pair } = useAuth();
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [code, setCode] = useState('');
  const [myCode, setMyCode] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSendLink = async () => {
    if (!email.trim()) return;
    setSending(true);
    try {
      await signIn(email.trim());
      setEmailSent(true);
    } catch {
      // ignore
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-300 via-pink-400 to-rose-500">
        <p className="text-white/80 text-lg animate-pulse">加载中...</p>
      </div>
    );
  }

  // 未登录 → 邮箱登录界面
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600 p-6 relative overflow-hidden">
        <FloatingHearts />
        <div className="relative z-10 text-center mb-8 animate-fade-in-up">
          <h1 className="text-3xl font-bold text-white mb-2">我们的空间 💑</h1>
          <p className="text-rose-100 text-sm">输入邮箱，接收登录链接</p>
        </div>

        {emailSent ? (
          <div className="w-full max-w-sm relative z-10 text-center animate-fade-in-up">
            <div className="glass rounded-3xl p-8">
              <div className="text-5xl mb-4">📧</div>
              <p className="text-white font-semibold mb-2">登录链接已发送</p>
              <p className="text-rose-200 text-sm">
                请检查你的邮箱 <span className="text-white font-medium">{email}</span>
              </p>
              <p className="text-rose-200 text-xs mt-4">链接有效期为 10 分钟</p>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-sm relative z-10">
            <div className="glass rounded-3xl p-6">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendLink()}
                placeholder="输入你的邮箱"
                className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-center text-white outline-none placeholder-rose-200 focus:border-white/50 backdrop-blur"
              />
              <button
                onClick={handleSendLink}
                disabled={!email.trim() || sending}
                className="w-full mt-3 bg-gradient-to-r from-rose-400 to-pink-500 text-white py-3 rounded-xl font-medium disabled:opacity-40 active:scale-95 transition-transform shadow-lg shadow-rose-500/30"
              >
                {sending ? '发送中...' : '发送登录链接'}
              </button>
            </div>
          </div>
        )}
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
          <p className="text-rose-100 text-sm">先和你的另一半配对吧</p>
        </div>

        <div className="w-full max-w-sm space-y-4 relative z-10">
          <div className="glass rounded-3xl p-6">
            <h2 className="text-sm font-semibold text-rose-700 mb-3">我还没配对</h2>
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
                <p className="text-rose-300 text-xs mb-1">你的配对码</p>
                <p
                  className="text-3xl font-bold tracking-widest text-white cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(myCode);
                    setCopied(true);
                  }}
                >
                  {myCode}
                </p>
                {copied && <p className="text-green-300 text-xs mt-1">已复制！</p>}
                <p className="text-rose-200 text-xs mt-2">发送给你的另一半</p>
              </div>
            )}
          </div>

          <div className="glass rounded-3xl p-6">
            <h2 className="text-sm font-semibold text-rose-700 mb-3">我有配对码</h2>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="输入6位配对码"
              className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-center text-2xl tracking-widest outline-none text-white placeholder-rose-200 focus:border-white/50 backdrop-blur"
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
