import React, { useState, useEffect } from "react";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import "./../../css/StudentTranscript.css";
import leftarrow from "./../../icons/leftarrow.png";
import { useLocation } from "react-router-dom";

const StudentTranscript = (props) => {
  const [student, setStudent] = useState([]);
  const location = useLocation();
  const registrationId = location.state;
  const resultcard = async () => {
    try {
      const res = await fetch(`/student_result/${registrationId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      // console.log(data);
      setStudent(data);

      if (!res.status === 200) {
        // navigate("/StudentLogin")
        console.log("no record found");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    resultcard();
  }, []);
  //semester
  // const [sem,setSem]=useState()
  // const semester=async()=>{
  //   if(student)
  // }
  // useEffect(()=>{
  //   if(student.length!=0){
  //     semester()
  //   }
  // },[])
  // console.log(student);
  return (
    <Fragment>
      <Link to="/StudentsInformation">
        <img className="arrowIcon" src={leftarrow} alt="" />
      </Link>
      <div className="transcriptContainer">
        <h1 className="transcript">Transcript</h1>
        <h3 className="datalabel">Name: </h3>
        <h3 className="data">Muhammad Waleed</h3>
        <br />
        <h3 className="datalabel">Registration No:</h3>
        <h3 className="data">FA18-BCS-141</h3>
        <br />
        <h3 className="datalabel">Section:</h3>
        <h3 className="data">FA18-BCS-A</h3>
        <br />
        <br />
        <div>
          <h3 className="semlabel">Semester1</h3>
          <table className="transcriptTable">
            <tr>
              <th className="codeCol">Course Code</th>
              <th className="titleCol">Course Title</th>
              <th className="creditCol">Credits</th>
              <th className="GPCol">GP</th>
            </tr>
            {student.map((sem) => (
              <tr>
                <td>{sem.courseCode}</td>
                <td>{sem.courseName}</td>
                <td>{sem.credits}</td>
                <td>{sem.gp}</td>
              </tr>
            ))}
          </table>
        </div>

        <br />
        <h3 className="semlabel">CGPA:</h3>
        <h3 className="sem">3.07</h3>
      </div>
    </Fragment>
  );
};

export default StudentTranscript;
