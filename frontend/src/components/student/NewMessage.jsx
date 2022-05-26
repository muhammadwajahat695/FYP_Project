import React, { useState } from "react";
import MainMenu from "./MainMenu";
import TopMenu from "./TopMenu";
import Footer from "./Footer";
import "./../../css/StudentProfile.css";
import "./../../css/ChangePassword.css";
import { Link, useNavigate } from "react-router-dom";
import "./../../css/NewMessage.css";

const NewMessage = () => {
  const [newsms, setNewsms] = useState({ subject: "", message: "" });
  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setNewsms({ ...newsms, [name]: value });
  };
  const navigate = useNavigate();
  const send = async () => {
    const { subject, message } = newsms;
    if (message === "" || subject === "") {
      window.alert("invalid credentials");
    } else {
      const res = await fetch("/createchat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject,
          message,
        }),
      });
      const data = res.json();
      if (res.status === 400 || !data) {
        window.alert("invalid credentials");
      } else {
        alert("send message");
        navigate("/MailBox");
      }
    }
  };
  return (
    <div className="stdpasswordcontainer">
      <TopMenu />
      <MainMenu />
      <div className="freezesemesterdiv">
        <h2 className="freezesemestertitle">New Message</h2>
      </div>
      <div className="stdpasswordformdiv">
        <form action="">
          <label className="subjectlabel" htmlFor="">
            Subject
          </label>
          <br />
          <input
            className="subjectinput"
            type="text"
            name="subject"
            value={newsms.subject}
            onChange={handleInputs}
            required
          />
          <br />
          <label className="descriptionlabel" htmlFor="">
            Description
          </label>
          <br />
          <textarea
            name="message"
            value={newsms.message}
            onChange={handleInputs}
            className="descriptioninput"
            cols="30"
            rows="8"
            required
          ></textarea>
          <br />
          <Link to="/MailBox">
            <button className="cancelbutton">Cancel</button>
          </Link>
          <button className="sendbutton" onClick={send}>
            Send
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default NewMessage;
