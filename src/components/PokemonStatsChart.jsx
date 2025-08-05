import React from "react";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

function PokemonStatsChart({ stats, color }) {
  const statLabels = stats.map((stat) =>
    stat.stat.name
      .replace("special-attack", "Sp. Atk")
      .replace("special-defense", "Sp. Def")
      .replace("-", " ")
  );
  const statValues = stats.map((stat) => stat.base_stat);

  const backgroundColor = color ? `${color}40` : "rgba(34, 211, 238, 0.25)";
  const borderColor = color || "rgba(34, 211, 238, 1)";
  const pointColor = color || "rgba(34, 211, 238, 1)";
  const labelColor = color || "#4B5563";

  const data = {
    labels: statLabels,
    datasets: [
      {
        label: "Statistiques de base",
        data: statValues,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        pointBackgroundColor: pointColor,
        pointBorderColor: pointColor,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: {
          color: borderColor,
        },
        grid: {
          color: borderColor,
        },
        pointLabels: {
          color: borderColor,
          font: {
            size: 14,
            weight: "bold",
          },
        },
        ticks: {
          color: borderColor,
          backdropColor: "transparent",
          stepSize: 50,
          beginAtZero: true,
          max: 150,
        },
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
