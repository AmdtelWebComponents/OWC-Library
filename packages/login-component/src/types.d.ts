// Cardano wallet types
declare global {
  interface Window {
    cardano?: {
      [walletName: string]: {
        enable: () => Promise<{
          address: string;
          networkId: number;
          balance: string;
        }>;
        isEnabled: () => Promise<boolean>;
        name: string;
        icon: string;
      };
    };
  }
}

export {}; 