import { supabase } from './supabase';
import { getDeviceId, generatePairCode } from './utils';

/** 当前用户缓存 */
let _currentUser: { id: string; partner_id: string | null } | null = null;

/** 初始化或获取当前用户 */
export async function initUser(nickname?: string): Promise<{ id: string }> {
  const deviceId = getDeviceId();

  // 查找已有用户
  const { data: existing } = await supabase
    .from('users')
    .select('id, partner_id')
    .eq('device_id', deviceId)
    .single();

  if (existing) {
    _currentUser = existing;
    return existing;
  }

  // 创建新用户
  const { data: created, error } = await supabase
    .from('users')
    .insert({ device_id: deviceId, nickname: nickname || '另一半' })
    .select('id, partner_id')
    .single();

  if (error) throw error;
  _currentUser = created;
  return created;
}

/** 获取当前用户 */
export async function getCurrentUser() {
  if (_currentUser) return _currentUser;
  const deviceId = getDeviceId();
  const { data } = await supabase
    .from('users')
    .select('id, partner_id')
    .eq('device_id', deviceId)
    .single();
  _currentUser = data;
  return data;
}

/** 生成配对码 */
export async function createPairCode(): Promise<string> {
  const user = await getCurrentUser();
  if (!user) throw new Error('用户未初始化');

  const code = generatePairCode();
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
  if (!user) throw new Error('用户未初始化');
  if (user.partner_id) throw new Error('已配对');

  // 查找配对码对应的用户
  const { data: partner } = await supabase
    .from('users')
    .select('id')
    .eq('pair_code', code)
    .single();

  if (!partner) return false;

  // 互相绑定
  const { error: e1 } = await supabase
    .from('users')
    .update({ partner_id: partner.id })
    .eq('id', user.id);

  const { error: e2 } = await supabase
    .from('users')
    .update({ partner_id: user.id, pair_code: null })
    .eq('id', partner.id);

  if (e1 || e2) throw new Error('绑定失败');

  _currentUser = { ...user, partner_id: partner.id };
  return true;
}
