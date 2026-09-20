# Swaroop Kola — AI/ML Developer Portfolio

> A production-oriented React portfolio for software engineering, AI/ML, product thinking, and experimental computer-vision interaction.

## ✦ Overview

This repository contains the source for my personal portfolio website.

The application keeps the existing visual language and interaction model while organizing the code around focused responsibilities:

- responsive portfolio UI
- project exploration and filtering
- keyboard navigation
- clipboard utilities
- reduced-motion support
- optional camera-based hand interaction
- custom pointer tracking
- gesture-driven clicking and scrolling

## 🧭 Architecture

```text
src/
├── components/
│   ├── About.jsx
│   ├── Contact.jsx
│   ├── Header.jsx
│   ├── Hero.jsx
│   ├── OrbitalScene.jsx
│   ├── ProjectCard.jsx
│   ├── Skills.jsx
│   └── Work.jsx
├── data/
│   └── portfolio.js
├── features/
│   └── hand-control/
│       ├── HandControl.jsx
│       ├── gesture.js
│       └── targets.js
├── App.css
├── App.jsx
├── index.css
└── main.jsx

tests/
├── gesture.test.mjs
└── scroll-controller.test.mjs
```

`App.jsx` is the composition root. Page sections are isolated in `components/`, content is kept in `data/`, and webcam interaction lives in `features/hand-control/`.

## ⚙️ Technology

| Layer | Technology |
| --- | --- |
| UI | React 19 |
| Build | Vite 7 |
| Styling | CSS |
| Computer vision | MediaPipe Tasks Vision |
| Browser APIs | Camera, Clipboard, Intersection Observer, Animation Frame |
| Quality | ESLint + Node regression tests |
| Deployment | Vercel |

## 🖐 Air Control

Air Control is an optional camera interaction layer.

```text
Webcam
  ↓
MediaPipe Hand Landmarker
  ↓
21 hand landmarks
  ↓
Gesture classification
  ↓
Interaction state
  ├── Pointer
  ├── Click
  ├── Scroll up
  ├── Scroll down
  └── Pause
  ↓
Browser interaction
```

### Gesture grammar

| Gesture | Action |
| --- | --- |
| ☝ Index only | Move the custom pointer |
| ☝ + 👍 | Hold a click target; closing the thumb completes it |
| 🤟 Index + middle + ring | Scroll up |
| 🖐 Index + middle + ring + little | Scroll down |
| ✋ Open hand / ✊ Fist | Pause |

Mouse, touch, and keyboard interaction remain available without Air Control.

## 🧪 Development

Install the locked dependency graph:

```bash
npm ci
```

Start the development server:

```bash
npm run dev
```

Run regression tests:

```bash
npm run test:gesture
```

Run linting:

```bash
npm run lint
```

Build production assets:

```bash
npm run build
```

Run the combined quality check:

```bash
npm run check
```

Preview the production build:

```bash
npm run preview
```

## 🔐 Runtime notes

Camera permission is requested only after Air Control is enabled.

Production camera access requires HTTPS. Local development can use localhost.

The current application performs hand tracking in the browser and does not introduce an application-level upload endpoint for webcam frames.

## ♿ Accessibility

The standard website remains usable without camera control.

The interface includes semantic buttons and links, keyboard navigation, focus states, a skip link, reduced-motion handling, and accessible labels for interactive controls.

## 🚀 Deployment

This is a standard Vite application.

Recommended Vercel settings:

```text
Install command : npm ci
Build command   : npm run build
Output directory: dist
```

## 🧱 Engineering conventions

The repository follows clear boundaries:

- `components/` owns page and UI pieces.
- `data/` owns portfolio content.
- `features/hand-control/` owns camera and gesture interaction.
- `App.jsx` composes the application.
- `tests/` contains deterministic regression coverage.
- runtime behavior should stay isolated from presentation whenever practical.

The structure is inspired by the public engineering qualities of mature product codebases: explicit ownership, small modules, predictable dependencies, readable entry points, and repeatable quality checks.

## 👤 Author

**Swaroop Kola**

CSE AI/ML student focused on software engineering, AI/ML, intelligent interfaces, and future agritech systems.
