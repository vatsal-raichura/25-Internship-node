const ProductModel = require("../models/ProductModel");
const multer = require("multer");
const path = require("path");

const bcrypt = require("bcrypt");
const cloudinaryUtil = require("../utils/CloudinaryUtil");

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
}).single("image");

const getAllProduct = async (req, res) => {
  const products = await ProductModel.find().populate("businessId categoryId reviews").exec();

  res.json({
    message: "products fetched successfully",
    data: products,
  });
};
const addProduct = async (req, res) => {
  try {
    // Ensure rating and ratingCount default values
    req.body.rating = req.body.rating !== undefined ? req.body.rating : 0;
    req.body.ratingCount = req.body.ratingCount !== undefined ? req.body.ratingCount : 0;

    // Create the product
    const createdProduct = await ProductModel.create(req.body);

    res.status(201).json({
      message: "Product created successfully.",
      data: createdProduct,
    });
  } catch (err) {
    console.error("❌ Error creating product:", err);
    res.status(500).json({
      message: "Error",
      error: err.message,
    });
  }
};


const deleteProduct = async (req, res) => {
  const deletedProduct = await ProductModel.findByIdAndDelete(req.params.id);
  res.json({
    message: "user deleted ....",
    data: deletedProduct,
  });
};



const addProductWithFile = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      res.status(500).json({
        message: err.message,
      });
    } else {
      // database data store
      //cloundinary

      const cloundinaryResponse = await cloudinaryUtil.uploadFileToCloudinary(
        req.file
      );
      console.log(cloundinaryResponse);
      console.log(req.body);

      //store data in database
      req.body.productURL = cloundinaryResponse.secure_url;
      req.body.rating= 0;
      req.body.ratingCount=0;


      const savedProduct = await ProductModel.create(req.body);

      res.status(200).json({
        message: "Product saved successfully",
        data: savedProduct,
      });
    }
  });
};

// const getAllProductByBusinessId = async (req, res) => {
//   try {
//     const products = await ProductModel.find({
//       businessId: req.params.businessId,
//     }).populate("categoryId ratingId ");

//     if (products.length === 0) {
//       res.status(404).json({ message: "No products found" });
//     } else {
//       res.status(200).json({
//         message: "product found successfully",
//         data: products,
//       });
//     }
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// const getAllProductByBusinessId = async (req, res) => {
//   try {
//     const products = await ProductModel.find({
//       businessId: req.params.businessId,
//     }).populate("categoryId businessId reviews").exec();
//     if (products.length === 0) {
//       res.status(404).json({ message: "No productas found" });
//     } else {
//       res.status(200).json({
//         message: "product found successfully",
//         data: products,
//       });
//     }
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// const getAllProductByBusinessId = async (req, res) => {
//   try {
//     const products = await ProductModel.find({
//       businessId: req.params.businessId,
//     })
//     .populate("categoryId businessId")
//     .populate({
//       path: "reviews",
//       model:"ratings",
//       populate: {
//         path: "userId", // Populate the user who wrote the review
//         select: "firstname lastname email", }// Select only needed fields // Fetch user details inside reviews
//       }).lean(); // Converts documents to plain JavaScript objects

//       console.log("Fetched Products:", JSON.stringify(products, null, 2)); 

//     if (!products.length) {
//       return res.status(200).json({ message: "No products found", data: [] });
//     }

    

//     res.status(200).json({
//       message: "Products retrieved successfully",
//       data: products,
//     });
//   } catch (err) {
//     console.error("Error fetching products:", err);
//     res.status(500).json({ message: "Internal Server Error", error: err.message });
//   }
// };

// const getAllProductByBusinessId = async (req, res) => {
//   try {
//     const products = await ProductModel.find({
//       businessId: req.params.businessId,
//     })
//     .populate("categoryId businessId")
//     .populate({
//       path: "reviews",
//       model: "ratings",
//       populate: {
//         path: "userId",
//         model:"users",
//         select: "firstname lastname email", 
//       },
//     })
//     .populate({
//       path: "complaints",
//       model: "complaints",
//       populate: {
//         path: "userId",
//         model: "users",
//         select: "firstname lastname email",
//       },
//     })
//     .lean(); // Convert documents to plain JavaScript objects

//     console.log("Fetched Products:", JSON.stringify(products, null, 2));

//     if (!products.length) {
//       return res.status(200).json({ message: "No products found", data: [] });
//     }

//     // ✅ Format reviews array to include name & email
//     const formattedProducts = products.map(product => ({
//       ...product,
//       reviews: (product.reviews || []).map(review => ({
//         _id: review._id,
//         rating: review.rating,
//         comment: review.comment,
//         review_date: review.review_date,
//         name: review.userId ? `${review.userId.firstname} ${review.userId.lastname}` : "Unknown User",
//         email: review.userId ? review.userId.email : "No Email",
//       })),
//       complaints: (product.complaints || []).map((complaint) => ({
//         _id: complaint._id,
//         message: complaint.message,
//         complaintType: complaint.complaintType,
//         filedDate: complaint.filedDate,
//         name: complaint.userId
//           ? `${complaint.userId.firstname} ${complaint.userId.lastname}`
//           : "Unknown User",
//         email: complaint.userId ? complaint.userId.email : "No Email",
//       })),
//     }));
    
    

//     res.status(200).json({
//       message: "Products retrieved successfully",
//       data: formattedProducts,
//     });

//   } catch (err) {
//     console.error("Error fetching products:", err);
//     res.status(500).json({ message: "Internal Server Error", error: err.message });
//   }
// };

const getAllProductByBusinessId = async (req, res) => {
  try {
    const products = await ProductModel.find({
      businessId: req.params.businessId,
    })
    .populate("categoryId businessId")
    .populate({
      path: "reviews",
      model: "ratings",
      populate: {
        path: "userId",
        model:"users",
        select: "firstname lastname email", 
      },
    })
    .populate({
      path: "complaints",
      model: "complaints",
      populate: {
        path: "userId",
        model: "users",
        select: "firstname lastname email",
      },
    })
    .lean(); // Convert documents to plain JavaScript objects

    console.log("Fetched Products:", JSON.stringify(products, null, 2));

    if (!products.length) {
      return res.status(200).json({ message: "No products found", data: [] });
    }

    // ✅ Format reviews array to include name & email
    const formattedProducts = products.map(product => ({
      ...product,
      reviews: (product.reviews || []).map(review => ({
        _id: review._id,
        rating: review.rating,
        comment: review.comment,
        review_date: review.review_date,
        name: review.userId ? `${review.userId.firstname} ${review.userId.lastname}` : "Unknown User",
        email: review.userId ? review.userId.email : "No Email",
      })),
      complaints: (product.complaints || []).map((complaint) => ({
        _id: complaint._id,
        description: complaint.description,
        status: complaint.status,
        fileddate: complaint.fileddate,
        name: complaint.userId
          ? `${complaint.userId.firstname} ${complaint.userId.lastname}`
          : "Unknown User",
        email: complaint.userId ? complaint.userId.email : "No Email",
      })),
    }));
    
    

    res.status(200).json({
      message: "Products retrieved successfully",
      data: formattedProducts,
    });

  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};







const updateProduct = async (req, res) => {
  //update tablename set  ? where id = ?
  //update new data -->req.body
  //id -->req.params.id

  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (err) {
    res.status(500).json({
      message: "error while update product",
      err: err,
    });
  }
};

// const getProductById = async (req, res) => {
//   try {
//     const product = await ProductModel.findById(req.params.id);
//     if (!product) {
//       res.status(404).json({ message: "No Product found" });
//     } else {
//       res.status(200).json({
//         message: "Product found successfully",
//         data: product,
//       });
//     }
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

const getProductById = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.productId)
      .populate("categoryId businessId")
      .populate({
        path: "reviews",
        model: "ratings", // ✅ Use your actual model name
        populate: {
          path: "userId",
          model: "users", // ✅ Must match your User model
          select: "firstname lastname email",
        },
      })
      .populate({
        path: "complaints",
        model: "complaints",
        populate: {
          path: "userId",
          model: "users",
          select: "firstname lastname email",
        },
      })
      .lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ✅ Format reviews just like in getAllProductByBusinessId
    const formattedProduct = {
      ...product,
      reviews: (product.reviews || []).map((review) => ({
        _id: review._id,
        rating: review.rating,
        comment: review.comment,
        review_date: review.review_date,
        name: review.userId
          ? `${review.userId.firstname} ${review.userId.lastname}`
          : "Unknown User",
        email: review.userId ? review.userId.email : "No Email",
      })),
      complaints: (product.complaints || []).map((complaint) => ({
        _id: complaint._id,
        description: complaint.description,
        fileddate: complaint.fileddate,
        status: complaint.status,
        name: complaint.userId ? `${complaint.userId.firstname} ${complaint.userId.lastname}` : "Unknown User",
        email: complaint.userId ? complaint.userId.email : "No Email",
      })),
    };

    res.status(200).json({
      message: "Product retrieved successfully",
      data: formattedProduct,
    });

  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


// const getAllProductByCategory = async (req, res) => {
//   try {
//     const foundProducts = await ProductModel.find({
//       categoryId: req.params.categoryId, // Fetch products by category ID
//     });

//     if (foundProducts.length === 0) {
//       return res.status(404).json({ message: "No products found for this category" });
//     }

//     res.status(200).json({
//       message: "Products fetched successfully",
//       data: foundProducts,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

const getAllProductByCategory = async (req, res) => {
  try {
    const categoryName = req.params.category; // Get category name from request params
    const products = await ProductModel.find({ category: categoryName }); // Fetch by category name

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found for this category" });
    }

    res.status(200).json({
      message: "Products found successfully",
      data: products,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



module.exports = {
  getAllProduct,
  addProduct,
  deleteProduct,
  
  addProductWithFile,
  getAllProductByBusinessId,
  updateProduct,
  getProductById,
  getAllProductByCategory
};
