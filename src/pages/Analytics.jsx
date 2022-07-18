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
  const [dataDonut, setDataDonut] = useState({
    options: {
      labels: [],
    },
    series: [],
  });
  const [dataBar, setDataBar] = useState({
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: [],
      },
    },
    series: [
      {
        name: "",
        data: [],
      },
    ],
  });

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

      const res2 = await axios.get(
        api.find((e) => e.pages === "Tổng quan").api["get-chart"],
        axiosConfig
      );

      makeData(res.data.result);
      makeData2(res2.data.result);
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

  const makeData2 = (pureData) => {
    const pureDataArr = pureData.chartInfo;
    const tmpSeries = [];
    const tmpLabels = [];

    for (let i = 0; i < pureDataArr.length; i++) {
      tmpSeries.push(pureDataArr[i].count);
      tmpLabels.push(pureDataArr[i].category);
    }

    const tmpDataBar = {
      options: {
        chart: {
          id: "basic-bar",
        },
        xaxis: {
          categories: [],
        },
      },
      series: [],
    };

    tmpDataBar.options.xaxis.categories.push("Users");
    tmpDataBar.options.xaxis.categories.push("Courses");
    tmpDataBar.options.xaxis.categories.push("Attdendances");
    tmpDataBar.options.xaxis.categories.push("Categories");

    tmpDataBar.series.push({
      name: "",
      data: [
        pureData.countUser,
        pureData.countCourse,
        pureData.countAttendance,
        pureData.countCategory,
      ],
    });

    setDataBar(tmpDataBar);
    setDataDonut({ options: { labels: tmpLabels }, series: tmpSeries });
  };

  const themeReducer = useSelector((state) => state.ThemeReducer.mode);

  return (
    <div className="analyics-component">
      <div className="row">
        <div className="col-6">
          <div className="card">
            <div className="card_heder">
              <h3>Categories</h3>
            </div>
            <Chart
              options={dataDonut.options}
              series={dataDonut.series}
              type="donut"
              width="380"
            />
          </div>
        </div>
        <div className="col-6">
          <div className="card">
            <div className="card_heder">
              <h3>Analystics</h3>
            </div>
            <Chart
              options={dataBar.options}
              series={dataBar.series}
              type="bar"
              height="235"
            />
          </div>
        </div>
      </div>
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
