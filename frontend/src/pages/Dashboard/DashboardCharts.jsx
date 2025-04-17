import React from "react";
import { FormattedMessage } from "react-intl";

const DashboardCharts = () => {
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
          <div
            className="chart-placeholder"
            style={{
              height: "300px",
              backgroundColor: "#f8f9fa",
              border: "1px dashed #ccc",
            }}
          >
            <p className="text-center text-muted mt-5">
              <FormattedMessage
                id="dashboardCharts.users.placeholder"
                defaultMessage="User Registration Line Chart Placeholder"
              />
            </p>
          </div>
        </div>

        {/* Gráfico Cumulativo: Número Total de Produtos Comprados */}
        <div>
          <h6>
            <FormattedMessage
              id="dashboardCharts.products.title"
              defaultMessage="Total Products Purchased Over Time"
            />
          </h6>
          <div
            className="chart-placeholder"
            style={{
              height: "300px",
              backgroundColor: "#f8f9fa",
              border: "1px dashed #ccc",
            }}
          >
            <p className="text-center text-muted mt-5">
              <FormattedMessage
                id="dashboardCharts.products.placeholder"
                defaultMessage="Cumulative Product Purchases Chart Placeholder"
              />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
