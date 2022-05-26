import React, { useEffect, useState } from "react";
import "./../../css/TopMenu.css";
import profile from "./../../icons/profile.png";
import notification from "./../../icons/notification.png";
import logout from "./../../icons/logout.png";
import { Link, useNavigate } from "react-router-dom";
import NotificationPanel from "./NotificationPanel";

const TopMenu = () => {
  const [buttonPopup, setButtonPopup] = useState(false);
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    const calltopmenu = async () => {
      try {
        const res = await fetch("/S_Topmenu", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        setUserData(data);

        if (!res.status === 200) {
          navigate("/StudentLogin");
          const error = new Error(res.error);
          throw error;
        }
      } catch (error) {
        navigate("/StudentLogin");
        console.log(error);
      }
    };
    calltopmenu();
  }, []);

  //for logout

  const Slogout = async (e) => {
    e.preventDefault();
    const res = await fetch("/Studentlogout", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (res.status === 200) {
      window.alert("logout");
      navigate("/StudentLogin");
    } else {
      window.alert("invalid credentials");
    }
  };

  return (
    <div className="containerNo1">
      <form action="" method="GET">
        <div className="containerNo2">
          <h1 className="title">Tipster</h1>
          <h3 className="tagline">A Digital Batch Advisor</h3>
        </div>
        <div className="containerNo3">
          <Link to="/StudentProfile">
            <img className="profileicon" src={profile} alt="" />
            <h4 className="profile">{userData.registrationId}</h4>
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
            onClick={Slogout}
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

export default TopMenu;
