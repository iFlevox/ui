# iflevox-ui

> Next-generation CLI tool to add production-ready kinetic UI components directly to your project. Zero vendor lock-in. Component ownership.

[![npm version](https://img.shields.io/npm/v/iflevox-ui.svg?color=7c3aed)](https://www.npmjs.com/package/iflevox-ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Installation & Quick Start

You don't need to install this globally. Run it directly with `npx`:

```bash
npx iflevox-ui add magnetic-button
```

Or initialize your project configuration:

```bash
npx iflevox-ui init
```

## Available Commands

### Add Components
Add one or more components directly to your `components/iflevox/` directory:

```bash
# Add a single component
npx iflevox-ui add magnetic-button

# Add multiple components
npx iflevox-ui add kinetic-text-reveal animated-beam-background dock-navbar

# Interactive selection (launches fuzzy search menu)
npx iflevox-ui add
```

### List All Components
Browse the complete registry of 200+ elements:

```bash
npx iflevox-ui list
```

## Supported Package Managers

The CLI automatically detects your active package manager and installs missing dependencies accordingly:
- **pnpm**: `pnpm dlx iflevox-ui add <component>`
- **bun**: `bunx iflevox-ui add <component>`
- **npm**: `npx iflevox-ui add <component>`
- **yarn**: `yarn dlx iflevox-ui add <component>`

## Philosophy

- **Component Ownership**: The source code belongs to you. No bloated node_modules wrapper.
- **Kinetic Physics**: Built on Framer Motion spring calculations.
- **Accessibility**: Built with Radix UI primitives.
- **Type Safety**: Strictly typed TypeScript and Tailwind CSS ready.

## Documentation

Explore interactive previews and full documentation at [https://iflevox.uz/ui](https://iflevox.uz/ui).

## License

MIT © [iFlevox](https://iflevox.uz)
