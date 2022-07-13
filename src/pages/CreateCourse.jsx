import axios from "axios";
import React, { useEffect, useState } from "react";
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
import Swal from "sweetalert2";

const CreateCourse = () => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

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
        api.find((e) => e.pages === "Category").api["get-all-categories"],
        axiosConfig
      );
      setCategories(res.data.result);
      setLoading(false);
    };

    getData();
  }, []);

  return (
    <div>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card_body">
              {loading ? <BarWave /> : <Content categories={categories} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Content = (props) => {
  const [course, setCourse] = useState({
    name: "",
    description: "",
    image: "",
    categoryId: "",
    lessons: [],
    quiz: {
      title: "",
      questions: [],
    },
  });

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

  // Submit
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${localStorage.getItem("token-admin")}`,
    },
  };

  const submit = async () => {
    console.log(JSON.stringify(course));
    const res = await axios.post(
      api.find((e) => e.pages === "Khóa học").api["add-course"],
      course,
      axiosConfig
    );

    if (res.data.code === 200)
      Swal.fire("Done", "Course has been uploaded successfully", "success");
    else
      Swal.fire(
        "Error",
        "Something happened, check infomations and try again, glhf!",
        "error"
      );
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
            <TextField
              fullWidth
              label="Course image uri"
              variant="filled"
              name="image"
              onChange={handleChange}
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
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Lesson video uri"
                  variant="filled"
                  name="video"
                  onChange={(e) => {
                    handleChangeLesson(e, index);
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
              />
            </Grid>
            <Grid item xs={12} container spacing={1}>
              <FormControl fullWidth>
                <RadioGroup
                  defaultValue="A"
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
export default CreateCourse;
