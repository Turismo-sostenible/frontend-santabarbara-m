# frontend-santabarbara

## Project Overview

This is the web frontend for **Santa Barbara**, a platform for browsing and booking tourist packages planes with expert guides in Colombia.

The application is built with a modern web stack:

*   **Framework**: [Next.js](https://nextjs.org/) (using the App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **UI Library**: [React](https://react.dev/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components**: [shadcn/ui](https://ui.shadcn.com/), which is a collection of reusable components built on Radix UI and Tailwind CSS.
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Form Handling**: [React Hook Form](https://react-hook-form.com/) for logic and [Zod](https://zod.dev/) for schema validation.

### Architecture

The project follows standard Next.js App Router conventions.

*   **API Communication**: All communication with the backend is centralized through a custom `apiClient` located at `src/lib/api.ts`. This client handles request/response logic, error handling, and automatically attaches authentication tokens.
*   **Service Layer**: The `apiClient` is further abstracted by a service layer in `src/service/`. Each service file (e.g., `planes-service.ts`, `auth-service.ts`) is responsible for interacting with a specific part of the backend API.
*   **Component Structure**: Reusable components are located in `src/components/`. The low-level, unstyled UI primitives provided by `shadcn/ui` are in `src/components/ui/`.
*   **Typing**: TypeScript types are centralized in `src/types/index.ts`.

## Building and Running

First, install the project dependencies:

```bash
npm install
```

### Development

To run the local development server (usually on `http://localhost:3000`):

```bash
npm run dev
```

### Production

To build the application for production:

```bash
npm run build
```

To run the production server after building:

```bash
npm run start
```

### Linting

To check the code for style and potential errors:

```bash
npm run lint
```

## Development Conventions

*   **Path Aliases**: The project uses the `@/*` path alias to refer to the `src/` directory. Always use this alias when importing modules from within the project (e.g., `import { Button } from '@/components/ui/button'`).
*   **API Interaction**: Never use `fetch` directly. All backend API calls must go through the `apiClient` (`src/lib/api.ts`) or its corresponding service function in `src/service/`.
*   **Styling**: Use Tailwind CSS utility classes for styling. For new UI elements, first check if a suitable component exists in `shadcn/ui` before building a new one from scratch.
*   **Components**: Differentiate between Client Components (`"use client"`) and Server Components. Place general-purpose, reusable components in `src/components/`. Page-specific components can be co-located with their pages or routes.
*   **Forms**: All forms should be built using `react-hook-form` and validated with `zod` schemas.