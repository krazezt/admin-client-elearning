import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import api from "../assets/JsonData/api.json";
import { BarWave } from "react-cssfx-loading/lib";
import "../assets/css/user.css";
import {
  TextField,
  Grid,
  Select,
  MenuItem,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputLabel,
  Button,
  Typography,
} from "@mui/material";
import { useHistory, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const EditCourse = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [course, setCourse] = useState({});

  useEffect(() => {
    let axiosConfig = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token-admin")}`,
      },
    };

    const getData = async () => {
      const categoryData = await axios.get(
        api.find((e) => e.pages === "Category").api["get-all-categories"],
        axiosConfig
      );

      const courseData = await axios.get(
        api.find((e) => e.pages === "Khóa học").api["get-course-by-id"] + id,
        axiosConfig
      );

      setCategories(categoryData.data.result);
      setCourse(courseData.data.result);
      setLoading(false);
    };

    getData();
  }, [id]);

  return (
    <div>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card_body">
              {loading ? (
                <BarWave />
              ) : (
                <Content categories={categories} course={course} id={id} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Content = (props) => {
  const [course, setCourse] = useState(props.course);
  const history = useHistory();
  const courseImageRef = useRef("");

  const addLesson = () => {
    const tmpLessons = [...course.lessons];
    tmpLessons.push({
      name: "",
      description: "",
      video: "",
    });
    setCourse({
      ...course,
      lessons: tmpLessons,
    });
  };

  const addQuiz = () => {
    const tmpQuiz = { ...course.quiz };
    tmpQuiz.questions.push({
      question: "",
      answers: {
        A: "",
        B: "",
        C: "",
        D: "",
      },
      correctAnswer: "A",
    });
    setCourse({
      ...course,
      quiz: tmpQuiz,
    });
  };

  const handleChange = (event) => {
    setCourse({ ...course, [event.target.name]: event.target.value });
  };

  const handleChangeLesson = (event, index) => {
    const tmpCourse = { ...course };
    tmpCourse.lessons[index][event.target.name] = event.target.value;
    setCourse(tmpCourse);
  };

  const handleChangeQuizTitle = (e) => {
    setCourse({
      ...course,
      quiz: { title: e.target.value, questions: [...course.quiz.questions] },
    });
  };

  const handleChangeQuestion = (event, index) => {
    const tmpCourse = { ...course };
    tmpCourse.quiz.questions[index][event.target.name] = event.target.value;
    setCourse(tmpCourse);
  };

  const handleChangeAnswer = (event, index) => {
    const tmpCourse = { ...course };
    tmpCourse.quiz.questions[index].answers[event.target.name] =
      event.target.value;
    setCourse(tmpCourse);
  };

  const handleChangeFile = async (event, index) => {
    const tmpCourse = { ...course };
    try {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("image", file);
      const res = await axios.post(
        api.find((e) => e.pages === "Thêm khóa học").api["upload"],
        formData
      );
      tmpCourse.lessons[index].video = res.data.data;
      setCourse(tmpCourse);
    } catch (error) {
      Swal.fire(
        "Error",
        "Something happened, check infomations and try again, glhf!",
        "error"
      );
    }
  };

  const handleChangeCourseImage = async (event) => {
    const tmpCourse = { ...course };
    try {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("image", file);
      const res = await axios.post(
        api.find((e) => e.pages === "Thêm khóa học").api["upload"],
        formData
      );
      tmpCourse.image = res.data.data;
      setCourse(tmpCourse);
    } catch (error) {
      Swal.fire(
        "Error",
        "Something happened, check infomations and try again, glhf!",
        "error"
      );
    }
  };

  const showChooseFileDialog = () => {
    courseImageRef.current.click();
  };

  // Submit
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${localStorage.getItem("token-admin")}`,
    },
  };

  const submit = async () => {
    try {
      const res = await axios.put(
        api.find((e) => e.pages === "Khóa học").api["edit-course"] + props.id,
        course,
        axiosConfig
      );

      if (res.data.code === 200)
        Swal.fire(
          "Done",
          "Course has been updated successfully",
          "success"
        ).then(() => history.push("/"));
      else
        Swal.fire(
          "Error",
          "Something happened, check infomations and try again, glhf!",
          "error"
        );
    } catch (error) {
      Swal.fire(
        "Error",
        "Something happened, check infomations and try again, glhf!",
        "error"
      );
    }
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={4} container spacing={4}>
          <Grid item xs={8}>
            <TextField
              fullWidth
              label="Course Name"
              variant="filled"
              name="name"
              onChange={handleChange}
              value={course.name}
            />
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel id="select-category-label">Category</InputLabel>
              <Select
                variant="filled"
                labelId="select-category-label"
                id="select-category"
                value={course.categoryId}
                label="Category"
                name="categoryId"
                onChange={handleChange}
              >
                {props.categories.map((item, index) => (
                  <MenuItem value={item.id} key={index}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              size="large"
              onClick={showChooseFileDialog}
            >
              Choose image
            </Button>
            <b style={{ paddingLeft: "10px" }}>
              {"..." +
                course.image
                  .split(/(\\|\/)/g)
                  .pop()
                  .slice(-20)}
            </b>
            <input
              hidden
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChangeCourseImage}
              ref={courseImageRef}
            />
          </Grid>
        </Grid>
        <Grid item xs={8}>
          <TextField
            fullWidth
            multiline
            label="Course description"
            variant="filled"
            rows={5}
            name="description"
            onChange={handleChange}
            value={course.description}
          />
        </Grid>
        <Grid item xs={10}>
          <Typography variant="h4" align="left">
            Lessons
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Button variant="contained" onClick={addLesson}>
            Add lesson
          </Button>
        </Grid>
        {course.lessons.map((item, index) => (
          <Grid item container spacing={5} xs={12} key={index}>
            <Grid item xs={4} container spacing={4}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Lesson Name"
                  variant="filled"
                  name="name"
                  onChange={(e) => {
                    handleChangeLesson(e, index);
                  }}
                  value={item.name}
                />
              </Grid>
              <Grid item xs={12}>
                <input
                  type="file"
                  id="video"
                  accept=".mp4"
                  onChange={(e) => {
                    handleChangeFile(e, index);
                  }}
                />
              </Grid>
            </Grid>
            <Grid item xs={8}>
              <TextField
                fullWidth
                multiline
                label="Lesson description"
                variant="filled"
                rows={5}
                name="description"
                onChange={(e) => {
                  handleChangeLesson(e, index);
                }}
                value={item.description}
              />
            </Grid>
          </Grid>
        ))}
        <Grid item xs={10}>
          <Typography variant="h4" align="left">
            Quiz
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Button variant="contained" onClick={addQuiz}>
            Add question
          </Button>
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            label="Quiz title"
            variant="filled"
            name="title"
            onChange={handleChangeQuizTitle}
            value={course.quiz.title}
          />
        </Grid>
        {course.quiz.questions.map((item, index) => (
          <Grid item xs={12} container spacing={4} key={index}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                label="Type your question here..."
                variant="filled"
                rows={2}
                name="question"
                onChange={(e) => {
                  handleChangeQuestion(e, index);
                }}
                value={item.question}
              />
            </Grid>
            <Grid item xs={12} container spacing={1}>
              <FormControl fullWidth>
                <RadioGroup
                  defaultValue={item.correctAnswer}
                  name="correctAnswer"
                  onChange={(e) => {
                    handleChangeQuestion(e, index);
                  }}
                >
                  <Grid container spacing={1} paddingLeft="20px">
                    <Grid item xs={1}>
                      <FormControlLabel
                        value="A"
                        control={<Radio />}
                        label="A"
                      />
                    </Grid>
                    <Grid item xs={11}>
                      <TextField
                        fullWidth
                        label="Quiz title"
                        variant="filled"
                        name="A"
                        onChange={(e) => {
                          handleChangeAnswer(e, index);
                        }}
                        value={item.answers.A}
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <FormControlLabel
                        value="B"
                        control={<Radio />}
                        label="B"
                      />
                    </Grid>
                    <Grid item xs={11}>
                      <TextField
                        fullWidth
                        label="Quiz title"
                        variant="filled"
                        name="B"
                        onChange={(e) => {
                          handleChangeAnswer(e, index);
                        }}
                        value={item.answers.B}
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <FormControlLabel
                        value="C"
                        control={<Radio />}
                        label="C"
                      />
                    </Grid>
                    <Grid item xs={11}>
                      <TextField
                        fullWidth
                        label="Quiz title"
                        variant="filled"
                        name="C"
                        onChange={(e) => {
                          handleChangeAnswer(e, index);
                        }}
                        value={item.answers.C}
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <FormControlLabel
                        value="D"
                        control={<Radio />}
                        label="D"
                      />
                    </Grid>
                    <Grid item xs={11}>
                      <TextField
                        fullWidth
                        label="Quiz title"
                        variant="filled"
                        name="D"
                        onChange={(e) => {
                          handleChangeAnswer(e, index);
                        }}
                        value={item.answers.D}
                      />
                    </Grid>
                  </Grid>
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
        ))}
        <Grid item xs={8} />
        <Grid item xs={4}>
          <Button size="large" variant="contained" onClick={submit}>
            Submit
          </Button>
        </Grid>
      </Grid>
    </>
  );
};
export default EditCourse;
