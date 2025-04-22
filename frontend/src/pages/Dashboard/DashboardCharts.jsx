import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { FormattedMessage } from "react-intl";
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

// Registrar os componentes necessários do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashboardCharts = () => {
  const [userGrowthData, setUserGrowthData] = useState(null);
  const [productPurchaseData, setProductPurchaseData] = useState(null);

  // Buscar dados do backend para o gráfico de utilizadores
  useEffect(() => {
    const fetchUserGrowthData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/vanessa-vinicyus-proj3/rest/users/registrations"
        );
        const data = await response.json();

        // Formatar os dados para o gráfico
        // Converter timestamps para datas legíveis
        const labels = data.map((entry) =>
          new Date(entry.date).toLocaleDateString("pt-BR")
        );
        const counts = data.map((entry) => entry.count);

        setUserGrowthData({
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
        console.error(
          "Erro ao buscar dados do gráfico de utilizadores:",
          error
        );
      }
    };

    fetchUserGrowthData();
  }, []);

  // Buscar dados do backend para o gráfico de produtos comprados
  useEffect(() => {
    const fetchProductPurchaseData = async () => {
      try {
        const response = await fetch("/api/products/purchases"); // Substitua pelo endpoint correto
        const data = await response.json();

        // Formatar os dados para o gráfico
        const labels = data.map((entry) => entry.date); // Datas no eixo X
        const counts = data.map((entry) => entry.count); // Contagem no eixo Y

        setProductPurchaseData({
          labels,
          datasets: [
            {
              label: "Produtos Comprados",
              data: counts,
              borderColor: "rgba(255, 99, 132, 1)",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              tension: 0.4, // Suavizar a linha
            },
          ],
        });
      } catch (error) {
        console.error(
          "Erro ao buscar dados do gráfico de produtos comprados:",
          error
        );
      }
    };

    fetchProductPurchaseData();
  }, []);

  return (
    <div className="mb-4">
      <div className="card-body">
        <p className="card-text">
          <FormattedMessage
            id="dashboardCharts.description"
            defaultMessage="Visualize user registrations and product purchases over time."
          />
        </p>

        {/* Gráfico de Linhas: Número de Utilizadores Registados */}
        <div className="mb-4">
          <h6>
            <FormattedMessage
              id="dashboardCharts.users.title"
              defaultMessage="User Registrations Over Time"
            />
          </h6>
          {userGrowthData ? (
            <Line
              data={userGrowthData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  title: {
                    display: true,
                    text: "Crescimento de Utilizadores",
                  },
                },
              }}
            />
          ) : (
            <p className="text-center text-muted mt-5">
              <FormattedMessage
                id="dashboardCharts.users.loading"
                defaultMessage="Loading user registration data..."
              />
            </p>
          )}
        </div>

        {/* Gráfico Cumulativo: Número Total de Produtos Comprados */}
        <div>
          <h6>
            <FormattedMessage
              id="dashboardCharts.products.title"
              defaultMessage="Total Products Purchased Over Time"
            />
          </h6>
          {productPurchaseData ? (
            <Line
              data={productPurchaseData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  title: {
                    display: true,
                    text: "Produtos Comprados ao Longo do Tempo",
                  },
                },
              }}
            />
          ) : (
            <p className="text-center text-muted mt-5">
              <FormattedMessage
                id="dashboardCharts.products.loading"
                defaultMessage="Loading product purchase data..."
              />
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
