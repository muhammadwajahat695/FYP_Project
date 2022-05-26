import React from "react";
import "./../css/LandingPage.css";
import student from "./../icons/student.png";
import batchadvisor from "./../icons/batchadvisor.png";
import { Link } from "react-router-dom";
document.body.style.backgroundColor = "white";
const LandingPage = () => {
  return (
    <div className="Lpcontainer">
      <div className="LpTitle">
        <h1 className="LandingPagetitle">Tipster</h1>
        <h3 className="LandingPagetagline">A Digital Batch Advisor</h3>
      </div>
      <h1 className="loginAs">Login As</h1>
      <Link to="/StudentLogin">
        <div className="studentdiv">
          <img className="LPicon" src={student} alt="" />
          <h2 className="student">Student</h2>
        </div>
      </Link>
      <Link to="/BatchAdvisorLogin">
        <div className="batchadvisordiv">
          <img className="LPicon" src={batchadvisor} alt="" />
          <h2 className="student">
            Batch <br /> Advisor
          </h2>
        </div>
      </Link>
    </div>
  );
};

export default LandingPage;
