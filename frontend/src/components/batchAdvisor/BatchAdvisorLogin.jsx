import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserTie } from "@fortawesome/free-solid-svg-icons";
import Footer from "./../student/Footer";
import "./../../css/BatchAdvisorLogin.css";
import { Link, useNavigate } from "react-router-dom";

const BatchAdvisorLogin = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
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
    const { email, password } = user;
    const res = await fetch("/BatchAdvisorlogin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    const data = res.json();

    if (res.status === 400 || !data) {
      window.alert("invalid credentials");
    } else {
      window.alert("login successfully");
      navigate("/PendingRequests");
    }
  };
  return (
    <div className="BALogincontainer">
      <h1 className="title">Tipster</h1>
      <h3 className="tagline">A Digital Batch Advisor</h3>
      <h1 className="console">
        <FontAwesomeIcon icon={faUserTie} className="icon" />
        Batch Advisor Console
      </h1>

      <div className="container2">
        <form action="" method="POST">
          <h2 className="stdlogin">Batch Advisor Login</h2>
          <hr />
          <br />
          <input
            className="BALoginLabels"
            type="text"
            name="email"
            value={user.email}
            onChange={handleInputs}
            placeholder="Email"
          />
          <br />
          <br />
          <input
            className="BALoginLabels"
            type="password"
            name="password"
            value={user.password}
            onChange={handleInputs}
            placeholder="Password"
          />
          <br />
          {/* <Link to="/BatchAdvisorHome"> */}
          <button className="btn" onClick={loginUser}>
            Login
          </button>
          {/* </Link> */}
          <Link to="/BatchAdvisorResetPassword">
            <h4 className="forgotPassword">Forgot Password?</h4>
          </Link>
        </form>
      </div>

      <Footer />
    </div>
  );
};
export default BatchAdvisorLogin;
