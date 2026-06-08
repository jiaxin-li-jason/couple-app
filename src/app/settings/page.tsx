'use client';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';
import toast from 'react-hot-toast';
import imageCompression from 'browser-image-compression';

export default function SettingsPage() {
  const { user, paired, generateCode, pair, loading, signOut } = useAuth();
  const [nickname, setNickname] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [pairCode, setPairCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getCurrentUser().then((u) => {
      if (u) {
        supabase.from('users').select('nickname, avatar_url').eq('id', u.id).single().then(({ data }) => {
          if (data) {
            setNickname(data.nickname);
            setAvatarUrl(data.avatar_url);
          }
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

  const handleAvatarUpload = async (file: File) => {
    setUploading(true);
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.3,
        maxWidthOrHeight: 400,
        useWebWorker: true,
      });
      const user = await getCurrentUser();
      if (!user) return;
      const ext = file.name.split('.').pop() || 'jpg';
      const fileName = `avatars/${user.id}.${ext}`;
      await supabase.storage.from('avatars').upload(fileName, compressed, { upsert: true });
      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
      const url = urlData.publicUrl + '?t=' + Date.now(); // 缓存刷新
      await supabase.from('users').update({ avatar_url: url }).eq('id', user.id);
      setAvatarUrl(url);
      toast.success('头像已更新');
    } catch {
      toast.error('头像上传失败');
    } finally {
      setUploading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('已退出登录');
  };

  if (loading) return <div className="pt-6 py-20 text-center text-gray-400">加载中...</div>;

  return (
    <div className="h-full flex flex-col pt-6">
      {/* 固定标题 */}
      <div className="shrink-0">
        <h1 className="text-lg font-bold text-gray-900">设置</h1>
      </div>

      {/* 可滚动内容 */}
      <div className="flex-1 overflow-y-auto min-h-0 pb-24 mt-6 space-y-6">

      {/* 头像 + 昵称 */}
      <div className="flex flex-col items-center py-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleAvatarUpload(file);
          }}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-28 h-28 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center text-gray-400 text-4xl font-bold hover:opacity-80 transition-opacity disabled:opacity-50 ring-4 ring-white shadow-md"
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <span>{nickname.charAt(0) || '?'}</span>
          )}
        </button>
        <p className="text-lg font-semibold text-gray-800 mt-3">{nickname || user?.email?.split('@')[0] || '未设置昵称'}</p>
        <p className="text-sm text-gray-400 mt-0.5">{user?.email || ''}</p>
        <p className="text-xs text-gray-400 mt-2">{uploading ? '上传中...' : '点击更换头像'}</p>
      </div>

      {/* 昵称 */}
      <div className="bg-white rounded-xl p-5 space-y-3 border border-gray-100 card">
        <label className="text-sm font-medium text-gray-700">昵称</label>
        <div className="flex gap-2">
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-50 transition-all"
          />
          <button onClick={updateNickname} className="bg-rose-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium active:scale-[0.98] transition-all shadow-sm">
            保存
          </button>
        </div>
      </div>

      {/* 当前账号 */}
      <div className="bg-white rounded-xl p-5 space-y-3 border border-gray-100 card">
        <label className="text-sm font-medium text-gray-700">当前账号</label>
        <p className="text-sm text-gray-500">{user?.email || '未知'}</p>
        <button
          onClick={handleSignOut}
          className="w-full bg-gray-100 text-gray-600 py-2.5 rounded-xl text-sm hover:bg-gray-200 transition-colors"
        >
          退出登录
        </button>
      </div>

      {/* 配对状态 */}
      <div className="bg-white rounded-xl p-5 space-y-3 border border-gray-100 card">
        <label className="text-sm font-medium text-gray-700">配对状态</label>
        <p className={`text-sm ${paired ? 'text-green-600' : 'text-gray-500'}`}>
          {paired ? '已配对' : '未配对'}
        </p>
      </div>

      {/* 配对操作 */}
      {!paired && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl p-5 space-y-3 border border-gray-100 card">
            <p className="text-sm font-medium text-gray-700">生成配对码</p>
            <button onClick={handleGenerateCode} className="bg-rose-500 text-white w-full py-3 rounded-2xl text-sm font-medium active:scale-[0.98] transition-all shadow-sm">
              生成
            </button>
            {pairCode && (
              <div className="text-center animate-fade-in-up">
                <p
                  className="text-3xl font-bold tracking-widest text-rose-500 cursor-pointer"
                  onClick={() => { navigator.clipboard.writeText(pairCode); setCopied(true); }}
                >
                  {pairCode}
                </p>
                {copied && <p className="text-green-600 text-xs mt-1">已复制！</p>}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl p-5 space-y-3 border border-gray-100 card">
            <p className="text-sm font-medium text-gray-700">输入TA的配对码</p>
            <input
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.replace(/\D/g, ''))}
              placeholder="6位数字"
              inputMode="numeric"
              maxLength={6}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-center text-2xl tracking-widest outline-none text-gray-900 placeholder-gray-400 focus:border-rose-300 focus:ring-2 focus:ring-rose-50 transition-all"
            />
            <button onClick={handlePair} disabled={inputCode.length !== 6} className="w-full bg-rose-500 text-white py-3 rounded-2xl text-sm font-medium disabled:opacity-40 active:scale-[0.98] transition-all shadow-sm">
              绑定
            </button>
          </div>
        </div>
      )}

      {/* 版本信息 */}
      <div className="text-center pt-8">
        <p className="text-xs text-gray-400">我们的空间 v1.0</p>
      </div>
      </div>
    </div>
  );
}
