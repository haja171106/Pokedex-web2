import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import PokemonCard from "./PokemonCard";
import Pagination from "./Pagination";
import { Link } from "react-router-dom";



const ITEMS_PER_PAGE = 20;

function Pokedex() {
  
  const [allPokemon, setAllPokemon] = useState([]);
  
  const [pokemonDetails, setPokemonDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  
  useEffect(() => {
    const fetchAllPokemonNames = async () => {
      setLoading(true);
      try {
        const res = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=1300');
        setAllPokemon(res.data.results);
      } catch (err) {
        console.error('Erreur:', err);
      }
      setLoading(false);
    };

    fetchAllPokemonNames();
  }, []);

  
  const filteredPokemon = useMemo(() =>
    allPokemon.filter(pokemon =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [allPokemon, searchTerm]);

  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredPokemon.length / ITEMS_PER_PAGE);

  
  useEffect(() => {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    const pokemonForPage = filteredPokemon.slice(offset, offset + ITEMS_PER_PAGE);

    if (pokemonForPage.length === 0) {
      setPokemonDetails([]);
      return;
    }

    const fetchPageDetails = async () => {
      setLoading(true);
      try {
        const detailedPromises = pokemonForPage.map(p =>
          axios.get(p.url).then(res => {
            const stats = res.data.stats;
            const totalStats = stats.reduce((sum, stat) => sum + stat.base_stat, 0);
            return {
              id: res.data.id,
              name: res.data.name,
              image: res.data.sprites.versions['generation-v']['black-white'].animated.front_default || res.data.sprites.front_default,
              type: res.data.types[0].type.name,
              totalStats: totalStats,
            };
          })
        );
        const detailedPokemons = await Promise.all(detailedPromises);
        setPokemonDetails(detailedPokemons);
      } catch (err) {
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPageDetails();
  }, [currentPage, filteredPokemon]);


  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="w-full bg-gradient-to-tr from-red-500 via-yellow-500 to-blue-500 min-h-screen pb-6">
      <h2 className="text-2xl font-bold mb-4 text-center pt-4">Pokédex</h2>

      <div className="flex flex-col items-center gap-4 mb-4 justify-center ">
        <input
          type="text"
          placeholder="Rechercher un Pokémon..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-md shadow-md w-64"
        />
      </div>

      {loading ? (
        <p className="text-center mt-4">Chargement des Pokémon...</p>
      ) : (
        <>
          <div className="flex flex-wrap justify-center gap-4 p-4">
            {pokemonDetails.map(pokemon => (
              <Link
                to={`/pokemon/${pokemon.name}`}
                key={pokemon.name}
                style={{ display: "inline-block", width: "fit-content" }}
              >
                <PokemonCard pokemon={pokemon} />
              </Link>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onChangePage={changePage}
          />
        </>
      )}
    </div>
  );
}


export default Pokedex;