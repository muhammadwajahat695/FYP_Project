import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import MainMenu from "./MainMenu";
import TopMenu from "./TopMenu";
import "./../../css/MailBox.css";
import { Link, useLocation } from "react-router-dom";
import back from "./../../icons/back.png";
import sendMessage from "./../../icons/sendMessage.png";

const QueryThread = () => {
  const location = useLocation();
  const Student = location.state;
  const subject = Student[0];
  const name = Student[1];

  const [studentChat, setStudentChat] = useState([]);
  const chat = async () => {
    try {
      const res = await fetch(`/S_viewmessage/${subject}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setStudentChat(data);
      if (!res.status === 200) {
        console.log("no record found");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    chat();
  }, []);

  //send message
  const [sendmessage, setSendmessage] = useState({ message: "" });

  const sendsms = async () => {
    if (sendmessage.message === "") {
      console.log("error");
    } else {
      const message = sendmessage;
      console.log(message);
      const res = await fetch(`/S_sendmessage/${subject}/${message}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (res.status === 400 || !data) {
        window.alert("invalid credentials");
      } else {
        window.alert("send message successfully");
      }
    }
  };
  return (
    <div className="container">
      <TopMenu />
      <MainMenu />
      <div className="freezesemesterdiv">
        <h2 className="freezesemestertitle">
          <div>
            <Link to="/MailBox">
              <img src={back} alt="" className="backToInbox" />
            </Link>
            Query Box
          </div>
        </h2>
      </div>
      <div className="msgthreadcontainer">
        <p className="subjectHeading">
          <b>Subject:</b> {subject}
        </p>
        {studentChat.map((chat) =>
          chat.name === name ? (
            <div>
              <div className="Sent">
                {chat.message}
                <br />
                <p className="time">{chat.date}</p>
              </div>
            </div>
          ) : (
            <div>
              <div className="Received">
                {chat.message}
                <br />
                <p className="time">{chat.date}</p>
              </div>
            </div>
          )
        )}
      </div>
      <div className="msgTextAreaContainer">
        <form action="">
          <textarea
            name="message"
            value={sendMessage.message}
            onChange={(e) => setSendmessage(e.target.value)}
            id=""
            cols="100"
            rows="1"
            className="msgTextArea"
          ></textarea>
          <img
            src={sendMessage}
            alt=""
            className="sendMessageIcon"
            onClick={sendsms}
          />
        </form>
      </div>
      <Footer />
    </div>
  );
};
export default QueryThread;
