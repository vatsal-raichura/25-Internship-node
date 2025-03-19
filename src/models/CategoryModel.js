const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  //fields // get

  
  
  categoryType: {
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
    type:String
    
  },
  status:{
    enum:[
      'active',
      'inactive'
    ],
    type:String
  }

},{timestamps:true});

module.exports = mongoose.model("category", categorySchema);
