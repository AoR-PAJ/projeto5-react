import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Service } from "../../Services/Services"; // Importa o serviço para buscar os dados

const AveragePurchaseTime = ({ token }) => {
  const [averageTime, setAverageTime] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAverageTime = async () => {
      try {
        const data = await Service.fetchAverageTimeToPurchase(token);
        setAverageTime(data.averageTime); // Supondo que o backend retorna { averageTime: 0.39 }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAverageTime();
  }, [token]);

  if (error) {
    return (
      <div className="mb-4">
        <div className="card-body">
          <p className="text-danger">
            <FormattedMessage
              id="averagePurchaseTime.error"
              defaultMessage="Error fetching average time to purchase."
            />
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <div className="card-body">
        <p className="card-text">
          <FormattedMessage
            id="averagePurchaseTime.description"
            defaultMessage="The average time it takes for a product to be purchased after publication."
          />
        </p>
        <div className="mb-3">
          <strong>
            <FormattedMessage
              id="averagePurchaseTime.value"
              defaultMessage="Average Time to Purchase"
            />
            :
          </strong>{" "}
          {averageTime !== null ? (
            <>
              {averageTime.toFixed(2)}{" "}
              <FormattedMessage id="days" defaultMessage="days" />
            </>
          ) : (
            <FormattedMessage id="loading" defaultMessage="Loading..." />
          )}
        </div>
      </div>
    </div>
  );
};

export default AveragePurchaseTime;
