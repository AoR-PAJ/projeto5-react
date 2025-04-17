import React from "react";
import { FormattedMessage } from "react-intl";

const AveragePurchaseTime = () => {
  return (
    <div className="mb-4">
      <div className="card-body">
        <p className="card-text">
          <FormattedMessage
            id="averagePurchaseTime.description"
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
          {/* Exemplo de valor estático */}
          3.5 <FormattedMessage id="hours" defaultMessage="hours" />
        </div>
      </div>
    </div>
  );
};

export default AveragePurchaseTime;
