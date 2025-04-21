import React from "react";
import useUserStats from "../../hooks/useUserStats";
import { FormattedMessage } from "react-intl";

const UserStatus = () => {
  const { total, verified, unverified } = useUserStats();
  console.log("UserStatus", total, verified, unverified);

  return (
    <div className="card mb-4">
      <div className="card-body">
        <p className="card-text">
          <FormattedMessage id="userstatistics.description" />
        </p>
        <div className="row">
          <div className="col-12 col-md-4 mb-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">
                  <FormattedMessage id="totalusers" />
                </h5>
                <p className="card-text fs-4">{total}</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4 mb-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">
                  <FormattedMessage id="verifiedusers" />
                </h5>
                <p className="card-text fs-4">{verified}</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4 mb-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">
                  <FormattedMessage id="unverifiedusers" />
                </h5>
                <p className="card-text fs-4">{unverified}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStatus;
