import { useState } from 'react';
import { PokemonListItem } from './types/pokemon';
import PokemonDetails from './components/PokemonDetails';
import PokemonList from './components/PokemonList';

const PokemonApp = () => {
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonListItem | null>(null);

  const handlePokemonClick = (pokemon: PokemonListItem) => {
    setSelectedPokemon(pokemon);
  };

  const handleBackClick = () => {
    setSelectedPokemon(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {selectedPokemon ? (
        <PokemonDetails
          pokemonUrl={selectedPokemon.url}
          onBackClick={handleBackClick}
        />
      ) : (
        <PokemonList
          onPokemonClick={handlePokemonClick}
        />
      )}
    </div>
  );
};

export default PokemonApp;