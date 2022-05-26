import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import MainMenu from "./MainMenu";
import TopMenu from "./TopMenu";
import back from "./../../icons/back.png";
import "./../../css/PastPapers.css";
import pdf from "./../../icons/pdf.png";
import { Link } from "react-router-dom";

const ViewPastPapers = () => {
  const [userData, setUserData] = useState({
    course_title: "",
    paper_type: "",
    session: "",
  });
  const [view, setView] = useState([]);
  let name, value;
  const handleinputs = (e) => {
    console.log(e);
    name = e.target.name;
    value = e.target.value;
    setUserData({ ...userData, [name]: value });
  };
  const submit = async (e) => {
    e.preventDefault();
    const { course_title, paper_type, session } = userData;
    console.log(course_title);
    const res = await fetch(
      `/papers/${course_title}/${paper_type}/${session}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    const data = await res.json();
    if (!data || data.length === 0) {
      setView(null);
      window.alert("no record found");
    }
    setView(data);
    console.log(data);
    window.alert("view");
  };
  const [pathfile, setPathfile] = useState({});
  useEffect(() => {});
  const delcourse = async (_id) => {
    const res = await fetch(`/papers/${_id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await res.json();
    if (!data) {
      window.alert("no record found");
    }
    setPathfile(data);

    console.log(data);
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
        <Link to="/PastPapers">
          <img src={back} alt="" className="backiconview" />
        </Link>
        <h2 className="pastpaperstitle">View Past Papers</h2>
      </div>
      <div className="viewpastpapercontainer">
        <form action="" method="GET">
          <br />
          <br />
          <br />
          <label className="coursetitlelabel" htmlFor="">
            Course Title
          </label>
          <br />
          <select
            className="courseinput"
            name="course_title"
            id=""
            placeholder=""
            value={userData.course_title}
            onChange={handleinputs}
            required
          >
            <option value="" disabled selected hidden>
              Select Course Title
            </option>
            {allCourses.map((course) => (
              <option>{course.courseName}</option>
            ))}
          </select>
          <br />
          <label className="papertypelabel" htmlFor="">
            Paper Type
          </label>
          <br />
          <select
            className="courseinput"
            name="paper_type"
            id=""
            value={userData.paper_type}
            onChange={handleinputs}
            placeholder=""
            required
          >
            <option value="" disabled selected hidden>
              Select Paper Type
            </option>
            <option value="Mid Term">Mid Term, S1, S2</option>
            <option value="Terminal">Terminal</option>
          </select>
          <br />
          <label className="sessionlabel" htmlFor="">
            Session
          </label>
          <br />
          <select
            className="courseinput"
            name="session"
            id=""
            placeholder=""
            value={userData.session}
            onChange={handleinputs}
            required
          >
            <option value="" disabled selected hidden>
              Select Session
            </option>
            <option value="SP22">SP22</option>
            <option value="FA21">FA21</option>
            <option value="SP21">SP21</option>
            <option value="FA20">FA20</option>
            <option value="SP20">SP20</option>
            <option value="FA19">FA19</option>
            <option value="SP19">SP19</option>
            <option value="FA20">FA18</option>
            <option value="SP18">SP18</option>
            <option value="FA17">FA17</option>
            <option value="SP17">SP17</option>
            <option value="FA16">FA16</option>
            <option value="SP16">SP16</option>
            <option value="FA15">FA15</option>
            <option value="SP15">SP15</option>
          </select>
          <br />
          <button className="searchbtn" onClick={submit}>
            Search
          </button>
        </form>
      </div>
      <div className="paperpdfscontainer">
        {view == "" ? (
          <h3 className="norecords">No record found!</h3>
        ) : (
          <form action="" method="GET">
            <div className="needguidancetable">
              {view.map((papers) => (
                <div className="pdffilesdiv">
                  <a
                    href={pathfile.paper}
                    target="_blank"
                    rel="noreferrer"
                    className="pdffiles"
                    onClick={() => {
                      delcourse(papers._id);
                    }}
                  >
                    <img className="pdficon" src={pdf} alt="" />
                    {papers.paper_name}
                  </a>
                </div>
              ))}
            </div>
          </form>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ViewPastPapers;
