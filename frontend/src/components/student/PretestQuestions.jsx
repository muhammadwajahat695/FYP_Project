import React, { useState, useEffect } from "react";
import "./../../css/Pretest.css";
import { Link, useLocation } from "react-router-dom";

const PretestQuestions = () => {
  const location = useLocation();
  const courseName = location.state;
  const [preTest, setPreTest] = useState([]);
  const pretest_question = async () => {
    try {
      const res = await fetch(`/getQuestions/${courseName}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await res.json();
      setPreTest(data);
      if (!res.status === 200) {
        const error = new Error(res.error);
        throw error;
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    pretest_question();
  }, []);
  const [state, setState] = useState([]);
  let name, value;
  const handleChange = (e) => {
    console.log("first");
    name = e.target.name;
    value = e.target.value;
    setState([{ ...state, [name]: value }]);
  };
  //submit button
  const submitTest = async () => {
    const answer = state;
    const res = await fetch(`/verifyAnswer/${courseName}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        answer: answer,
      }),
    });
    await res.json();
  };
  return (
    <>
      <div className="pretest-div">
        <h2 className="freezesemestertitle">Pre-Test</h2>
      </div>
      <div className="Pretest-questions-container">
        {preTest.map((mcqs) => (
          <div className="question-container">
            <h3>{mcqs.question}</h3>
            <input
              type="radio"
              name={mcqs.question}
              value={mcqs.option1}
              onChange={handleChange}
              className="select"
            />
            <label htmlFor="" className="choice">
              {mcqs.option1}
            </label>
            <br />
            <input
              type="radio"
              name={mcqs.question}
              value={mcqs.option2}
              onChange={handleChange}
              className="select"
            />
            <label htmlFor="" className="choice">
              {mcqs.option2}
            </label>
            <br />
            <input
              type="radio"
              name={mcqs.question}
              value={mcqs.option3}
              onChange={handleChange}
              className="select"
            />
            <label htmlFor="" className="choice">
              {mcqs.option3}
            </label>
            <br />
            <input
              type="radio"
              name={mcqs.question}
              value={mcqs.option4}
              onChange={handleChange}
              className="select"
            />
            <label htmlFor="" className="choice">
              {mcqs.option4}
            </label>
          </div>
        ))}
        <div className="submit-btn-container">
          <Link to="/AddCourse">
            {" "}
            <button className="start-btn" onClick={submitTest}>
              Submit
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default PretestQuestions;

// import React, { useState, useEffect } from "react";
// import "./../../css/Pretest.css";

// const PretestQuestions = () => {
//   const [preTest, setPreTest] = useState([]);
//   const pretest_question = async () => {
//     try {
//       const res = await fetch("/getQuestions", {
//         method: "GET",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//       });
//       const data = await res.json();
//       // console.log(data);
//       setPreTest(data);
//       if (!res.status === 200) {
//         const error = new Error(res.error);
//         throw error;
//       }
//     } catch (error) {
//       console.log(error);
//       // navigate("/StudentLogin");
//     }
//   };
//   useEffect(() => {
//     pretest_question();
//   }, []);

//   return (
//     <>
//       <div className="pretestdiv">
//         <h2 className="freezesemestertitle">Pre-Test</h2>
//       </div>
//       <div className="Pretest-questions-container">
//           <div className="question-container">
//             <h3>{preTest[0].question}</h3>
//             <input
//               type="radio"
//               name={}
//               value={qu.option1}
//               className="select"
//             />
//             <label htmlFor="" className="choice">
//               {test.option1}
//             </label>
//             <br />
//             <input type="radio" name="abc" className="select" />
//             <label htmlFor="" className="choice">
//               {test.option2}
//             </label>
//             <br />
//             <input type="radio" name="abc" className="select" />
//             <label htmlFor="" className="choice">
//               {test.option3}
//             </label>
//             <br />
//             <input type="radio" name="abc" className="select" />
//             <label htmlFor="" className="choice">
//               {test.option4}
//             </label>
//           </div>
//         <div className="submit-btn-container">
//           <button className="start-btn">Submit</button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default PretestQuestions;
