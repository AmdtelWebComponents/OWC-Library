import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { WalletConnectionState } from '@amdtel/shared';
import { formatCardanoBalance, getStateManager } from '@amdtel/shared';
import { Address } from '@emurgo/cardano-serialization-lib-browser';
// Polyfill Buffer for browser if needed
// @ts-ignore
import { Buffer } from 'buffer';
import { loginComponentStyles } from './login-component.styles';

@customElement('amdtel-login')
export class AmdtelLoginComponent extends LitElement {
  @property({ type: String })
  theme = 'light';
  @property({ type: String })
  mode: 'full' | 'simple' = 'full';

  @state()
  private connectionState: WalletConnectionState = {connected: false};
  @state()
  private isLoading = false;
  @state()
  private errorMessage = '';
  @state()
  private stateManager = getStateManager();
  private unsubscribe: (() => void) | null = null;

  constructor() {
    super();
  }

  override connectedCallback() {
    super.connectedCallback();
    // Subscribe to state changes
    this.unsubscribe = this.stateManager.subscribe((state) => {
      this.connectionState = state;
    });
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    // Unsubscribe from state changes
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  static override styles = [loginComponentStyles];

  override render() {
    if (this.mode === 'simple') {
      return this.renderSimpleMode();
    }

    return this.renderFullMode();
  }

  private renderSimpleMode() {
    if (this.connectionState.connected) {
      return html`
        <div class="simple-container">
          <button 
            class="simple-button connected" 
            @click=${this.disconnectWallet}
            ?disabled=${this.isLoading}
            title="Disconnect wallet"
          >
            ${this.isLoading ? html`<div class="loading"></div>` : html`
              <svg class="wallet-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            `}
            <span>Disconnect</span>
          </button>
        </div>
      `;
    }

    return html`
      <div class="simple-container">
        <button 
          class="simple-button" 
          @click=${this.connectWallet}
          ?disabled=${this.isLoading}
          title="Connect Cardano wallet"
        >
          ${this.isLoading ? html`<div class="loading"></div>` : html`
            <svg class="wallet-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          `}
          <span>Connect Wallet</span>
        </button>
      </div>
    `;
  }

  private renderFullMode() {
    if (this.connectionState.connected) {
      return html`
        <div class="login-container">
          <div class="header">
            <h2>Wallet Connected</h2>
            <p>Your wallet is successfully connected</p>
          </div>

          <div class="content">
            <div class="wallet-info">
              <h3>Wallet Information</h3>
              <p><strong>Raw Address:</strong> <span class="address">${this.connectionState.address ? this.connectionState.address : 'No address available'}</span></p>
              <p><strong>Bech32 Address:</strong> <span class="address">${'bech32Address' in this.connectionState && this.connectionState.bech32Address ? this.connectionState.bech32Address : this.bech32Address(this.connectionState.address || '')}</span></p>
              <p><strong>Network:</strong> ${this.connectionState.networkId === 1 ? 'Mainnet' : 'Testnet'}</p>
              ${this.connectionState.balance ? html`
                <p><strong>Balance:</strong> ${formatCardanoBalance(this.connectionState.balance)}</p>
              ` : ''}
            </div>

            <button 
              class="wallet-button connected" 
              @click=${this.disconnectWallet}
              ?disabled=${this.isLoading}
            >
              ${this.isLoading ? html`<div class="loading"></div>` : html`
                <svg class="wallet-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              `}
              <span>Disconnect Wallet</span>
            </button>
          </div>
        </div>
      `;
    }

    return html`
      <div class="login-container">
        <div class="header">
          <h2>Connect Wallet</h2>
          <p>Connect your Cardano wallet to get started</p>
        </div>

        <div class="content">
          ${this.errorMessage ? html`
            <div class="message error-message">${this.errorMessage}</div>
          ` : ''}

          <button 
            class="wallet-button" 
            @click=${this.connectWallet}
            ?disabled=${this.isLoading}
          >
            ${this.isLoading ? html`<div class="loading"></div>` : html`
              <svg class="wallet-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            `}
            <span>Connect Cardano Wallet</span>
          </button>
        </div>

        <div class="footer">
          <p>Supported wallets:</p>
          <div class="wallet-links">
            <a href="https://www.lace.io/" target="_blank" rel="noopener noreferrer" class="wallet-link">Lace</a>
            <a href="https://namiwallet.io/" target="_blank" rel="noopener noreferrer" class="wallet-link">Nami</a>
            <a href="https://eternl.io/" target="_blank" rel="noopener noreferrer" class="wallet-link">Eternl</a>
            <a href="https://flint-wallet.com/" target="_blank" rel="noopener noreferrer" class="wallet-link">Flint</a>
            <a href="https://yoroi-wallet.com/" target="_blank" rel="noopener noreferrer" class="wallet-link">Yoroi</a>
          </div>
        </div>
      </div>
    `;
  }

  private bech32Address(addr: string): string {
    try {
      // Try hex decode first
      let bytes: Uint8Array;
      if (/^[0-9a-fA-F]+$/.test(addr) && addr.length % 2 === 0) {
        bytes = Uint8Array.from(Buffer.from(addr, 'hex'));
      } else {
        // Try base64 decode (CIP-30 spec: addresses are CBOR bytes, usually base16, but some wallets use base64)
        bytes = Uint8Array.from(window.atob(addr), c => c.charCodeAt(0));
      }
      return Address.from_bytes(bytes).to_bech32();
    } catch (e) {
      return addr; // fallback to raw if conversion fails
    }
  }

  private async connectWallet() {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      if (!window.cardano) {
        throw new Error('No Cardano wallet detected. Please install Nami, Eternl, Flint, Lace, or Yoroi wallet.');
      }
      const availableWallets = Object.keys(window.cardano!).filter(
        key => window.cardano![key] && window.cardano![key].enable
      );
      if (availableWallets.length === 0) {
        throw new Error('No Cardano wallet detected. Please install Nami, Eternl, Flint, Lace, or Yoroi wallet.');
      }
      const walletName = availableWallets[0]!;
      const wallet = window.cardano![walletName]!;
      // Enable the wallet and get the API object
      const walletApi = await wallet.enable();
      let address: string[] = [];
      let networkId: number;
      let balance: string;
      let bech32Address = '';
      try {
        if (typeof walletApi.getUsedAddresses === 'function') {
          address = await walletApi.getUsedAddresses();
          if (address.length === 0 && typeof walletApi.getUnusedAddresses === 'function') {
            address = await walletApi.getUnusedAddresses();
          }
        } else if (typeof walletApi.getAddresses === 'function') {
          const addresses = await walletApi.getAddresses();
          address = addresses.map((addr: any) => addr.address);
        } else {
          throw new Error('Wallet does not support address retrieval');
        }
        if (typeof walletApi.getNetworkId === 'function') {
          networkId = await walletApi.getNetworkId();
        } else {
          networkId = 1;
        }
        if (typeof walletApi.getBalance === 'function') {
          balance = await walletApi.getBalance();
        } else {
          balance = '0';
        }
        if (address[0]) {
          bech32Address = this.bech32Address(address[0]);
        }
        const newState: WalletConnectionState & { bech32Address?: string } = {
          connected: true,
          wallet: {
            name: walletName,
            icon: wallet.icon || '',
            version: wallet.version || '1.0.0',
            enable: walletApi.enable?.bind(walletApi) || wallet.enable.bind(wallet),
            isEnabled: walletApi.isEnabled?.bind(walletApi) || wallet.isEnabled.bind(wallet),
            getNetworkId: walletApi.getNetworkId?.bind(walletApi) || (() => Promise.resolve(1)),
            getBalance: walletApi.getBalance?.bind(walletApi) || (() => Promise.resolve('0')),
            getUsedAddresses: walletApi.getUsedAddresses?.bind(walletApi) || walletApi.getAddresses?.bind(walletApi),
            getUnusedAddresses: walletApi.getUnusedAddresses?.bind(walletApi) || (() => Promise.resolve([])),
            getChangeAddress: walletApi.getChangeAddress?.bind(walletApi) || (() => Promise.resolve('')),
            getRewardAddresses: walletApi.getRewardAddresses?.bind(walletApi) || (() => Promise.resolve([])),
            signTx: walletApi.signTx?.bind(walletApi) || (() => Promise.reject(new Error('Signing not supported'))),
            signData: walletApi.signData?.bind(walletApi) || (() => Promise.reject(new Error('Data signing not supported'))),
            submitTx: walletApi.submitTx?.bind(walletApi) || (() => Promise.reject(new Error('Transaction submission not supported')))
          },
          address: address[0] || '',
          networkId,
          balance,
          bech32Address
        };
        // Update global state
        this.stateManager.setWalletState(newState);
        // Dispatch event
        this.dispatchEvent(new CustomEvent('wallet-connected', {
          detail: newState,
          bubbles: true,
          composed: true
        }));
      } catch (walletError) {
        console.error('Error getting wallet information:', walletError);
        throw new Error(`Failed to get wallet information: ${walletError instanceof Error ? walletError.message : 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      this.errorMessage = `Failed to connect wallet: ${error instanceof Error ? error.message : 'Unknown error'}`;
    } finally {
      this.isLoading = false;
    }
  }

  private async disconnectWallet() {
    try {
      // Clear global state
      this.stateManager.setWalletState({ connected: false });
      this.errorMessage = '';

      // Dispatch custom event
      this.dispatchEvent(new CustomEvent('wallet-disconnected', {
        bubbles: true,
        composed: true
      }));
    } catch (error) {
      this.errorMessage = `Failed to disconnect wallet: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }
} 