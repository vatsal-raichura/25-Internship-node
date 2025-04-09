const RatingModel = require("../models/RatingModel");

const bcrypt = require("bcrypt")
const mongoose = require("mongoose");
const ProductModel = require("../models/ProductModel");




const getAllRating = async (req,res)=>{
    const ratings = await RatingModel.find().populate("userId productId");

    res.json({
        message:"ratings fetched successfully",
        data:ratings

    })
 }

 


// const addRating = async (req, res) => {
//   try {
//     const { productId, rating, comment, userId } = req.body;

//     // Validate ObjectId formats
//     if (!mongoose.Types.ObjectId.isValid(productId)) {
//       return res.status(400).json({ message: "Invalid productId format" });
//     }
//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({ message: "Invalid userId format" });
//     }

//     // Ensure rating is a valid number between 1 and 5
//     const numericRating = parseFloat(rating);
//     if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
//       return res.status(400).json({ message: "Rating must be between 1 and 5" });
//     }

//     // Create and save new rating
//     const createdRating = await RatingModel.create({
//       productId,
//       userId,
//       rating: numericRating,
//       comment,
//       review_date: new Date()
//     });

//     // ✅ Fix: Push the raw `createdRating._id` (not wrapped in `ObjectId`)
//     const updatedProduct = await ProductModel.findByIdAndUpdate(
//       productId,
//       { $push: { reviews: createdRating._id } }, // Correct push operation
//       { new: true, useFindAndModify: false }
//     );

//     if (!updatedProduct) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     res.status(201).json({
//       message: "Rating added successfully and stored in product",
//       data: createdRating
//     });

//   } catch (err) {
//     console.error("Error adding rating:", err);
//     res.status(500).json({ message: "Internal Server Error", error: err.message });
//   }
// };

const addRating = async (req, res) => {
  try {
    const { productId, rating, comment, userId } = req.body;

    // Validate ObjectId formats
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid productId format" });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId format" });
    }

    // Ensure rating is a valid number between 1 and 5
    const numericRating = parseFloat(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

//     const existingReview = await RatingModel.findOne({ productId, userId });
//     if (existingReview) {
//      return res.status(400).json({ message: "You have already reviewed this product." });
// }

    // Create and save new rating
    const createdRating = await RatingModel.create({
      productId,
      userId,
      rating: numericRating,
      comment,
      review_date: new Date()
    });

    // Push review ID into the product's reviews array
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      { $push: { reviews: createdRating._id } },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ✅ Recalculate averageRating and reviewCount
    const allRatings = await RatingModel.find({ productId });

    const averageRating =
      allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;

    // ✅ Update product with new stats and recent reviews
    await ProductModel.findByIdAndUpdate(productId, {
      averageRating,
      reviewCount: allRatings.length,
      reviews: allRatings
        // .slice(-3)
        .map((r) => ({
          userId: r.userId,
          rating: r.rating,
          comment: r.comment,
          review_date: r.review_date,
        }))
    });

    return res.status(201).json({
      message: "Rating added successfully and product updated",
      data: createdRating
    });

  } catch (err) {
    console.error("Error adding rating:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid productId format" });
    }

    // Populate product's reviews
    const product = await ProductModel.findById(productId)
      .populate({
        path: 'reviews',
        populate: {
          path: 'userId',
          select: 'firstname lastname email ' // select what you want to show from user
        },
        select: "rating comment review_date"
      });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const formattedReviews = product.reviews.map((review) => {
      const user = review.userId;
      const fullName = user?.firstname && user?.lastname
        ? `${user.firstname} ${user.lastname}`
        : user?.firstname || user?.lastname || "Unknown";

      return {
        _id: review._id,
        rating: review.rating,
        comment: review.comment,
        review_date: review.review_date,
        // name: fullName ,
        // email: user?.email// ✅ Final merged name field,
        name: review.userId ? `${review.userId.firstname} ${review.userId.lastname}` : "Unknown User",
      email: review.userId ? review.userId.email : "No Email"
      };
    });

    return res.status(200).json({
      productId: product._id,
      totalReviews: product.reviewCount,
      averageRating: product.averageRating,
      reviews: formattedReviews
    });

  } catch (err) {
    console.error("Error fetching product reviews:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};










 

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
    getAllRating,addRating,deleteRating,getRatingById,getAllRatingsByUserId,getProductReviews
 }