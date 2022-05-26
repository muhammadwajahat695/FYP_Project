const mongoose = require("mongoose");
const electiveCourseSchema = mongoose.Schema({
  courseCode: {
    type: String,
    required: true,
  },
  courseName: {
    type: String,
    required: true,
  },
  track: {
    type: Number,
    required: true,
    enum: [1, 2, 3],
  },
  lab: {
    type: String,
    default: "No",
  },
  credits: {
    type: Number,
    required: true,
    enum: [3, 4],
  },
  prerequisite: [
    {
      course: {
        type: String,
        default: "N/A",
      },
    },
  ],
});

// // store the courses
// electiveCourseSchema.methods.elec_prereq = async function (course) {
//   try {
//     this.prerequisite = this.prerequisite.concat({ course });
//     await this.save();
//     return this.prerequisite;
//   } catch (error) {
//     console.log(error);
//   }
// };

//create the collection in database
const ElectiveCourse = mongoose.model("ElectiveCourse", electiveCourseSchema);
module.exports = ElectiveCourse;
