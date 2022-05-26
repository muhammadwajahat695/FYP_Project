import React,{useState} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserTie } from "@fortawesome/free-solid-svg-icons";
import Footer from "./../student/Footer";
import "./../../css/BatchAdvisorResetPassword.css";
import { Link,useNavigate } from "react-router-dom";

const BatchAdvisorResetPassword = () => {
  const [sendemail,setSendemail]=useState({email:""});
  let name,value;
  const handleInputs=(e)=>{
    console.log(e);
    name=e.target.name; 
    value=e.target.value;
    setSendemail({...sendemail,[name]:value});
  }

  const navigate = useNavigate();
  const send_mail = async (e) => {
    e.preventDefault();
    const {email}=sendemail
    const res = await fetch("/BA_sendresetemail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email
      })
    })
    const data = res.json();
    if (res.status === 400 || res.status === 422|| !data) {
      window.alert("invalid credentials")
    } else {
      window.alert("send email")
      navigate("/BatchAdvisorLogin")
    }
  }

  return (
    <div className="BALogincontainer">
      <h1 className="title">Tipster</h1>
      <h3 className="tagline">A Digital Batch Advisor</h3>
      <h1 className="console">
        <FontAwesomeIcon icon={faUserTie} className="icon" />
        Batch Advisor Console
      </h1>
      <div className="container3">
        <h2 className="rstpassword">Reset Password</h2>
        <hr />
        <form action="" method="POST">
          <h3 className="todo">
            Please enter your official email to receive the <br />
            password reset link.
          </h3>
          <input className="email" type="email" 
                     name="email"
                     value={sendemail.email}
                     onChange={handleInputs}
                    placeholder="" required />
          <br />
          <Link to="/">
            <button className="cancelbtn">Cancel</button>
          </Link>
          <button className="sendbtn" onClick={send_mail}>Send</button>
        </form>
      </div>
      <Footer />
    </div>
  );
};
export default BatchAdvisorResetPassword;
