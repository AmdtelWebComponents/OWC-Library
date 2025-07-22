import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { WalletConnectionState } from '@amdtel/shared';
import { formatCardanoBalance, getStateManager } from '@amdtel/shared';
import { Address } from '@emurgo/cardano-serialization-lib-browser';
// Polyfill Buffer for browser if needed
// @ts-ignore
import { Buffer } from 'buffer';

@customElement('amdtel-login')
export class OWCLoginComponent extends LitElement {
  @property({ type: String })
  theme = 'light';

  @property({ type: String })
  mode: 'full' | 'simple' = 'full';

  @state()
  private connectionState: WalletConnectionState = {
    connected: false
  };

  @state()
  private isLoading = false;

  @state()
  private errorMessage = '';

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

  static override styles = [
    css`
      :host {
        display: block;
        color: var(--text-1);
        background: var(--surface-1);
        border-radius: var(--radius-3);
        font-family: var(--font-sans);
        line-height: var(--font-lineheight-3);
      }

      /* Full mode container */
      .login-container {
        display: grid;
        grid-template-rows: auto 1fr auto;
        gap: var(--size-6);
        max-width: var(--size-content-2);
        margin: 0 auto;
        padding: var(--size-fluid-4);
        border-radius: var(--radius-4);
        box-shadow: var(--shadow-3);
        background: var(--surface-2);
        border: var(--border-size-1) solid var(--surface-3);
      }

      /* Simple mode container */
      .simple-container {
        display: inline-block;
      }

      /* Header section */
      .header {
        display: grid;
        gap: var(--size-3);
        text-align: center;
        padding-block-end: var(--size-4);
        border-bottom: var(--border-size-1) solid var(--surface-3);
      }

      .header h2 {
        margin: 0;
        color: var(--text-1);
        font-size: var(--font-size-5);
        font-weight: var(--font-weight-6);
        line-height: var(--font-lineheight-2);
      }

      .header p {
        margin: 0;
        color: var(--text-2);
        font-size: var(--font-size-3);
        line-height: var(--font-lineheight-3);
      }

      /* Main content area */
      .content {
        display: grid;
        gap: var(--size-4);
        align-content: start;
      }

      /* Wallet button with modern styling */
      .wallet-button {
        display: grid;
        grid-template-columns: auto 1fr;
        align-items: center;
        gap: var(--size-3);
        width: 100%;
        padding: var(--size-4);
        border: var(--border-size-2) solid var(--surface-4);
        border-radius: var(--radius-3);
        background: var(--surface-1);
        color: var(--text-1);
        font-size: var(--font-size-3);
        font-weight: var(--font-weight-5);
        cursor: pointer;
        transition: all var(--ease-2) var(--speed-2);
        text-decoration: none;
        text-align: left;
      }

      .wallet-button:hover:not(:disabled) {
        border-color: var(--primary-6);
        background: var(--surface-2);
        box-shadow: var(--shadow-2);
        transform: translateY(-2px);
      }

      .wallet-button:active:not(:disabled) {
        transform: translateY(0);
      }

      .wallet-button:disabled {
        opacity: var(--opacity-5);
        cursor: not-allowed;
        transform: none;
      }

      .wallet-icon {
        width: var(--size-5);
        height: var(--size-5);
        color: var(--primary-6);
      }

      /* Connected state button */
      .wallet-button.connected {
        background: var(--green-2);
        border-color: var(--green-6);
        color: var(--green-11);
      }

      .wallet-button.connected:hover {
        background: var(--green-3);
        border-color: var(--green-7);
        transform: translateY(-1px);
      }

      .wallet-button.connected .wallet-icon {
        color: var(--green-7);
      }

      /* Simple mode button */
      .simple-button {
        display: inline-flex;
        align-items: center;
        gap: var(--size-2);
        padding: var(--size-3) var(--size-4);
        border: var(--border-size-1) solid var(--surface-4);
        border-radius: var(--radius-2);
        background: var(--surface-1);
        color: var(--text-1);
        font-size: var(--font-size-2);
        font-weight: var(--font-weight-5);
        cursor: pointer;
        transition: all var(--ease-2) var(--speed-2);
        text-decoration: none;
        white-space: nowrap;
      }

      .simple-button:hover:not(:disabled) {
        border-color: var(--primary-6);
        background: var(--surface-2);
        transform: translateY(-1px);
      }

      .simple-button.connected {
        background: var(--green-2);
        border-color: var(--green-6);
        color: var(--green-11);
      }

      .simple-button.connected:hover {
        background: var(--green-3);
        border-color: var(--green-7);
      }

      /* Message styling */
      .message {
        display: grid;
        gap: var(--size-2);
        padding: var(--size-4);
        border-radius: var(--radius-3);
        font-size: var(--font-size-2);
        line-height: var(--font-lineheight-4);
      }

      .error-message {
        color: var(--red-11);
        background: var(--red-2);
        border: var(--border-size-1) solid var(--red-6);
      }

      .success-message {
        color: var(--green-11);
        background: var(--green-2);
        border: var(--border-size-1) solid var(--green-6);
      }

      /* Wallet info card */
      .wallet-info {
        display: grid;
        gap: var(--size-3);
        background: var(--blue-2);
        padding: var(--size-4);
        border-radius: var(--radius-3);
        border: var(--border-size-1) solid var(--blue-6);
        word-break: break-word;
        overflow-wrap: anywhere;
      }

      .wallet-info h3 {
        margin: 0;
        color: var(--blue-11);
        font-size: var(--font-size-4);
        font-weight: var(--font-weight-6);
      }

      .wallet-info p {
        margin: 0;
        font-size: var(--font-size-2);
        line-height: var(--font-lineheight-4);
        color: var(--blue-12);
        word-break: break-all;
        overflow-wrap: anywhere;
      }
      .wallet-info .address {
        font-family: var(--font-mono, monospace);
        font-size: var(--font-size-2);
        word-break: break-all;
        overflow-wrap: anywhere;
      }

      /* Loading spinner */
      .loading {
        display: inline-block;
        width: var(--size-4);
        height: var(--size-4);
        border: var(--border-size-2) solid var(--surface-4);
        border-radius: 50%;
        border-top-color: currentColor;
        animation: spin var(--speed-3) linear infinite;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      /* Footer section */
      .footer {
        display: grid;
        gap: var(--size-3);
        padding-block-start: var(--size-4);
        border-top: var(--border-size-1) solid var(--surface-3);
        text-align: center;
      }

      .footer p {
        margin: 0;
        font-size: var(--font-size-1);
        color: var(--text-3);
        line-height: var(--font-lineheight-4);
      }

      .wallet-links {
        display: flex;
        justify-content: center;
        gap: var(--size-4);
        flex-wrap: wrap;
      }

      .wallet-link {
        color: var(--primary-6);
        text-decoration: none;
        font-size: var(--font-size-1);
        transition: color var(--ease-2) var(--speed-2);
      }

      .wallet-link:hover {
        color: var(--primary-7);
        text-decoration: underline;
      }

      /* Responsive design */
      @media (max-width: 768px) {
        .login-container {
          margin: var(--size-2);
          padding: var(--size-fluid-3);
        }

        .wallet-links {
          gap: var(--size-3);
        }
      }

      /* Dark theme overrides */
      :host([theme="dark"]) {
        color: var(--gray-1);
        background: var(--gray-9);
      }

      :host([theme="dark"]) .login-container {
        background: var(--gray-8);
        border-color: var(--gray-7);
      }

      :host([theme="dark"]) .wallet-button {
        background: var(--gray-8);
        border-color: var(--gray-6);
        color: var(--gray-1);
      }

      :host([theme="dark"]) .wallet-button:hover:not(:disabled) {
        background: var(--gray-7);
        border-color: var(--primary-5);
      }

      :host([theme="dark"]) .simple-button {
        background: var(--gray-8);
        border-color: var(--gray-6);
        color: var(--gray-1);
      }

      :host([theme="dark"]) .simple-button:hover:not(:disabled) {
        background: var(--gray-7);
        border-color: var(--primary-5);
      }
    `
  ];

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