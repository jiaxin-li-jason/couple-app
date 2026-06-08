import { supabase } from './supabase';

/** 邮箱登录（发送 Magic Link） */
export async function signInWithEmail(email: string) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: 'https://couple-app-rose.vercel.app' },
  });
  if (error) throw error;
}

/** 登出 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/** 获取当前用户信息（含 partner_id） */
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('users')
    .select('id, partner_id')
    .eq('id', user.id)
    .single();

  return data;
}

/** 初始化用户档案（首次邮箱登录时在 users 表创建记录） */
export async function initUserProfile(nickname?: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('未登录');

  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('id', user.id)
    .single();

  if (existing) return existing;

  const username = nickname || user.email?.split('@')[0] || '另一半';
  const { data: created, error } = await supabase
    .from('users')
    .insert({ id: user.id, nickname: username })
    .select('id, partner_id')
    .single();

  if (error) throw error;
  return created;
}

/** 生成配对码 */
export async function createPairCode(): Promise<string> {
  const user = await getCurrentUser();
  if (!user) throw new Error('用户未登录');

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const { error } = await supabase
    .from('users')
    .update({ pair_code: code })
    .eq('id', user.id);

  if (error) throw error;
  return code;
}

/** 通过配对码绑定伴侣 */
export async function joinWithCode(code: string): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) throw new Error('用户未登录');
  if (user.partner_id) throw new Error('已配对');

  const { data: partner } = await supabase
    .from('users')
    .select('id')
    .eq('pair_code', code)
    .single();

  if (!partner) return false;

  const { error: e1 } = await supabase
    .from('users')
    .update({ partner_id: partner.id })
    .eq('id', user.id);

  const { error: e2 } = await supabase
    .from('users')
    .update({ partner_id: user.id, pair_code: null })
    .eq('id', partner.id);

  if (e1 || e2) throw new Error('绑定失败');
  return true;
}
