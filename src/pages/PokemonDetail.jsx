import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import PokemonStatsChart from "../components/PokemonStatsChart";

const typeColors = {
  fire: "#F08030", water: "#6890F0", grass: "#78C850",
  electric: "#F8D030", psychic: "#F85888", ice: "#98D8D8",
  dragon: "#7038F8", dark: "#705848", fairy: "#EE99AC",
  normal: "#A8A878", fighting: "#C03028", flying: "#A890F0",
  poison: "#A040A0", ground: "#E0C068", rock: "#B8A038",
  bug: "#A8B820", ghost: "#705898", steel: "#B8B8D0",
};

function PokemonDetail() {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [bgColor, setBgColor] = useState("#f0f0f0");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPokemon = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
        setPokemon(res.data);
        const primaryType = res.data.types[0].type.name;
        setBgColor(typeColors[primaryType] || "#f0f0f0");
      } catch (err) {
        console.error("Erreur API :", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPokemon();
  }, [name]);

  const handleNavigation = async (direction) => {
    if (!pokemon) return;
    // Note: The max ID is hardcoded. A better solution would be to fetch the total count.
    const newId = pokemon.id + direction;
    if (newId < 1 || newId > 898) return;
    setIsLoading(true);
    try {
      const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${newId}`);
      navigate(`/pokemon/${res.data.name}`);
    } catch (err) {
      console.error("Navigation échouée :", err);
      setIsLoading(false);
    }
  };

  if (isLoading || !pokemon) {
    return (
      <div className="bg-gray-100 h-screen flex justify-center items-center text-3xl font-bold text-gray-800">
        Chargement du Pokémon...
      </div>
    );
  }

  const animatedSprite = pokemon.sprites.versions['generation-v']['black-white'].animated.front_default;
  const staticSprite = pokemon.sprites.other["official-artwork"].front_default;

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Blurred background color */}
      <div
        className="absolute inset-0 w-full h-full -z-20 blur-3xl"
        style={{ backgroundColor: bgColor }}
      />
      {/* Faded background image */}
      <div
        className="absolute inset-0 w-full h-full -z-10 bg-cover bg-no-repeat bg-center opacity-15"
        style={{ backgroundImage: `url(${staticSprite})` }}
      />

      <div className="h-full flex justify-center items-center p-4">
        <div className="bg-white/85 rounded-2xl p-8 shadow-lg text-center w-auto max-w-4xl backdrop-blur-sm">
          <h1 className="text-4xl capitalize mb-4 font-bold">{pokemon.name}</h1>
          
          <div className="flex flex-col md:flex-row items-center justify-around gap-8">
            {/* Left Column: Image and Basic Info */}
            <div className="flex flex-col items-center">
              <img
                src={animatedSprite || staticSprite}
                alt={pokemon.name}
                className="w-[180px] h-[180px] mx-auto"
              />
              <p className="mt-2"><strong>Type :</strong> {pokemon.types.map((t) => t.type.name).join(", ")}</p>
              <p><strong>Poids :</strong> {pokemon.weight / 10} kg</p>
              <p><strong>Taille :</strong> {pokemon.height / 10} m</p>
            </div>

            {/* Right Column: Stats Chart */}
            <div 
              className="w-full md:w-96 p-4 rounded-xl"
              style={{ backgroundColor: `${bgColor}B3` }} // Applying background with 70% opacity
            >
              <PokemonStatsChart stats={pokemon.stats} color={bgColor} />
            </div>
          </div>

          <div className="mt-8 border-t border-gray-300 pt-5">
            <div className="flex justify-between mb-3">
              <button onClick={() => handleNavigation(-1)} className="px-4 py-2 rounded-lg bg-gray-800 text-white font-bold cursor-pointer">⬅ Précédent</button>
              <button onClick={() => handleNavigation(1)} className="px-4 py-2 rounded-lg bg-gray-800 text-white font-bold cursor-pointer">Suivant ➡</button>
            </div>
            <button
              onClick={() => navigate("/")}
              className="w-full px-4 py-2.5 rounded-lg bg-gray-300 text-gray-800 font-bold cursor-pointer"
            >
              ⬅ Retour au Pokédex
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PokemonDetail;