// Cardano wallet types
declare global {
  interface Window {
    cardano?: {
      [walletName: string]: {
        enable: () => Promise<void>;
        isEnabled: () => Promise<boolean>;
        getNetworkId: () => Promise<number>;
        getBalance: () => Promise<string>;
        getUsedAddresses: () => Promise<string[]>;
        getUnusedAddresses: () => Promise<string[]>;
        getChangeAddress: () => Promise<string>;
        getRewardAddresses: () => Promise<string[]>;
        signTx: (tx: string, partialSign: boolean) => Promise<string>;
        signData: (address: string, payload: string) => Promise<string>;
        submitTx: (tx: string) => Promise<string>;
        // Lace wallet specific methods
        getAddresses?: () => Promise<Array<{ address: string }>>;
        name?: string;
        icon?: string;
        version?: string;
      };
    };
  }
}

export {}; 