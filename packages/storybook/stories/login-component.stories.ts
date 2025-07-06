import type { Meta, StoryObj } from '@storybook/web-components';
import { OWCLoginComponent } from '@owc/login-component';

const meta: Meta<OWCLoginComponent> = {
  title: 'Components/Login Component',
  component: 'owc-login',
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
type Story = StoryObj<OWCLoginComponent>;

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