// Base Pokemon types from PokeAPI
export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface PokemonSprites {
  front_default: string | null;
  front_shiny: string | null;
  front_female: string | null;
  front_shiny_female: string | null;
  back_default: string | null;
  back_shiny: string | null;
  back_female: string | null;
  back_shiny_female: string | null;
  other?: {
    'official-artwork': {
      front_default: string;
    };
  };
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonAbility {
  is_hidden: boolean;
  slot: number;
  ability: {
    name: string;
    url: string;
  };
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface Pokemon {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  weight: number;
  sprites: PokemonSprites;
  types: PokemonType[];
  abilities: PokemonAbility[];
  stats: PokemonStat[];
}

// RTK Query enhanced types
export interface PokemonListQueryResponse {
  results: PokemonListItem[];
  count: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

export interface PokemonListQueryParams {
  page?: number;
  limit?: number;
}

// Component prop types
export interface PokemonListProps {
  onPokemonClick: (pokemon: PokemonListItem) => void;
}

export interface PokemonDetailsProps {
  pokemonUrl: string;
  onBackClick: () => void;
}