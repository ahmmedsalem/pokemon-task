import { http, HttpResponse } from 'msw'
import { Pokemon, PokemonListResponse } from '../../types/pokemon'

const mockPokemonList: PokemonListResponse = {
  count: 1302,
  next: "https://pokeapi.co/api/v2/pokemon?offset=20&limit=20",
  previous: null,
  results: [
    { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
    { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
    { name: "venusaur", url: "https://pokeapi.co/api/v2/pokemon/3/" },
  ]
}

const mockPokemon: Pokemon = {
  id: 1,
  name: "bulbasaur",
  base_experience: 64,
  height: 7,
  weight: 69,
  sprites: {
    front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
    front_shiny: null,
    front_female: null,
    front_shiny_female: null,
    back_default: null,
    back_shiny: null,
    back_female: null,
    back_shiny_female: null,
    other: {
      'official-artwork': {
        front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png"
      }
    }
  },
  types: [
    {
      slot: 1,
      type: {
        name: "grass",
        url: "https://pokeapi.co/api/v2/type/12/"
      }
    },
    {
      slot: 2,
      type: {
        name: "poison",
        url: "https://pokeapi.co/api/v2/type/4/"
      }
    }
  ],
  abilities: [
    {
      is_hidden: false,
      slot: 1,
      ability: {
        name: "overgrow",
        url: "https://pokeapi.co/api/v2/ability/65/"
      }
    }
  ],
  stats: [
    {
      base_stat: 45,
      effort: 0,
      stat: {
        name: "hp",
        url: "https://pokeapi.co/api/v2/stat/1/"
      }
    },
    {
      base_stat: 49,
      effort: 0,
      stat: {
        name: "attack",
        url: "https://pokeapi.co/api/v2/stat/2/"
      }
    }
  ]
}

export const handlers = [
  http.get('https://pokeapi.co/api/v2/pokemon', () => {
    return HttpResponse.json(mockPokemonList)
  }),

  http.get('https://pokeapi.co/api/v2/pokemon/1/', () => {
    return HttpResponse.json(mockPokemon)
  }),

  http.get('https://pokeapi.co/api/v2/pokemon/1', () => {
    return HttpResponse.json(mockPokemon)
  }),
]