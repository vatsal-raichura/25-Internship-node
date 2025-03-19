const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const businessSchema = new Schema({
    businessname:{
        type:String
    },
   
    email:{
        type:String,
        unique:true
    },
    contact_no:{
        type:Number,
    },
    description:{
        type:String,
        
    },
    
    roleId:{
        type:Schema.Types.ObjectId,
        ref:"roles"
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:"users"

    },
    
    password:{
        type:String,

    },
    status:{
        type:Boolean,
        default:true
    }
    
   
})

module.exports = mongoose.model("business",businessSchema)