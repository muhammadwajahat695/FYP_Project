import React, { useEffect, useState } from "react";
import Footer from "../student/Footer";
import BatchAdvisorMainMenu from "./BatchAdvisorMainMenu";
import BatchAdvisorTopMenu from "./BatchAdvisorTopMenu";
import next from "./../../icons/next.png";
import "./../../css/PendingRequests.css";
import { Link, useNavigate } from "react-router-dom";

const PendingRequests = () => {
  const [userData, setUserData] = useState([]);
  const navigate = useNavigate();
  const S_Profile = async () => {
    try {
      const res = await fetch("/Add_Drop_Freeze_pending", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();
      setUserData(data);
      if (!res.status === 200) {
        const error = new Error(res.error);
        throw error;
      }
    } catch (error) {
      console.log(error);
      navigate("/");
    }
  };
  useEffect(() => {
    //we can not use async function in useEffect
    S_Profile();
  }, []);

  return (
    <div className="BAprofilecontainer">
      <BatchAdvisorTopMenu />
      <BatchAdvisorMainMenu />
      <div className="menuheadingdiv">
        <h2 className="freezesemestertitle">Pending Requests</h2>
      </div>
      {userData.length === 0 ? (
        ""
      ) : (
        <table className="pendingTable">
          <tr>
            <th className="pendingReg">Registration No.</th>
            <th className="pendingName">Name</th>
            <th className="pendingType">Request Type</th>
            <th className="formIcon"></th>
          </tr>
          {userData.map((pending) => (
            <tr>
              <td className="pendingReg">{pending.registrationId}</td>
              <td className="pendingName">{pending.name}</td>
              <td className="pendingType">{pending.request}</td>
              <td className="formIcon">
                <Link
                  to={
                    pending.request === "Freeze Semester"
                      ? "/FreezeSemesterForm"
                      : pending.request === "Add Pending"
                      ? "/AddForm"
                      : "/DropForm"
                  }
                  state={pending.registrationId}
                >
                  <img className="nexticon" src={next} alt="" />
                </Link>
              </td>
            </tr>
          ))}
        </table>
      )}
      <Footer />
    </div>
  );
};

export default PendingRequests;
