const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const roleSchema = new Schema({
    //fields // get

    name:{
        type:String,
    },
    description:{
        type:String
    }

}) 

module.exports = mongoose.model("roles",roleSchema)