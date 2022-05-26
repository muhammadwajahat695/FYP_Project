import React, { useState } from "react";
import MainMenu from "./MainMenu";
import TopMenu from "./TopMenu";
import "./../../css/FreezeSemester.css";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
const FreezeSemester = () => {
  const [user, setUser] = useState({
    reason: "",
    continuationTime: "",
  });
  let name, value;
  const handleInputs = (e) => {
    console.log(e);
    name = e.target.name;
    value = e.target.value;
    setUser({ ...user, [name]: value });
  };

  const navigate = useNavigate();
  const loginUser = async (e) => {
    e.preventDefault();
    const { reason, continuationTime } = user;
    const res = await fetch("/freezeSemester", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reason,
        continuationTime,
      }),
    });
    const data = res.json();
    if (res.status === 400 || !data) {
      window.alert("invalid credentials");
    } else {
      // return "send request successfully";
      window.alert("Request send successfully");
      navigate("/Home");
    }
  };
  return (
    <div className="container">
      <TopMenu />
      <MainMenu />
      <div className="freezesemesterdiv">
        <h2 className="freezesemestertitle">Freeze Semester</h2>
      </div>
      <div className="formdiv">
        <form action="" method="POST">
          <label className="reasonlabel" htmlFor="">
            Reason
          </label>
          <br />
          <textarea
            name="reason"
            value={user.reason}
            onChange={handleInputs}
            className="reasoninput"
            placeholder="Enter a valid reason"
            cols="30"
            rows="8"
            required
          ></textarea>
          <br />
          <label className="timelabel" htmlFor="">
            Continuation Semester
          </label>
          <br />
          <select
            className="timeinput"
            name="continuationTime"
            value={user.continuationTime}
            onChange={handleInputs}
            id=""
            placeholder=""
            required
          >
            <option value="" disabled selected hidden>
              Select a contiuation semester
            </option>
            <option value="FA22">FA22</option>
            <option value="SP23">SP23</option>
            <option value="FA23">FA23</option>
            <option value="SP24">SP24</option>
          </select>
          <br />
          {console.log(user)}
          {user.reason === "" && user.continuationTime === "" ? (
            <button className="freezebutton">Submit</button>
          ) : (
            <button className="freezebutton" onClick={loginUser}>
              Submit
            </button>
          )}
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default FreezeSemester;
