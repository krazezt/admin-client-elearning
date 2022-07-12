import Axios from "axios";
import React, { useEffect } from "react";
import api from "../assets/JsonData/api.json";
import { BarWave } from "react-cssfx-loading/lib";
import "../assets/css/user.css";

const User = () => {
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset-UTF-8",
      Accept: "application/json",
      Authorization: `Bearer ${localStorage.getItem("token-admin")}`,
    },
  };

  useEffect(() => {

  }, []);

  return (
    <div>
      <div className="page-user_header">
      </div>
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
export default User;
