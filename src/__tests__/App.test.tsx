import { describe, it, expect, beforeEach, afterEach, afterAll } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { render } from '../test/test-utils'
import PokemonApp from '../App'
import { server } from '../test/mocks/server'

beforeEach(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

afterAll(() => server.close())

afterEach(() => server.resetHandlers())

describe('PokemonApp', () => {
  it('renders pokemon list by default', async () => {
    render(<PokemonApp />)
    
    await waitFor(() => {
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument()
    })
  })

  it('navigates to pokemon details when pokemon is clicked', async () => {
    render(<PokemonApp />)
    
    await waitFor(() => {
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument()
    })
    
    const pokemonRow = screen.getByText('Bulbasaur').closest('tr')
    fireEvent.click(pokemonRow!)
    
    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument() // Pokemon name in details
    })
    
    expect(screen.getByText('Basic Info')).toBeInTheDocument()
    expect(screen.queryByText('Ivysaur')).not.toBeInTheDocument() // List should be gone
  })

  it('navigates back to list when back button is clicked', async () => {
    render(<PokemonApp />)
    
    await waitFor(() => {
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument()
    })
    
    const pokemonRow = screen.getByText('Bulbasaur').closest('tr')
    fireEvent.click(pokemonRow!)
    
    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument()
    })
    
    const backButton = screen.getByRole('button', { name: /Back to List/ })
    fireEvent.click(backButton)
    
    await waitFor(() => {
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument()
      expect(screen.getByText('Ivysaur')).toBeInTheDocument()
      expect(screen.getByText('Venusaur')).toBeInTheDocument()
    })
    
    expect(screen.queryByText('Basic Info')).not.toBeInTheDocument()
  })

  it('maintains proper app structure', async () => {
    render(<PokemonApp />)
    
    const appContainer = document.querySelector('.min-h-screen')
    expect(appContainer).toBeInTheDocument()
  })

  it('handles state transitions properly', async () => {
    render(<PokemonApp />)
    
    await waitFor(() => {
      expect(screen.getByText('Loading Pokémon...')).toBeInTheDocument()
    })
    
    await waitFor(() => {
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument()
    })
    
    expect(screen.queryByText('Loading Pokémon...')).not.toBeInTheDocument()
  })
})