import React, { useState, useEffect } from "react";
import Footer from "../student/Footer";
import emailjs from "emailjs-com";
import BatchAdvisorMainMenu from "./BatchAdvisorMainMenu";
import BatchAdvisorTopMenu from "./BatchAdvisorTopMenu";
import "./../../css/PendingRequests.css";
import RejectRequestPopup from "./RejectRequestPopup";
import { useNavigate, useLocation } from "react-router-dom";

const FreezeSemesterForm = () => {
  const [result, ShowResult] = useState(false);
  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "FreezeSemester_Service",
        "FreezeSemester_Email",
        e.target,
        "user_8Oqr3FKbWRDqndN2Yr0x7"
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
    e.target.reset();
    ShowResult(true);
  };
  const location = useLocation();
  const registrationId = location.state;
  console.log(registrationId);
  const Navigate = useNavigate();
  const [freezeForm, setFreezeForm] = useState([]);
  useEffect(() => {
    //we can not use async function in useEffect
    FreezeForm();
  }, []);
  const FreezeForm = async () => {
    try {
      const res = await fetch(`/Freeze_Form/${registrationId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();
      console.log(data);
      setFreezeForm(data);

      if (!res.status === 200) {
        const error = new Error(res.error);
        throw error;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [reject, setReject] = useState({ reason: "" });

  const [buttonPopup, setButtonPopup] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const res = await fetch("/FreezeSemester_reject", {
      method: "DELETE",
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
      window.alert("Freeze Semester Request has been rejected");
      setButtonPopup(false);
      Navigate("/PendingRequests");
    }
  };
  //accept button
  const submit_A = async (e) => {
    e.preventDefault();
    const res = await fetch("/FreezeSemester_reject", {
      method: "DELETE",
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
      window.alert("Freeze Semester Request has been Accepted");
      Navigate("/PendingRequests");
    }
  };
  const Result = () => {
    return (
      <div className="respdiv">
        <p className="response">A mail has been sent to the DCO!</p>;
      </div>
    );
  };
  return (
    <div className="BAprofilecontainer">
      <BatchAdvisorTopMenu />
      <BatchAdvisorMainMenu />
      <div className="menuheadingdiv">
        <h2 className="freezesemestertitle">Freeze Form</h2>
      </div>
      <div className="FreezeSemesterFormContainer">
        <form action="" onSubmit={sendEmail}>
          <div className="credentials">
            <h3 className="formLabel">Name: </h3>
            <input
              type="text"
              name="name"
              className="formDataName"
              value={freezeForm.name}
            />
          </div>
          <div className="credentials">
            <h3 className="formLabel">Reg No:</h3>
            <input
              type="text"
              name="regno"
              className="formData"
              value={freezeForm.registrationId}
            />
          </div>
          <div className="credentials">
            <h3 className="formLabel">Section:</h3>
            <input
              type="text"
              name="section"
              className="formData"
              value={freezeForm.section}
            />
          </div>
          <div className="credentials">
            <h3 className="formLabel">Email:</h3>
            <input
              type="text"
              name="email"
              className="formDataEmail"
              value={freezeForm.email}
            />
          </div>
          <div className="credentials">
            <h3 className="formLabel">CGPA:</h3>
            <input
              type="text"
              name="cgpa"
              className="formDataCgpa"
              value={freezeForm.CGPA}
            />
          </div>
          <div className="credentials">
            <h3 className="formLabel">Contact:</h3>
            <input
              type="text"
              name="contact"
              className="formDataContact"
              value={freezeForm.contactNo}
            />
          </div>
          <div className="credentials2">
            <h3 className="formLabel">Continuation Semester:</h3>
            <input
              type="text"
              name="continuationtime"
              className="FreezeTime"
              value={freezeForm.continuationTime}
            />
          </div>
          <h3 className="formreasonLabel">Reason:</h3>
          <div className="credentials3">
            <textarea
              cols={37}
              rows={10}
              type="text"
              name="reason"
              className="FreezeFormReason"
              value={freezeForm.reason}
            />
          </div>
          <button className="FreezeAcceptBtn" onClick={submit_A}>
            Accept
          </button>
        </form>
        <div className="rejectbtndiv">
          <button
            className="FreezeRejectBtn"
            onClick={() => setButtonPopup(true)}
          >
            Reject
          </button>
        </div>
        <div>{result ? <Result /> : null}</div>
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
          <br />
        </form>
      </RejectRequestPopup>
    </div>
  );
};

export default FreezeSemesterForm;
