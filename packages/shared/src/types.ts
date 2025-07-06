export interface CardanoWallet {
  name: string;
  icon: string;
  version: string;
  enable: () => Promise<any>;
  isEnabled: () => Promise<boolean>;
  getNetworkId: () => Promise<number>;
  getBalance: () => Promise<string>;
  getUsedAddresses: () => Promise<string[]>;
  getUnusedAddresses: () => Promise<string[]>;
  getChangeAddress: () => Promise<string>;
  getRewardAddresses: () => Promise<string[]>;
  signTx: (tx: string, partialSign: boolean) => Promise<string>;
  signData: (addr: string, payload: string) => Promise<string>;
  submitTx: (tx: string) => Promise<string>;
}

// Native Cardano wallet API interface
export interface NativeCardanoWallet {
  enable: () => Promise<any>;
  isEnabled: () => Promise<boolean>;
  getNetworkId: () => Promise<number>;
  getBalance: () => Promise<string>;
  getUsedAddresses: () => Promise<string[]>;
  getUnusedAddresses: () => Promise<string[]>;
  getChangeAddress: () => Promise<string>;
  getRewardAddresses: () => Promise<string[]>;
  signTx: (tx: string, partialSign: boolean) => Promise<string>;
  signData: (addr: string, payload: string) => Promise<string>;
  submitTx: (tx: string) => Promise<string>;
  icon?: string;
  version?: string;
}

// Extend Window interface for cardano wallets
declare global {
  interface Window {
    cardano?: {
      [key: string]: NativeCardanoWallet;
    };
  }
}

export interface UserProfile {
  id: string;
  walletAddress: string;
  username?: string;
  email?: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
  preferences?: Record<string, any>;
}

export interface EncryptedProfile {
  encryptedData: string;
  iv: string;
  salt: string;
  version: string;
}

export interface LoginResult {
  success: boolean;
  profile?: UserProfile;
  error?: string;
  walletAddress?: string;
}

export interface IPFSConfig {
  gateway: string;
  apiKey?: string;
  pinningService?: string;
}

export interface WalletConnectionState {
  connected: boolean;
  wallet?: CardanoWallet;
  address?: string;
  networkId?: number;
  balance?: string;
} 