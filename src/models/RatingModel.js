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
    category:{
        type:String,
        enum: [
      
            'Electronics',
            'Clothing & Apparel',
            'Footwear',
            'Beauty & Personal Care',
            'Home & Kitchen',
            'Grocery & Food',
            'Automobiles & Accessories',
            'Books & Stationery',
            'Sports & Fitness',
            'Toys & Baby Products',
            'Healthcare & Medicine',
            'Services'
          ],

    },

    rating:{
        type:Number

    },

    comment:{
        type:String

    },

    review_date:{
        type:"date",
        default: Date.now   



    }

    
    
   
    
   
},{timestamps:true})

module.exports = mongoose.model("ratings",ratingSchema)