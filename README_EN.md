# Persei-ε-B0.5V

<div align="center">

[简体中文](./README.md) | **English**

![Frontend](https://img.shields.io/badge/Frontend-React%2019%20%7C%20TypeScript-61DAFB?style=flat-square&logo=react)
![Build Tool](https://img.shields.io/badge/Build-Vite-646CFF?style=flat-square&logo=vite)
![Styling](https://img.shields.io/badge/CSS-TailwindCSS-38B2AC?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/License-Non--Commercial%20Research-grey?style=flat-square)

<p align="center">
  <b>Aether Gazer Web Operations & Management Console Source Code Repository (Frontend Only)</b>
</p>

</div>

> 📖 **Developer's Note / Behind the Scenes**:  
> Curious about the story, motivations, and journey behind this project? Check out the author's blog post: [About LocalServer - MoriaRuRuka (Chinese)](https://moriaruruka.com/2026/09/24/411/).

---

## Module Scope

`Persei-ε-B0.5V` (Epsilon Persei) serves as the frontend control panel source code repository within the **Alpha Persei Cluster** ecosystem.

This repository **strictly contains frontend source code, TypeScript type definitions, UI component logic, and Vite build pipeline setups**. All heavy binary media assets (character portraits, background CGs, animated stickers, and audio) have been completely stripped.

---

## Directory Structure

This repository archives two distinct stages of web dashboard source code:

```
Persei-Epsilon-B0.5V/
├── web_current/            # Active Web management console source code
│   ├── src/                # UI components, router, API client & TypeScript types
│   ├── scripts/            # Build and generation helper scripts
│   ├── templates/          # Base HTML templates
│   ├── package.json        # Dependencies (React 19 + Tailwind CSS)
│   ├── tsconfig.json       # TypeScript configuration
│   └── vite.config.ts      # Vite build pipeline configuration
│
└── web_opus_legacy/        # Legacy OPUS prototype source code (reference archive)
    ├── src/                # Prototype panel components (Overview, Heroes, Gacha, etc.)
    ├── package.json        # Dependencies
    ├── tsconfig.json       # TypeScript configuration
    └── vite.config.ts      # Vite configuration
```

---

## Key Functional Panels

The management console primarily serves as an **inspection and monitoring tool** for server runtime states and account data:

1. **Overview**: Displays server uptime, real-time connection status, and account snapshot;
2. **Accounts**: Displays stamina regeneration clocks, active assistant characters, and signatures;
3. **Heroes**: Inspects modifier rosters, breakthrough stages, astrolabe node setups, and stats;
4. **Inventory**: Categorized inspection of items, upgrade materials, and consumables;
5. **Gacha**: Inspects active pool configurations and pity counters, supporting 229 / 311 pool switching;
6. **Agreement & Help**: Operational FAQ and technical principles;
7. **Shop**: Inspects regular token shop catalogues and product pricing;
8. **Mail**: Mailbox viewing and test mail dispatching;
9. **AIChat**: LLM-based interactive dialogue testing with game character personalities;
10. **Settings**: Port monitoring, version switching, and recharge calculation.

---

## Local Development & Build

To run or build the active web console locally:

```powershell
cd web_current

# Install dependencies
npm install

# Start local hot-reloading development server
npm run dev

# Compile production bundle (output will be generated in dist/)
npm run build
```

---

## Disclaimer

This project is intended strictly for personal research and educational study in modern frontend architecture (React 19 / TypeScript / Vite), component state management, and simulation dashboard design. Commercial use is strictly prohibited.
