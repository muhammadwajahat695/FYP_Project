import React, { useState, useEffect } from "react";
import BatchAdvisorMainMenu from "./BatchAdvisorMainMenu";
import BatchAdvisorTopMenu from "./BatchAdvisorTopMenu";
import Footer from "./../student/Footer";
import deleteicon from "./../../icons/deleteicon.png";
import { Link } from "react-router-dom";
import DeleteMessagePopup from "./../student/DeleteMessagePopup";
import "./../../css/BatchAdvisorQueryBox.css";

const BatchAdvisorMailBox = () => {
  const [querybox, setQuerybox] = useState([]);
  const Querybox = async () => {
    try {
      const res = await fetch("/BA_viewmessages", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await res.json();
      setQuerybox(data);
      if (!res.status === 200) {
        const error = new Error(res.error);
        throw error;
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    Querybox();
  }, []);
  //Delete Chat
  const [deleteChat, setDeleteChat] = useState([]);
  const deleteSubmit = async () => {
    const registrationId = deleteChat[0];
    const subject = deleteChat[1];
    console.log(subject, registrationId);
    const res = await fetch(`/BA_deleteChat/${registrationId}/${subject}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify({

      // })
    });
    const data = res.json();
    if (res.status === 400 || !data) {
      window.alert("invalid credentials");
    } else {
      window.alert("send request successfully");
    }
  };
  const [buttonPopup, setButtonPopup] = useState(false);
  return (
    <div className="BAprofilecontainer">
      <BatchAdvisorTopMenu />
      <BatchAdvisorMainMenu />
      <div className="menuheadingdiv">
        <h2 className="freezesemestertitle">Query Box</h2>
      </div>
      <div className="receivedmsgscontainer">
        <table style={{ width: "100%", marginLeft: "0px" }}>
          <tr>
            <th className="stdRegCol">Reg. No</th>
            <th className="stdNameCol">Name</th>
            <th className="highlightedCol">Subject</th>
            <th className="dateCol">Date</th>
            <th className="delCol">Delete</th>
          </tr>
          {querybox.map((query) => (
            <tr>
              <td className="highlightedRow">
                {/* <Link to={"/StudentTranscript"} state={students.registrationId}>
                <img className="nexticon" src={next} alt="" />
              </Link> */}
                <Link
                  to={"/BatchAdvisorQueryThread"}
                  state={[
                    query.registrationId,
                    query.subject,
                    query.chat[0].name,
                  ]}
                  className="highlightedRow"
                >
                  {query.registrationId}
                </Link>
              </td>
              <td className="highlightedRow">
                <Link
                  to={"/BatchAdvisorQueryThread"}
                  state={[
                    query.registrationId,
                    query.subject,
                    query.chat[0].name,
                  ]}
                  className="highlightedRow"
                >
                  {query.chat[0].name}
                </Link>
              </td>
              <td>
                <Link
                  to={"/BatchAdvisorQueryThread"}
                  state={[
                    query.registrationId,
                    query.subject,
                    query.chat[0].name,
                  ]}
                  className="highlightedRow"
                >
                  {query.subject}
                </Link>
              </td>
              <td className="tablerows">
                <Link
                  to={"/BatchAdvisorQueryThread"}
                  state={[
                    query.registrationId,
                    query.subject,
                    query.chat[0].name,
                  ]}
                  className="highlightedRow"
                >
                  {query.chat[0].date}
                </Link>
              </td>
              <td className="tablerows">
                <img
                  src={deleteicon}
                  alt=""
                  className="AddedCourseDelBtn"
                  onClick={() => {
                    setButtonPopup(true);
                    setDeleteChat([query.registrationId, query.subject]);
                  }}
                />
              </td>
            </tr>
          ))}
        </table>
      </div>
      <Footer />
      <DeleteMessagePopup trigger={buttonPopup} setTrigger={setButtonPopup}>
        <form action="">
          <h3 className="DeleteConfirmation">
            Are you sure you want to delete this query?
          </h3>
          <button className="DeleteAddedCourseButton " onClick={deleteSubmit}>
            Delete
          </button>
        </form>
      </DeleteMessagePopup>
    </div>
  );
};

export default BatchAdvisorMailBox;
