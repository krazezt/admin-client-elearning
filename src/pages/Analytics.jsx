import { Button } from "@mui/material";
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
  const dataTest = [
    {
      count: 1,
      averageAchievement: null,
      minAchievement: null,
      maxAchievement: null,
      course: "Test Course 2",
    },
    {
      count: 1,
      averageAchievement: null,
      minAchievement: null,
      maxAchievement: null,
      course: "react course",
    },
    {
      count: 2,
      averageAchievement: 3.5,
      minAchievement: 2,
      maxAchievement: 5,
      course: "Python course 2",
    },
    {
      count: 1,
      averageAchievement: null,
      minAchievement: null,
      maxAchievement: null,
      course: "Test Course",
    },
    {
      count: 1,
      averageAchievement: null,
      minAchievement: null,
      maxAchievement: null,
      course: "React extremely godlike course!",
    },
    {
      count: 1,
      averageAchievement: null,
      minAchievement: null,
      maxAchievement: null,
      course: "python course",
    },
    {
      count: 3,
      averageAchievement: 4.333333333333333,
      minAchievement: 1,
      maxAchievement: 7,
      course: "react course",
    },
    {
      count: 1,
      averageAchievement: null,
      minAchievement: null,
      maxAchievement: null,
      course: "Tran Duc Quan",
    },
    {
      count: 1,
      averageAchievement: null,
      minAchievement: null,
      maxAchievement: null,
      course: "React for HATERS !!!",
    },
    {
      count: 1,
      averageAchievement: null,
      minAchievement: null,
      maxAchievement: null,
      course: "react course",
    },
  ];

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
    pureDataArr.sort((a, b) => b.count - a.count);
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
                type="line"
                height="100%"
              />
              <Button onClick={() => makeData(dataTest)}>ABC</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
