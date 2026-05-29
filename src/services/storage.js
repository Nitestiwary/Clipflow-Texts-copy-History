import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@clipflow_history';

export const getHistory = async () => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load history', e);
    return [];
  }
};

export const saveHistory = async (history) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (e) {
    console.error('Failed to save history', e);
  }
};

export const classifyText = (text) => {
  const trimmed = text.trim();
  
  // URL check
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/i;
  if (urlRegex.test(trimmed)) {
    let domain = trimmed;
    try {
      const urlObj = new URL(trimmed.startsWith('http') ? trimmed : `http://${trimmed}`);
      domain = urlObj.hostname.replace('www.', '');
    } catch (_) {}
    return { type: 'link', domain, text: trimmed };
  }

  // Numbers, OTP, 2FA codes check (numeric, alphanumeric short codes of length 4 to 8)
  const otpRegex = /^(?:\d{4,8}|[A-Z0-9]{5,8})$/;
  const hasDigit = /\d/;
  if (otpRegex.test(trimmed) && hasDigit.test(trimmed)) {
    return { type: 'code', text: trimmed };
  }

  // Default Plain Text
  const words = trimmed.split(/\s+/).filter(Boolean).length;
  const chars = trimmed.length;
  return { type: 'text', text: trimmed, stats: { words, chars } };
};
