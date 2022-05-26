const mongoose = require("mongoose");
const pretestSchema = mongoose.Schema({
  courseName: {
    type: String,
    required: true,
  },
  courseCode: {
    type: String,
    required: true,
  },
  questions: [
    {
      question: {
        type: String,
        required: true,
      },
      option1: {
        type: String,
        required: true,
      },
      option2: {
        type: String,
        required: true,
      },
      option3: {
        type: String,
        required: true,
      },
      option4: {
        type: String,
        required: true,
      },
      correct_answer: {
        type: String,
        required: true,
      },
    },
  ],
});

//add questions
pretestSchema.methods.add_question = async function (
  question,
  option1,
  option2,
  option3,
  option4,
  correct_answer
) {
  try {
    this.questions = this.questions.concat({
      question,
      option1,
      option2,
      option3,
      option4,
      correct_answer,
    });
    await this.save();
    return this.questions;
  } catch (error) {
    console.log(error);
  }
};
//create the collection in database
const Pretest = mongoose.model("Pretest", pretestSchema);
module.exports = Pretest;
