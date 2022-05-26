const mongoose = require("mongoose");

const Chatboxschema = new mongoose.Schema({
    registrationId: {
        type: String,
        required:true
    },
    batch:{
        type:String,
        required:true
    },  
    email: {
        type: String,
        required:true
    },
    subject:{
        type:String,
        required:true
    },
    chat: [{
        name: {
            type: String,
        },
        message:{
            type:String
        }
    }],
})
//add chatbox
Chatboxschema.methods.chatbox=async function(name,message){
    try {
        this.chat = this.chat.concat({name,message})
        await this.save();
        return this.chat;
    } catch (error) {
        console.log(error);
    }
}

//create the collection in database
const ChatBox = mongoose.model("ChatBox", Chatboxschema);
module.exports = ChatBox;