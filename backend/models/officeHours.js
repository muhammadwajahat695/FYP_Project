const mongoose = require("mongoose")
const officeHourSchema = mongoose.Schema({
    batch:{
        type: String,
        required:true
    },
        Monday:[{
            day:{
                type: String,
                required:true,
                default:"Monday"        
            },
            from: {
                type: String,
                required:true,
                default:"--"
            },
            to: {
                type: String, 
                required:true,
                default:"--"
            },
        }],
        Tuesday:[{
            day:{
                type: String,
                required:true,
                default:"Tuesday"        
            },
            from: {
                type: String,
                required:true,
                default:"--"
            },
            to: {
                type: String, 
                required:true,
                default:"--"
            },
        }],
        Wednesday:[{
            day:{
                type: String,
                required:true,
                default:"Wednesday"        
            },
            from: {
                type: String,
                required:true,
                default:"--"
            },
            to: {
                type: String, 
                required:true,
                default:"--"
            },
        }],
        Thursday:[{
            day:{
                type: String,
                required:true,
                default:"Thursday"        
            },
            from: {
                type: String,
                required:true,
                default:"--"
            },
            to: {
                type: String, 
                required:true,
                default:"--"
            },
        }],
        Friday:[{
            day:{
                type: String,
                required:true,
                default:"Friday"        
            },
            from: {
                type: String,
                required:true,
                default:"--"
            },
            to: {
                type: String, 
                required:true,
                default:"--"
            },
        }],
        
    
})
//add time for office hour
officeHourSchema.methods.addMonday = async function(day,from,to) {
    try {
        this.Monday = this.Monday.concat({day,from,to})
        await this.save();
        return this.Monday;
    } catch (error) {
        console.log(error);
    }
}
//add time for office hour
officeHourSchema.methods.addTuesday = async function(day,from,to) {
    try {
        this.Tuesday = this.Tuesday.concat({day,from,to})
        await this.save();
        return this.Tuesday;
    } catch (error) {
        console.log(error);
    }
}
//add time for office hour
officeHourSchema.methods.addWednesday = async function(day,from,to) {
    try {
        this.Wednesday = this.Wednesday.concat({day,from,to})
        await this.save();
        return this.Wednesday;
    } catch (error) {
        console.log(error);
    }
}
//add time for office hour
officeHourSchema.methods.addThursday = async function(day,from,to) {
    try {
        this.Thursday = this.Thursday.concat({day,from,to})
        await this.save();
        return this.Thursday;
    } catch (error) {
        console.log(error);
    }
}
//add time for office hour
officeHourSchema.methods.addFriday = async function(day,from,to) {
    try {
        this.Friday = this.Friday.concat({day,from,to})
        await this.save();
        return this.Friday;
    } catch (error) {
        console.log(error);
    }
}
//create the collection in database
const OfficeHour = mongoose.model("OfficeHour", officeHourSchema);
module.exports = OfficeHour;