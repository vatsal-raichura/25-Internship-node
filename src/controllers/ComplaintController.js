const ComplaintModel = require("../models/ComplaintModel");

const bcrypt = require("bcrypt")




const getAllComplaint = async (req,res)=>{
    const complaints = await ComplaintModel.find().populate("userId productId");

    res.json({
        message:"complaints fetched successfully",
        data:complaints

    })
 }

 

 const addComplaint = async (req,res)=>{
   try {
      const createdComplaint = await ComplaintModel.create(req.body)
      res.status(201).json({
         message:"Complaint created..",
         data:createdComplaint
      })
      
   } catch (err) {
      res.status(500).json({
         message:"error",
         data:err
      })
      
    
      
   }
 }



 const deleteComplaint = async(req,res)=>{
    const deletedComplaint = await ComplaintModel.findByIdAndDelete(req.params.id)
    res.json({
        message:"user deleted ....",
        data:deletedComplaint
    })
 }

 const getComplaintById = async (req,res)=>{
    const specificComplaint = await ComplaintModel.findById(req.params.id)
    res.json({
        message:"service found successfully",
        data:specificComplaint
    })
 }

 module.exports={
    getAllComplaint,addComplaint,deleteComplaint,getComplaintById
 }
