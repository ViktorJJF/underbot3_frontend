# System Patterns - Underbot3 Frontend

## Architecture
- **Vue 3 (Composition API)**: Modern frontend framework.
- **Vuex**: Centralized state management with modules.
- **Vite**: Fast build tool and development server.
- **TypeScript**: For type safety and better developer experience.

## Key Patterns
- **Module-based Store**: Located in `src/store/modules/`.
- **Dynamic Store Loading**: Store modules are dynamically imported and registered (see `src/store/modules/index.ts`).
- **Service Layer**: API calls managed via Axios.
- **Component Design**: Modular UI using Element Plus components.

## Technical Decisions
- Use `lodash` for utility functions (e.g., `camelCase` for module naming).
- Real-time data handling with Socket.io.
- CSS/SCSS for styling, using Dart Sass.
