import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { 
  Pokemon, 
  PokemonListResponse, 
  PokemonListQueryResponse, 
  PokemonListQueryParams 
} from '../types/pokemon';

export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://pokeapi.co/api/v2/',
  }),
  tagTypes: ['Pokemon', 'PokemonList'],
  endpoints: (builder) => ({
    getPokemonList: builder.query<PokemonListQueryResponse, PokemonListQueryParams>({
      query: ({ page = 1, limit = 20 } = {}) => {
        const offset = (page - 1) * limit;
        return `pokemon?limit=${limit}&offset=${offset}`;
      },
      providesTags: ['PokemonList'],
      transformResponse: (response: PokemonListResponse, _meta, arg) => ({
        results: response.results,
        count: response.count,
        totalPages: Math.ceil(response.count / (arg?.limit || 20)),
        currentPage: arg?.page || 1,
        itemsPerPage: arg?.limit || 20,
      }),
    }),

    getPokemonDetails: builder.query<Pokemon, string>({
      query: (url: string) => url.replace('https://pokeapi.co/api/v2/', ''),
      providesTags: (_result, _error, url) => [
        { type: 'Pokemon', id: url },
      ],
      keepUnusedDataFor: 300,
    }),

    getPokemonById: builder.query<Pokemon, number | string>({
      query: (id) => `pokemon/${id}`,
      providesTags: (_result, _error, id) => [
        { type: 'Pokemon', id },
      ],
      keepUnusedDataFor: 300,
    }),
  }),
});

export const {
  useGetPokemonListQuery,
  useGetPokemonDetailsQuery,
  useGetPokemonByIdQuery,
  useLazyGetPokemonDetailsQuery,
} = pokemonApi;