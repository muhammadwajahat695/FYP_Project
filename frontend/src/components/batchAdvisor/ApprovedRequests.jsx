import React, { useState, useEffect } from "react";
import Footer from "../student/Footer";
import BatchAdvisorMainMenu from "./BatchAdvisorMainMenu";
import BatchAdvisorTopMenu from "./BatchAdvisorTopMenu";
import del from "./../../icons/deleteicon.png";
// import print from "./../../icons/printer.png";
import "./../../css/ApprovedRequests.css";
import DeleteAddedCoursePopup from "./../student/DeleteAddedCoursePopup.jsx";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

const ApprovedRequests = () => {
  const [userData, setUserData] = useState([]);
  // const navigate= useNavigate();
  const S_Profile = async () => {
    try {
      const res = await fetch("/approvedRequest", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();
      console.log(data);
      setUserData(data);

      if (!res.status === 200) {
        const error = new Error(res.error);
        throw error;
      }
    } catch (error) {
      console.log(error);
      // navigate("/");
    }
  };
  useEffect(() => {
    //we can not use async function in useEffect
    S_Profile();
  }, []);

  const deleted = async (_id) => {
    const res = await fetch(`/delete/${_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id,
      }),
    });
    const data = res.json();
    if (res.status === 400 || !data) {
      window.alert("invalid credentials");
    } else {
      window.alert(`delete ${_id} successfully`);
      // navigate("/WantToGuide")
    }
  };

  const [buttonPopup, setButtonPopup] = useState(false);
  return (
    <div className="BAprofilecontainer">
      <BatchAdvisorTopMenu />
      <BatchAdvisorMainMenu />
      <div className="menuheadingdiv">
        <h2 className="ApprovedRequeststitle">Approved Requests</h2>
        {/* <img className="printIcon" src={print} alt="" /> */}
      </div>

      <form action="">
        <table className="pendingTable" id="table-to-xls">
          <tr>
            <th className="ARregno">Reg No</th>
            <th className="ARname">Name</th>
            <th className="ARcode">Course Code</th>
            <th className="ARtitle">Course Title</th>
            <th className="ARcredits">Credits</th>
            <th className="ARsection">Section</th>
            <th className="ARrequest">Action</th>
            <th className="ARdel">Delete</th>
          </tr>
          {userData.map((approved) => (
            <tr>
              <td className="ARregno">{approved.registrationId}</td>
              <td className="ARname">{approved.name}</td>
              <td className="ARcode">{approved.courseCode}</td>
              <td className="ARtitle">{approved.courseName}</td>
              <td className="ARcredits">{approved.credits}</td>
              <td className="ARsection">{approved.section}</td>
              <td className="ARrequest">{approved.action}</td>
              <td className="ARdel">
                <img
                  className="tooltip"
                  src={del}
                  alt=""
                  // onClick={() => {setButtonPopup(true);deleted(approved._id)}}
                  onClick={() => deleted(approved._id)}
                />
              </td>
            </tr>
          ))}
        </table>
        {/* <button className="delAll" onClick={() => setButtonPopup(true)}>
          Delete All
        </button> */}
        <ReactHTMLTableToExcel
          id="test-table-xls-button"
          className="print"
          table="table-to-xls"
          filename="Add/Drop List"
          sheet="tablexls"
          buttonText="Download"
        />
      </form>
      <Footer />
      <DeleteAddedCoursePopup trigger={buttonPopup} setTrigger={setButtonPopup}>
        <form action="">
          <h3 className="DeleteConfirmation">
            Are you sure you want to delete this request?
          </h3>
          <button className="DeleteAddedCourseButton ">Delete</button>
        </form>
      </DeleteAddedCoursePopup>
    </div>
  );
};

export default ApprovedRequests;
