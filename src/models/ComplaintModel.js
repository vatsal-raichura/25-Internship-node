const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const complaintsSchema = new Schema({
    
    description:{
        type:String
    },
    status:{
        enum: ['Open', 'Resolved', 'Escalated'],
        type: String,
        required: true
        
    },

    productId:{
          type:Schema.Types.ObjectId,
        ref:"products"

    },
    userId:{
          type:Schema.Types.ObjectId,
        ref:"users"

    },
    fileddate:{
        type:Number,
    },
    
    
   
})

module.exports = mongoose.model("complaints",complaintsSchema)