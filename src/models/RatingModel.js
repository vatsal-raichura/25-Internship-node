const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const ratingSchema = new Schema({
    
    userId:{
        type:Schema.Types.ObjectId,
        ref:"users"

    },  

    productId:{
        type:Schema.Types.ObjectId,
        ref:"products"

    },

    rating:{
        type:Number

    },

    comment:{
        type:String

    },

    review__date:{
        type:"date",
        default: Date.now   



    }

    
    
   
    
   
})

module.exports = mongoose.model("ratings",ratingSchema)