import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import MainMenu from "./MainMenu";
import TopMenu from "./TopMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import "./../../css/MailBox.css";
import deleteicon from "./../../icons/deleteicon.png";
import { Link } from "react-router-dom";
import DeleteMessagePopup from "./DeleteMessagePopup";

const MailBox = () => {
  const [querybox, setQuerybox] = useState([]);
  const Querybox = async () => {
    try {
      const res = await fetch("/S_viewmessage", {
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
  const [deleteChat, setDeleteChat] = useState("");
  const deleteSubmit = async () => {
    const subject = deleteChat;
    console.log(subject);
    const res = await fetch(`/S_deleteChat/${subject}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
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
    <div className="container">
      <TopMenu />
      <MainMenu />
      <div className="freezesemesterdiv">
        <h2 className="freezesemestertitle">Mail Box</h2>
      </div>
      <div className="receivedmsgscontainer">
        <table style={{ width: "100%", marginLeft: "0px" }}>
          <tr>
            <th className="subjectCol">Subject</th>
            <th className="dateCol">Date</th>
            <th className="delCol">Delete</th>
          </tr>
          {querybox.map((query) => (
            <tr>
              <td>
                <Link
                  to={"/QueryThread"}
                  state={[query.subject, query.chat[0].name]}
                  className="subjectRow"
                >
                  {query.subject}
                </Link>
              </td>

              <td className="tablerows">
                <Link
                  to={"/QueryThread"}
                  state={[query.subject, query.chat[0].name]}
                  className="subjectRow"
                >
                  {query.registrationId}
                </Link>
              </td>
              <td className="tablerows">
                <img
                  src={deleteicon}
                  alt=""
                  className="AddedCourseDelBtn"
                  onClick={() => {
                    setButtonPopup(true);
                    setDeleteChat(query.subject);
                  }}
                />
              </td>
            </tr>
          ))}
        </table>
      </div>
      <Link to="/NewMessage">
        <div className="composeicondiv">
          <button className="composebtn">
            <FontAwesomeIcon icon={faPlusSquare} className="composeicon" />
            Compose
          </button>
        </div>
      </Link>
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

export default MailBox;
