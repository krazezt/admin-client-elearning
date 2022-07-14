import React, { useEffect, useState } from "react";
import { BarWave } from "react-cssfx-loading/lib";
import Axios from "axios";
import api from "../assets/JsonData/api.json";
import CategoryTable from "../component/tables/CategoryTable";

export default function CategoryManagement() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let axiosConfig = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token-admin")}`,
      },
    };

    const getData = async () => {
      const categoryData = await Axios.get(
        api.find((e) => e.pages === "Category").api["get-all-categories"],
        axiosConfig
      );

      setCategories(categoryData.data.result);
      setLoading(false);
    };

    getData();
  }, []);
  return (
    <div>
      <div className="card">
        {loading ? <BarWave /> : <Content categories={categories} />}
      </div>
    </div>
  );
}

const Content = (props) => {
  return <CategoryTable categories={props.categories} />;
};
