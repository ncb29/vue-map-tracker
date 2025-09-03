# vue-map-tracker

**Short description**  
`vue-map-tracker` is a mobile-friendly web app that provides real-time tracking on an interactive OpenStreetMap (OSM). Users can follow their position live and visualize routes.  

---

## ✨ Features

- Display of a mobile live-tracking map using **OpenStreetMap (OSM)**  
- Built with **Vue 3** and **Vite** – modern, fast, and modular  
- Pre-configured for **Cypress** testing (unit & end-to-end)  

---

## ⚙️ Technical Overview

- **Framework**: Vue 3 with Vite for lightning-fast development and hot-reload  
- **Map component**: Based on OpenStreetMap (OSM) as data source  
- **Testing**:  
  - Unit tests with Cypress component testing (`npm run test:unit:dev` or `npm run test:unit` in headless mode)  
  - End-to-end tests against the dev server or a production build (`npm run test:e2e:dev`, or `npm run test:e2e`)  

---

## 🚀 Getting Started

# 1. Install dependencies
npm install

# 2. Start development server (with hot-reload)
npm run dev

# 3. Build for production
npm run build

# 4. Run unit tests (component-based)
npm run test:unit:dev
# headless:
npm run test:unit

# 5. Run end-to-end tests (fast dev mode)
npm run test:e2e:dev

# 6. For CI / deployment
npm run build
npm run test:e2e
\`\`\`

---

## 📌 Roadmap / To-Dos

The repository already includes a list of planned improvements:

- [ ] Add search suggestions for input field (Search Result Select)  
- [ ] Support different routing modes (car, bicycle, walking)  
- [ ] Save completed tracking sessions  
- [x] Add "Get current location" button in search form  
- [ ] Improve modal behavior (open one modal should close others)  
- [ ] Fix drag-routing bug (markers lose position)  
- [ ] Add multilingual support (currently only German available)  
