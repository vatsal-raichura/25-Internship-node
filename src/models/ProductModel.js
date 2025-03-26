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
    

    businessId:{
        type:Schema.Types.ObjectId,
        ref:"business"

    },
    
    price:{
        type:Number,
    },
    
    
   
},{timestamps:true})

module.exports = mongoose.model("products",productSchema)