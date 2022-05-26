import React,{useState,useEffect} from "react";
import Footer from "./../student/Footer";
import "./../../css/StudentProfile.css";
import edit from "./../../icons/edit.png";
import BatchAdvisorTopMenu from "./BatchAdvisorTopMenu";
import BatchAdvisorMainMenu from "./BatchAdvisorMainMenu";
import { Link, useNavigate } from "react-router-dom";
import ChangeBatchAdvisorContact from "./ChangeBatchAdvisorContact";

const BatchAdvisorProfile = () => {
  const [userData, setUserData] = useState({});
  const [buttonPopup, setButtonPopup] = useState(false);
  const [update_contact_no,setUpdate_contact_no]=useState({
    contactNo:""
  });
  const navigate= useNavigate();
  useEffect(() => {   
  //we can not use async function in useEffect
  
  BA_Profile();
  },[buttonPopup]);
  const BA_Profile= async()=>{
    try {
      const res= await fetch("/BatchAdvisorprofile",{
        method: "GET",
        headers:{
          Accept:"application/json",
          "Content-Type":"application/json"
        },
        credentials:"include"
      });

      const data=await res.json();
      console.log(data);
      setUserData(data);

      if(!res.status===200){
        const error =new Error(res.error);
        throw error;
      }
    } catch (error) {
      console.log(error);
      navigate("/Home");
    }
  }
  // for update contact
  
  let name,value;
  const handleInputs=(e)=>{
    console.log(e);
    name=e.target.name;
    value=e.target.value;
    setUpdate_contact_no({...update_contact_no,[name]:value});
  }
  
  // const navigate = useNavigate();
  const update_contact = async (e) => {
    e.preventDefault();
    const {contactNo}=update_contact_no;
    const res = await fetch("/BA_updatecontact", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
      contactNo
      })
    })
    const data = res.json();
  
    if (res.status === 400 || !data) {
      window.alert("invalid credentials")
    } else {
      window.alert("contact no updated")
      setButtonPopup(false)
      // navigate("/StudentProfile")
    }
  }

  return (
    <div className="BAprofilecontainer">
      <BatchAdvisorTopMenu />
      <BatchAdvisorMainMenu />
      <div className="menuheadingdiv">
        <h2 className="freezesemestertitle">Profile</h2>
      </div>
      <form action="" method="GET">
      <div className="BAprofileformdiv">
        <label className="BAnamelabel" htmlFor="">
          Name
        </label>
        <br />
        <input className="BAfirsttwoinputs" type="text" value={userData.name} placeholder=""/>
        <br />
        <label className="BAemaillabel" htmlFor="">
          Email
        </label>
        <br />
        <input className="BAfirsttwoinputs" type="text" value={userData.email} placeholder="" />
        <br />
        <label className="BAcontactlabel" htmlFor="">
          Contact Number
        </label>
        <br />
        <input className="BAinput" 
        type="text" 
        value={userData.contactNo}
        placeholder=""/>
        <img className="editicon"
        onClick={() => setButtonPopup(true)} 
        src={edit} 
        alt="" />
        <br />
        <Link className="BApsdlink" to="/ChangeBatchAdvisorPassword">
          <label className="BApsdlabel" htmlFor="">
            Change Password
          </label>
        </Link>
        <br />
        <br />
      </div>
      </form>
      <Footer />
      <ChangeBatchAdvisorContact
        trigger={buttonPopup}
        setTrigger={setButtonPopup}
      >
        <form action="" method="PUT">
          <label htmlFor="" className="newcontactlabel">
            New Contact Number
          </label>
          <br />
          <input type="text" className="newcontactinput" required
           name="contactNo"
           value={update_contact_no.contactNo}
           onChange={handleInputs}
           placeholder="" />
          <br />
          <button className="newcontactbutton"
          onClick={update_contact}
          >Update</button>
        </form>
      </ChangeBatchAdvisorContact>
    </div>
  );
};

export default BatchAdvisorProfile;
