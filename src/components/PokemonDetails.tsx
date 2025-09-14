import React from 'react';
import { useGetPokemonDetailsQuery } from '../store/pokemonApi';
import { PokemonDetailsProps } from '../types/pokemon';

const PokemonDetails: React.FC<PokemonDetailsProps> = ({ 
  pokemonUrl, 
  onBackClick 
}) => {
  const {
    data: pokemonDetails,
    error,
    isLoading: detailsLoading,
  } = useGetPokemonDetailsQuery(pokemonUrl);
  return (
    <div className="max-w-2xl mx-auto p-6">
      <button
        onClick={onBackClick}
        className="mb-6 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
      >
        <span>←</span>
        <span>Back to List</span>
      </button>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {(() => {
            if ('data' in error && error.data) {
              return (error.data as any).message || 'Failed to fetch Pokemon details';
            }
            if ('message' in error) {
              return error.message;
            }
            return 'Failed to fetch Pokemon details';
          })()}
        </div>
      )}

      {detailsLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : pokemonDetails ? (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <img
              src={pokemonDetails.sprites?.front_default || undefined}
              alt={pokemonDetails.name}
              className="w-32 h-32 mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {pokemonDetails.name}
            </h1>
            <p className="text-gray-600">#{pokemonDetails.id}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">Basic Info</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Height:</span> {pokemonDetails.height / 10} m</p>
                <p><span className="font-medium">Weight:</span> {pokemonDetails.weight / 10} kg</p>
                <p><span className="font-medium">Base Experience:</span> {pokemonDetails.base_experience}</p>
              </div>
              
              <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-800">Types</h3>
              <div className="flex flex-wrap gap-2">
                {pokemonDetails.types?.map((type) => (
                  <span
                    key={type.type.name}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {type.type.name}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">Abilities</h2>
              <div className="space-y-2">
                {pokemonDetails.abilities?.map((ability) => (
                  <div
                    key={ability.ability.name}
                    className="bg-gray-50 p-2 rounded border"
                  >
                    <span className="font-medium">
                      {ability.ability.name.replace('-', ' ')}
                    </span>
                    {ability.is_hidden && (
                      <span className="text-xs bg-yellow-200 text-yellow-800 ml-2 px-2 py-1 rounded">
                        Hidden
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-800">Base Stats</h3>
              <div className="space-y-1">
                {pokemonDetails.stats?.map((stat) => (
                  <div key={stat.stat.name} className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">
                      {stat.stat.name.replace('-', ' ')}:
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${Math.min((stat.base_stat / 200) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold w-8">{stat.base_stat}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PokemonDetails;