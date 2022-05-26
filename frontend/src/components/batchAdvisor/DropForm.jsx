import React, { useState, useEffect } from "react";
import Footer from "../student/Footer";
import BatchAdvisorMainMenu from "./BatchAdvisorMainMenu";
import BatchAdvisorTopMenu from "./BatchAdvisorTopMenu";
import deleteicon from "./../../icons/deleteicon.png";
import "./../../css/PendingRequests.css";
import RejectRequestPopup from "./RejectRequestPopup";
import { useLocation, useNavigate } from "react-router-dom";

const DropForm = (props) => {
  const location = useLocation();
  const registrationId = location.state;
  const [first, setfirst] = useState([]);
  // console.log("sfddsf",first)
  const [dropform, setDropform] = useState([]);
  const Navigate = useNavigate;
  useEffect(() => {
    //we can not use async function in useEffect
    adddropform();
  }, []);
  const adddropform = async () => {
    try {
      const res = await fetch(`/Drop_Form/${registrationId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();
      console.log(data);
      setDropform(data);
      setfirst(data.courses);

      if (!res.status === 200) {
        const error = new Error(res.error);
        throw error;
      }
    } catch (error) {
      console.log(error);
      // navigate("");
    }
  };
  const [reject, setReject] = useState({ reason: "" });
  const [reject1, setReject1] = useState({ courseName: "" });
  const [buttonPopup, setButtonPopup] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const reason = reject;
    const courseName = reject1;
    const res = await fetch("/delete_DropRequest", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reason: reason,
        courseName: courseName,
        registrationId,
      }),
    });
    const data = res.json();
    if (res.status === 400 || !data) {
      window.alert("invalid credentials");
    } else {
      window.alert("drop course request send");
      setButtonPopup(false);
    }
  };

  //on accept drop request
  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/dropcoursess_submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        registrationId,
      }),
    });
    const data = res.json();
    if (res.status === 400 || !data) {
      window.alert("invalid credentials");
    } else {
      window.alert("Accept successfully");
      Navigate("ApprovedRequests");
      // setButtonPopup(false)
    }
  };
  return (
    <div className="BAprofilecontainer">
      <BatchAdvisorTopMenu />
      <BatchAdvisorMainMenu />
      <div className="menuheadingdiv">
        <h2 className="freezesemestertitle">Drop Form</h2>
      </div>
      <div className="AddDropFormContainer">
        <form action="">
          <div className="credentials">
            <h3 className="formLabel">Name: </h3>
            <h3 className="formDataName1">{dropform.name}</h3>
          </div>
          <div className="credentials">
            <h3 className="formLabel">Reg No:</h3>
            <h3 className="formData1">{dropform.registrationId}</h3>
          </div>
          <div className="credentials">
            <h3 className="formLabel">Section:</h3>
            <h3 className="formData1">{dropform.section}</h3>
          </div>
          <div className="credentials">
            <h3 className="formLabel">Email:</h3>
            <h3 className="formDataEmail1">{dropform.email}</h3>
          </div>
          <div className="credentials">
            <h3 className="formLabel">CGPA:</h3>
            <h3 className="formDataCgpa1">{dropform.CGPA}</h3>
          </div>
          <div className="credentials">
            <h3 className="formLabel">Contact:</h3>
            <h3 className="formDataContact1">{dropform.contactNo}</h3>
          </div>
          <table className="AddDropTable">
            <tr>
              <th className="formCourseCode">Course Code</th>
              <th className="formCourseTitle">Course Title</th>
              <th className="formCredits">Credits</th>
              <th className="formSection">Section</th>
              <th className="formReason">Reason</th>
              <th className="formReject">Reject</th>
            </tr>
            {first.map((course) => (
              <tr>
                <td className="formCourseCode">{course.courseCode}</td>
                <td className="formCourseTitle">{course.courseName}</td>
                <td className="formCredits">{course.credits}</td>
                <td className="formSection">{dropform.section}</td>
                <td className="formReason">{course.reason}</td>
                <td className="formReject">
                  <img
                    src={deleteicon}
                    alt=""
                    className="dropbtn"
                    onClick={() => {
                      setButtonPopup(true);
                      setReject1(course.courseName);
                    }}
                  />
                </td>
              </tr>
            ))}
          </table>
          <button className="acceptBtn" onClick={onSubmit}>
            Accept
          </button>
        </form>
      </div>
      <Footer />
      <RejectRequestPopup trigger={buttonPopup} setTrigger={setButtonPopup}>
        <form action="">
          <label htmlFor="" className="dropreasonlabel">
            Reason
          </label>
          <br />
          <textarea
            name="reason"
            value={reject.reason}
            onChange={(e) => setReject(e.target.value)}
            className="dropreasoninput"
            placeholder="Enter a reason to reject this request"
            cols="40"
            rows="5"
            required
          ></textarea>
          <br />
          <button className="rejectBtn" onClick={submit}>
            Reject
          </button>
        </form>
      </RejectRequestPopup>
    </div>
  );
};

export default DropForm;
