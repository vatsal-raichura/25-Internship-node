const RatingModel = require("../models/RatingModel");

const bcrypt = require("bcrypt")
const mongoose = require("mongoose")




const getAllRating = async (req,res)=>{
    const ratings = await RatingModel.find().populate("userId productId");

    res.json({
        message:"ratings fetched successfully",
        data:ratings

    })
 }

 

 const addRating = async (req,res)=>{
   try {
      const createdRating = await RatingModel.create(req.body)
      res.status(201).json({
         message:"Rating Added successfully",
         data:createdRating
      })
      
   } catch (err) {
      res.status(500).json({
         message:"error",
         data:err
      })
      
    
      
   }
 }

 const deleteRating = async(req,res)=>{
    const deletedRating = await RatingModel.findByIdAndDelete(req.params.id)
    res.json({
        message:"Rating deleted ....",
        data:deletedRating
    })
 }

 const getRatingById = async (req,res)=>{
    const specificRating = await RatingModel.findById(req.params.id)
    res.json({
        message:"Rating found successfully",
        data:specificRating
    })
 }

 const getAllRatingsByUserId = async (req, res) => {
    try {
      const userId = req.params.userId;
      console.log("🔍 Received Request for userId:", userId);
  
      if (!userId || userId === "undefined") {
        return res.status(400).json({ message: "Invalid user ID" });
      }
  
      const ratings = await RatingModel.find({ userId: new mongoose.Types.ObjectId(userId) })
        .populate("productId");
  
      if (!ratings.length) {
        return res.status(404).json({ message: "No Review and Ratings found" });
      }
  
      res.status(200).json({ message: "Review and Ratings retrieved", data: ratings });
    } catch (err) {
      console.error("🔥 Error:", err);
      res.status(500).json({ message: err.message });
    }
  };
  
  
 
 
 
 
 
  
  
 
  
 

 module.exports={
    getAllRating,addRating,deleteRating,getRatingById,getAllRatingsByUserId
 }