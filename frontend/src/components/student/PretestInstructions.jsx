import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import MainMenu from "./MainMenu";
import TopMenu from "./TopMenu";
import back from "./../../icons/back.png";
import "./../../css/Pretest.css";
import { Link, useLocation } from "react-router-dom";

const PretestInstructions = () => {
  const location = useLocation();
  const courseName = location.state;
  //get all courses
  //get all(sos or elective) courses to check what is coursecode and credits hours
  const [allCourses, setAllCourses] = useState([]);
  const getAllCourses = async () => {
    try {
      const res = await fetch("/AllCourses", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await res.json();
      // console.log(data);
      setAllCourses(data);
      if (!res.status === 200) {
        const error = new Error(res.error);
        throw error;
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (getAllCourses.length === 0) {
      getAllCourses();
    }
  }, [allCourses]);
  //fetch the coursecode and store in usestate
  const [preTest, setPretest] = useState({});
  if (allCourses.length !== 0) {
    if (preTest.courseName !== courseName) {
      for (let i = 0; i < allCourses.length; i++) {
        if (allCourses[i].courseName === courseName) {
          const courseCode = allCourses[i].courseCode;
          const courseName = allCourses[i].courseName;
          setPretest({ ...preTest, courseCode, courseName });
        }
      }
    }
  }
  return (
    <div className="container">
      <TopMenu />
      <MainMenu />
      <div className="freezesemesterdiv">
        <h2 className="freezesemestertitle">
          <Link to="/AddCourse">
            <img src={back} alt="" className="backToAddCourse" />
          </Link>
          Pre-Test
        </h2>
      </div>
      <div className="PretestInstructionsContainer">
        <div className="innerdiv">
          <form action="">
            <p className="prereqCode">
              <b> Course Code: </b>
              {preTest.courseCode}
            </p>
            <p className="prereqTitle">
              <b> Course Title:</b> {preTest.courseName}
            </p>
            <h3>Instructions:</h3>
            <p className="instructions">Total Questions: 10</p>
            <p className="instructions">Total Marks: 10</p>
            <p className="instructions">Total Time: 15 mins</p>
            <p className="instructions">Only one attempt!</p>
            <p className="instructions">One you start you cannot pause!</p>
            <Link to={"/PretestQuestions"} state={preTest.courseName}>
              <button className="start-btn">Start</button>
            </Link>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PretestInstructions;
