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
    <div className="pt-6 space-y-6">
      <h1 className="text-lg font-bold text-gray-900">设置</h1>

      {/* 头像 */}
      <div className="flex flex-col items-center">
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
          className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-gray-500 text-3xl font-bold hover:opacity-80 transition-opacity disabled:opacity-50"
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <span>{nickname.charAt(0) || '?'}</span>
          )}
        </button>
        <p className="text-xs text-gray-400 mt-2">{uploading ? '上传中...' : '点击更换头像'}</p>
      </div>

      {/* 当前账号 */}
      <div className="bg-white rounded-xl p-4 space-y-3 border border-gray-200">
        <label className="text-sm font-medium text-gray-700">当前账号</label>
        <p className="text-sm text-gray-500">{user?.email || '未知'}</p>
        <button
          onClick={handleSignOut}
          className="w-full bg-gray-100 text-gray-600 py-2.5 rounded-lg text-sm hover:bg-gray-200 transition-colors"
        >
          退出登录
        </button>
      </div>

      {/* 昵称 */}
      <div className="bg-white rounded-xl p-4 space-y-3 border border-gray-200">
        <label className="text-sm font-medium text-gray-700">昵称</label>
        <div className="flex gap-2">
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-500 transition-colors"
          />
          <button onClick={updateNickname} className="bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium active:scale-[0.98] transition-all">
            保存
          </button>
        </div>
      </div>

      {/* 配对状态 */}
      <div className="bg-white rounded-xl p-4 space-y-3 border border-gray-200">
        <label className="text-sm font-medium text-gray-700">配对状态</label>
        <p className={`text-sm ${paired ? 'text-green-600' : 'text-gray-500'}`}>
          {paired ? '已配对' : '未配对'}
        </p>
      </div>

      {/* 配对操作 */}
      {!paired && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 space-y-3 border border-gray-200">
            <p className="text-sm font-medium text-gray-700">生成配对码</p>
            <button onClick={handleGenerateCode} className="bg-amber-500 text-white w-full py-2.5 rounded-lg text-sm font-medium active:scale-[0.98] transition-all">
              生成
            </button>
            {pairCode && (
              <div className="text-center animate-fade-in-up">
                <p
                  className="text-3xl font-bold tracking-widest text-amber-600 cursor-pointer"
                  onClick={() => { navigator.clipboard.writeText(pairCode); setCopied(true); }}
                >
                  {pairCode}
                </p>
                {copied && <p className="text-green-600 text-xs mt-1">已复制！</p>}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl p-4 space-y-3 border border-gray-200">
            <p className="text-sm font-medium text-gray-700">输入TA的配对码</p>
            <input
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.replace(/\D/g, ''))}
              placeholder="6位数字"
              inputMode="numeric"
              maxLength={6}
              className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-center text-2xl tracking-widest outline-none text-gray-900 placeholder-gray-400 focus:border-amber-500 transition-colors"
            />
            <button onClick={handlePair} disabled={inputCode.length !== 6} className="w-full bg-amber-500 text-white py-2.5 rounded-lg text-sm font-medium disabled:opacity-40 active:scale-[0.98] transition-all">
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
  );
}
