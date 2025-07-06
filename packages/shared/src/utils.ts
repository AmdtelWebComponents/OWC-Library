import { create } from 'ipfs-http-client';
import type { UserProfile, EncryptedProfile, IPFSConfig } from './types.js';

/**
 * Generate a random salt for encryption
 */
export function generateSalt(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate encryption key from password and salt
 */
export async function deriveKey(password: string, salt: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );
  
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode(salt),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt user profile data
 */
export async function encryptProfile(
  profile: UserProfile,
  password: string
): Promise<EncryptedProfile> {
  const salt = generateSalt();
  const key = await deriveKey(password, salt);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(profile));
  
  const encryptedData = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );
  
  return {
    encryptedData: btoa(String.fromCharCode(...new Uint8Array(encryptedData))),
    iv: btoa(String.fromCharCode(...iv)),
    salt,
    version: '1.0'
  };
}

/**
 * Decrypt user profile data
 */
export async function decryptProfile(
  encryptedProfile: EncryptedProfile,
  password: string
): Promise<UserProfile> {
  const key = await deriveKey(password, encryptedProfile.salt);
  
  const decoder = new TextDecoder();
  const iv = new Uint8Array(atob(encryptedProfile.iv).split('').map(c => c.charCodeAt(0)));
  const encryptedData = new Uint8Array(atob(encryptedProfile.encryptedData).split('').map(c => c.charCodeAt(0)));
  
  const decryptedData = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    encryptedData
  );
  
  return JSON.parse(decoder.decode(decryptedData));
}

/**
 * Initialize IPFS client
 */
export function createIPFSClient(config: IPFSConfig) {
  const options: any = {
    url: config.gateway
  };
  
  if (config.apiKey) {
    options.headers = { 'X-API-Key': config.apiKey };
  }
  
  return create(options);
}

/**
 * Upload encrypted profile to IPFS
 */
export async function uploadToIPFS(
  data: any,
  config: IPFSConfig
): Promise<string> {
  const ipfs = createIPFSClient(config);
  const result = await ipfs.add(JSON.stringify(data));
  return result.cid.toString();
}

/**
 * Download encrypted profile from IPFS
 */
export async function downloadFromIPFS(
  cid: string,
  config: IPFSConfig
): Promise<any> {
  const ipfs = createIPFSClient(config);
  const chunks = [];
  
  for await (const chunk of ipfs.cat(cid)) {
    chunks.push(chunk);
  }
  
  const data = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
  let offset = 0;
  
  for (const chunk of chunks) {
    data.set(chunk, offset);
    offset += chunk.length;
  }
  
  return JSON.parse(new TextDecoder().decode(data));
}

/**
 * Validate Cardano address format
 */
export function isValidCardanoAddress(address: string): boolean {
  // Basic Cardano address validation (bech32 format)
  const bech32Regex = /^addr1[a-z0-9]{98}$/;
  return bech32Regex.test(address);
}

/**
 * Format Cardano balance (lovelace to ADA)
 */
export function formatCardanoBalance(lovelace: string): string {
  const ada = parseInt(lovelace) / 1000000;
  return `${ada.toFixed(6)} ADA`;
}

/**
 * Generate a unique user ID from wallet address
 */
export async function generateUserId(walletAddress: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(walletAddress);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .substring(0, 16);
} 