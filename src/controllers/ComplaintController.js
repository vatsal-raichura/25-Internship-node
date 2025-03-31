const ComplaintModel = require("../models/ComplaintModel");

const bcrypt = require("bcrypt")
const mongoose = require("mongoose")




const getAllComplaint = async (req,res)=>{
    const complaints = await ComplaintModel.find().populate({
      path: "productId userId", 
      select: "name brand price productURL", // Select specific product fields
    })
    
    .exec();



    res.json({
        message:"complaints fetched successfully",
        data:complaints

    })
 }

 const updateComplaint = async (req, res) => {
   //update tablename set  ? where id = ?
   //update new data -->req.body
   //id -->req.params.id
 
   try {
     const updatedComplaint = await ComplaintModel.findByIdAndUpdate(
       req.params.id,
       req.body,
       { new: true }
     );
     res.status(200).json({
       message: "Product updated successfully",
       data: updatedComplaint,
     });
   } catch (err) {
     res.status(500).json({
       message: "error while update product",
       err: err,
     });
   }
 };

//  const getAllComplaintsByUserId = async (req, res) => {
//    try {
//      const complaints = await ComplaintModel.find({
//        userId: req.params.userId, // Filtering complaints by userId
//      }).populate("productId userId"); // Populating product details
 
//      if (complaints.length === 0) {
//        res.status(404).json({ message: "No complaints found" });
//      } else {
//        res.status(200).json({
//          message: "Complaints retrieved successfully",
//          data: complaints,
//        });
//      }
//    } catch (err) {
//      res.status(500).json({ message: err.message });
//    }
//  };
const getAllComplaintsByUserId = async (req, res) => {
   try {
     const userId = req.params.userId;
     console.log("🔍 Received Request for userId:", userId);
 
     if (!userId || userId === "undefined") {
       return res.status(400).json({ message: "Invalid user ID" });
     }
 
     const complaints = await ComplaintModel.find({ userId: new mongoose.Types.ObjectId(userId) })
       .populate("productId");
 
     if (!complaints.length) {
       return res.status(404).json({ message: "No complaints found" });
     }
 
     res.status(200).json({ message: "Complaints retrieved", data: complaints });
   } catch (err) {
     console.error("🔥 Error:", err);
     res.status(500).json({ message: err.message });
   }
 };
 
 





 
 

 

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
    getAllComplaint,addComplaint,deleteComplaint,getComplaintById,getAllComplaintsByUserId,updateComplaint
 }
