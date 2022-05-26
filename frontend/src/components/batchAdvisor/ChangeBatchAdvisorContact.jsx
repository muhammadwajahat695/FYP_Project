import React from "react";
import "./../../css/ChangeStudentContact.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
const ChangeBatchAdvisorContact = (props) => {
  return props.trigger ? (
    <div className="popup-bg">
      <div className="popup">
        <FontAwesomeIcon
          icon={faTimesCircle}
          className="close-btn"
          onClick={() => props.setTrigger(false)}
        />
        {props.children}
      </div>
    </div> 
  ) : (
    ""
  );
};

export default ChangeBatchAdvisorContact;
