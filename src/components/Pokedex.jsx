import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import PokemonCard from "./PokemonCard";
import Pagination from "./Pagination";
import { Link } from "react-router-dom";

const ITEMS_PER_PAGE = 20;

const sortOptions = [
  { key: "original", label: "Ordre d'origine" },
  { key: "strength", label: "Par force (total stats)" },
  { key: "alphabetical", label: "Ordre alphabétique" },
  { key: "type", label: "Par type" },
];

function Pokedex() {
  const [allPokemon, setAllPokemon] = useState([]);
  const [pokemonDetails, setPokemonDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortMode, setSortMode] = useState("original");

  useEffect(() => {
    const fetchAllPokemonNames = async () => {
      setLoading(true);
      try {
        const res = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=1300");
        setAllPokemon(res.data.results);
      } catch (err) {
        console.error("Erreur:", err);
      }
      setLoading(false);
    };
    fetchAllPokemonNames();
  }, []);

  const filteredPokemon = useMemo(() =>
    allPokemon.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [allPokemon, searchTerm]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortMode]);

  useEffect(() => {
    const fetchDetails = async () => {
      if (filteredPokemon.length === 0) {
        setPokemonDetails([]);
        return;
      }
      setLoading(true);
      try {
        const limitedList = filteredPokemon.slice(0, 200);

        const detailedPromises = limitedList.map((p) =>
          axios.get(p.url).then((res) => {
            const stats = res.data.stats;
            const totalStats = stats.reduce((sum, stat) => sum + stat.base_stat, 0);
            return {
              id: res.data.id,
              name: res.data.name,
              image:
                res.data.sprites.versions["generation-v"]["black-white"].animated
                  .front_default || res.data.sprites.front_default,
              type: res.data.types[0].type.name,
              totalStats: totalStats,
            };
          })
        );

        const detailedPokemons = await Promise.all(detailedPromises);
        setPokemonDetails(detailedPokemons);
      } catch (err) {
        console.error("Erreur:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [filteredPokemon]);

  const sortedPokemon = useMemo(() => {
    let pokemons = [...pokemonDetails];
    switch (sortMode) {
      case "strength":
        pokemons.sort((a, b) => b.totalStats - a.totalStats);
        break;
      case "alphabetical":
        pokemons.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "type":
        pokemons.sort((a, b) => a.type.localeCompare(b.type));
        break;
      case "original":
      default:
        pokemons.sort((a, b) => a.id - b.id);
        break;
    }
    return pokemons;
  }, [pokemonDetails, sortMode]);

  const totalPages = Math.ceil(sortedPokemon.length / ITEMS_PER_PAGE);
  const currentPageData = sortedPokemon.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" }); 
    }
  };

  return (
    <div className="bg-gradient-blue-animated min-h-screen flex flex-col p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-white drop-shadow-lg">Pokédex</h2>

      <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-xl mx-auto mb-8">
        <input
          type="text"
          placeholder="Rechercher un Pokémon..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow px-4 py-3 rounded-lg shadow-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          aria-label="Rechercher un Pokémon"
        />

        <select
          value={sortMode}
          onChange={(e) => setSortMode(e.target.value)}
          className="px-4 py-3 rounded-lg shadow-lg border border-gray-300 bg-white text-gray-900 cursor-pointer transition hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          aria-label="Trier les Pokémon"
        >
          {sortOptions.map(({ key, label }) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-center text-white text-lg font-semibold">Chargement des Pokémon...</p>
      ) : currentPageData.length === 0 ? (
        <p className="text-center text-white text-lg font-semibold">Aucun Pokémon trouvé.</p>
      ) : (
        <>
          <div
            className="grid grid-cols-10 gap-4 justify-center mx-auto"
            style={{ maxWidth: "fit-content" }}
          >
            {currentPageData.map((pokemon) => (
              <Link
                to={`/pokemon/${pokemon.name}`}
                key={pokemon.name}
                style={{ display: "inline-block", width: "fit-content" }}
              >
                <PokemonCard pokemon={pokemon} />
              </Link>
            ))}
          </div>       
          <div className="mt-auto pt-6 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onChangePage={changePage}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default Pokedex;


