# OWC Library - Open Web Components for Cardano & IPFS

A comprehensive library of web components built with Lit, following Open Web Components best practices, designed for decentralized applications using Cardano blockchain and IPFS.

## 🚀 Features

- **Cardano Wallet Integration**: Seamless connection with popular Cardano wallets (Nami, Eternl, Flint, Yoroi)
- **IPFS Profile Storage**: Encrypted user profiles stored on IPFS
- **Modern Web Components**: Built with Lit framework following Open Web Components standards
- **TypeScript Support**: Full type safety and IntelliSense support
- **Monorepo Structure**: Organized with Lerna and Nx for easy development and publishing
- **Storybook Integration**: Interactive component documentation and testing
- **Design System Ready**: CSS custom properties for easy theming

## 📦 Components

### Available Components

- **`amdtel-login`**: Cardano wallet login component with IPFS profile storage
- More components coming soon...

### Planned Components

- `amdtel-wallet-info`: Display wallet information and balance
- `amdtel-transaction-form`: Create and sign Cardano transactions
- `amdtel-nft-gallery`: Display and manage Cardano NFTs
- `amdtel-ipfs-uploader`: File upload to IPFS with encryption
- `amdtel-cardano-chart`: Interactive Cardano blockchain data visualization

## 🛠️ Setup & Installation

### Prerequisites

- Node.js 18+ 
- npm 8+
- A Cardano wallet (Nami, Eternl, Flint, or Yoroi)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/OWC-Library.git
   cd OWC-Library
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build all packages**
   ```bash
   npm run build
   ```

4. **Start component development**
   ```bash
   npm run dev:login
   ```

5. **Start Storybook** (in a new terminal)
   ```bash
   npm run storybook
   ```

## 🎯 Usage

### Basic Usage

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module">
    import '@owc/login-component';
  </script>
</head>
<body>
  <amdtel-login 
    ipfs-gateway="https://ipfs.io"
    theme="light"
  ></amdtel-login>

  <script>
    document.querySelector('amdtel-login').addEventListener('wallet-connected', (event) => {
      console.log('Wallet connected:', event.detail);
    });

    document.querySelector('amdtel-login').addEventListener('profile-saved', (event) => {
      console.log('Profile saved:', event.detail);
    });
  </script>
</body>
</html>
```

### Advanced Usage with Custom Styling

```html
<style>
  :root {
    --amdtel-primary-color: #3b82f6;
    --amdtel-bg-color: #f8fafc;
    --amdtel-card-bg: #ffffff;
    --amdtel-text-color: #1f2937;
    --amdtel-border-color: #e5e7eb;
  }

  .dark-theme {
    --amdtel-primary-color: #60a5fa;
    --amdtel-bg-color: #1f2937;
    --amdtel-card-bg: #374151;
    --amdtel-text-color: #f9fafb;
    --amdtel-border-color: #4b5563;
  }
</style>

<amdtel-login 
  ipfs-gateway="https://gateway.pinata.cloud"
  ipfs-api-key="your-pinata-api-key"
  theme="dark"
></amdtel-login>
```

### React Integration

```jsx
import { useEffect, useRef } from 'react';
import '@owc/login-component';

function LoginPage() {
  const loginRef = useRef();

  useEffect(() => {
    const loginElement = loginRef.current;
    
    const handleWalletConnected = (event) => {
      console.log('Wallet connected:', event.detail);
    };

    const handleProfileSaved = (event) => {
      console.log('Profile saved:', event.detail);
    };

    loginElement.addEventListener('wallet-connected', handleWalletConnected);
    loginElement.addEventListener('profile-saved', handleProfileSaved);

    return () => {
      loginElement.removeEventListener('wallet-connected', handleWalletConnected);
      loginElement.removeEventListener('profile-saved', handleProfileSaved);
    };
  }, []);

  return (
    <amdtel-login
      ref={loginRef}
      ipfs-gateway="https://ipfs.io"
      theme="light"
    />
  );
}
```

## 🎨 Figma Integration

### Design Token Workflow

1. **Export tokens from Figma**
   - Use Figma Tokens plugin to export design tokens
   - Export as JSON format

2. **Transform tokens**
   ```bash
   npm run tokens:transform
   ```

3. **Generate CSS custom properties**
   ```bash
   npm run tokens:css
   ```

### Storybook Figma Addon

The project includes Storybook Figma addon for design-dev handoff:

1. **Install Figma addon**
   ```bash
   npm install --save-dev @storybook/addon-figma
   ```

2. **Configure in `.storybook/main.ts`**
   ```typescript
   addons: [
     '@storybook/addon-figma',
     // ... other addons
   ],
   ```

3. **Use in stories**
   ```typescript
   export const Default: Story = {
     parameters: {
       figma: {
         url: 'https://www.figma.com/file/...',
         component: 'Login Component'
       }
     }
   };
   ```

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests for specific package
npm run test --workspace=@owc/login-component
```

### Test Coverage

```bash
# Generate coverage report
npm run test:coverage
```

## 📚 Development

### Project Structure

```
OWC-Library/
├── packages/
│   ├── login-component/     # Login component development
│   │   ├── src/            # Component source files
│   │   ├── index.html      # Development page
│   │   └── vite.config.ts  # Component dev server config
│   ├── shared/             # Shared utilities
│   │   ├── src/            # Shared source files
│   │   └── vite.config.ts  # Shared dev server config
│   └── storybook/          # Component documentation
├── demo/                   # Production-like testing
├── dist/                   # Built components
├── .storybook/             # Storybook configuration
├── nx.json                 # Nx workspace config
├── lerna.json             # Lerna monorepo config
└── package.json           # Root package config
```

For detailed development workflow, see [DEVELOPMENT.md](./DEVELOPMENT.md).

### Adding New Components

1. **Create component package**
   ```bash
   npx nx generate @nx/workspace:library my-component --directory=packages
   ```

2. **Add component to Storybook**
   ```bash
   # Add story file
   touch packages/storybook/stories/my-component.stories.ts
   ```

3. **Update exports**
   ```typescript
   // packages/my-component/src/index.ts
   export { MyComponent } from './my-component.js';
   ```

### Building for Production

```bash
# Build all packages
npm run build

# Build specific package
npm run build --workspace=@owc/login-component

# Publish to npm
npm run publish
```

## 🔧 Configuration

### IPFS Configuration

The components support various IPFS gateways:

- **Public gateways**: `https://ipfs.io`, `https://gateway.pinata.cloud`
- **Private gateways**: Configure with API keys for better performance
- **Local node**: `http://localhost:5001` for development

### Cardano Network Configuration

- **Mainnet**: Production network (default)
- **Testnet**: Development and testing network
- **Preview**: Latest features testing network

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow Open Web Components standards
- Use TypeScript for all new code
- Write tests for all components
- Update Storybook stories
- Follow conventional commits

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Storybook](http://localhost:6006)
- **Issues**: [GitHub Issues](https://github.com/your-username/OWC-Library/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/OWC-Library/discussions)

## 🔗 Related Projects

- [Lit](https://lit.dev/) - Web Components framework
- [Open Web Components](https://open-wc.org/) - Web Components best practices
- [Cardano Connect with Wallet](https://github.com/cardano-foundation/cardano-connect-with-wallet) - Cardano wallet integration
- [IPFS HTTP Client](https://github.com/ipfs/js-ipfs/tree/master/packages/ipfs-http-client) - IPFS JavaScript client
