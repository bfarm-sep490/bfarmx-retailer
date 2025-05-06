import { AES, enc } from 'crypto-js';

export type EncryptedData = {
  contract_address: string;
  expires_at: number;
  access_expires_at: number;
};

export const encryptData = (data: EncryptedData, secretKey: string): string => {
  return AES.encrypt(JSON.stringify(data), secretKey).toString();
};

export const decryptData = (encryptedData: string, secretKey: string): EncryptedData | null => {
  try {
    const bytes = AES.decrypt(encryptedData, secretKey);
    const decryptedData = bytes.toString(enc.Utf8);
    return JSON.parse(decryptedData);
  } catch (error) {
    console.error('Error decrypting data:', error);
    return null;
  }
};

export const generateExpiryTimes = (qrExpiryHours: number = 24, accessExpiryHours: number = 168) => {
  const now = Date.now();
  return {
    expires_at: now + (qrExpiryHours * 60 * 60 * 1000), // QR code expiry
    access_expires_at: now + (accessExpiryHours * 60 * 60 * 1000), // Access expiry
  };
};
