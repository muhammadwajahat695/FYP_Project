const mongoose = require("mongoose");

const S_Chatboxschema = new mongoose.Schema({
  registrationId: {
    type: String,
    required: true,
  },
  batch: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  chat: [
    {
      name: {
        type: String,
      },
      message: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
});
//add chatbox
S_Chatboxschema.methods.S_chatbox = async function (name, message) {
  try {
    this.chat = this.chat.concat({ name, message });
    await this.save();
    return this.chat;
  } catch (error) {
    console.log(error);
  }
};

//create the collection in database
const S_ChatBox = mongoose.model("S_ChatBox", S_Chatboxschema);
module.exports = S_ChatBox;
