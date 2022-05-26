import React, { useState, useEffect } from "react";
import Footer from "../student/Footer";
import BatchAdvisorMainMenu from "./BatchAdvisorMainMenu";
import BatchAdvisorTopMenu from "./BatchAdvisorTopMenu";
import "./../../css/MailBox.css";
import { Link, useLocation } from "react-router-dom";
import back from "./../../icons/back.png";
import sendMessage from "./../../icons/sendMessage.png";

const BatchAdvisorQueryThread = () => {
  const location = useLocation();
  const Student = location.state;
  const subject = Student[1];
  const registrationId = Student[0];
  const name = Student[2];
  console.log(name);

  const [batchAdvisorChat, setBatchAdvisorchat] = useState([]);
  const chat = async () => {
    try {
      const res = await fetch(`/BA_viewmessages/${registrationId}/${subject}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setBatchAdvisorchat(data);
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
      const res = await fetch(
        `/BA_messageReply/${registrationId}/${subject}/${message}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (res.status === 400 || !data) {
        window.alert("invalid credentials");
      } else {
        window.alert("send message successfully");
      }
    }
  };

  return (
    <div className="BAprofilecontainer">
      <BatchAdvisorTopMenu />
      <BatchAdvisorMainMenu />
      <div className="menuheadingdiv">
        <h2 className="freezesemestertitle">
          <div>
            <Link to="/BatchAdvisorMailBox">
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
        {batchAdvisorChat.map((chat) =>
          chat.name !== name ? (
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
            value={sendmessage.message}
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
export default BatchAdvisorQueryThread;
