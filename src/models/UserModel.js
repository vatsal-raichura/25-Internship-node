const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname:{
        type:String
    },
    lastname:{
        type:String
    },
    contact_no:{
        type:Number,
    },
    
    roleId:{
        type:Schema.Types.ObjectId,
       ref:"roles"
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String,

    },
    
   
})

module.exports = mongoose.model("users",userSchema)