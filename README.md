# Pokemon Explorer App

A React application for browsing Pokemon using the PokeAPI. Built with React, TypeScript, and Tailwind CSS.

## Features

- Browse Pokemon list with pagination
- View detailed Pokemon information
- Responsive design
- TypeScript support
- Comprehensive test suite

## Quick Start

### Prerequisites
- Node.js (version 20+)
- npm

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
npm run test:run     # Run all tests once
npm run lint         # Check code quality
```

## How to Use

1. **Browse Pokemon**: The app shows a paginated list of Pokemon
2. **View Details**: Click any Pokemon to see detailed information
3. **Navigate**: Use pagination buttons or "Back to List" button
4. **Responsive**: Works on desktop and mobile devices

## Project Structure

```
src/
├── components/        # React components
├── store/            # Redux store and API
├── types/            # TypeScript types
├── test/             # Test utilities
└── __tests__/        # Test files
```

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **Tailwind CSS** - Styling
- **Vitest** - Testing
- **Vite** - Build tool

## Testing

Run the test suite:
```bash
npm run test         # Interactive mode
npm run test:run     # Single run
```

The project includes 37+ tests covering components, API integration, and user workflows.

## Build & Deploy

```bash
npm run build        # Creates dist/ folder
npm run preview      # Test production build locally
```

The `dist/` folder contains the production-ready application that can be deployed to any static hosting service.

## API

This app uses the free [PokeAPI](https://pokeapi.co/) - no API key required.

---

**Built with React + TypeScript + Vite**