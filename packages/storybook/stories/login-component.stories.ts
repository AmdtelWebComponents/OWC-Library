import type { Meta, StoryObj } from '@storybook/web-components';
import '@amdtel/login-component';

const meta: Meta<any> = {
  title: 'Components/Login Component',
  component: 'amdtel-login',
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    ipfsGateway: {
      control: 'text',
      description: 'IPFS gateway URL',
    },
    ipfsApiKey: {
      control: 'text',
      description: 'IPFS API key (optional)',
    },
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
      description: 'Component theme',
    },
  },
  args: {
    ipfsGateway: 'https://ipfs.io',
    ipfsApiKey: '',
    theme: 'light',
  },
};

export default meta;
type Story = StoryObj<any>;

export const Default: Story = {
  args: {},
};

export const WithCustomGateway: Story = {
  args: {
    ipfsGateway: 'https://gateway.pinata.cloud',
    ipfsApiKey: 'your-api-key-here',
  },
};

export const DarkTheme: Story = {
  args: {
    theme: 'dark',
  },
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
}; 