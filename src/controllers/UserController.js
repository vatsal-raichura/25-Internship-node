const userModel = require("../models/UserModel")
const bcrypt = require("bcrypt")
const mailUtil = require("../utils/MailUtil")

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

      await mailUtil.sendingMail(createdUser.email,"welcome to Buyer Talk","this is welcome mail")

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
    getAllUsers,addUser,deleteUSer,getUserById,signup,loginUser
 }

