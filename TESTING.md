# Testing Documentation

This project includes comprehensive unit and integration tests using **Vitest** and **React Testing Library**.

## Testing Stack

- **Vitest**: Fast unit test framework and test runner
- **React Testing Library**: Testing utilities for React components  
- **MSW (Mock Service Worker)**: API mocking for integration tests
- **jsdom**: Browser environment simulation

## Test Structure

```
src/
├── __tests__/                 # Integration tests
│   ├── App.test.tsx           # App component integration tests
│   └── integration.test.tsx   # End-to-end user flow tests
├── components/__tests__/       # Component unit tests  
│   ├── PokemonList.test.tsx   # PokemonList component tests
│   └── PokemonDetails.test.tsx # PokemonDetails component tests
├── store/__tests__/           # API/Store tests
│   └── pokemonApi.test.ts     # RTK Query API tests
└── test/                      # Test utilities
    ├── setup.ts               # Test setup and configuration
    ├── test-utils.tsx         # Custom render with providers
    └── mocks/                 # MSW mock handlers
        ├── handlers.ts        # API mock responses  
        └── server.ts          # MSW server setup
```

## Available Scripts

```bash
# Run tests in watch mode (interactive)
npm run test

# Run all tests once
npm run test:run  

# Run tests with coverage report
npm run test:coverage

# Run tests with UI interface
npm run test:ui

# Run tests in watch mode
npm run test:watch
```

## Test Categories

### 1. Unit Tests

**Component Tests** (`src/components/__tests__/`):
- PokemonList component rendering and interactions
- PokemonDetails component display and navigation
- Props handling and event callbacks
- Loading and error states
- Pagination functionality

**API Tests** (`src/store/__tests__/`):
- RTK Query endpoint testing
- Data fetching and transformation
- Error handling 
- Caching behavior
- Request parameter handling

### 2. Integration Tests

**App Integration** (`src/__tests__/App.test.tsx`):
- Component navigation flow
- State management between components
- Route transitions

**User Flow Tests** (`src/__tests__/integration.test.tsx`):
- Complete user workflows
- API integration with UI
- Error handling across components
- Loading state management
- Data persistence

## Test Utilities

### Custom Render Function
Located in `src/test/test-utils.tsx`, provides:
- Redux store integration
- Provider wrapping
- Simplified component testing

```typescript
import { render } from '../test/test-utils'

// Automatically wraps with Redux Provider
render(<MyComponent />)
```

### Mock API Responses
Located in `src/test/mocks/handlers.ts`:
- Pokemon list API responses
- Pokemon details API responses  
- Error scenarios
- Custom test data

## Test Coverage

The test suite covers:
- ✅ Component rendering and interactions
- ✅ API data fetching and error handling
- ✅ User navigation flows
- ✅ Loading and error states
- ✅ Pagination functionality
- ✅ State management
- ✅ Props and event handling

## Writing New Tests

### Component Tests
```typescript
import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { render } from '../../test/test-utils'
import MyComponent from '../MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })
})
```

### API Tests
```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { server } from '../../test/mocks/server'

describe('API Tests', () => {
  beforeEach(() => server.listen())
  afterEach(() => server.resetHandlers())
})
```

## Debugging Tests

### Verbose Output
```bash
npm run test:run -- --reporter=verbose
```

### Debug Specific Test File
```bash
npm run test -- PokemonList.test.tsx
```

### See HTML Output in Tests
```typescript
import { screen } from '@testing-library/react'
screen.debug() // Prints current DOM
```

## CI/CD Integration

Add to your CI pipeline:
```yaml
- name: Run Tests
  run: npm run test:run

- name: Generate Coverage  
  run: npm run test:coverage
```

## Best Practices

1. **Test user behavior, not implementation details**
2. **Use semantic queries** (`getByRole`, `getByText`)
3. **Test error states and edge cases**
4. **Keep tests isolated and independent**
5. **Use descriptive test names**
6. **Mock external dependencies** (APIs, timers)
7. **Test accessibility** (roles, labels)
8. **Avoid testing internal state directly**