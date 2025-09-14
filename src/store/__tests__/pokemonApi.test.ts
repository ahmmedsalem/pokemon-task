import { describe, it, expect, beforeEach, afterEach, afterAll } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import { pokemonApi } from '../pokemonApi'
import { server } from '../../test/mocks/server'
import { http, HttpResponse } from 'msw'

// Start server before all tests
beforeEach(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

// Close server after all tests
afterAll(() => server.close())

// Reset handlers after each test
afterEach(() => server.resetHandlers())

// Helper function to create test store
const createTestStore = () => {
  return configureStore({
    reducer: {
      [pokemonApi.reducerPath]: pokemonApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActionsPaths: ['meta.arg', 'payload.timestamp'],
          ignoredPaths: [pokemonApi.reducerPath],
        },
      }).concat(pokemonApi.middleware),
  })
}

describe('pokemonApi', () => {
  let store: ReturnType<typeof createTestStore>

  beforeEach(() => {
    store = createTestStore()
  })

  describe('getPokemonList', () => {
    it('fetches pokemon list successfully', async () => {
      const result = await store.dispatch(
        pokemonApi.endpoints.getPokemonList.initiate({ page: 1, limit: 20 })
      )

      expect(result.data).toBeDefined()
      expect(result.data?.results).toHaveLength(3)
      expect(result.data?.count).toBe(1302)
      expect(result.data?.totalPages).toBeGreaterThan(0)
      expect(result.data?.currentPage).toBe(1)
      expect(result.data?.itemsPerPage).toBe(20)
    })

    it('handles pagination parameters correctly', async () => {
      const result = await store.dispatch(
        pokemonApi.endpoints.getPokemonList.initiate({ page: 2, limit: 10 })
      )

      expect(result.data?.currentPage).toBe(2)
      expect(result.data?.itemsPerPage).toBe(10)
    })

    it('uses default parameters when none provided', async () => {
      const result = await store.dispatch(
        pokemonApi.endpoints.getPokemonList.initiate({})
      )

      expect(result.data?.currentPage).toBe(1)
      expect(result.data?.itemsPerPage).toBe(20)
    })

    it('handles API errors gracefully', async () => {
      server.use(
        http.get('https://pokeapi.co/api/v2/pokemon', () => {
          return new HttpResponse(null, { status: 500 })
        })
      )

      const result = await store.dispatch(
        pokemonApi.endpoints.getPokemonList.initiate({ page: 1, limit: 20 })
      )

      expect(result.error).toBeDefined()
      expect(result.data).toBeUndefined()
    })
  })

  describe('getPokemonDetails', () => {
    it('fetches pokemon details successfully', async () => {
      const result = await store.dispatch(
        pokemonApi.endpoints.getPokemonDetails.initiate('https://pokeapi.co/api/v2/pokemon/1/')
      )

      expect(result.data).toBeDefined()
      expect(result.data?.id).toBe(1)
      expect(result.data?.name).toBe('bulbasaur')
      expect(result.data?.types).toHaveLength(2)
      expect(result.data?.abilities).toHaveLength(1)
      expect(result.data?.stats).toHaveLength(2)
    })

    it('handles URL transformation correctly', async () => {
      // Test that it strips the base URL correctly
      const result = await store.dispatch(
        pokemonApi.endpoints.getPokemonDetails.initiate('https://pokeapi.co/api/v2/pokemon/1/')
      )

      expect(result.data?.id).toBe(1)
    })

    it('handles API errors gracefully', async () => {
      server.use(
        http.get('https://pokeapi.co/api/v2/pokemon/1/', () => {
          return new HttpResponse(null, { status: 404 })
        })
      )

      const result = await store.dispatch(
        pokemonApi.endpoints.getPokemonDetails.initiate('https://pokeapi.co/api/v2/pokemon/1/')
      )

      expect(result.error).toBeDefined()
      expect(result.data).toBeUndefined()
    })
  })

  describe('getPokemonById', () => {
    it('fetches pokemon by ID successfully', async () => {
      const result = await store.dispatch(
        pokemonApi.endpoints.getPokemonById.initiate(1)
      )

      expect(result.data).toBeDefined()
      expect(result.data?.id).toBe(1)
      expect(result.data?.name).toBe('bulbasaur')
    })

    it('accepts string ID', async () => {
      const result = await store.dispatch(
        pokemonApi.endpoints.getPokemonById.initiate('1')
      )

      expect(result.data).toBeDefined()
      expect(result.data?.id).toBe(1)
    })
  })

  describe('caching behavior', () => {
    it('caches pokemon details correctly', async () => {
      // First request
      const result1 = await store.dispatch(
        pokemonApi.endpoints.getPokemonDetails.initiate('https://pokeapi.co/api/v2/pokemon/1/')
      )

      // Second request should use cache
      const result2 = await store.dispatch(
        pokemonApi.endpoints.getPokemonDetails.initiate('https://pokeapi.co/api/v2/pokemon/1/')
      )

      expect(result1.data).toEqual(result2.data)
    })
  })

  describe('data transformation', () => {
    it('transforms pokemon list response correctly', async () => {
      const result = await store.dispatch(
        pokemonApi.endpoints.getPokemonList.initiate({ page: 1, limit: 20 })
      )

      expect(result.data).toHaveProperty('results')
      expect(result.data).toHaveProperty('count')
      expect(result.data).toHaveProperty('totalPages')
      expect(result.data).toHaveProperty('currentPage')
      expect(result.data).toHaveProperty('itemsPerPage')
      
      // Check that totalPages is calculated correctly
      const expectedTotalPages = Math.ceil(1302 / 20)
      expect(result.data?.totalPages).toBe(expectedTotalPages)
    })
  })
})