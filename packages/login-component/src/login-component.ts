import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { 
  UserProfile, 
  IPFSConfig, 
  WalletConnectionState
} from '@owc/shared';
import { 
  encryptProfile, 
  uploadToIPFS, 
  generateUserId,
  formatCardanoBalance 
} from '@owc/shared';

@customElement('owc-login')
export class OWCLoginComponent extends LitElement {
  @property({ type: String })
  ipfsGateway = 'https://ipfs.io';

  @property({ type: String })
  ipfsApiKey = '';

  @property({ type: String })
  theme = 'light';

  @state()
  private connectionState: WalletConnectionState = {
    connected: false
  };

  @state()
  private isLoading = false;

  @state()
  private errorMessage = '';

  @state()
  private showProfileForm = false;

  @state()
  private userProfile: Partial<UserProfile> = {};

  private ipfsConfig: IPFSConfig;

  constructor() {
    super();
    console.log('FILE WATCHING TEST at:', new Date().toISOString());
    this.ipfsConfig = {
      gateway: this.ipfsGateway,
      apiKey: this.ipfsApiKey
    };
  }

  static override styles = css`
    :host {
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: var(--owc-text-color, #333);
      background: var(--owc-bg-color, #fff);
    }

    .login-container {
      max-width: 400px;
      margin: 0 auto;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      background: var(--owc-card-bg, #fff);
    }

    .header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .header h2 {
      margin: 0 0 0.5rem 0;
      color: var(--owc-primary-color, #2563eb);
      font-size: 1.5rem;
    }

    .header p {
      margin: 0;
      color: var(--owc-text-secondary, #666);
      font-size: 0.9rem;
    }

    .wallet-button {
      width: 100%;
      padding: 1rem;
      margin: 0.5rem 0;
      border: 2px solid var(--owc-border-color, #e5e7eb);
      border-radius: 8px;
      background: var(--owc-button-bg, #fff);
      color: var(--owc-button-text-color, #333);
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .wallet-button:hover {
      border-color: var(--owc-primary-color, #2563eb);
      background: var(--owc-button-hover-bg, #f8fafc);
    }

    .wallet-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .wallet-icon {
      width: 24px;
      height: 24px;
    }

    .error-message {
      color: var(--owc-error-color, #dc2626);
      background: var(--owc-error-bg, #fef2f2);
      padding: 0.75rem;
      border-radius: 6px;
      margin: 1rem 0;
      font-size: 0.9rem;
    }

    .success-message {
      color: var(--owc-success-color, #059669);
      background: var(--owc-success-bg, #f0fdf4);
      padding: 0.75rem;
      border-radius: 6px;
      margin: 1rem 0;
      font-size: 0.9rem;
    }

    .profile-form {
      margin-top: 1rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: var(--owc-text-color, #333);
    }

    .form-input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--owc-border-color, #e5e7eb);
      border-radius: 6px;
      font-size: 1rem;
      transition: border-color 0.2s ease;
    }

    .form-input:focus {
      outline: none;
      border-color: var(--owc-primary-color, #2563eb);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .submit-button {
      width: 100%;
      padding: 1rem;
      background: var(--owc-primary-color, #2563eb);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .submit-button:hover {
      background: var(--owc-primary-hover, #1d4ed8);
    }

    .submit-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .wallet-info {
      background: var(--owc-info-bg, #f0f9ff);
      padding: 1rem;
      border-radius: 8px;
      margin: 1rem 0;
    }

    .wallet-info h3 {
      margin: 0 0 0.5rem 0;
      color: var(--owc-primary-color, #2563eb);
    }

    .wallet-info p {
      margin: 0.25rem 0;
      font-size: 0.9rem;
    }

    .disconnect-button {
      background: var(--owc-danger-color, #dc2626);
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
    }

    .disconnect-button:hover {
      background: var(--owc-danger-hover, #b91c1c);
    }

    .loading {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: #fff;
      animation: spin 1s ease-in-out infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;

  override render() {
    if (this.connectionState.connected) {
      return this.renderConnectedState();
    }

    return this.renderLoginState();
  }

  private renderLoginState() {
    return html`
      <div class="login-container">
        <div class="header">
          <h2>Connect Wallet</h2>
          <p>Connect your Cardano wallet to get started</p>
        </div>

        ${this.errorMessage ? html`
          <div class="error-message">${this.errorMessage}</div>
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
          Connect Cardano Wallet
        </button>

        <div style="text-align: center; margin-top: 1rem;">
          <p style="font-size: 0.8rem; color: var(--owc-text-secondary, #666); margin-bottom: 0.5rem;">
            Supported wallets:
          </p>
          <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
            <a href="https://www.lace.io/" target="_blank" rel="noopener noreferrer" style="color: var(--owc-primary-color, #2563eb); text-decoration: none; font-size: 0.8rem;">Lace</a>
            <a href="https://namiwallet.io/" target="_blank" rel="noopener noreferrer" style="color: var(--owc-primary-color, #2563eb); text-decoration: none; font-size: 0.8rem;">Nami</a>
            <a href="https://eternl.io/" target="_blank" rel="noopener noreferrer" style="color: var(--owc-primary-color, #2563eb); text-decoration: none; font-size: 0.8rem;">Eternl</a>
            <a href="https://flint-wallet.com/" target="_blank" rel="noopener noreferrer" style="color: var(--owc-primary-color, #2563eb); text-decoration: none; font-size: 0.8rem;">Flint</a>
            <a href="https://yoroi-wallet.com/" target="_blank" rel="noopener noreferrer" style="color: var(--owc-primary-color, #2563eb); text-decoration: none; font-size: 0.8rem;">Yoroi</a>
          </div>
        </div>
      </div>
    `;
  }

  private renderConnectedState() {
    return html`
      <div class="login-container">
        <div class="header">
          <h2>Wallet Connected</h2>
          <p>Your wallet is successfully connected</p>
        </div>

        <div class="wallet-info">
          <h3>Wallet Information</h3>
          <p><strong>Address:</strong> ${this.connectionState.address}</p>
          <p><strong>Network:</strong> ${this.connectionState.networkId === 1 ? 'Mainnet' : 'Testnet'}</p>
          ${this.connectionState.balance ? html`
            <p><strong>Balance:</strong> ${formatCardanoBalance(this.connectionState.balance)}</p>
          ` : ''}
        </div>

        ${this.showProfileForm ? this.renderProfileForm() : html`
          <button 
            class="submit-button" 
            @click=${this.showProfileForm = true}
          >
            Create Profile
          </button>
        `}

        <button 
          class="disconnect-button" 
          @click=${this.disconnectWallet}
          style="width: 100%; margin-top: 1rem;"
        >
          Disconnect Wallet
        </button>
      </div>
    `;
  }

  private renderProfileForm() {
    return html`
      <div class="profile-form">
        <div class="form-group">
          <label class="form-label" for="username">Username</label>
          <input 
            type="text" 
            id="username"
            class="form-input"
            .value=${this.userProfile.username || ''}
            @input=${(e: Event) => this.userProfile.username = (e.target as HTMLInputElement).value}
            placeholder="Enter your username"
          >
        </div>

        <div class="form-group">
          <label class="form-label" for="email">Email (optional)</label>
          <input 
            type="email" 
            id="email"
            class="form-input"
            .value=${this.userProfile.email || ''}
            @input=${(e: Event) => this.userProfile.email = (e.target as HTMLInputElement).value}
            placeholder="Enter your email"
          >
        </div>

        <div class="form-group">
          <label class="form-label" for="bio">Bio (optional)</label>
          <textarea 
            id="bio"
            class="form-input"
            rows="3"
            .value=${this.userProfile.bio || ''}
            @input=${(e: Event) => this.userProfile.bio = (e.target as HTMLTextAreaElement).value}
            placeholder="Tell us about yourself"
          ></textarea>
        </div>

        <button 
          class="submit-button" 
          @click=${this.saveProfile}
          ?disabled=${this.isLoading}
        >
          ${this.isLoading ? html`<div class="loading"></div>` : 'Save Profile'}
        </button>
      </div>
    `;
  }

  private async connectWallet() {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      // Check if any Cardano wallet is available
      if (!window.cardano) {
        throw new Error('No Cardano wallet detected. Please install Nami, Eternl, Flint, or Yoroi wallet.');
      }

      // Get available wallets
      const availableWallets = Object.keys(window.cardano!).filter(
        key => window.cardano![key] && window.cardano![key].enable
      );

      if (availableWallets.length === 0) {
        throw new Error('No Cardano wallet detected. Please install Nami, Eternl, Flint, or Yoroi wallet.');
      }

      // For now, use the first available wallet (you can add wallet selection UI later)
      const walletName = availableWallets[0]!;
      const wallet = window.cardano![walletName]!;

      // Enable the wallet
      await wallet.enable();

      // Get wallet information
      const address = await wallet.getUsedAddresses();
      const networkId = await wallet.getNetworkId();
      const balance = await wallet.getBalance();

              this.connectionState = {
          connected: true,
          wallet: {
            name: walletName,
            icon: wallet.icon || '',
            version: wallet.version || '1.0.0',
            enable: wallet.enable.bind(wallet),
            isEnabled: wallet.isEnabled.bind(wallet),
            getNetworkId: wallet.getNetworkId.bind(wallet),
            getBalance: wallet.getBalance.bind(wallet),
            getUsedAddresses: wallet.getUsedAddresses.bind(wallet),
            getUnusedAddresses: wallet.getUnusedAddresses.bind(wallet),
            getChangeAddress: wallet.getChangeAddress.bind(wallet),
            getRewardAddresses: wallet.getRewardAddresses.bind(wallet),
            signTx: wallet.signTx.bind(wallet),
            signData: wallet.signData.bind(wallet),
            submitTx: wallet.submitTx.bind(wallet)
          },
          address: address[0] || '',
          networkId,
          balance
        };

      // Dispatch custom event
      this.dispatchEvent(new CustomEvent('wallet-connected', {
        detail: this.connectionState,
        bubbles: true,
        composed: true
      }));
    } catch (error) {
      this.errorMessage = `Failed to connect wallet: ${error instanceof Error ? error.message : 'Unknown error'}`;
    } finally {
      this.isLoading = false;
    }
  }

  private async disconnectWallet() {
    try {
      // For native wallet APIs, we just clear the local state
      // The wallet itself remains connected but we stop tracking it
      this.connectionState = { connected: false };
      this.userProfile = {};
      this.showProfileForm = false;
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

  private async saveProfile() {
    if (!this.connectionState.address) {
      this.errorMessage = 'No wallet address available';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const userId = await generateUserId(this.connectionState.address);
      const now = new Date().toISOString();

      const profile: UserProfile = {
        id: userId,
        walletAddress: this.connectionState.address || '',
        ...(this.userProfile.username && { username: this.userProfile.username }),
        ...(this.userProfile.email && { email: this.userProfile.email }),
        ...(this.userProfile.bio && { bio: this.userProfile.bio }),
        createdAt: now,
        updatedAt: now
      };

      // Encrypt profile with wallet address as password
      const encryptedProfile = await encryptProfile(profile, this.connectionState.address);
      
      // Upload to IPFS
      const cid = await uploadToIPFS(encryptedProfile, this.ipfsConfig);

      // Store CID in localStorage for demo purposes
      // In production, you might want to store this on-chain or in a database
      localStorage.setItem(`owc_profile_${userId}`, cid);

      // Dispatch success event
      this.dispatchEvent(new CustomEvent('profile-saved', {
        detail: { profile, cid },
        bubbles: true,
        composed: true
      }));

      this.errorMessage = '';
    } catch (error) {
      this.errorMessage = `Failed to save profile: ${error instanceof Error ? error.message : 'Unknown error'}`;
    } finally {
      this.isLoading = false;
    }
  }
} 