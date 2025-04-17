import React from "react";
import useUserStats from "../../hooks/useUserStats";
import { FormattedMessage, useIntl } from "react-intl"; 

const UserStatus = () => {
  const { total, verified, unverified } = useUserStats();

  return (
    <div className="card mb-4">
      
        <p className="card-text">
          <FormattedMessage id="userstatistics.description" />
        </p>
        <ul className="list-group">
          <li className="list-group-item">
            <strong>
              <FormattedMessage id="totalusers" />:
            </strong>{" "}
            {total}
          </li>
          <li className="list-group-item">
            <strong>
              <FormattedMessage id="verifiedusers" />:
            </strong>{" "}
            {verified}
          </li>
          <li className="list-group-item">
            <strong>
              <FormattedMessage id="unverifiedusers" />:
            </strong>{" "}
            {unverified}
          </li>
        </ul>
      </div>
  );
};

export default UserStatus;
