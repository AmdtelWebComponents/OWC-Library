import { css } from 'lit';

export const loginComponentStyles = css`
  :host {
    display: block;
    color: var(--text-1);
    background: var(--surface-1);
    border-radius: var(--radius-3);
    font-family: var(--font-sans);
    line-height: var(--font-lineheight-3);
  }

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

  .simple-container {
    display: inline-block;
  }

  .header {
    display: grid;
    gap: var(--size-3);
    text-align: center;
    padding-block-end: var(--size-4);
    border-bottom: var(--border-size-1) solid var(--surface-3);
  }

  .wallet-button,
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

  .wallet-button:disabled,
  .simple-button:disabled {
    opacity: var(--opacity-5);
    cursor: not-allowed;
  }

  .wallet-icon {
    width: var(--size-5);
    height: var(--size-5);
    color: var(--primary-6);
  }

  .message {
    padding: var(--size-4);
    border-radius: var(--radius-3);
    font-size: var(--font-size-2);
    line-height: var(--font-lineheight-4);
    background: var(--surface-3);
    color: var(--text-2);
  }

  .wallet-info {
    background: var(--blue-2);
    padding: var(--size-4);
    border-radius: var(--radius-3);
    border: var(--border-size-1) solid var(--blue-6);
    word-break: break-word;
    overflow-wrap: anywhere;
  }

  .loading {
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

  .footer {
    padding-block-start: var(--size-4);
    border-top: var(--border-size-1) solid var(--surface-3);
    text-align: center;
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
`