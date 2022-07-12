import React, { useEffect } from "react";
import { BarWave } from "react-cssfx-loading/lib";

const Dashboard = () => {
  useEffect(() => {});
  return (
    <div>
      <div className="page-user_header"></div>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card_body">
              <BarWave />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
