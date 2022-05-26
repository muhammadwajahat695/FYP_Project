import React, {useState} from "react";
import BatchAdvisorMainMenu from "./BatchAdvisorMainMenu";
import BatchAdvisorTopMenu from "./BatchAdvisorTopMenu";
import Footer from "./../student/Footer";
import "./../../css/StudentProfile.css";
import "./../../css/ChangePassword.css";
import { Link,useNavigate } from "react-router-dom";

const ChangeBatchAdvisorPassword = () => {

  const [update_password,setUpdate_password]=useState({
    old_password:"",new_password:"",confirm_password:""
  });
  let name,value;
  const handleInputs=(e)=>{
    console.log(e);
    name=e.target.name;
    value=e.target.value;
    setUpdate_password({...update_password,[name]:value});
  }
  
  const navigate = useNavigate();
  const Update_Password = async (e) => {
    e.preventDefault();
    const {old_password,new_password,confirm_password}=update_password;
    const res = await fetch("/BA_updatepassword", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        old_password: old_password,
        new_password: new_password,
        confirm_password: confirm_password
      })
    })
    const data = res.json();
  
    if (res.status === 400 || !data) {
      window.alert("invalid credentials")
    } else {
      window.alert("Passord updated successfully")
      navigate("/BatchAdvisorProfile")
    }
  }

  return (
    <div className="BApasswordcontainer">
      <BatchAdvisorTopMenu />
      <BatchAdvisorMainMenu />
      <div className="freezesemesterdiv">
        <h2 className="freezesemestertitle">Change Password</h2>
      </div>
      <form action="" method="PUT">
      <div className="stdpasswordformdiv">
        <label className="stdcurrentlabel" htmlFor="">
          Current Password
        </label>
        <br />
        <input className="stdpasswordinputs" type="password"
        name="old_password"
        value={update_password.old_password}
        onChange={handleInputs}
        placeholder=""
        />
        <br />
        <label className="stdnewlabel" htmlFor="">
          New Password
        </label>
        <br />
        <input className="stdpasswordinputs" type="password"
         name="new_password"
         value={update_password.new_password}
        onChange={handleInputs} 
         placeholder=""
        />
        <br />
        <label className="stdconfirmlabel" htmlFor="">
          Confirm New Password
        </label>
        <br />
        <input className="stdpasswordinputs" type="text" 
        name="confirm_password"
        value={update_password.confirm_password}
        onChange={handleInputs}
        placeholder=""
        />
        <br />
        <Link to="/BatchAdvisorProfile">
          <button className="cancelbutton">Cancel</button>
        </Link>
        <button className="submitbutton" onClick={Update_Password}>Submit</button>
      </div>
      </form>
      <Footer />
    </div>
  );
};

export default ChangeBatchAdvisorPassword;
