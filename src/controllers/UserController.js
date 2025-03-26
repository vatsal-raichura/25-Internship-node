const userModel = require("../models/UserModel")
const bcrypt = require("bcrypt")
const mailUtil = require("../utils/MailUtil")
const jwt = require("jsonwebtoken")
const secret = "secret"

const loginUser = async (req,res)=>{
   // req.body email and password : password

   const email= req.body.email;
   const password = req.body.password;

   // normal password compare 

   //const foundUserFromEmail = userModel.findOne({email:req.body.email})
   const foundUserFromEmail =  await userModel.findOne({email:email}).populate("roleId");
   console.log(foundUserFromEmail);

   if(foundUserFromEmail!= null){
      const isMatch = bcrypt.compareSync(password,foundUserFromEmail.password)

      if(isMatch == true){
         res.status(200).json({
            message:"login successfully",
            data:foundUserFromEmail,
         })
      } else{
         res.status(404).json({
            message:"Invalid credentials...",
         })
      }
   } else{
      res.status(404).json({
         message:"Email not found..."
      })
   }
}

const signup = async (req,res)=>{

   try {

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(req.body.password,salt);
      req.body.password = hashedPassword;
      const createdUser = await userModel.create(req.body);

      await mailUtil.userSendingMail(createdUser.email,"welcome to Buyer Talk","this is welcome mail")

      res.status(201).json({
         message:"user created...",
         data:createdUser
      })

      
   } catch (err) {
      console.log(err);
      res.status(500).json({
         message:"error",
         data:err
      })
      
   }

}

const forgotPassowrd= async(req,res)=>{
   const email = req.body.email;
   const foundUser = await userModel.findOne({email:email})

   if(foundUser != null){
      const token = jwt.sign(foundUser.toObject(),secret)
      console.log(token)
      const url = `http://localhost:5173/resetpassword/${token}`;
      const mailContent = `<html>
                              <a href ="${url}"> reset password </a>
                           </html>`
      
      await mailUtil.forgotSendingMail(foundUser.email,"reset password",mailContent);
      res.status(200).json({
         message:"reset password link sent to mail "
      });
   } else{
      res.status(404).json({
         message:"user not found register first"
      })
   }
}

const resetPassword = async (req,res)=>{

   const token = req.body.token;
   const newPassword = req.body.password;

   const userFromToken = jwt.verify(token,secret)

   const salt = bcrypt.genSaltSync(10);
   const hashedPassword = bcrypt.compareSync(newPassword,salt);
   

   const updatedUser = await userModel.findByIdAndUpdate(userFromToken._id,{
      password:hashedPassword,
   })
   res.json({
      message:"password updated successfully"
   })
}




const getAllUsers = async (req,res)=>{
    const users = await userModel.find().populate("roleId")

    res.json({
        message:"user fetched successfully",
        data:users

    })
 }

 

 const addUser = async (req,res)=>{
   try {
      const createdUser = await userModel.create(req.body)
      res.status(201).json({
         message:"user created..",
         data:createdUser
      })
      
   } catch (err) {
      res.status(500).json({
         message:"error",
         data:err
      })
      
    
      
   }
 }

 const deleteUSer = async(req,res)=>{
    const deletedUser = await userModel.findByIdAndDelete(req.params.id)
    res.json({
        message:"user deleted ....",
        data:deletedUser
    })
 }

 const getUserById = async (req,res)=>{
    const specificUser = await userModel.findById(req.params.id)
    res.json({
        message:"user found successfully",
        data:specificUser
    })
 }

 module.exports={
    getAllUsers,addUser,deleteUSer,getUserById,signup,loginUser,forgotPassowrd,resetPassword
 }

