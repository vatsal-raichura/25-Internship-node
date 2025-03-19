
const notificationModel = require("../models/NotificationsModel");

const bcrypt = require("bcrypt")




const getAllNotification = async (req,res)=>{
    const notifications = await notificationModel.find().populate("userId");

    res.json({
        message:"notifications fetched successfully",
        data:notifications

    })
 }

 

 const addNotification = async (req,res)=>{
   try {
      const createdNotification = await notificationModel.create(req.body)
      res.status(201).json({
         message:"Notification Added successfully",
         data:createdNotification
      })
      
   } catch (err) {
      res.status(500).json({
         message:"error",
         data:err
      })
      
    
      
   }
 }

 const deleteNotification = async(req,res)=>{
    const deletedNotification = await notificationModel.findByIdAndDelete(req.params.id)
    res.json({
        message:"Notification deleted ....",
        data:deletedNotification
    })
 }

 const getNotificationById = async (req,res)=>{
    const specificNotification = await notificationModel.findById(req.params.id)
    res.json({
        message:"Notification found successfully",
        data:specificNotification
    })
 }

 module.exports={
    getAllNotification,addNotification,deleteNotification,getNotificationById
 }