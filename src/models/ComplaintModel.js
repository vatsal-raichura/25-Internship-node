const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const complaintsSchema = new Schema({
    
    description:{
        type:String
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
        type:Date,
    },
    
    
   
},{timestamps:true})

module.exports = mongoose.model("complaints",complaintsSchema)