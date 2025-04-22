import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const UserRegistrationsChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/vanessa-vinicyus-proj3/rest/users/registrations"
        ); 
        const data = await response.json();

        const labels = data.map((entry) => entry.date); // Datas no eixo X
        const counts = data.map((entry) => entry.count); // Contagem no eixo Y

        setChartData({
          labels,
          datasets: [
            {
              label: "Registros de Utilizadores",
              data: counts,
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              tension: 0.4,
            },
          ],
        });
      } catch (error) {
        console.error("Erro ao buscar dados do gráfico:", error);
      }
    };

    fetchData();
  }, []);

  if (!chartData) {
    return <p>Carregando gráfico...</p>;
  }

  return (
    <div>
      <h5>Registros de Utilizadores ao Longo do Tempo</h5>
      <Line
        data={chartData}
        options={{ responsive: true, plugins: { legend: { position: "top" } } }}
      />
    </div>
  );
};

export default UserRegistrationsChart;
