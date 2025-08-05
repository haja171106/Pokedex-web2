import React from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

function PokemonStatsChart({ stats, color }) {
  const statLabels = stats.map(stat => stat.stat.name.replace('special-attack', 'Sp. Atk').replace('special-defense', 'Sp. Def').replace('-', ' '));
  const statValues = stats.map(stat => stat.base_stat);

  const data = {
    labels: statLabels,
    datasets: [
      {
        label: 'Statistiques de base',
        data: statValues,
        backgroundColor: color ? `${color}80` : 'rgba(34, 211, 238, 0.5)', 
        borderColor: color || 'rgba(34, 211, 238, 1)',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        pointLabels: {
          color: '#4B5563', 
          font: {
            size: 14,
            weight: 'bold',
          }
        },
        ticks: {
          color: '#4B5563',
          backdropColor: 'rgba(255, 255, 255, 0.85)',
          stepSize: 50,
        },
        suggestedMin: 0,
        suggestedMax: 150,
      },
    },
    plugins: {
      legend: {
        display: false, 
      },
    },
    maintainAspectRatio: true,
  };

  return <Radar data={data} options={options} />;
}

export default PokemonStatsChart;
