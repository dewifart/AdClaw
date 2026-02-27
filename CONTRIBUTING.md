# Contributing to AdClaw

Thank you for your interest in contributing to AdClaw. This document provides guidelines for contributing to the project.

## Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Start the development server: `npm run dev`

## Project Architecture

AdClaw follows a layered architecture:

- **API Layer** (`server/api/`) — Route handlers organized by domain
- **Service Layer** (`server/services/`) — Business logic (score engine, buyback, promotion)
- **Middleware** (`server/middleware/`) — Request processing (rate limiting, logging, errors)
- **Storage Layer** (`server/storage.ts`) — Database access via Drizzle ORM
- **Config** (`server/config/`) — Environment validation and platform constants

## Code Style

- TypeScript strict mode
- Zod for all input validation
- Drizzle ORM for database queries (no raw SQL)
- Express error handling via `AppError` classes
- ESM imports throughout

## Pull Request Process

1. Create a feature branch from `main`
2. Write clear, descriptive commit messages
3. Ensure the development server starts without errors
4. Update documentation if adding new API endpoints
5. Open a PR with a description of what changed and why

## API Guidelines

- All new endpoints go in `server/api/` with their own router
- Use Zod schemas for request validation
- Return consistent `{ success: boolean, ... }` response format
- Use appropriate HTTP status codes (201 for creation, 404 for not found, etc.)
- Add rate limiting to write endpoints via `strictRateLimit()`

## Frontend Guidelines

- Pages go in `client/src/pages/`
- Reusable components in `client/src/components/`
- Use TanStack Query for all API calls
- Follow the design system (steel blue for activity, gold for financial)
- Add `data-testid` attributes to interactive and display elements

## Reporting Issues

Open an issue with:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment details (Node version, OS)
