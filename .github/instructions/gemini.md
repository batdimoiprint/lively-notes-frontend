# Gemini Instructions for Lively-Notes Frontend

This document provides instructions for the Gemini AI model to effectively assist with development in the `lively-notes-frontend` workspace.

## Project Overview

This is the frontend for "Lively Notes", a modern note-taking application. It's a single-page application (SPA) built with React and TypeScript.

## Tech Stack

- **Framework:** React 19
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Component Library:** shadcn/ui (built on Radix UI)
- **Routing:** React Router
- **Data Fetching & State:** TanStack Query (React Query)
- **Forms:** React Hook Form
- **Linting:** ESLint
- **Package Manager:** pnpm

## Project Structure

- `src/`: Contains all the source code.
  - `src/api/`: Functions for making API calls to the backend.
  - `src/components/`: Shared and reusable React components.
    - `src/components/ui/`: UI components from shadcn/ui.
    - `src/components/home/`: Components specific to the home page.
  - `src/pages/`: Top-level page components.
  - `src/routes/`: Application routes configuration.
  - `src/types/`: TypeScript type definitions.
  - `src/lib/`: Utility functions.
  - `src/main.tsx`: The application entry point.
  - `src/App.tsx`: The root component of the application.

## Available Scripts

You can run the following scripts using `pnpm <script>`:

- `pnpm dev`: Starts the Vite development server.
- `pnpm build`: Compiles TypeScript and builds the application for production.
- `pnpm lint`: Lints the codebase using ESLint.
- `pnpm preview`: Serves the production build locally for preview.

## Component Development

This project uses `shadcn/ui`. To add new components, you can use the `shadcn` CLI. For example, to add an accordion component:

```bash
npx shadcn-ui@latest add accordion
```

When creating custom components, follow the existing structure and place them in the appropriate directory under `src/components/`.

## Styling

Styling is done using Tailwind CSS. Use the utility classes provided by Tailwind to style components. For custom styles, you can add them to `src/index.css`.

## API Interaction

All interactions with the backend API should be defined in `src/api/`. Use TanStack Query for fetching and caching data from the API.

## Routing

The application uses `react-router-dom` for routing. The routes are defined in `src/routes/routes.tsx`. When adding new pages, you will need to add a new route to this file.