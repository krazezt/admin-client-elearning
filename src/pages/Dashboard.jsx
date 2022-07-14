import { Grid } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BarWave } from "react-cssfx-loading/lib";
import api from "../assets/JsonData/api.json";
import CourseCard from "../component/cards/CourseCard";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    let axiosConfig = {
      headers: {
        "Content-Type": "application/json;charset-UTF-8",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token-admin")}`,
      },
      params: {
        limit: 10,
        page: 1,
      },
    };

    const getData = async () => {
      const res = await axios.get(
        api.find((e) => e.pages === "Khóa học").api["get-list_course"],
        axiosConfig
      );
      setData(res.data);
      setLoading(false);
    };

    getData();
  }, []);

  return (
    <div>
      <div className="page-user_header"></div>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card_body">
              {loading ? <BarWave /> : <Content courses={data.results} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Content = (props) => {
  return (
    <Grid container spacing={5}>
      {props.courses.map((item, index) => (
        <Grid item xs={3} key={index}>
          <CourseCard course={item} />
        </Grid>
      ))}
    </Grid>
  );
};
export default Dashboard;
