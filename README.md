<div align="center">

# ZborHub Weekly Scheduler

**A browser-based weekly planner and poster builder for training programs, workshops, recurring events, and team schedules**

[![Platform](https://img.shields.io/badge/Platform-Web-4F46E5?style=flat-square&logo=vercel&logoColor=white)](https://vite.dev/)
[![Framework](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![Language](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Build](https://img.shields.io/badge/Build-Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](#-license--author)

</div>

<p align="center">
  <img src="./src/assets/hero.png" alt="Weekly Scheduler interface preview" width="960">
</p>

---

## Overview

ZborHub Weekly Scheduler is a React + TypeScript application that helps you turn a rough weekly plan into a clean, export-ready schedule. The app combines a week planner, event editor, mobile/desktop preview modes, and poster customization tools so the final output can be shared without extra cleanup in spreadsheets or design software.

The current build supports:

- managing a weekly date range and enabled days
- editing events inline for each day
- importing schedule data from Excel files
- styling the board with preset color themes
- customizing poster layout spacing and typography
- switching between 2-slide and 3-slide output layouts
- exporting the selected slide as PNG, JPG, or PDF
- persisting settings locally in the browser

---

## Current features

### Weekly planning

- choose the week start date and optional year display
- generate a structured daily grid for the selected week
- add, edit, remove, and highlight events per day
- keep the schedule state stored automatically in `localStorage`
- reset back to the default mock schedule at any time

### Excel import workflow

- import `.xlsx` schedule data into the current planner
- parse event rows into the app’s structured weekly model
- keep import status feedback for success and parsing errors
- use the imported schedule immediately in the editor and preview

### Poster / export tooling

- switch between multiple theme presets for the schedule board
- fine-tune poster spacing, typography, day card dimensions, and event card styling
- save custom preset profiles and update them later
- export presets as JSON for backup or sharing
- import preset JSON files back into the app
- export the active board slide as a downloadable image or PDF

### UX and layout

- desktop and mobile-friendly view switching
- focused board pagination for multi-slide planning
- live preview while adjusting poster settings
- quick access to editor, preview, and poster configuration modes

---

## Tech stack

| Area | Tooling |
| --- | --- |
| Frontend | React 19 + TypeScript |
| Build & dev tooling | Vite |
| Styling | Tailwind CSS |
| Date logic | date-fns |
| Icons | lucide-react |
| Export / rendering | html2canvas, jsPDF |
| Excel import | ExcelJS |
| UI polish | custom poster presets and themed schedule styling |

---

## App structure

```text
.
├── src/
│   ├── App.tsx                     # main app shell and state orchestration
│   ├── components/
│   │   ├── editor/                 # date settings, event editing, day management
│   │   ├── preview/                # slide board rendering and export controls
│   │   └── settings/               # poster settings and preset manager
│   ├── constants/                  # default poster settings and UI theme tokens
│   ├── data/                       # mock schedule data, theme definitions, sample imports
│   ├── hooks/                      # scheduling logic and persistence hook
│   ├── types/                      # shared TypeScript models
│   ├── utils/                      # date helpers, storage utilities, export services, Excel parser
│   ├── assets/                     # interface images and app assets
│   ├── main.tsx                   # app entry point
│   └── index.css                  # global styling
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md
├── LICENSE
├── public/
└── src/data/schedule.xlsx
```

---

## Getting started

### Prerequisites

- Node.js 20+
- npm

### Install

```bash
git clone https://github.com/coxteen/weekly-scheduler.git
cd weekly-scheduler
npm install
```

### Run locally

```bash
npm run dev
```

Then open the app in your browser, usually:

```text
http://localhost:5173
```

### Production build

```bash
npm run build
```

---

## Current implementation notes

This project is intentionally frontend-only and does not require a backend or external API keys for local use. The app keeps schedule data in browser storage, supports quick iteration, and is designed for fast event planning and presentation-quality output.

---

## License & author

- Author: [Costin Ghiujan](https://github.com/coxteen)
- License: Released unde the [MIT License](LICENSE).
