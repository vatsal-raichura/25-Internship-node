const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema = new mongoose.Schema({
  name:{
    type:String
},

email:{
    type:String,
    unique:true,
    required:true
},
contact_no:{
    type:Number,
},



roleId:{
    type:Schema.Types.ObjectId,
    ref:"roles"
},




password:{
    type:String,

}



},{timestamps:true})

module.exports = mongoose.model("admin", adminSchema);
