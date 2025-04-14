const BusinessModel = require("../models/BusinessModel");
const mailUtil = require("../utils/MailUtil")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const secret = "secret"


const express = require("express");
const router = express.Router();
// const { verifyBusiness } = require("../middlewares/authMiddleware");
const Rating = require("../models/RatingModel");
const Complaint = require("../models/ComplaintModel");
const Product = require("../models/ProductModel");



const getBusinessRatings = async (req, res) => {
  try {
    const businessId = req.query.businessId;
    if (!businessId) {
      return res.status(400).json({ message: "Business ID is required" });
    }

    // Get all products for this business
    const products = await Product.find({ businessId });
    if (!products.length) {
      return res.json([]); // No products, return empty array
    }

    const productIds = products.map((product) => product._id);

    // Fetch ratings and populate user data
    const ratings = await Rating.find({ productId: { $in: productIds } })
      .populate("userId", "firstname lastname")  // Ensure user data is populated
      .exec();

    // Structure the response
    const data = products.map((product) => ({
      productName: product.name,
      ratings: ratings
        .filter((rating) => rating.productId.toString() === product._id.toString())
        .map((rating) => {
          console.log("Rating userId:", rating.userId); // Debugging userId
          
          return {
            rating: rating.rating,
            userName: rating.userId && rating.userId.firstname && rating.userId.lastname
              ? `${rating.userId.firstname} ${rating.userId.lastname}`
              : "Unknown User",
            review_comments: rating.comment || "No review",
            review_date: rating.review_date || "No comments",
          };
        }),
    }));

    console.log("Final Response Data:", data);
    res.json(data);
  } catch (error) {
    console.error("Error in getBusinessRatings:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};




const BusinessLogin = async (req, res) => {
  // req.body email and password : password

  const email = req.body.email;
  const password = req.body.password;

  // normal password compare

  //const foundUserFromEmail = userModel.findOne({email:req.body.email})
  const foundBusinessFromEmail = await BusinessModel.findOne({ email: email })
    .populate("roleId")
    .populate("userId");
  console.log(foundBusinessFromEmail);

  if (foundBusinessFromEmail != null) {

    if(foundUserFromEmail.isBlocked){
      return res.status(403).json({

         success:false,
         message:"Your account has been blocked by the admin"
      })
   }
    const isMatch = bcrypt.compareSync(
      password,
      foundBusinessFromEmail.password
    );

    if (isMatch == true) {
      res.status(200).json({
        message: "login successfully",
        data: foundBusinessFromEmail,
      });
    } else {
      res.status(404).json({
        message: "Invalid credentials...",
      });
    }
  } else {
    res.status(404).json({
      message: "Email not found...",
    });
  }
};

const BusinessSignUp = async (req, res) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    req.body.password = hashedPassword;
    const createdBusiness = await BusinessModel.create(req.body);

     await mailUtil.businessSendingMail(createdBusiness.email,"welcome to Buyer Talk","this is welcome mail")
    
    res.status(201).json({
      message: "service created...",
      data: createdUser,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "error",
      data: err,
    });
  }
};

// const forgotPassowrd= async(req,res)=>{
//    const email = req.body.email;
//    const foundBusiness = await BusinessModel.findOne({email:email})

//    if(foundBusiness != null){
//       const token = jwt.sign(foundBusiness.toObject(),secret)
//       console.log(token)
//       const url = `http://localhost:5173/businessResetPassword/${token}`;
//       const mailContent = `<html>
//                               <a href ="${url}"> reset password </a>
//                            </html>`
      
//       await mailUtil.forgotSendingMail(foundBusiness.email,"reset password",mailContent);
//       res.status(200).json({
//          message:"reset password link sent to mail "
//       });
//    } else{
//       res.status(404).json({
//          message:"user not found register first"
//       })
//    }
// }

// const resetPassword = async (req,res)=>{

//    const token = req.body.token;
//    const newPassword = req.body.password;

//    const businessFromToken = jwt.verify(token,secret)

//    const salt = bcrypt.genSaltSync(10)
//    const hashedPassword = bcrypt.compareSync(newPassword,salt)
   

//    const updatedBusiness = await BusinessModel.findByIdAndUpdate(businessFromToken._id,{
//       password:hashedPassword,
//    })
//    res.json({
//       message:"password updated successfully"
//    })
// }

const forgotPassword = async (req, res) => {
  const email = req.body.email;
  const foundBusiness = await BusinessModel.findOne({ email: email });

  if (!foundBusiness) {
      return res.status(404).json({ message: "Email not found..." });
  }

  const token = jwt.sign({ _id: foundBusiness._id }, secret, { expiresIn: "15m" });
  console.log("Generated Token:", token);

  const url = `http://localhost:5173/businessResetPassword/${token}`;
  const mailContent = `<html>
                          <a href="${url}">Reset Password</a>   
                       </html>` ;
  
  await mailUtil.forgotSendingMail(foundBusiness.email, "Reset Password", mailContent);
  
  return res.status(200).json({
      message: "Reset password link sent to your mail"
  });
};

const resetPassword = async (req, res) => {
  const token = req.body.token;
  const newPassword = req.body.password;

  try {
      const businessFromToken = jwt.verify(token, secret);
      const business = await BusinessModel.findById(businessFromToken._id);

      if (!business) {
          return res.status(404).json({ message: "Business not found" });
      }

      const salt = bcrypt.genSaltSync(10);
      business.password = bcrypt.hashSync(newPassword, salt);

      await business.save();

      return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
      console.error("Token Error:", error);
      return res.status(400).json({ message: "Invalid or expired token" });
  }
};



const getAllBusiness = async (req, res) => {
  const business = await BusinessModel.find().populate("roleId userId");

  res.json({
    message: "business fetched successfully",
    data: business,
  });
};

const addBusiness = async (req, res) => {
  try {
    const createdBusiness = await BusinessModel.create(req.body);
    res.status(201).json({
      message: "business created..",
      data: createdBusiness,
    });
  } catch (err) {
    res.status(500).json({
      message: "error",
      data: err,
    });
  }
};

const deleteBusiness = async (req, res) => {
  const deletedBusiness = await BusinessModel.findByIdAndDelete(req.params.id);
  res.json({
    message: "user deleted ....",
    data: deletedBusiness,
  });
};

const getBusinessById = async (req, res) => {
  const specificBusiness = await BusinessModel.findById(req.params.id);
  res.json({
    message: "business found successfully",
    data: specificBusiness,
  });
};

module.exports = {
  getAllBusiness,
  addBusiness,
  deleteBusiness,
  getBusinessById,
  BusinessSignUp,
  BusinessLogin,
  forgotPassword,
  resetPassword,
  getBusinessRatings

 
};
