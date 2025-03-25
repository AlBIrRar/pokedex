import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [caughtPokemon, setCaughtPokemon] = useState(() => {
    const saved = localStorage.getItem('caughtPokemon');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');
        const pokemonData = await Promise.all(
          response.data.results.map(async (pokemon) => {
            const details = await axios.get(pokemon.url);
            return {
              id: details.data.id,
              name: details.data.name,
              image: details.data.sprites.front_default,
              types: details.data.types.map(type => type.type.name)
            };
          })
        );
        setPokemonList(pokemonData);
      } catch (error) {
        console.error('Error fetching Pokémon:', error);
      }
    };

    fetchPokemon();
  }, []);

  useEffect(() => {
    localStorage.setItem('caughtPokemon', JSON.stringify(caughtPokemon));
  }, [caughtPokemon]);

  const toggleCaught = (pokemonId) => {
    setCaughtPokemon(prev => ({
      ...prev,
      [pokemonId]: !prev[pokemonId]
    }));
  };

  return (
    <div className="app">
      <h1>Pokédex - Gen 1</h1>
      <div className="pokemon-grid">
        {pokemonList.map(pokemon => (
          <div 
            key={pokemon.id} 
            className={`pokemon-card ${caughtPokemon[pokemon.id] ? 'caught' : ''}`}
            onClick={() => toggleCaught(pokemon.id)}
          >
            <img src={pokemon.image} alt={pokemon.name} />
            <div className="pokemon-info">
              <span className="pokemon-number">#{String(pokemon.id).padStart(3, '0')}</span>
              <h2>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
              <div className="types">
                {pokemon.types.map(type => (
                  <span key={type} className={`type ${type}`}>
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App; 