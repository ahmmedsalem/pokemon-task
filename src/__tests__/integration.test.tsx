import { describe, it, expect, beforeEach, afterEach, afterAll } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '../test/test-utils'
import PokemonApp from '../App'
import { server } from '../test/mocks/server'
import { http, HttpResponse } from 'msw'

beforeEach(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

afterAll(() => server.close())

afterEach(() => server.resetHandlers())

describe('Pokemon App Integration Tests', () => {
  describe('Complete User Flow', () => {
    it('allows users to browse pokemon list and view details', async () => {
      const user = userEvent.setup()
      render(<PokemonApp />)

      await waitFor(() => {
        expect(screen.getByText('Loading Pokémon...')).toBeInTheDocument()
      })

      await waitFor(() => {
        expect(screen.getByText('Bulbasaur')).toBeInTheDocument()
      })

      expect(screen.getByText('Ivysaur')).toBeInTheDocument()
      expect(screen.getByText('Venusaur')).toBeInTheDocument()
      expect(screen.getByText(/1,302 Pokémon • Page 1 of/)).toBeInTheDocument()

      const bulbasaurRow = screen.getByText('Bulbasaur').closest('tr')
      await user.click(bulbasaurRow!)

      await waitFor(() => {
        expect(screen.getByText('bulbasaur')).toBeInTheDocument()
      })

      expect(screen.getByText('#1')).toBeInTheDocument()
      expect(screen.getByText('Basic Info')).toBeInTheDocument()
      expect(screen.getByText('0.7 m')).toBeInTheDocument()
      expect(screen.getByText('6.9 kg')).toBeInTheDocument()
      expect(screen.getByText('grass')).toBeInTheDocument()
      expect(screen.getByText('poison')).toBeInTheDocument()

      const backButton = screen.getByRole('button', { name: /Back to List/ })
      await user.click(backButton)

      await waitFor(() => {
        expect(screen.getByText('Bulbasaur')).toBeInTheDocument()
        expect(screen.getByText('Ivysaur')).toBeInTheDocument()
        expect(screen.getByText('Venusaur')).toBeInTheDocument()
      })

      expect(screen.queryByText('Basic Info')).not.toBeInTheDocument()
    })

    it('handles pagination interaction', async () => {
      const user = userEvent.setup()
      
      server.use(
        http.get('https://pokeapi.co/api/v2/pokemon', ({ request }) => {
          const url = new URL(request.url)
          const offset = url.searchParams.get('offset')
          
          if (offset === '20') {
            return HttpResponse.json({
              count: 1302,
              next: "https://pokeapi.co/api/v2/pokemon?offset=40&limit=20",
              previous: "https://pokeapi.co/api/v2/pokemon?offset=0&limit=20",
              results: [
                { name: "rattata", url: "https://pokeapi.co/api/v2/pokemon/19/" },
                { name: "raticate", url: "https://pokeapi.co/api/v2/pokemon/20/" },
              ]
            })
          }
          
          return HttpResponse.json({
            count: 1302,
            next: "https://pokeapi.co/api/v2/pokemon?offset=20&limit=20",
            previous: null,
            results: [
              { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
              { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
              { name: "venusaur", url: "https://pokeapi.co/api/v2/pokemon/3/" },
            ]
          })
        })
      )

      render(<PokemonApp />)

      await waitFor(() => {
        expect(screen.getByText('Bulbasaur')).toBeInTheDocument()
      })

      const nextButton = screen.getByRole('button', { name: '»' })
      expect(nextButton).not.toBeDisabled()
      
      await user.click(nextButton)

      await waitFor(() => {
        expect(screen.getByText('Rattata')).toBeInTheDocument()
      })

      expect(screen.getByText('Raticate')).toBeInTheDocument()
      expect(screen.queryByText('Bulbasaur')).not.toBeInTheDocument()
    })
  })

  describe('Error Handling Integration', () => {
    it('handles API errors gracefully in the full app flow', async () => {
      server.use(
        http.get('https://pokeapi.co/api/v2/pokemon', () => {
          return new HttpResponse(null, { status: 500 })
        })
      )

      render(<PokemonApp />)

      await waitFor(() => {
        expect(screen.getByText(/Failed to fetch Pokemon/)).toBeInTheDocument()
      })

      expect(screen.queryByText('Loading Pokémon...')).not.toBeInTheDocument()
    })

    it('handles pokemon details API errors', async () => {
      const user = userEvent.setup()
      render(<PokemonApp />)

      await waitFor(() => {
        expect(screen.getByText('Bulbasaur')).toBeInTheDocument()
      })

      server.use(
        http.get('https://pokeapi.co/api/v2/pokemon/1/', () => {
          return new HttpResponse(null, { status: 404 })
        })
      )

      const bulbasaurRow = screen.getByText('Bulbasaur').closest('tr')
      await user.click(bulbasaurRow!)

      await waitFor(() => {
        expect(screen.getByText(/Failed to fetch Pokemon details/)).toBeInTheDocument()
      })

      expect(screen.getByRole('button', { name: /Back to List/ })).toBeInTheDocument()
    })
  })

  describe('Loading States Integration', () => {
    it('shows appropriate loading states during navigation', async () => {
      const user = userEvent.setup()
      render(<PokemonApp />)

      expect(screen.getByText('Loading Pokémon...')).toBeInTheDocument()

      await waitFor(() => {
        expect(screen.getByText('Bulbasaur')).toBeInTheDocument()
      })

      expect(screen.queryByText('Loading Pokémon...')).not.toBeInTheDocument()

      const bulbasaurRow = screen.getByText('Bulbasaur').closest('tr')
      await user.click(bulbasaurRow!)

      expect(document.querySelector('.animate-spin')).toBeInTheDocument()

      await waitFor(() => {
        expect(screen.getByText('bulbasaur')).toBeInTheDocument()
      })
    })
  })

  describe('Data Persistence Integration', () => {
    it('maintains state when navigating between list and details', async () => {
      const user = userEvent.setup()
      render(<PokemonApp />)

      await waitFor(() => {
        expect(screen.getByText('Bulbasaur')).toBeInTheDocument()
      })

      const pageInfo = screen.getByText(/1,302 Pokémon • Page 1 of/)
      expect(pageInfo).toBeInTheDocument()

      const bulbasaurRow = screen.getByText('Bulbasaur').closest('tr')
      await user.click(bulbasaurRow!)

      await waitFor(() => {
        expect(screen.getByText('bulbasaur')).toBeInTheDocument()
      })

      const backButton = screen.getByRole('button', { name: /Back to List/ })
      await user.click(backButton)

      await waitFor(() => {
        expect(screen.getByText('Bulbasaur')).toBeInTheDocument()
        expect(screen.getByText(/1,302 Pokémon • Page 1 of/)).toBeInTheDocument()
      })
    })
  })
})