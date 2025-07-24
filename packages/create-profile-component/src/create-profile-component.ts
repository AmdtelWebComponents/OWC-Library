import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { UserProfile, IPFSConfig } from '@amdtel/shared';
import { encryptProfile, uploadToIPFS, generateUserId } from '@amdtel/shared';

@customElement('amdtel-create-profile')
export class AmdtelCreateProfileComponent extends LitElement {
  @property({ type: String })
  walletAddress = '';

  @property({ type: Object })
  ipfsConfig: IPFSConfig = { gateway: 'https://ipfs.io' };

  @property({ type: Boolean })
  loading = false;

  @state()
  private errorMessage = '';

  @state()
  private userProfile: Partial<UserProfile> = {};

  static override styles = [
    css`
      :host {
        display: block;
        font-family: var(--font-sans, system-ui, sans-serif);
        color: var(--gray-8);
        background: var(--surface-1);
      }
      .profile-form {
        margin-top: var(--size-4);
      }
      .form-group {
        margin-bottom: var(--size-3);
      }
      .form-label {
        display: block;
        margin-bottom: var(--size-2);
        font-weight: var(--font-weight-5);
        color: var(--gray-8);
      }
      .form-input {
        width: 100%;
        padding: var(--size-2);
        border: var(--border-size-1) solid var(--gray-3);
        border-radius: var(--radius-2);
        font-size: var(--font-size-2);
        transition: border-color 0.2s;
      }
      .form-input:focus {
        outline: none;
        border-color: var(--indigo-7);
        box-shadow: 0 0 0 3px var(--indigo-2);
      }
      .submit-button {
        width: 100%;
        padding: var(--size-3);
        background: var(--indigo-7);
        color: white;
        border: none;
        border-radius: var(--radius-2);
        font-size: var(--font-size-2);
        font-weight: var(--font-weight-6);
        cursor: pointer;
        transition: background-color 0.2s;
      }
      .submit-button:hover {
        background: var(--indigo-8);
      }
      .submit-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
      .error-message {
        color: var(--red-7);
        background: var(--red-0);
        padding: var(--size-2);
        border-radius: var(--radius-2);
        margin: var(--size-3) 0;
        font-size: var(--font-size-1);
      }
      .loading {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 3px solid rgba(255,255,255,0.3);
        border-radius: 50%;
        border-top-color: #fff;
        animation: spin 1s ease-in-out infinite;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `
  ];

  override render() {
    return html`
      <div class="profile-form">
        ${this.errorMessage ? html`<div class="error-message">${this.errorMessage}</div>` : ''}
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
          ?disabled=${this.loading}
        >
          ${this.loading ? html`<div class="loading"></div>` : 'Save Profile'}
        </button>
      </div>
    `;
  }

  private async saveProfile() {
    if (!this.walletAddress) {
      this.errorMessage = 'No wallet address available';
      return;
    }
    this.loading = true;
    this.errorMessage = '';
    try {
      const userId = await generateUserId(this.walletAddress);
      const now = new Date().toISOString();
      const profile: UserProfile = {
        id: userId,
        walletAddress: this.walletAddress,
        ...(this.userProfile.username && { username: this.userProfile.username }),
        ...(this.userProfile.email && { email: this.userProfile.email }),
        ...(this.userProfile.bio && { bio: this.userProfile.bio }),
        createdAt: now,
        updatedAt: now
      };
      const encryptedProfile = await encryptProfile(profile, this.walletAddress);
      const cid = await uploadToIPFS(encryptedProfile, this.ipfsConfig);
      localStorage.setItem(`amdtel_profile_${userId}`, cid);
      this.dispatchEvent(new CustomEvent('profile-saved', {
        detail: { profile, cid },
        bubbles: true,
        composed: true
      }));
      this.errorMessage = '';
    } catch (error) {
      this.errorMessage = `Failed to save profile: ${error instanceof Error ? error.message : 'Unknown error'}`;
    } finally {
      this.loading = false;
    }
  }
}
