import { describe, it, expect, vi, beforeEach, afterEach, afterAll } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { render } from '../../test/test-utils'
import PokemonList from '../PokemonList'
import { server } from '../../test/mocks/server'

beforeEach(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

afterAll(() => server.close())

afterEach(() => server.resetHandlers())

describe('PokemonList', () => {
  const mockOnPokemonClick = vi.fn()

  beforeEach(() => {
    mockOnPokemonClick.mockClear()
  })

  it('renders loading state initially', () => {
    render(<PokemonList onPokemonClick={mockOnPokemonClick} />)
    
    expect(screen.getByText('Loading Pokémon...')).toBeInTheDocument()
  })

  it('renders pokemon list after loading', async () => {
    render(<PokemonList onPokemonClick={mockOnPokemonClick} />)
    
    await waitFor(() => {
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument()
    })
    
    expect(screen.getByText('Ivysaur')).toBeInTheDocument()
    expect(screen.getByText('Venusaur')).toBeInTheDocument()
  })

  it('displays correct pagination info', async () => {
    render(<PokemonList onPokemonClick={mockOnPokemonClick} />)
    
    await waitFor(() => {
      expect(screen.getByText(/1,302 Pokémon • Page 1 of/)).toBeInTheDocument()
    })
  })

  it('calls onPokemonClick when pokemon row is clicked', async () => {
    render(<PokemonList onPokemonClick={mockOnPokemonClick} />)
    
    await waitFor(() => {
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument()
    })
    
    const pokemonRow = screen.getByText('Bulbasaur').closest('tr')
    fireEvent.click(pokemonRow!)
    
    expect(mockOnPokemonClick).toHaveBeenCalledWith({
      name: "bulbasaur",
      url: "https://pokeapi.co/api/v2/pokemon/1/"
    })
  })

  it('handles pagination correctly', async () => {
    render(<PokemonList onPokemonClick={mockOnPokemonClick} />)
    
    await waitFor(() => {
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument()
    })

    const nextButton = screen.getByRole('button', { name: '»' })
    const firstPageButton = screen.getByRole('button', { name: '««' })
    
    expect(nextButton).toBeInTheDocument()
    expect(firstPageButton).toBeDisabled()
  })

  it('renders pokemon numbers correctly', async () => {
    render(<PokemonList onPokemonClick={mockOnPokemonClick} />)
    
    await waitFor(() => {
      expect(screen.getByText('#1')).toBeInTheDocument()
    })
    
    expect(screen.getByText('#2')).toBeInTheDocument()
    expect(screen.getByText('#3')).toBeInTheDocument()
  })

  it('capitalizes pokemon names correctly', async () => {
    render(<PokemonList onPokemonClick={mockOnPokemonClick} />)
    
    await waitFor(() => {
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument()
    })
    
    expect(screen.queryByText('bulbasaur')).not.toBeInTheDocument()
  })
})