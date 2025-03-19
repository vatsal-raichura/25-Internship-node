const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    
    userId:{
        type:Schema.Types.ObjectId,
        ref:"users"

    },  

    message:{
        type:String

    },

    sent__date:{
        type:"date",
        default: Date.now   
    },

    type:{
        
        enum:[
           'ComplaintUpdate',
           'Reply' 
        ],
        type: String,
        
    },
    read_status:{
        
        enum:[
           'Read',
           'Unread' 
        ],
        type: String,
        
    }


    
    
   
    
   
})

module.exports = mongoose.model("notifications",notificationSchema)