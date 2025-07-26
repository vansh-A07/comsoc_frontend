import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AppointmentsChart = ({ data }) => {
  const statusCounts = data.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: ["Pending", "Confirmed", "Cancelled", "Completed"],
    datasets: [
      {
        label: "Status Count",
        data: [
          statusCounts.pending || 0,
          statusCounts.confirmed || 0,
          statusCounts.cancelled || 0,
          statusCounts.completed || 0,
        ],
        backgroundColor: ["#6c757d","#ffc107", "#dc3545","#28a745"],
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Appointments Overview" },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default AppointmentsChart;
