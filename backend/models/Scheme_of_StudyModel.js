const mongoose = require("mongoose");
const SchemeofStudySchema = mongoose.Schema({
  courseCode: {
    type: String,
    required: true,
  },
  courseName: {
    type: String,
    required: true,
  },
  semester: {
    type: Number,
    required: true,
    enum: [1, 2, 3, 4, 5, 6, 7, 8],
  },
  credits: {
    type: Number,
    required: true,
    enum: [2, 3, 4],
  },
  lab: {
    type: String,
    default: "No",
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
// SchemeofStudySchema.methods.prereq = async function (course) {
//   try {
//     this.prerequisite = this.prerequisite.concat({ course });
//     await this.save();
//     return this.prerequisite;
//   } catch (error) {
//     console.log(error);
//   }
// };

//create the collection in database
const SOS = mongoose.model("SOS", SchemeofStudySchema);
module.exports = SOS;
