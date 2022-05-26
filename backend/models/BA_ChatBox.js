const mongoose = require("mongoose");

const BA_Chatboxschema = new mongoose.Schema({
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
BA_Chatboxschema.methods.BA_chatbox = async function (name, message) {
  try {
    this.chat = this.chat.concat({ name, message });
    await this.save();
    return this.chat;
  } catch (error) {
    console.log(error);
  }
};

//create the collection in database
const BA_ChatBox = mongoose.model("BA_ChatBox", BA_Chatboxschema);
module.exports = BA_ChatBox;
