<p align="center">
  <a href="https://iflevox.uz/ui">
    <img src="https://iflevox.uz/og-image.png" alt="iFlevox UI" width="800" style="border-radius: 14px;" />
  </a>
</p>

<h1 align="center">iFlevox UI & Micro-Animated Icons</h1>

<p align="center">
  <strong>Next-Generation Kinetic UI Components & 254 Micro-Animated Vector Icons for React & Next.js.</strong>
  <br />
  <em>Zero vendor lock-in. Full source code ownership. Apple & Linear grade physics.</em>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/iflevox-ui"><img src="https://img.shields.io/npm/v/iflevox-ui?color=7c3aed&style=for-the-badge&logo=npm" alt="npm version" /></a>
  <a href="https://github.com/iFlevox/ui/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge" alt="MIT License" /></a>
  <a href="https://iflevox.uz/ui"><img src="https://img.shields.io/badge/components-210+-black?style=for-the-badge&logo=react" alt="210+ Components" /></a>
  <a href="https://iflevox.uz/icons"><img src="https://img.shields.io/badge/icons-254%20animated-black?style=for-the-badge&logo=framer" alt="254 Animated Icons" /></a>
  <a href="https://iflevox.uz"><img src="https://img.shields.io/badge/platform-iFlevox.uz-6366f1?style=for-the-badge" alt="iFlevox.uz" /></a>
</p>

---

## ✦ Why iFlevox UI?

Most modern UI libraries package their components into monolithic npm dependencies that bloat your bundle, conflict with your Tailwind configuration, and lock you into their design decisions.

**iFlevox UI flips that model completely:**

- 🚀 **100% Code Ownership**: Direct copy-paste into your repository (`@/components/ui`). You own every CSS class, every JSX element, and every state hook.
- 🎯 **Apple & Linear Grade Physics**: Tuned spring physics (`stiffness`, `damping`, `mass`) powered by Framer Motion. Motion feels tactile, natural, and responsive.
- ✨ **254 Micro-Animated SVG Icons**: Not simple CSS scale transforms! Our flagship icons feature multi-stage SVG `<motion.path>` choreography (bell clapper swing, padlock shackle pop, trash lid snap, checkmark path drawing).
- 🧩 **Universal Tailwind & Shadcn Native**: Works effortlessly with standard Tailwind CSS (v3 & v4). Install directly via our CLI or official Shadcn registry command.
- 🤖 **AI-Agent Ready**: Built for developers using **Cursor**, **Claude Code**, **Windsurf**, or **v0**. Point your agent to [`https://iflevox.uz/llms.txt`](https://iflevox.uz/llms.txt) for instant component blueprints and prompts.

---

## ⚡ Quickstart

### 1. Interactive CLI (Recommended)

No global installation required! Run the interactive component browser right inside your project:

```bash
# Browse and install interactively
npx iflevox-ui add

# Add a specific kinetic component
npx iflevox-ui add spotlight-card
npx iflevox-ui add magnetic-button
npx iflevox-ui add dock-navbar

# Add a micro-animated vector icon
npx iflevox-ui add icon-bell
npx iflevox-ui add icon-shield-check
```

### 2. Shadcn Registry CLI

Already using `shadcn/ui`? You can install any iFlevox component or icon directly via the official Shadcn CLI:

```bash
# Install UI component
npx shadcn@latest add https://iflevox.uz/r/spotlight-card.json

# Install micro-animated icon
npx shadcn@latest add https://iflevox.uz/r/icon-bell.json
```

---

## 🛠 Manual Installation

If you prefer adding components manually:

### 1. Install Peer Dependencies

```bash
npm install framer-motion lucide-react clsx tailwind-merge
# or
pnpm add framer-motion lucide-react clsx tailwind-merge
# or
yarn add framer-motion lucide-react clsx tailwind-merge
```

### 2. Utility Helper

Make sure you have `cn` helper in `src/lib/utils.ts` (standard in Shadcn / Tailwind setups):

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 3. Copy & Use

Visit [iflevox.uz/ui](https://iflevox.uz/ui), click **Copy Code**, paste it into your `components/ui/` folder, and import it anywhere in your app:

```tsx
import { SpotlightCard } from "@/components/ui/spotlight-card";

export default function Hero() {
  return (
    <SpotlightCard spotlightColor="rgba(124, 58, 237, 0.25)">
      <h3 className="text-xl font-bold text-white">Next-Gen Interface</h3>
      <p className="text-zinc-400 mt-2">Crafted with precision physics.</p>
    </SpotlightCard>
  );
}
```

---

## 🎨 Component Highlights (210+ Components)

| Category | Highlights |
| :--- | :--- |
| **Hero Sections** | Bento Grid Hero, Spotlight Hero, Kinetic Canvas Reveal, Mesh Aurora |
| **Navbars & Docks** | Fluid macOS Dock, Floating Pill Bar, Liquid Active Indicator, Dynamic Island |
| **Cards & 3D** | Spotlight Card, Tilt Parallax Card, Noise Glass Card, Hologram Border Card |
| **Buttons & Press** | Magnetic Cursor Button, Fluid Gradient Border, Shimmer Ripple, Haptic Glow |
| **Kinetic Text** | Dynamic Text Reveal, Character Stagger Glitch, Typewriter Splitter, Gradient Wave |
| **Pricing & Sliders** | Interactive Annual Pricing Slider, Tier Comparison Grid, Glow Badge Matrix |
| **Command & Modals** | Glassmorphic Command Palette, Staggered Spring Modal, Drawer Sheet |
| **Data & Marquee** | Infinite Velocity Marquee, Live Number Counter, Staggered Grid List |

---

## 🎬 Micro-Animated Icons (254 Vector Icons)

Unlike static icon sets or basic CSS transitions, each iFlevox icon is an independent SVG micro-choreography:

- 🔔 **IconBell**: Clapper physically oscillates on hover with damped harmonic decay.
- 🛡️ **IconShieldCheck**: Shield border pulses while checkmark path dynamically draws in.
- 🗑️ **IconTrash**: Lid flips upward with inertia while can body subtly tilts.
- ✨ **IconSparkles**: Secondary stars rotate and twinkle with staggered delay.
- ⚙️ **IconGear**: Dual-phase mechanical rotation with smooth easing.
- ❤️ **IconHeart**: Elastic heartbeat pulse with floating ambient particle.

---

## 🤖 AI Coding Agents (Cursor, Claude Code, Windsurf, v0)

iFlevox was built from the ground up for the AI-assisted engineering workflow.

1. **Directives Endpoint**: Every AI agent can consume our full component registry specifications at:
   ```
   https://iflevox.uz/llms.txt
   ```
2. **One-Click Agent Blueprint**: On [iflevox.uz/ui](https://iflevox.uz/ui), every component card includes a **"Copy for AI"** button that copies ready-to-paste instructions, props schema, and full code for your prompt.

---

## 📦 Monorepo Structure

```
ui/
├── packages/
│   └── cli/             # Official iflevox-ui npm package
│       ├── bin/index.js # Production CLI executable
│       └── package.json # npm metadata
├── cli/                 # CLI TypeScript source code & tsup build config
├── LICENSE              # MIT License
└── README.md            # Documentation & Quickstart
```

---

## 🤝 Contributing

Contributions, bug reports, and new component ideas are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/new-kinetic-component`)
3. Commit your changes (`git commit -m 'feat: add interactive holographic card'`)
4. Push to the branch (`git push origin feat/new-kinetic-component`)
5. Open a Pull Request

---

## ⭐ Star Us

If you find iFlevox UI useful for your projects, **please star this repository** — it helps more developers discover open-source kinetic design!

<p align="center">
  <a href="https://github.com/iFlevox/ui">
    <img src="https://api.star-history.com/svg?repos=iFlevox/ui&type=Date" alt="Star History Chart" />
  </a>
</p>

---

## 📄 License

Licensed under the [MIT License](LICENSE). Free for personal and commercial use.

Crafted with care by [Ozodbek Nazarov](https://iflevox.uz/founder) & the [iFlevox Ecosystem](https://iflevox.uz).
