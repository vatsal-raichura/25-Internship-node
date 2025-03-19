const discussionModel = require("../models/ForumDiscussionsModel");

const bcrypt = require("bcrypt")




const getAllDiscussion = async (req,res)=>{
    const discussions = await discussionModel.find().populate("userId");

    res.json({
        message:"ratings fetched successfully",
        data:discussions

    })
 }

 

 const addDiscussion = async (req,res)=>{
   try {
      const createdDiscussion = await discussionModel.create(req.body)
      res.status(201).json({
         message:"Discussion Added successfully",
         data:createdDiscussion
      })
      
   } catch (err) {
      res.status(500).json({
         message:"error",
         data:err
      })
      
    
      
   }
 }

 const deleteDiscussion = async(req,res)=>{
    const deletedDiscussion = await discussionModel.findByIdAndDelete(req.params.id)
    res.json({
        message:"Discussion deleted ....",
        data:deletedDiscussion
    })
 }

 const getDiscussionById = async (req,res)=>{
    const specificDiscussion = await discussionModel.findById(req.params.id)
    res.json({
        message:"Discussion found successfully",
        data:specificDiscussion
    })
 }

 module.exports={
    getAllDiscussion,addDiscussion,deleteDiscussion,getDiscussionById
 }