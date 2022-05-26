import React from "react";
import Footer from "../student/Footer";
import BatchAdvisorMainMenu from "./BatchAdvisorMainMenu";
import BatchAdvisorTopMenu from "./BatchAdvisorTopMenu";
import "./../../css/Timetable.css";
import Loadable from "react-loadable";
import LoadingIndicator from "../TimetableImages/LoadingIndicator";
class Timetable extends React.Component {
  state = { select: "" };
  render() {
    return (
      <div className="BAprofilecontainer">
        <BatchAdvisorTopMenu />
        <BatchAdvisorMainMenu />
        <div className="menuheadingdiv">
          <h2 className="freezesemestertitle">Timetable</h2>
        </div>
        <div className="timetablecontainer">{this.selector()}</div>
        <div className="timetableimagecontainer">
          {this.selectedImage(this.state.select)}
        </div>
        {/* <div className="timetableimagecontainer"></div> */}
        <Footer />
      </div>
    );
  }

  selector() {
    return (
      <form action="">
        {/* <label className="timetablelabel">Section</label> */}
        <select
          className="timetableinput"
          name=""
          id=""
          placeholder=""
          required
          onChange={(e) => {
            this.setState({ select: e.target.value });
          }}
        >
          <option value="" disabled selected hidden>
            Select Section
          </option>
          <option>SP22-BCS-A</option>
          <option>SP22-BCS-B</option>
          <option>FA21-BCS-A</option>
          <option>FA21-BCS-B</option>
          <option>SP21-BCS-A</option>
          <option>SP21-BCS-B</option>
          <option>FA20-BCS-A</option>
          <option>FA20-BCS-B</option>
          <option>SP20-BCS-A</option>
          <option>SP20-BCS-B</option>
          <option>FA19-BCS-A</option>
          <option>FA19-BCS-B</option>
          <option>SP19-BCS-A</option>
          <option>SP19-BCS-B</option>
          <option>FA18-BCS-A</option>
          <option>FA18-BCS-B</option>
        </select>
        <br />
      </form>
    );
  }

  selectedImage(select) {
    const Component = this.loadComponent(select);
    return Component;
  }

  loadComponent(Type) {
    switch (Type) {
      case "SP22-BCS-A":
        const SP22_BCS_A = Loadable({
          loader: () => import("./../TimetableImages/SP22-BCS-A/SP22_BCS_A"),
          loading: LoadingIndicator,
        });
        return <SP22_BCS_A />;

      case "SP22-BCS-B":
        const SP22_BCS_B = Loadable({
          loader: () => import("./../TimetableImages/SP22-BCS-B/SP22_BCS_B"),
          loading: LoadingIndicator,
        });
        return <SP22_BCS_B />;

      case "FA21-BCS-A":
        const FA21_BCS_A = Loadable({
          loader: () => import("./../TimetableImages/FA21-BCS-A/FA21_BCS_A"),
          loading: LoadingIndicator,
        });
        return <FA21_BCS_A />;

      case "FA21-BCS-B":
        const FA21_BCS_B = Loadable({
          loader: () => import("./../TimetableImages/FA21-BCS-B/FA21_BCS_B"),
          loading: LoadingIndicator,
        });
        return <FA21_BCS_B />;

      case "SP21-BCS-A":
        const SP21_BCS_A = Loadable({
          loader: () => import("./../TimetableImages/SP21-BCS-A/SP21_BCS_A"),
          loading: LoadingIndicator,
        });
        return <SP21_BCS_A />;

      case "SP21-BCS-B":
        const SP21_BCS_B = Loadable({
          loader: () => import("./../TimetableImages/SP21-BCS-B/SP21_BCS_B"),
          loading: LoadingIndicator,
        });
        return <SP21_BCS_B />;

      case "FA20-BCS-A":
        const FA20_BCS_A = Loadable({
          loader: () => import("./../TimetableImages/FA20-BCS-A/FA20_BCS_A"),
          loading: LoadingIndicator,
        });
        return <FA20_BCS_A />;

      case "FA20-BCS-B":
        const FA20_BCS_B = Loadable({
          loader: () => import("./../TimetableImages/FA20-BCS-B/FA20_BCS_B"),
          loading: LoadingIndicator,
        });
        return <FA20_BCS_B />;

      case "SP20-BCS-A":
        const SP20_BCS_A = Loadable({
          loader: () => import("./../TimetableImages/SP20-BCS-A/SP20_BCS_A"),
          loading: LoadingIndicator,
        });
        return <SP20_BCS_A />;

      case "SP20-BCS-B":
        const SP20_BCS_B = Loadable({
          loader: () => import("./../TimetableImages/SP20-BCS-B/SP20_BCS_B"),
          loading: LoadingIndicator,
        });
        return <SP20_BCS_B />;

      case "FA19-BCS-A":
        const FA19_BCS_A = Loadable({
          loader: () => import("./../TimetableImages/FA19-BCS-A/FA19_BCS_A"),
          loading: LoadingIndicator,
        });
        return <FA19_BCS_A />;

      case "FA19-BCS-B":
        const FA19_BCS_B = Loadable({
          loader: () => import("./../TimetableImages/FA19-BCS-B/FA19_BCS_B"),
          loading: LoadingIndicator,
        });
        return <FA19_BCS_B />;

      case "SP19-BCS-A":
        const SP19_BCS_A = Loadable({
          loader: () => import("./../TimetableImages/SP19-BCS-A/SP19_BCS_A"),
          loading: LoadingIndicator,
        });
        return <SP19_BCS_A />;

      case "SP19-BCS-B":
        const SP19_BCS_B = Loadable({
          loader: () => import("./../TimetableImages/SP19-BCS-B/SP19_BCS_B"),
          loading: LoadingIndicator,
        });
        return <SP19_BCS_B />;

      case "FA18-BCS-A":
        const FA18_BCS_A = Loadable({
          loader: () => import("./../TimetableImages/FA18-BCS-A/FA18_BCS_A"),
          loading: LoadingIndicator,
        });
        return <FA18_BCS_A />;

      case "FA18-BCS-B":
        const FA18_BCS_B = Loadable({
          loader: () => import("./../TimetableImages/FA18-BCS-B/FA18_BCS_B"),
          loading: LoadingIndicator,
        });
        return <FA18_BCS_B />;

      case "":
        return (
          <h2 className="noimage">
            Please select section to view the timetable!
          </h2>
        );

      default:
        return (
          <h2 className="noimage">
            An error has occured while loading the image!
          </h2>
        );
    }
  }
}

export default Timetable;
