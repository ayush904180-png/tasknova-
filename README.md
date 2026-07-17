# TaskNova AI — Premium Human Intelligence Platform (v0.1 MVP)

TaskNova AI is a high-integrity, premium Human Intelligence Platform. Micro-taskers complete ultra-simple feedback requests (RLHF evaluation, prompt auditing, and translation validations) to help enterprises, researchers, and creators align machine learning models with human values.

This codebase serves as a highly scalable, production-ready frontend foundation (Build v0.1 MVP) designed with pristine folder separations, strict type safety, and direct adherence to SOLID design principles.

---

## 🌟 Core Architecture & Directory Specification

The project structure is engineered to prevent clutter, optimize build steps, and guarantee seamless scaling as backend features are introduced.

```bash
/src
 ├── config/                  # Environment controllers & third-party connectors
 │    ├── env.ts              # Type-safe client variables & multipliers
 │    └── firebase.placeholder.ts # Crash-safe, lazy-loaded Firebase adapter
 ├── context/                 # Global state layers
 │    └── ThemeContext.tsx    # Persistent Light/Dark theme manager
 ├── types/                   # Compile-time declarations
 │    └── index.ts            # Core schemas for tasks, profiles, & routes
 ├── utils/                   # Pure utility functions
 │    └── index.ts            # Currency indices (₹), class merges, timers
 ├── components/
 │    ├── ui/                 # Atomic stateless primitives (design tokens)
 │    │    ├── Button.tsx     # Custom variant buttons
 │    │    ├── Card.tsx       # Grid bento card components
 │    │    ├── Badge.tsx      # Status indicators (Inter/JetBrains Mono)
 │    │    └── Tabs.tsx       # Sliding tab switches
 │    ├── layout/             # Global structural scaffolds
 │    │    ├── Header.tsx     # Navigation header with active state maps
 │    │    ├── Footer.tsx     # Dynamic global sitemap & region badges
 │    │    └── LayoutShell.tsx # responsive padding container & transitions
 │    └── features/           # Sovereign domain-focused UI models
 │         ├── Hero.tsx        # High-contrast displays & CTA controls
 │         ├── FeaturesGrid.tsx # Bento-grid detailed value pitches
 │         ├── SandboxTasks.tsx # Interactive client-side task playground
 │         └── ArchitectureHub.tsx # Live filesystem specification explorer
 ├── App.tsx                  # Root router, orchestrating context boundaries
 └── main.tsx                 # DOM mounting & rendering
```

---

## 🛠️ Tech Stack & Styling Guide

- **Runtime & Compilation**: Vite + React 19 + TypeScript
- **Styling Pipeline**: Tailwind CSS (Native `@import` configuration)
- **Animation Layer**: Framer Motion transitions (or clean CSS animations)
- **Icons**: Lucide React
- **Theme**: Premium High-Contrast Light theme (default) paired with Graphite Dark mode. Fully persistent.

---

## 🛡️ SOLID Implementation Map

Each module in this foundation is mapped to standard software engineering principles:

1. **Single Responsibility Principle (SRP)**:
   - `/src/types/index.ts` is purely a dictionary of contract definitions; it carries zero runtime instructions.
   - `/src/utils/index.ts` houses pure, side-effect-free algorithms (e.g. converting Coins to Rupees `₹`).

2. **Open/Closed Principle (OCP)**:
   - Components like `/src/components/ui/Button.tsx` and `/src/components/ui/Card.tsx` utilize our custom `cn(...)` class merging utility. They are open to styling overlays via Tailwind classes but closed to direct modifications of their internal layout rules.

3. **Liskov Substitution Principle (LSP)**:
   - All standard HTML event listeners and props can be substituted directly into our custom primitives (e.g. `ButtonProps` extends `ButtonHTMLAttributes<HTMLButtonElement>`).

4. **Interface Segregation Principle (ISP)**:
   - Feature directories isolate distinct functional workloads. For instance, the task playground (`SandboxTasks.tsx`) is completely separate from the architecture browser (`ArchitectureHub.tsx`), avoiding huge monolithic files.

5. **Dependency Inversion Principle (DIP)**:
   - The `/src/config/firebase.placeholder.ts` module checks for system credentials before initializing. Components consume lazy getters (`getFirestore()`) rather than imports from direct modules, allowing the database driver to be swapped or mocked easily.

---

## 🚀 Setting Up the Application Locally

### Prerequisites
Ensure you have **Node.js (v18+)** and **npm** installed.

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Parameters
Create a local `.env` file based on `.env.example`:
```bash
cp .env.example .env
```
Fill in the Firebase and Gemini placeholders if you plan to connect live database elements later.

### 3. Launch Development Server
```bash
npm run dev
```
The server will bind on port `3000` (`http://localhost:3000`) with Hot Module Replacement support.

### 4. Build for Production
```bash
npm run build
```
The static compiler will compile all TSX modules, bundle stylesheets, and generate optimized production files under `/dist`.
