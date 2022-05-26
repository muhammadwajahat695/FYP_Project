import React, { useEffect, useState } from "react";
import Footer from "../student/Footer";
import BatchAdvisorMainMenu from "./BatchAdvisorMainMenu";
import BatchAdvisorTopMenu from "./BatchAdvisorTopMenu";
import next from "./../../icons/next.png";
import { Link } from "react-router-dom";
import "./../../css/StudentsInformation.css";

const StudentsInformation = () => {
  const [student, setStudent] = useState([]);

  const getstudentdata = async () => {
    try {
      const res = await fetch("/StudentsInformations", {
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
        const error = new Error(res.error);
        throw error;
      }
    } catch (error) {
      console.log(error);
    }
  };
  //  const [studentResult,setStudentResult]=useState({})
  //     const submit= async (_id)=>{
  //       const res = await fetch(`/StudentResult/${_id}`, {
  //         method: "GET",
  //         headers:{
  //           Accept:"application/json",
  //           "Content-Type":"application/json"
  //         },
  //         credentials:"include"
  //       })
  //       const data = await res.json();
  //       if(!data){
  //         window.alert("no record found")
  //       }
  //       setStudentResult(data)
  //       console.log(data)
  //     }
  useEffect(() => {
    getstudentdata();
  }, []);

  return (
    <div className="BAprofilecontainer">
      <BatchAdvisorTopMenu />
      <BatchAdvisorMainMenu />
      <div className="menuheadingdiv">
        <h2 className="freezesemestertitle">Students Information</h2>
      </div>
      <table>
        <tr>
          <th className="regCol">Registration No.</th>
          <th className="nameCol">Name</th>
          <th className="secCol">Section</th>
          <th className="emailCol">Email</th>
          <th className="cgpaCol">CGPA</th>
          <th className="transCol">Transcript</th>
        </tr>
        {student.map((students) => (
          <tr>
            <td>{students.registrationId}</td>
            <td>{students.name}</td>
            <td>{students.section}</td>
            <td>{students.email}</td>
            <td>{students.Result[0].CGPA}</td>
            <td>
              {/* <button onClick={()=>submit(students._id)}>View </button> */}
              <Link to={"/StudentTranscript"} state={students.registrationId}>
                <img className="nexticon" src={next} alt="" />
              </Link>
            </td>
          </tr>
        ))}
      </table>
      <Footer />;
    </div>
  );
};

export default StudentsInformation;
