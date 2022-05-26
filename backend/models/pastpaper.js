const mongoose = require("mongoose")
const pastpaperschema = new mongoose.Schema({
    course_title: {
        type: String,
        required: [true, "Please enter course name"]
    },
    paper_type: {
        type: String,
        required: [true, "Please enter Paper type"]
    },
    session: {
        type: String,
        required: [true, "Please enter the session"]
    },
    paper: {
       type:String,
       required:true
    },
    paper_name:{
        type:String,
        required:true
    },
    type:{
        type:String,
        default:"pdf"
    }



})
//create the collection in database
const Pastpaper = mongoose.model("Pastpaper", pastpaperschema);
module.exports = Pastpaper;
