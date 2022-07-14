import { Button, Grid } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BarWave } from "react-cssfx-loading/lib";
import api from "../assets/JsonData/api.json";
import CourseCard from "../component/cards/CourseCard";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import Swal from "sweetalert2";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [coursesData, setCoursesData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState({
    categoryId: "",
    sortBy: "",
    sortType: "",
  });

  useEffect(() => {
    const axiosConfig = {
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
      const coursesData = await axios.get(
        api.find((e) => e.pages === "Khóa học").api["get-list_course"],
        axiosConfig
      );

      const categoriesData = await axios.get(
        api.find((e) => e.pages === "Category").api["get-all-categories"],
        axiosConfig
      );

      setCoursesData(coursesData.data);
      setCategories(categoriesData.data.result);
      setLoading(false);
    };

    getData();
  }, []);

  const handleChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const submitFilter = async () => {
    let tmpParams = {};
    if (filter.categoryId !== "") tmpParams.categoryId = filter.categoryId;
    if (filter.sortBy !== "" && filter.sortType !== "")
      tmpParams.sortBy = `${filter.sortBy}:${filter.sortType}`;

    const axiosConfig = {
      headers: {
        "Content-Type": "application/json;charset-UTF-8",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token-admin")}`,
      },
      params: tmpParams,
    };

    try {
      const res = await axios.get(
        api.find((e) => e.pages === "Khóa học").api["get-list_course"],
        axiosConfig
      );

      setCoursesData(res.data);
    } catch (error) {
      Swal.fire(
        "Error",
        "Something happened, check infomations and try again, glhf!",
        "error"
      );
    }
  };

  return (
    <div>
      <div className="row">
        <div style={{ width: "770px", padding: "15px" }}>
          <div className="card">
            <div className="card_body">
              <FormControl variant="standard" sx={{ m: 3, minWidth: 120 }}>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  name="categoryId"
                  onChange={handleChange}
                >
                  <MenuItem value="" key={-1}>
                    All
                  </MenuItem>
                  {categories.map((item, index) => (
                    <MenuItem value={item.id} key={index}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl variant="standard" sx={{ m: 3, minWidth: 120 }}>
                <InputLabel id="sortby-label">Sort By</InputLabel>
                <Select
                  labelId="sortby-label"
                  name="sortBy"
                  onChange={handleChange}
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="name">Course Name</MenuItem>
                  <MenuItem value="createdAt">Date Created</MenuItem>
                </Select>
              </FormControl>
              <FormControl variant="standard" sx={{ m: 3, minWidth: 120 }}>
                <ToggleButtonGroup
                  color="primary"
                  exclusive
                  value={filter.sortType}
                  onChange={(event, value) => {
                    setFilter({ ...filter, sortType: value });
                  }}
                >
                  <ToggleButton value="desc">▲</ToggleButton>
                  <ToggleButton value="asc">▼</ToggleButton>
                </ToggleButtonGroup>
              </FormControl>
              <FormControl variant="standard" sx={{ m: 3, minWidth: 120 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<FilterAltIcon />}
                  onClick={submitFilter}
                >
                  Filter
                </Button>
              </FormControl>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card_body">
              {loading ? (
                <BarWave />
              ) : (
                <Content courses={coursesData.results} />
              )}
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
