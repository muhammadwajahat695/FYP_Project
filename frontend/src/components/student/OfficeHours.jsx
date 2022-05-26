import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import MainMenu from "./MainMenu";
import TopMenu from "./TopMenu";
import "./../../css/OfficeHours.css";

const OfficeHours = () => {
  const [monday, setMonday] = useState([]);
  const [wednesday, setWednesday] = useState([]);
  const [tuesday, setTuesday] = useState([]);
  const [thursday, setThursday] = useState([]);
  const [friday, setFriday] = useState([]);

  const S_office = async () => {
    try {
      const res = await fetch("/officehour", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();
      console.log(data);
      setMonday(data.Monday);
      setTuesday(data.Tuesday);
      setWednesday(data.Wednesday);
      setThursday(data.Thursday);
      setFriday(data.Friday);

      if (!res.status === 200) {
        const error = new Error(res.error);
        throw error;
      }
    } catch (error) {
      console.log(error);
      // navigate("/StudentLogin");
    }
  };
  useEffect(() => {
    //we can not use async function in useEffect
    S_office();
  }, []);
  return (
    <div className="container">
      <TopMenu />
      <MainMenu />
      <div className="freezesemesterdiv">
        <h2 className="freezesemestertitle">Office Hours</h2>
      </div>
      <table>
        <tr>
          <th className="dayCol">Day</th>
          <th className="fromCol">From</th>
          <th className="toCol">To</th>
        </tr>
        {monday.map((time) => (
          <tr>
            <td>{time.day}</td>
            <td>{time.from}</td>
            <td>{time.to}</td>
          </tr>
        ))}
        {tuesday.map((time) => (
          <tr>
            <td>{time.day}</td>
            <td>{time.from}</td>
            <td>{time.to}</td>
          </tr>
        ))}
        {wednesday.map((time) => (
          <tr>
            <td>{time.day}</td>
            <td>{time.from}</td>
            <td>{time.to}</td>
          </tr>
        ))}
        {thursday.map((time) => (
          <tr>
            <td>{time.day}</td>
            <td>{time.from}</td>
            <td>{time.to}</td>
          </tr>
        ))}
        {friday.map((time) => (
          <tr>
            <td>{time.day}</td>
            <td>{time.from}</td>
            <td>{time.to}</td>
          </tr>
        ))}
      </table>
      <Footer />
    </div>
  );
};

export default OfficeHours;
