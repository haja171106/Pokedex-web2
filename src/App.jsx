import React, { useEffect, useState } from "react";
import axios from "axios";
import PokemonCard from "./components/PokemonCard";
import Pagination from "./components/Pagination";

const sortModes = [
  { key: 'original', label: 'Original' },
  { key: 'type', label: 'Type' },
  { key: 'force', label: 'Force' },
  { key: 'name', label: 'Nom (a-z)' }
];

const ITEMS_PER_PAGE = 20;

function Pokedex() {
  const [pokemonList, setPokemonList] = useState([]);
  const [originalList, setOriginalList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortIndex, setSortIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const res = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=1300');
        const results = res.data.results;

        const detailedPromises = results.map(p =>
          axios.get(p.url).then(res => {
            const stats = res.data.stats;
            const totalStats = stats.reduce((sum, stat) => sum + stat.base_stat, 0);

            return {
              id: res.data.id,
              name: res.data.name,
              image: res.data.sprites.front_default,
              type: res.data.types[0].type.name,
              totalStats: totalStats,
            };
          })
        );

        const pokemons = await Promise.all(detailedPromises);
        setPokemonList(pokemons);
        setOriginalList(pokemons);
      } catch (err) {
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemons();
  }, []);

  const handleSortToggle = () => {
    const nextIndex = (sortIndex + 1) % sortModes.length;
    setSortIndex(nextIndex);

    const mode = sortModes[nextIndex].key;
    let sorted = [...pokemonList];

    if (mode === 'original') {
      sorted = [...originalList];
    } else if (mode === 'type') {
      sorted.sort((a, b) => a.type.localeCompare(b.type));
    } else if (mode === 'force') {
      sorted.sort((a, b) => b.totalStats - a.totalStats);
    } else if (mode === 'name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    }

    setPokemonList(sorted);
    setCurrentPage(1);
  };

  const filteredList = pokemonList.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE);
  const currentItems = filteredList.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) return <p className="text-center mt-4">Chargement des Pokémon...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Pokédex</h2>

      <div className="flex flex-col md:flex-row items-center gap-4 mb-4 justify-center">
        <input
          type="text"
          placeholder="Rechercher un Pokémon..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-md shadow-md w-64"
        />

        <button
          onClick={handleSortToggle}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition duration-200"
        >
          Tri: {sortModes[sortIndex].label}
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {currentItems.map(pokemon => (
          <PokemonCard key={pokemon.name} pokemon={pokemon} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onChangePage={changePage}
      />
    </div>
  );
}

export default Pokedex;
