import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PokemonStatsChart from "../components/PokemonStatsChart";
import "./PokemonDetail.css";

const typeColors = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

function PokemonDetail() {
  const { id, name } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    const identifier = name || id;
    if (!identifier) return;

    fetch(`https://pokeapi.co/api/v2/pokemon/${identifier}`)
      .then((res) => res.json())
      .then((data) => setPokemon(data))
      .catch((err) => {
        console.error("Erreur lors du chargement du Pokémon:", err);
      });
  }, [id, name]);

  if (!pokemon) return <div className="loading">Chargement...</div>;

  const mainType = pokemon.types[0].type.name;
  const bgColor = typeColors[mainType] || "#777";

  const backgroundImage = pokemon.sprites.other["official-artwork"].front_default;

  // Pour navigation, on utilise l'id numérique
  const currentId = pokemon.id;

  const goPrevious = () => {
    if (currentId > 1) {
      navigate(`/pokemon/${currentId - 1}`);
    }
  };

  const goNext = () => {
    navigate(`/pokemon/${currentId + 1}`);
  };

  return (
    <div
      className="pokemon-detail"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      <div
        className="pokemon-detail-overlay"
        style={{ backgroundColor: `${bgColor}cc` }}
      ></div>

      <button className="back-button" onClick={() => navigate("/")}>
        ← Retour
      </button>

      <div className="pokemon-container">
        <img
          src={backgroundImage}
          alt={pokemon.name}
          className="pokemon-image"
        />
        <h1 className="pokemon-name">{pokemon.name}</h1>
        <div className="pokemon-types">
          {pokemon.types.map((t) => (
            <span key={t.type.name} className={`type ${t.type.name}`}>
              {t.type.name}
            </span>
          ))}
        </div>
        <PokemonStatsChart stats={pokemon.stats} type={mainType} />
      </div>

      <div className="navigation-buttons">
        <button
          onClick={goPrevious}
          disabled={currentId <= 1}
          aria-label="Pokémon précédent"
        >
          ← Précédent
        </button>
        <button onClick={goNext} aria-label="Pokémon suivant">
          Suivant →
        </button>
      </div>
    </div>
  );
}

export default PokemonDetail;

