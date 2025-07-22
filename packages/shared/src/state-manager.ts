import type { WalletConnectionState } from './types';

export interface StateManager {
  getWalletState(): WalletConnectionState;
  setWalletState(state: WalletConnectionState): void;
  subscribe(callback: (state: WalletConnectionState) => void): () => void;
  unsubscribe(callback: (state: WalletConnectionState) => void): void;
}

class AmdtelStateManager implements StateManager {
  private walletState: WalletConnectionState = { connected: false };
  private subscribers: Set<(state: WalletConnectionState) => void> = new Set();

  getWalletState(): WalletConnectionState {
    return { ...this.walletState };
  }

  setWalletState(state: WalletConnectionState): void {
    this.walletState = { ...state };
    this.notifySubscribers();
  }

  subscribe(callback: (state: WalletConnectionState) => void): () => void {
    this.subscribers.add(callback);
    // Immediately call with current state
    callback(this.getWalletState());
    
    // Return unsubscribe function
    return () => this.unsubscribe(callback);
  }

  unsubscribe(callback: (state: WalletConnectionState) => void): void {
    this.subscribers.delete(callback);
  }

  private notifySubscribers(): void {
    const state = this.getWalletState();
    this.subscribers.forEach(callback => {
      try {
        callback(state);
      } catch (error) {
        console.error('Error in state subscriber:', error);
      }
    });
  }
}

// Global state manager instance
export const stateManager = new AmdtelStateManager();

// Helper function to get the global state manager
export function getStateManager(): StateManager {
  return stateManager;
} 