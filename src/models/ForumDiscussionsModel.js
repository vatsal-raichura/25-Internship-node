const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const discussionsSchema = new Schema({
    
    userId:{
        type:Schema.Types.ObjectId,
        ref:"users"

    },  

    tittle:{
        type:String

    },

    content:{
        type:String

    },

    created__date:{
        type:"date",
        default: Date.now   
    },

    status:{
        type: String,
        enum:[
           'Active',
           'Close' 
        ],
        default:'Active'
    }


    
    
   
    
   
})

module.exports = mongoose.model("forumdiscussions",discussionsSchema)