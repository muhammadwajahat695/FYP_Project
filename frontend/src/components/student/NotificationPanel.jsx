import React from "react";
import "./../../css/NotificationPanel.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
const NotificationPanel = (props) => {
  return props.trigger ? (
    <div className="popupbg">
      <div className="notification-popup">
        <FontAwesomeIcon
          icon={faTimesCircle}
          className="close-btn"
          onClick={() => props.setTrigger(false)}
        />
        <h2>Latest Notifications</h2>
        {props.children}
      </div>
    </div>
  ) : (
    ""
  );
};

export default NotificationPanel;
