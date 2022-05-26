const mongoose = require("mongoose");
const timetableschema = new mongoose.Schema({
  class: {
    type: String,
    require: true,
  },
  batch: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  semester: {
    type: Number,
    required: true,
  },
  timetable: [
    {
      Monday: [
        {
          courseName: {
            type: String,
            require: true,
          },
          slot: {
            type: String,
            required: true,
            enum: ["M1", "M2", "M3", "M4", "M5", "M6"],
          },
        },
      ],
      Tuesday: [
        {
          courseName: {
            type: String,
            require: true,
          },
          slot: {
            type: String,
            required: true,
            enum: ["T1", "T2", "T3", "T4", "T5", "T6"],
          },
        },
      ],
      Wednesday: [
        {
          courseName: {
            type: String,
            require: true,
          },
          slot: {
            type: String,
            required: true,
            enum: ["W1", "W2", "W3", "W4", "W5", "W6"],
          },
        },
      ],
      Thursday: [
        {
          courseName: {
            type: String,
            require: true,
          },
          slot: {
            type: String,
            required: true,
            enum: ["Th1", "Th2", "Th3", "Th4", "Th5", "Th6"],
          },
        },
      ],
      Friday: [
        {
          courseName: {
            type: String,
            require: true,
          },
          slot: {
            type: String,
            required: true,
            enum: ["F1", "F2", "F3", "F4", "F5", "F6"],
          },
        },
      ],
    },
  ],
});
//create the collection in database
const Timetable = mongoose.model("Timetable", timetableschema);
module.exports = Timetable;
