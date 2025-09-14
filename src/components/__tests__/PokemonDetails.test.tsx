import { describe, it, expect, vi, beforeEach, afterEach, afterAll } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { render } from '../../test/test-utils'
import PokemonDetails from '../PokemonDetails'
import { server } from '../../test/mocks/server'

beforeEach(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

afterAll(() => server.close())

afterEach(() => server.resetHandlers())

describe('PokemonDetails', () => {
  const mockOnBackClick = vi.fn()
  const mockPokemonUrl = 'https://pokeapi.co/api/v2/pokemon/1/'

  beforeEach(() => {
    mockOnBackClick.mockClear()
  })

  it('renders loading state initially', () => {
    render(
      <PokemonDetails 
        pokemonUrl={mockPokemonUrl} 
        onBackClick={mockOnBackClick} 
      />
    )
    
    expect(screen.getByRole('button', { name: /Back to List/ })).toBeInTheDocument()
    expect(document.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('renders pokemon details after loading', async () => {
    render(
      <PokemonDetails 
        pokemonUrl={mockPokemonUrl} 
        onBackClick={mockOnBackClick} 
      />
    )
    
    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument()
    })
    
    expect(screen.getByText('#1')).toBeInTheDocument()
    expect(screen.getByText('0.7 m')).toBeInTheDocument() 
    expect(screen.getByText('6.9 kg')).toBeInTheDocument() 
    expect(screen.getByText('64')).toBeInTheDocument() 
  })

  it('displays pokemon types correctly', async () => {
    render(
      <PokemonDetails 
        pokemonUrl={mockPokemonUrl} 
        onBackClick={mockOnBackClick} 
      />
    )
    
    await waitFor(() => {
      expect(screen.getByText('grass')).toBeInTheDocument()
    })
    
    expect(screen.getByText('poison')).toBeInTheDocument()
  })

  it('displays pokemon abilities', async () => {
    render(
      <PokemonDetails 
        pokemonUrl={mockPokemonUrl} 
        onBackClick={mockOnBackClick} 
      />
    )
    
    await waitFor(() => {
      expect(screen.getByText('overgrow')).toBeInTheDocument()
    })
  })

  it('displays pokemon stats', async () => {
    render(
      <PokemonDetails 
        pokemonUrl={mockPokemonUrl} 
        onBackClick={mockOnBackClick} 
      />
    )
    
    await waitFor(() => {
      expect(screen.getByText('hp:')).toBeInTheDocument()
    })
    
    expect(screen.getByText('attack:')).toBeInTheDocument()
    expect(screen.getByText('45')).toBeInTheDocument() 
    expect(screen.getByText('49')).toBeInTheDocument() 
  })

  it('calls onBackClick when back button is clicked', async () => {
    render(
      <PokemonDetails 
        pokemonUrl={mockPokemonUrl} 
        onBackClick={mockOnBackClick} 
      />
    )
    
    const backButton = screen.getByRole('button', { name: /Back to List/ })
    fireEvent.click(backButton)
    
    expect(mockOnBackClick).toHaveBeenCalledTimes(1)
  })

  it('displays pokemon image', async () => {
    render(
      <PokemonDetails 
        pokemonUrl={mockPokemonUrl} 
        onBackClick={mockOnBackClick} 
      />
    )
    
    await waitFor(() => {
      const image = screen.getByRole('img')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('alt', 'bulbasaur')
    })
  })

  it('renders section headers correctly', async () => {
    render(
      <PokemonDetails 
        pokemonUrl={mockPokemonUrl} 
        onBackClick={mockOnBackClick} 
      />
    )
    
    await waitFor(() => {
      expect(screen.getByText('Basic Info')).toBeInTheDocument()
    })
    
    expect(screen.getByText('Types')).toBeInTheDocument()
    expect(screen.getByText('Abilities')).toBeInTheDocument()
    expect(screen.getByText('Base Stats')).toBeInTheDocument()
  })
})