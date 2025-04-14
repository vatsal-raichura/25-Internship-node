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
    active: { type: Boolean, default: false }, // active field,

    isBlocked :{
        type:Boolean,
        default:false
    },
    lastLogin: { 
        type: Date, 
        default: Date.now, // Automatically set the current date if not provided
      },
    
   
},{timestamps:true})

module.exports = mongoose.model("users",userSchema)