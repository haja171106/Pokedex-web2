import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const typeColors = {
  fire: "#F08030",
  water: "#6890F0",
  grass: "#78C850",
  electric: "#F8D030",
  psychic: "#F85888",
  ice: "#98D8D8",
  dragon: "#7038F8",
  dark: "#705848",
  fairy: "#EE99AC",
  normal: "#A8A878",
  fighting: "#C03028",
  flying: "#A890F0",
  poison: "#A040A0",
  ground: "#E0C068",
  rock: "#B8A038",
  bug: "#A8B820",
  ghost: "#705898",
  steel: "#B8B8D0",
};

function PokemonDetail() {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [bgColor, setBgColor] = useState("#f0f0f0");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then((res) => {
        setPokemon(res.data);
        const primaryType = res.data.types[0].type.name;
        setBgColor(typeColors[primaryType] || "#f0f0f0");
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Erreur API :", err);
        setIsLoading(false);
      });
  }, [name]);

  const handleNavigation = async (direction) => {
    if (!pokemon) return;
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
      <div
        style={{
          backgroundColor: "#f0f0f0",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "1.8rem",
          fontWeight: "bold",
          color: "#333",
        }}
      >
        Chargement du Pokémon...
      </div>
    );
  }

  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw", overflow: "hidden" }}>

      <div
        style={{
          backgroundColor: bgColor,
          filter: "blur(40px)",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: -2,
        }}
      />

  
      <div
        style={{
          backgroundImage: `url(${pokemon.sprites.other["official-artwork"].front_default})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          opacity: 0.15,
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: -1,
        }}
      />


      <div
        style={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            borderRadius: "20px",
            padding: "30px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
            textAlign: "center",
            width: "340px",
            backdropFilter: "blur(6px)",
          }}
        >
          <h1 style={{ fontSize: "2.5rem", textTransform: "capitalize", marginBottom: "1rem" }}>
            {pokemon.name}
          </h1>
          <img
            src={pokemon.sprites.other["official-artwork"].front_default}
            alt={pokemon.name}
            style={{ width: "180px", height: "180px" }}
          />
          <p><strong>Type :</strong> {pokemon.types.map((t) => t.type.name).join(", ")}</p>
          <p><strong>Poids :</strong> {pokemon.weight} kg</p>
          <p><strong>Taille :</strong> {pokemon.height / 10} m</p>


          <div style={{ marginTop: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <button onClick={() => handleNavigation(-1)} style={buttonStyle}>⬅ Précédent</button>
              <button onClick={() => handleNavigation(1)} style={buttonStyle}>Suivant ➡</button>
            </div>
            <button
              onClick={() => navigate("/")}
              style={{
                padding: "10px 15px",
                border: "none",
                borderRadius: "10px",
                backgroundColor: "#ccc",
                color: "#333",
                fontWeight: "bold",
                cursor: "pointer",
                width: "100%",
              }}
            >
              ⬅ Retour au Pokédex
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const buttonStyle = {
  padding: "10px 15px",
  border: "none",
  borderRadius: "10px",
  backgroundColor: "#333",
  color: "#fff",
  fontWeight: "bold",
  cursor: "pointer",
};

export default PokemonDetail;
