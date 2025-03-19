const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name:{
        type:String
    },
    description:{
        type:String
    },
    category:{
        type:String,
        
    },
    categoryId:{
        type:Schema.Types.ObjectId,
        ref:"category"

    },  
    brand:{
        type:String

    },
    productURL:{
        type:String
    },
    rating:{
        type:Number

    },

    businessId:{
        type:Schema.Types.ObjectId,
        ref:"business"

    },
    
    price:{
        type:Number,
    },
    
    
   
})

module.exports = mongoose.model("products",productSchema)