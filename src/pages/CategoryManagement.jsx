import React, { useEffect } from "react";
import { BarWave } from "react-cssfx-loading/lib";
import Axios from "axios";
import api from "../assets/JsonData/api.json";

export default function CategoryManagement() {
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset-UTF-8",
      Accept: "application/json",
      Authorization: `Bearer ${localStorage.getItem("token-admin")}`,
    },
  };
  useEffect(() => {
    // Axios.get(
    //   api.find((e) => e.pages === "Tổng quan").api["get-course"],
    //   axiosConfig
    // );
  }, []);
  return (
    <div>
      <h2 className="page-header">Phê duyệt bài đăng</h2>
      <div className="card">
        <BarWave />
      </div>
    </div>
  );
}
