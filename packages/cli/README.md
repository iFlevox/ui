# iFlevox UI & Animated Icons

<p align="center">
  <img src="https://iflevox.uz/opengraph-image.png" alt="iFlevox UI" width="720" style="border-radius: 16px;" />
</p>

<p align="center">
  <strong>Next-Generation Kinetic UI Library & 254 Micro-Animated SVG Icons for React & Next.js</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/iflevox-ui"><img src="https://img.shields.io/npm/v/iflevox-ui?color=violet&style=flat-square" alt="NPM Version" /></a>
  <a href="https://github.com/iFlevox/iFlevox-website/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="MIT License" /></a>
  <a href="https://iflevox.uz/ui"><img src="https://img.shields.io/badge/components-210+-black?style=flat-square&logo=react" alt="210+ Components" /></a>
  <a href="https://iflevox.uz/icons"><img src="https://img.shields.io/badge/icons-254%20animated-black?style=flat-square" alt="254 Animated Icons" /></a>
</p>

---

## ✦ Why iFlevox UI?

1. **Zero Vendor Lock-in & Full Source Ownership**: Unlike monolithic npm component libraries that inflate your bundle, iFlevox copies the code directly into your repository (`@/components/iflevox`), giving you 100% control to customize, extend, and style.
2. **Apple & Linear Grade Physics**: Pre-tuned spring physics (`stiffness`, `damping`) powered by Framer Motion.
3. **True Micro-Choreographed Icons**: Not just `scale: 1.1` divs! Flagship icons feature genuine SVG `<motion.path>` micro-choreography (bell clapper swing, trash lid lift, checkmark path draw, gear rotation).
4. **Universal Tailwind Portability**: Works out of the box in standard Tailwind v3 and Tailwind v4 without requiring obscure custom tokens.
5. **Shadcn Registry Native**: Install any component or icon with standard `npx shadcn@latest add https://iflevox.uz/r/<slug>.json` commands.

---

## ⚡ Quickstart

### Option 1: Using `iflevox-ui` CLI (Recommended)

```bash
# Add a kinetic UI component
npx iflevox-ui add spotlight-card

# Add a micro-animated vector icon
npx iflevox-ui add icon-bell

# Interactive selector across all 210+ components
npx iflevox-ui add
```

### Option 2: Using the Shadcn Registry CLI

```bash
# Add UI component directly via URL
npx shadcn@latest add https://iflevox.uz/r/spotlight-card.json

# Add micro-animated icon via URL
npx shadcn@latest add https://iflevox.uz/r/icon-bell.json
```

---

## 🛠 Manual Installation

If you prefer copying code manually from [iflevox.uz/ui](https://iflevox.uz/ui):

1. **Install peer dependencies**:
```bash
npm install framer-motion lucide-react clsx tailwind-merge
```

2. **Ensure utility helper exists in `src/lib/utils.ts`**:
```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

3. Copy the component from [iflevox.uz/ui/[slug]](https://iflevox.uz/ui) into `components/ui/[slug].tsx` and import it in your page!

---

## 🤖 AI Coding Agents (Cursor, Windsurf, Claude Code, v0)

iFlevox is engineered for the AI agent era.
Every component has a **"Copy for Cursor/Claude"** button that gives your agent the exact props, dependencies, and code blueprint.

For agent system prompts or rules, reference our public directives endpoint:
`https://iflevox.uz/llms.txt`

---

## 📄 License

Licensed under the [MIT License](https://github.com/iFlevox/iFlevox-website/blob/main/LICENSE). Free for both personal and commercial applications.
