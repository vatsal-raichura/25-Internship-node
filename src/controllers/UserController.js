const userModel = require("../models/UserModel")
const bcrypt = require("bcrypt")
const mailUtil = require("../utils/MailUtil")
const jwt = require("jsonwebtoken")
const secret = process.env.JWT_SECRET
require('dotenv').config();

const getUserCounts = async (req, res) => {
   try {
      // Count active users
      const activeUsersCount = await userModel.countDocuments({ active: true });

      // Count inactive users
      const inactiveUsersCount = await userModel.countDocuments({ active: false });

      res.status(200).json({
         message: "User counts fetched successfully",
         data: {
            activeUsers: activeUsersCount,
            inactiveUsers: inactiveUsersCount
         }
      });
   } catch (err) {
      console.error("Error fetching user counts:", err);
      res.status(500).json({
         message: "Error fetching user counts",
         data: err
      });
   }
};


const loginUser = async (req,res)=>{
   // req.body email and password : password

   const email= req.body.email;
   const password = req.body.password;

   // normal password compare 

   //const foundUserFromEmail = userModel.findOne({email:req.body.email})
   const foundUserFromEmail =  await userModel.findOne({email:email}).populate("roleId");
   console.log(foundUserFromEmail);

   if(foundUserFromEmail!= null){

      if(foundUserFromEmail.isBlocked){
         return res.status(403).json({

            success:false,
            message:"Your account has been blocked by the admin"
         })
      }
      const isMatch = bcrypt.compareSync(password,foundUserFromEmail.password)

     

      if(isMatch == true){
         res.status(200).json({
            message:"login successfully",
            data:foundUserFromEmail,
         })

         await userModel.findByIdAndUpdate(userModel._id, { lastLogin: new Date() });
      } else{
         res.status(401).json({
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

// const forgotPassword = async(req,res) =>{

//    const email = req.body.email;
//    const foundUser  = await userModel.findOne({email : email});

//    if(foundUser != null) {

//       const token = jwt.sign(foundUser.toObject(),secret);
//       console.log(token);
//       const url = `http://localhost:5173/resetPassword/${token}`;
//       const mailContent = `<html>
//                               <a href="${url}">Reset Password</a>   
//                            </html>` ;
      
//       await mailUtil.forgotSendingMail(foundUser.email, "reset password" , mailContent);
//       res.status(200).json({
//        message:"reset password link sent to your mail"
//       }); 

//    }else {
//        res.status(404).json({
//            message:"Email not found..."
//        });
//    }
// }

// const resetPassword = async(req,res)=>{
//    const token = req.body.token;
//    const newPassword = req.body.password;

//    const userFromToken = jwt.verify(token,secret);


//    const salt = bcrypt.genSaltSync(10);
//    const hashedPassword = bcrypt.hashSync(newPassword,salt)

//    const updateUser = await userModel.findByIdAndUpdate(userFromToken._id, {
//        password:hashedPassword,
//    });
//    res.json({
//        message:"password updated successfully.."
//    });

// }

const forgotPassword = async (req, res) => {
   const email = req.body.email;
   const foundUser = await userModel.findOne({ email: email });

   if (!foundUser) {
       return res.status(404).json({ message: "Email not found..." });
   }

   const token = jwt.sign({ _id: foundUser._id }, secret, { expiresIn: "15m" });
   console.log("Generated Token:", token);

   const url = `http://localhost:5173/resetPassword/${token}`;
   const mailContent = `<html>
                           <a href="${url}">Reset Password</a>   
                        </html>` ;
   
   await mailUtil.forgotSendingMail(foundUser.email, "Reset Password", mailContent);
   
   return res.status(200).json({
       message: "Reset password link sent to your mail"
   });
};

const resetPassword = async (req, res) => {
   const token = req.body.token;
   const newPassword = req.body.password;

   try {
       const userFromToken = jwt.verify(token, secret);
       const user = await userModel.findById(userFromToken._id);

       if (!user) {
           return res.status(404).json({ message: "User not found" });
       }

       const salt = bcrypt.genSaltSync(10);
       user.password = bcrypt.hashSync(newPassword, salt);

       await user.save();

       return res.status(200).json({ message: "Password updated successfully" });
   } catch (error) {
       console.error("Token Error:", error);
       return res.status(400).json({ message: "Invalid or expired token" });
   }
};





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
    getAllUsers,addUser,deleteUSer,getUserById,signup,loginUser,forgotPassword,resetPassword,getUserCounts
 }

