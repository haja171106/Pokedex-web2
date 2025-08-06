import React from "react";

const color = {
  fire: 'linear-gradient(135deg, #f12711, #f5af19)',
  water: 'linear-gradient(135deg, #2193b0, #6dd5ed)',
  grass: 'linear-gradient(135deg, #56ab2f, #a8e063)',
  electric: 'linear-gradient(135deg, #fceabb, #f8b500)',
  bug: 'linear-gradient(135deg, #a8b820, #d0f060)',
  normal: 'linear-gradient(135deg, #cfd9df, #e2ebf0)',
  poison: 'linear-gradient(135deg, #a044ff, #6a3093)',
  ground: 'linear-gradient(135deg, #e4afcb, #b8a083)',
  fairy: 'linear-gradient(135deg, #ff9a9e, #fad0c4)',
  fighting: 'linear-gradient(135deg, #c31432, #240b36)',
  psychic: 'linear-gradient(135deg, #f953c6, #b91d73)',
  rock: 'linear-gradient(135deg, #3e5151, #decba4)',
  ghost: 'linear-gradient(135deg, #606c88, #3f4c6b)',
  ice: 'linear-gradient(135deg, #83a4d4, #b6fbff)',
  dragon: 'linear-gradient(135deg, #20002c, #cbb4d4)',
  dark: 'linear-gradient(135deg, #232526, #414345)',
  steel: 'linear-gradient(135deg, #bdc3c7, #2c3e50)',
  flying: 'linear-gradient(135deg, #89f7fe, #66a6ff)',
};

function PokemonCard({ pokemon }) {
  return (
    <div
      style={{ background: color[pokemon.type] || '#ddd' }}
      className="rounded-xl p-4 text-center text-neutral-950 w-36 h-52 shadow-md flex flex-col justify-around items-center"
    >
      <img src={pokemon.image} alt={pokemon.name} className="mx-auto w-20 h-20" />
      <h4 className="capitalize text-base h-12 flex items-center text-center">{pokemon.name}</h4>
      <p className="text-sm capitalize">{pokemon.type}</p>
      <small>Total stats: {pokemon.totalStats}</small>
    </div>
  );
}

export default PokemonCard;