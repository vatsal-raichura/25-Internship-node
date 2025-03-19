const RatingModel = require("../models/RatingModel");

const bcrypt = require("bcrypt")




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

 module.exports={
    getAllRating,addRating,deleteRating,getRatingById
 }