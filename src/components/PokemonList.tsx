import React, { useState } from 'react';
import { useGetPokemonListQuery } from '../store/pokemonApi';
import { PokemonListProps } from '../types/pokemon';

const PokemonList: React.FC<PokemonListProps> = ({ onPokemonClick }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const {
    data,
    error,
    isLoading: loading,
    isFetching
  } = useGetPokemonListQuery({ 
    page: currentPage, 
    limit: itemsPerPage 
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const pokemonList = data?.results || [];
  const totalCount = data?.count || 0;
  const totalPages = data?.totalPages || 0;

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 rounded border transition-colors ${
            currentPage === i
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex justify-center items-center mt-8 space-x-2">
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className={`px-3 py-2 rounded border transition-colors ${
            currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          ««
        </button>
        
        <button
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`px-3 py-2 rounded border transition-colors ${
            currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          «
        </button>

        {pages}

        <button
          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`px-3 py-2 rounded border transition-colors ${
            currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          »
        </button>
        
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`px-3 py-2 rounded border transition-colors ${
            currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          »»
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Pokémon Explorer
          </h1>
          <p className="text-gray-600">
            {totalCount.toLocaleString()} Pokémon • Page {currentPage} of {totalPages}
          </p>
        </div>
      
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {(() => {
              if ('data' in error && error.data) {
                return (error.data as any).message || 'Failed to fetch Pokemon';
              }
              if ('message' in error) {
                return error.message;
              }
              return 'Failed to fetch Pokemon';
            })()}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">Loading Pokémon...</span>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow overflow-hidden mb-8 relative">
              {isFetching && (
                <div className="absolute top-0 left-0 right-0 bg-blue-100 text-blue-700 text-center py-2 text-sm">
                  Updating...
                </div>
              )}
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pokemonList.map((pokemon, index) => {
                    const globalIndex = (currentPage - 1) * itemsPerPage + index + 1;
                    return (
                      <tr 
                        key={pokemon.name} 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => onPokemonClick(pokemon)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{globalIndex}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800">
                          View Details →
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {totalPages > 1 && renderPagination()}
          </>
        )}
      </div>
    </div>
  );
};

export default PokemonList;