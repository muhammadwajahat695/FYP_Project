import React, { useEffect,useState } from "react";
import MainMenu from "./MainMenu";
import TopMenu from "./TopMenu";
import Footer from "./Footer";
import "./../../css/StudentProfile.css";
import edit from "./../../icons/edit.png";
import { useNavigate,Link } from "react-router-dom";
import ChangeStudentContact from "./ChangeStudentContact";

const StudentProfile = () => {
  const [userData, setUserData] = useState({});
  const [update_contact_no,setUpdate_contact_no]=useState({
    contactNo:""
  });
  const [buttonPopup, setButtonPopup] = useState(false);
  
  const navigate= useNavigate();
  const S_Profile= async()=>{
    try {
      const res= await fetch("/Studentprofile",{
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
      navigate("/StudentLogin");
    }
  }
  useEffect(() => {   
    //we can not use async function in useEffect
    S_Profile();
    },[buttonPopup]);
  
  
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
    const res = await fetch("/S_updatecontact", {
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
    <div className="profilecontainer">
      <TopMenu />
      <MainMenu />
      <div className="freezesemesterdiv">
        <h2 className="freezesemestertitle">Profile</h2>
      </div>
      <form action="" method="GET">
      <div className="profileformdiv">
        <label className="label" htmlFor="">
          Name
        </label>
        <br />
        <input className="input" type="text" 
        value={userData.name} 
        placeholder=""
        /> 
        <br />
        <label className="label" htmlFor="">
          Father Name
        </label>
        <br />
        <input className="input" type="text" 
        value={userData.fatherName}
        placeholder=""
        />
        <br />
        <label className="label" htmlFor="">
          Registration Number
        </label>
        <br />
        <input className="input" type="text" 
        value={userData.registrationId}
        placeholder=""
        />
        <br />
        <label className="label" htmlFor="">
          Email
        </label>
        <br />
        <input className="input" type="text" 
        value={userData.email}
        placeholder=""
        />
        <br />
        <label className="label" htmlFor="">
          Address
        </label>
        <br />
        <input className="input" type="text" 
        value={userData.address}
        placeholder=""
        />
        <br />
        <label className="label" htmlFor="">
          Contact Number
        </label>
        <br />
        <input className="input" type="text" 
        value={userData.contactNo}
        placeholder=""
        />
        <img
          onClick={() => setButtonPopup(true)}
          className="editicon"
          src={edit}
          alt=""
        />
        <br />
        <label className="label" htmlFor="">
           Batch Advisor Name
         </label>
         <br />
         <input className="input" type="text" 
         value={userData.batchAdvisorName} 
         placeholder="Dr. Hamza"/>
         <br />
         <Link className="psdlink" to="/ChangeStudentPassword">
           <label className="psdlabel" htmlFor="">
             Change Password
           </label>
         </Link>
        <br />
        <br />
        <div className="picdiv">
          <img src={userData.profilePic} alt="" />
        </div>
      </div>
      </form>
      <Footer />
      <ChangeStudentContact
       trigger={buttonPopup} 
       setTrigger={setButtonPopup}>
        <form action="" method="PUT">
          <label htmlFor="" className="newcontactlabel">
            New Contact Number
          </label>
          <br />
          <input type="text" className="newcontactinput" required 
          name="contactNo"
          value={update_contact_no.contactNo}
          onChange={handleInputs}
          placeholder=""
          />
          <br />
          <button className="newcontactbutton" onClick={update_contact}>Update</button>
        </form>
      </ChangeStudentContact>
    </div>
  );
};

export default StudentProfile;














        // <label className="label" htmlFor="">
        //   Batch Advisor Name
        // </label>
        // <br />
        // <input className="input" type="text" />
        // <br />
        // <Link className="psdlink" to="/ChangeStudentPassword">
        //   <label className="psdlabel" htmlFor="">
        //     Change Password
        //   </label>
        // </Link>
