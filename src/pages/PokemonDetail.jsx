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
        backgroundColor: color ? `${color}40` : 'rgba(255, 255, 255, 0.25)',
        borderColor: '#ffffff',
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: {
          color: 'rgba(255, 255, 255, 0.25)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.25)',
        },
        pointLabels: {
          color: 'rgba(255, 255, 255, 0.85)',
          font: {
            size: 14,
            weight: 'bold',
          }
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.85)',
          backdropColor: 'transparent',
          stepSize: 50,
        },
        suggestedMin: 0,
        suggestedMax: 150,
      },
    },
    plugins: {
      legend: {
        display: false, // On peut masquer la légende si elle est redondante
      },
    },
    maintainAspectRatio: true,
  };

  return <Radar data={data} options={options} />;
}

export default PokemonStatsChart;
