import React,{useEffect,useState} from "react";
import { Link,useNavigate } from "react-router-dom";
import Footer from "./Footer";
import MainMenu from "./MainMenu";
import TopMenu from "./TopMenu";
import "./../../css/RepeatCourse.css";

const RepeatCourse = () => {
  const [userData, setUserData] = useState([]);
  const navigate= useNavigate();
  const S_Profile= async()=>{
    try {
      const res= await fetch("/repeatCourses",{
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
      navigate("/");
    }
  }
  useEffect(() => {   
    //we can not use async function in useEffect
    S_Profile();
    },[]);

  return (
    <div className="container">
      <TopMenu />
      <MainMenu />
      <div className="freezesemesterdiv">
        <h2 className="freezesemestertitle">Repeat Course</h2>
      </div>
      <table>
        <tr>
          <th className="codeCol">Course Code</th>
          <th className="titleCol">Course Title</th>
          <th className="creditsCol">Credits</th>
          <th className="gpaCol">GPA</th>
        </tr>
        {userData.map((repeat)=>(
<tr>
 <td>{repeat.courseCode}</td>
 <td>{repeat.courseName}</td>
 <td>{repeat.credits}</td>
 <td>{repeat.gp}</td>
</tr>
        ))}
       
        
      </table>
      <Link to="/AddCourse">
        <button className="repeatbtn">Add Course to Repeat</button>
      </Link>
      <Footer />
    </div>
  );
};

export default RepeatCourse;
