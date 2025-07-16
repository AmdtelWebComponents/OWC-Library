# Development Workflow

This project uses a component-based development workflow with shared dependencies.

## Project Structure

```
OWC-Library/
├── packages/
│   ├── login-component/     # Login component development
│   │   ├── src/            # Component source files
│   │   ├── index.html      # Development page
│   │   └── vite.config.ts  # Component dev server config
│   └── shared/             # Shared utilities
│       ├── src/            # Shared source files
│       └── vite.config.ts  # Shared dev server config
├── demo/                   # Production-like testing
│   ├── index.html          # Demo page
│   └── vite.config.ts      # Demo server config
├── dist/                   # Built components (for demo)
└── node_modules/           # Shared dependencies
```

## Development Workflow

### 1. Component Development

Each component has its own development environment with hot reload:

```bash
# Start login component development server
npm run dev:login

# Start shared utilities development server  
npm run dev:shared
```

**Login Component Development:**
- **URL:** http://localhost:3001
- **Files:** `packages/login-component/src/`
- **Hot Reload:** ✅ Enabled - changes reflect instantly
- **Purpose:** Component development and testing

**Shared Utilities Development:**
- **URL:** http://localhost:3002  
- **Files:** `packages/shared/src/`
- **Hot Reload:** ✅ Enabled
- **Purpose:** Shared utilities development

### 2. Production-like Testing

The demo environment tests built components:

```bash
# Build components first
npm run build:watch

# Start demo server (in another terminal)
npm run dev:demo
```

**Demo Environment:**
- **URL:** http://localhost:3000
- **Purpose:** Production-like testing of built components
- **Hot Reload:** ✅ Enabled for demo changes
- **Component Updates:** Requires component rebuild

### 3. Building Components

```bash
# Build all components once
npm run build

# Build all components with watch mode
npm run build:watch
```

## Development Commands

| Command | Purpose | Port |
|---------|---------|------|
| `npm run dev:login` | Login component development | 3001 |
| `npm run dev:shared` | Shared utilities development | 3002 |
| `npm run dev:demo` | Production-like testing | 3000 |
| `npm run build` | Build all components | - |
| `npm run build:watch` | Build with watch mode | - |

## Workflow Tips

### For Component Development:
1. Use `npm run dev:login` for active development
2. Edit files in `packages/login-component/src/`
3. See changes instantly in browser
4. Test different configurations using the controls

### For Production Testing:
1. Run `npm run build:watch` in one terminal
2. Run `npm run dev:demo` in another terminal  
3. Test the built component in a production-like environment
4. Verify component behavior with different configurations

### For Shared Utilities:
1. Use `npm run dev:shared` for utility development
2. Edit files in `packages/shared/src/`
3. Import shared utilities in components as needed

## File Structure

### Login Component
```
packages/login-component/
├── src/
│   ├── login-component.ts  # Main component
│   ├── index.ts           # Component exports
│   └── types.d.ts         # Type declarations
├── index.html             # Development page
├── vite.config.ts         # Dev server config
└── package.json           # Component config
```

### Shared Utilities
```
packages/shared/
├── src/
│   ├── utils.ts           # Utility functions
│   ├── types.ts           # Shared types
│   └── index.ts           # Shared exports
├── vite.config.ts         # Dev server config
└── package.json           # Shared config
```

## Benefits of This Workflow

1. **Fast Development:** Hot reload for each component
2. **Isolated Testing:** Each component has its own dev environment
3. **Shared Dependencies:** Single node_modules folder saves disk space
4. **Production Testing:** Demo environment tests built components
5. **Clear Separation:** Development vs production-like testing
6. **Scalable:** Easy to add new components

## Troubleshooting

### Hot Reload Not Working
- Ensure you're using the component's dev server (`npm run dev:login`)
- Check that files are being saved
- Try refreshing the browser

### Build Errors
- Check TypeScript errors in the component source
- Ensure shared dependencies are properly imported
- Verify Vite config paths are correct

### Demo Not Updating
- Ensure `npm run build:watch` is running
- Check that components are building successfully
- Verify demo is importing from correct built files

## 🎯 Testing Changes

1. **Open Demo**: `http://localhost:3000`
2. **Make Changes**: Edit component source files
3. **Watch Rebuild**: Terminal shows rebuild progress
4. **Browser Refresh**: Demo automatically updates
5. **Test Features**: Use the demo interface

## 🔧 Troubleshooting

### Changes Not Appearing?

1. **Check Terminal**: Look for build errors
2. **Manual Rebuild**: Run `npm run build`
3. **Clear Cache**: Delete `dist/` folders and rebuild
4. **Restart Dev Server**: Stop and run `npm run dev` again

### Build Errors?

1. **TypeScript Errors**: Check for type issues
2. **Missing Dependencies**: Run `npm install`
3. **Clean Build**: Run `npm run clean && npm run build`

## 📝 Adding New Components

1. **Create Package**:
   ```bash
   mkdir packages/my-component
   cd packages/my-component
   # Create package.json, vite.config.ts, etc.
   ```

2. **Add to Demo**:
   ```html
   <!-- In demo/index.html -->
   <script type="module">
     import '@amdtel/my-component';
   </script>
   <my-component></my-component>
   ```

3. **Test**: Run `npm run dev` and test in demo

## 🎨 Styling

- **CSS Variables**: Use `--amdtel-*` variables for theming
- **Dark Theme**: Toggle with the theme button in demo
- **Responsive**: Components are mobile-friendly

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific package tests
cd packages/login-component && npm test

# Run tests in watch mode
npm run test:watch
```

## 📚 Documentation

- **Storybook**: Component documentation (when configured)
- **Demo Page**: Interactive examples
- **TypeScript**: Full type definitions
- **Comments**: Inline documentation in code 