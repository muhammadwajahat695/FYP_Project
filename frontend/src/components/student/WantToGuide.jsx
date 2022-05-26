import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import MainMenu from "./MainMenu";
import TopMenu from "./TopMenu";
import back from "./../../icons/back.png";
import deleteicon from "./../../icons/deleteicon.png";
import { Link, useNavigate } from "react-router-dom";
// import { map } from 'rxjs/operators';
import "./../../css/GuidanceBox.css";

const WantToGuide = () => {
  const navigate = useNavigate();
  //in which course you want to guide
  const submit = async (course) => {
    const res = await fetch(`/want-to-guide/${course}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        course,
      }),
    });
    const data = res.json();

    if (res.status === 400 || !data) {
      window.alert("invalid credentials");
    } else {
      window.alert("course updated");
      navigate("/WantToGuide");
    }
  };

  //get the data
  const [coursedata, setCourseData] = useState([]);
  const wanttoguide = async () => {
    try {
      const res = await fetch("/guide_courses", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await res.json();
      setCourseData(data.courses);
      if (res.status === 400) {
        const error = new Error(res.error);
        throw error;
      }
    } catch (error) {
      console.log(error);
      navigate("/WantToGuide");
    }
  };

  useEffect(() => {
    //we can not use async function in useEffect
    wanttoguide();
  }, []);
  //checkbox
  const [checked, setChecked] = useState({
    check: false,
  });

  const chec = async (add) => {
    setChecked(add);
    const res = await fetch(`/wantToGuide_contact/${add}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    if (res.status === 400 || !data) {
      // window.alert("invalid credentials")
    } else {
      // window.alert("course updated")
      navigate("/WantToGuide");
    }
  };
  const checkBox = async () => {
    try {
      const res = await fetch("/guide_courses", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await res.json();

      if (data.contactNo === "--") {
        let check = false;
        setChecked({ ...checked, check });
      } else {
        let check = true;
        setChecked({ ...checked, check });
      }
      if (res.status === 400) {
        const error = new Error(res.error);
        throw error;
      }
    } catch (error) {
      console.log(error);
      navigate("/WantToGuide");
    }
  };
  useEffect(() => {
    // if (handleCheck) {
    checkBox();
    // }
  }, []);

  //for delete courses
  const delcourse = async (course) => {
    try {
      const res = await fetch(`/delete_course/${course}`, {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          course,
        }),
      });
      const data = res.json();

      if (res.status === 400 || !data) {
        window.alert("invalid credentials");
      } else {
        window.alert(`delete ${course} successfully`);
        navigate("/WantToGuide");
      }
    } catch (error) {
      console.log(error);
    }
  };

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
    getAllCourses();
  }, []);
  return (
    <div className="container">
      <TopMenu />
      <MainMenu />
      <div className="pastpapersdiv">
        <Link to="/GuidanceBox">
          <img src={back} alt="" className="backiconwant" />
        </Link>
        <h2 className="pastpaperstitle">Want to Guide?</h2>
      </div>
      <div className="wanttoguidecontainer">
        <form action="" method="POST">
          <br />
          <label className="courselabel" htmlFor="">
            Course 1
          </label>
          <br />
          <select
            className="courseinput"
            id=""
            name="course"
            onChange={(e) => submit(e.target.value)}
            placeholder=""
            required
          >
            <option value="" disabled selected hidden>
              Select Course 1
            </option>
            {allCourses.map((course) => (
              <option>{course.courseName}</option>
            ))}
          </select>
          <br />
          <input
            type="checkbox"
            className="contactcheckbox"
            name="check"
            checked={checked.check}
            onClick={(e) => chec(e.target.checked)}
          />
          <label htmlFor="" className="contactcheckboxlabel">
            I also want to share my phone number
          </label>
        </form>
      </div>
      <div className="guidancetablecontainer">
        {coursedata.length === 0 ? (
          <h3 className="norec">No record found!</h3>
        ) : (
          <form action="" method="GET">
            <table className="wanttoguidetable">
              <tr>
                <th className="coursecol">Course Title</th>
                <th className="delcol">Delete</th>
              </tr>
              {coursedata.map((courses) => (
                <tr>
                  <td className="row" name="course">
                    {courses.course}
                  </td>
                  <td className="row">
                    <img
                      src={deleteicon}
                      onClick={() => delcourse(courses.course)}
                      alt=""
                      className="delbtn"
                    />
                  </td>
                </tr>
              ))}
            </table>
          </form>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default WantToGuide;
