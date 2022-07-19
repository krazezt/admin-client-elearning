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
      name: "最高成績",
      data: [0, 0, 0, 0, 0, 0, 0],
    },
    {
      name: "平均成度",
      data: [0, 0, 0, 0, 0, 0, 0],
    },
    {
      name: "最低成績",
      data: [0, 0, 0, 0, 0, 0, 0],
    },
    {
      name: "学習者数",
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
        name: "最高成績",
        data: [],
      },
      {
        name: "平均成度",
        data: [],
      },
      {
        name: "最低成績",
        data: [],
      },
      {
        name: "学習者数",
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

    tmpDataBar.options.xaxis.categories.push("ユーザ数");
    tmpDataBar.options.xaxis.categories.push("コース数");
    tmpDataBar.options.xaxis.categories.push("登録数");
    tmpDataBar.options.xaxis.categories.push("カテゴリー数");

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
              <h3>カテゴリーによりコース数</h3>
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
              <h3>分析</h3>
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
              <h3>概要</h3>
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
