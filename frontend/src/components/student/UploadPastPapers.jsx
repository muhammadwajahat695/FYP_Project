import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import MainMenu from "./MainMenu";
import TopMenu from "./TopMenu";
import back from "./../../icons/back.png";
import { Link, useNavigate } from "react-router-dom";
import "./../../css/PastPapers.css";

const UploadPastPapers = () => {
  const [course_title, setCourse_title] = useState();
  const [paper_type, setPaper_type] = useState("");
  const [session, setSession] = useState("");
  const [fileName, setFileName] = useState();
  const Navigate = useNavigate();
  const onChangeFile = (e) => {
    setFileName(e.target.files[0]);
  };
  const changeonClick = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("course_title", course_title);
    formData.append("paper_type", paper_type);
    formData.append("session", session);
    formData.append("paper", fileName);

    setPaper_type("");
    setCourse_title("");
    setSession("");
    setFileName("");

    const res = await fetch("/upload_pastpapers", {
      method: "POST",
      // headers:{
      //   "Content-Type": "application/pdf"
      // },
      body: formData,
    });
    const data = res.json();
    console.log(data);
    if (!data || res.status === 400 || res.status === 500) {
      window.alert("not uploaded");
    } else {
      window.alert("uploaded");
      // Navigate("/PastPapers");
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
        <Link to="/PastPapers">
          <img src={back} alt="" className="backiconupload" />
        </Link>
        <h2 className="pastpaperstitle">Upload Past Papers</h2>
      </div>
      <div className="uploadpastpapercontainer">
        <br />
        <label className="coursetitlelabel" htmlFor="">
          Course Title
        </label>
        <br />
        <select
          className="courseinput"
          name="course_title"
          value={course_title}
          onChange={(e) => setCourse_title(e.target.value)}
          placeholder=""
          id=""
          required
        >
          <option value="" disabled selected hidden>
            Select Course Title
          </option>
          {allCourses.map((course) => (
            <option>{course.courseName}</option>
          ))}
          <option value="Game Development">Game Development</option>
          <option value="Software Project Management">
            Software Project Management
          </option>
          <option value="Multivariable Calculus">Multivariable Calculus</option>
        </select>
        <br />
        <label className="papertypelabel" htmlFor="">
          Paper Type
        </label>
        <br />
        <select
          className="courseinput"
          name="paper_type"
          value={paper_type}
          onChange={(e) => setPaper_type(e.target.value)}
          id=""
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
          value={session}
          onChange={(e) => setSession(e.target.value)}
          id=""
          placeholder=""
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
        <input
          className="uploadbutton"
          type="file"
          id=""
          filename="paper"
          onChange={onChangeFile}
          accept=".pdf"
          required
        />
        <br />
        <button className="searchbtn" onClick={changeonClick}>
          Submit
        </button>
        {/* </form> */}
      </div>
      <Footer />
    </div>
  );
};

export default UploadPastPapers;
