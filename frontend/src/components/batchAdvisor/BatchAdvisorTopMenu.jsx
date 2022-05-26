import React, { useState, useEffect } from "react";
import "./../../css/TopMenu.css";
import profile from "./../../icons/profile.png";
import notification from "./../../icons/notification.png";
import logout from "./../../icons/logout.png";
import { Link, useNavigate } from "react-router-dom";
import NotificationPanel from "./../student/NotificationPanel";

const BatchAdvisorTopMenu = () => {
  const [buttonPopup, setButtonPopup] = useState(false);

  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    const calltopmenu = async () => {
      try {
        const res = await fetch("/BA_Topmenu", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        console.log(data);
        setUserData(data);

        if (!res.status === 200) {
          navigate("/BatchAdvisorLogin");
          const error = new Error(res.error);
          throw error;
        }
      } catch (error) {
        navigate("/BatchAdvisorLogin");
        console.log(error);
      }
    };
    calltopmenu();
  }, []);

  //for logout

  const BAlogout = async (e) => {
    e.preventDefault();
    const res = await fetch("/Batchadvisorlogout", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (res.status === 200) {
      window.alert("logout");
      navigate("/BatchAdvisorLogin");
    } else {
      window.alert("invalid credentials");
    }
  };

  return (
    <div className="containerNo1">
      <div className="containerNo2">
        <h1 className="title">Tipster</h1>
        <h3 className="tagline">A Digital Batch Advisor</h3>
      </div>
      <form action="" method="GET">
        <div className="containerNo3">
          <Link to="/BatchAdvisorProfile">
            <img className="profileicon" src={profile} alt="" />
            <h4 className="profile">{userData.name}</h4>
          </Link>
          <img
            className="notificationicon"
            src={notification}
            alt=""
            onClick={() => setButtonPopup(true)}
          />
          <img
            className="logouticon"
            method="GET"
            src={logout}
            alt=""
            onClick={BAlogout}
          />
        </div>
      </form>
      <NotificationPanel
        trigger={buttonPopup}
        setTrigger={setButtonPopup}
      ></NotificationPanel>
    </div>
  );
};

export default BatchAdvisorTopMenu;
