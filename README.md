# OpenStreetMap-Tracker

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Headed Component Tests with [Cypress Component Testing](https://on.cypress.io/component)

```sh
npm run test:unit:dev # or `npm run test:unit` for headless testing
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
npm run build
npm run test:e2e
```

### ToDo's
- Add Search results select in search form under each input (Status: open)
- Add select for routing type on map: bike, car, feet (Status: started)
- Add save current ended tracking (Status: open)
- Add "Get current location" button to search form > routing. (Status: finished)
- Fix no overlaying Modals (Settings, Search and so on). By toggle close the other ones (Status: open)
- Bug: When use drage route, the markers lost their position on map. They're fixed. (Status: open)
- Currently, only German is available. Other languages will be available in the future. (Status: open)
