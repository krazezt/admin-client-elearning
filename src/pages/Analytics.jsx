import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { useSelector } from "react-redux";
import "../assets/css/analyics.css";
import axios from "axios";
import api from "../assets/JsonData/api.json";

const chartOptions = {
  color: ["#6ab04c", "#2980b9"],
  chart: {
    background: "transparent",
  },
  dataLabels: {
    enabled: true,
  },
  stroke: {
    curve: "smooth",
  },
  legend: {
    position: "top",
  },
  grid: {
    show: true,
  },
};

const Analytics = () => {
  const COURSE_NAME_LENGHT = 20;

  const [dashboard, setDashboard] = useState([
    {
      name: "Max Achievement",
      data: [0, 0, 0, 0, 0, 0, 0],
    },
    {
      name: "Average Achievement",
      data: [0, 0, 0, 0, 0, 0, 0],
    },
    {
      name: "Min Achievement",
      data: [0, 0, 0, 0, 0, 0, 0],
    },
    {
      name: "Count",
      data: [0, 0, 0, 0, 0, 0, 0],
    },
  ]);

  const [xAxis, setXAxis] = useState([]);

  useEffect(() => {
    let axiosConfig = {
      headers: {
        "Content-Type": "application/json;charset-UTF-8",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token-admin")}`,
      },
    };

    const getData = async () => {
      const res = await axios.get(
        api.find((e) => e.pages === "Tổng quan").api["get-analystics"],
        axiosConfig
      );

      makeData(res.data.result);
    };

    getData();
  }, []);

  const makeData = (pureDataArr) => {
    pureDataArr = pureDataArr.sort((a, b) => b.count - a.count).slice(0, 7);
    const result = [
      {
        name: "Max Achievement",
        data: [],
      },
      {
        name: "Average Achievement",
        data: [],
      },
      {
        name: "Min Achievement",
        data: [],
      },
      {
        name: "Count",
        data: [],
      },
    ];

    for (let i = 0; i < 7; i++) {
      result[0].data.push(pureDataArr[i].maxAchievement | 0);
      result[1].data.push(pureDataArr[i].averageAchievement | 0);
      result[2].data.push(pureDataArr[i].minAchievement | 0);
      result[3].data.push(pureDataArr[i].count | 0);
    }

    setXAxis(
      pureDataArr.map((item) =>
        item.course.length > COURSE_NAME_LENGHT
          ? item.course.slice(0, COURSE_NAME_LENGHT) + "..."
          : item.course
      )
    );
    setDashboard([...result]);
  };

  const themeReducer = useSelector((state) => state.ThemeReducer.mode);

  return (
    <div className="analyics-component">
      <div className="row">
        <div className="col-12">
          <div className="card  char-dashboard-top">
            <div className="card_heder">
              <h3>Tổng quan</h3>
            </div>
            <div className="card_body char-analytics-top">
              <Chart
                options={
                  themeReducer === "theme-mode-light"
                    ? {
                        xaxis: {
                          categories: xAxis,
                        },
                        ...chartOptions,
                        theme: { mode: "light" },
                      }
                    : {
                        ...chartOptions,
                        theme: { mode: "dark" },
                      }
                }
                series={dashboard}
                type="bar"
                height="100%"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
