# AI Development Context - OWC Library

## Project Overview

**OWC Library** is a comprehensive web components library built with Lit, designed for decentralized applications using Cardano blockchain and IPFS. The project follows Open Web Components best practices and uses a monorepo structure with Lerna and Nx.

## Current State

### ✅ Completed Features
- **Login Component**: Cardano wallet integration with IPFS profile storage
- **Component-based Development Workflow**: Individual dev servers with hot reload
- **Shared Dependencies**: Single node_modules at root level
- **Production-like Testing**: Demo environment for built components
- **TypeScript Support**: Full type safety across all components
- **Build System**: Vite-based build with watch mode
- **Documentation**: Comprehensive README and DEVELOPMENT guides

### 🏗️ Architecture
```
OWC-Library/
├── packages/
│   ├── login-component/     # Login component development (port 3001)
│   │   ├── src/
│   │   │   ├── login-component.ts  # Main component
│   │   │   ├── index.ts           # Exports
│   │   │   └── types.d.ts         # Type declarations
│   │   ├── index.html             # Development page
│   │   └── vite.config.ts         # Dev server config
│   ├── shared/             # Shared utilities (port 3002)
│   │   ├── src/
│   │   │   ├── utils.ts           # IPFS utilities
│   │   │   ├── types.ts           # Shared types
│   │   │   └── index.ts           # Exports
│   │   └── vite.config.ts         # Dev server config
│   └── storybook/          # Component documentation
├── demo/                   # Production-like testing (port 3000)
├── dist/                   # Built components
└── node_modules/           # Shared dependencies
```

## Development Workflow

### Component Development
```bash
# Login component development (hot reload)
npm run dev:login          # http://localhost:3001

# Shared utilities development
npm run dev:shared         # http://localhost:3002

# Production-like testing
npm run dev:demo           # http://localhost:3000
```

### Building
```bash
# Build all components
npm run build

# Build with watch mode
npm run build:watch
```

## Key Technologies

### Core Stack
- **Lit**: Web Components framework
- **TypeScript**: Type safety and IntelliSense
- **Vite**: Build tool and dev server
- **Lerna + Nx**: Monorepo management
- **IPFS HTTP Client**: IPFS integration
- **Native Cardano API**: Wallet integration (window.cardano)

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Storybook**: Component documentation
- **Concurrently**: Parallel task execution

## Component Details

### Login Component (`owc-login`)
**Location**: `packages/login-component/src/login-component.ts`

**Features**:
- Cardano wallet connection (Nami, Eternl, Flint, Yoroi)
- IPFS profile storage with encryption
- Theme support (light/dark)
- Event-driven architecture
- CSS custom properties for theming

**Properties**:
- `ipfs-gateway`: IPFS gateway URL
- `ipfs-api-key`: Optional API key for private gateways
- `theme`: "light" or "dark"

**Events**:
- `wallet-connected`: Fired when wallet connects
- `profile-saved`: Fired when profile is saved to IPFS
- `error`: Fired on errors

**Usage**:
```html
<owc-login 
  ipfs-gateway="https://ipfs.io"
  theme="light"
></owc-login>
```

### Shared Utilities
**Location**: `packages/shared/src/`

**Features**:
- IPFS upload/download utilities
- Encryption helpers
- Type definitions
- Common utility functions

## Recent Changes & Decisions

### Development Workflow Restructure
- **Problem**: Previous workflow had hot reload issues and complex setup
- **Solution**: Component-level development servers with individual hot reload
- **Benefits**: 
  - Instant hot reload for component development
  - Shared node_modules saves disk space
  - Clear separation between development and production testing
  - Scalable for adding new components

### Technical Decisions
1. **Native Cardano API**: Using `window.cardano` instead of external libraries
2. **IPFS Integration**: Direct IPFS HTTP client usage with encryption
3. **Monorepo Structure**: Lerna + Nx for efficient package management
4. **Vite Configuration**: Optimized for monorepo development with polling

## Known Issues & Solutions

### Hot Reload Issues (Resolved)
- **Issue**: Changes not reflecting in browser automatically
- **Solution**: Component-level dev servers with direct source imports
- **Status**: ✅ Resolved

### TypeScript Errors (Resolved)
- **Issue**: Various TypeScript compilation errors
- **Solution**: Proper type definitions and null checks
- **Status**: ✅ Resolved

### Build Configuration (Resolved)
- **Issue**: Workspace protocol and package version conflicts
- **Solution**: File path aliases and compatible package versions
- **Status**: ✅ Resolved

## Next Steps & Roadmap

### Immediate Tasks
1. **Add More Components**:
   - `owc-wallet-info`: Display wallet information
   - `owc-transaction-form`: Create and sign transactions
   - `owc-nft-gallery`: NFT display and management

2. **Enhance Existing Components**:
   - Add more wallet support
   - Improve error handling
   - Add loading states
   - Enhance theming options

3. **Testing & Documentation**:
   - Add unit tests
   - Expand Storybook stories
   - Add integration tests

### Future Enhancements
- **Design System**: Comprehensive design tokens
- **Figma Integration**: Design-dev handoff
- **Performance**: Bundle optimization
- **Accessibility**: WCAG compliance
- **Internationalization**: Multi-language support

## Development Guidelines

### Code Style
- Follow Open Web Components standards
- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Use conventional commits

### Component Development
- Each component should have its own dev server
- Use CSS custom properties for theming
- Implement proper event handling
- Add comprehensive TypeScript types

### Testing Strategy
- Unit tests for utility functions
- Component tests for web components
- Integration tests for wallet/IPFS functionality
- Storybook for visual testing

## Environment Setup

### Prerequisites
- Node.js 18+
- npm 8+
- Cardano wallet (Nami, Eternl, Flint, or Yoroi)

### Quick Start
```bash
# Install dependencies
npm install

# Start component development
npm run dev:login

# Build for production
npm run build
```

## Troubleshooting

### Common Issues
1. **Hot Reload Not Working**: Ensure using component dev server (`npm run dev:login`)
2. **Build Errors**: Check TypeScript errors and import paths
3. **Wallet Connection**: Ensure Cardano wallet extension is installed
4. **IPFS Issues**: Verify gateway URL and API key (if using private gateway)

### Debug Commands
```bash
# Check build status
npm run build

# Run with verbose output
npm run dev:login -- --debug

# Check TypeScript errors
npx tsc --noEmit
```

## File Locations

### Key Configuration Files
- `package.json`: Root package configuration
- `lerna.json`: Monorepo configuration
- `nx.json`: Nx workspace configuration
- `tsconfig.json`: TypeScript configuration
- `vite.config.ts`: Build tool configuration (in each package)

### Source Files
- `packages/login-component/src/`: Login component source
- `packages/shared/src/`: Shared utilities source
- `demo/`: Production-like testing environment

### Documentation
- `README.md`: Project overview and usage
- `DEVELOPMENT.md`: Detailed development workflow
- `AI_CONTEXT.md`: This file - AI development context

---

**Last Updated**: Current session
**Status**: Active development with working component-based workflow
**Next Session Focus**: Component enhancement and new component development 