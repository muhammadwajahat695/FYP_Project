import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGraduate } from "@fortawesome/free-solid-svg-icons";
import Footer from "./Footer";
import "./../../css/StudentLogin.css";
import { Link, useNavigate } from "react-router-dom";



const StudentLogin = () => {
  // const [batch, setBatch] = useState("");
  // const [degree, setDegree] = useState("");
  // const [roll_no, setRoll_no] = useState("");
  // const [password, setPassword] = useState("");
  const [user,setUser]=useState({
    batch:"",regNo:"",password:""
  });
  let name,value;
  const handleInputs=(e)=>{
    console.log(e);
    name=e.target.name;
    value=e.target.value;
    setUser({...user,[name]:value});
  }

  const navigate = useNavigate();
  const loginUser = async (e) => {
    e.preventDefault();
    const {batch,regNo,password}=user;
    const res = await fetch("/Studentlogin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        batch: batch,
        regNo: regNo,
        password: password
      })
    })
    const data = res.json();
    if (res.status === 400 || !data) {
      window.alert("invalid credentials")
    } else {
      window.alert("login successfully")
      navigate("/Home")
    }
  }
  return (
    <div className="maincontainer">
      <h1 className="title">Tipster</h1>
      <h3 className="tagline">A Digital Batch Advisor</h3>
      <h1 className="console">
        <FontAwesomeIcon icon={faUserGraduate} className="icon" />
        Student Console
      </h1>
      <div className="container2">
        <h2 className="stdlogin">Student Login</h2>
        <hr />
        <form action="" method="POST">
        <h3 className="regNoLabel">Registration Number</h3>
        <select className="batchinput" 
        name="batch" 
        id=""
          value={user.batch}
          onChange={handleInputs}
          placeholder="">
          <option value="" disabled selected hidden>
            Batch
          </option>
          <option value="SP22">SP22</option>
          <option value="FA21">FA21</option>
          <option value="SP21">SP21</option>
          <option value="FA20">FA20</option>
          <option value="SP20">SP20</option>
          <option value="FA19">FA19</option>
          <option value="SP19">SP19</option>
          <option value="FA18">FA18</option>
        </select>
        <input className="department" name="" type="text"
          placeholder="BCS" disabled />
        <input className="regNo" name="regNo" type="text"
          value={user.regNo}
          onChange={handleInputs}
          placeholder="" />
        <br /> <br />
        <input className="password" name="password" type="password"
          value={user.password}
          onChange={handleInputs}
          placeholder="Password" />
        <br />

        {/* <Link to="/Home"> */}
        <button className="btn" value="login" onClick={loginUser}>Login</button>
        </form>
        {/* </Link> */}
        <Link to="/ResetPassword">
          <h4 className="forgotPassword">Forgot Password?</h4>
        </Link>
      </div>
      <Footer />
    </div>
  );
};
export default StudentLogin;
