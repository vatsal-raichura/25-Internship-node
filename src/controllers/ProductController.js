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
  const products = await ProductModel.find().populate("businessId categoryId");

  res.json({
    message: "products fetched successfully",
    data: products,
  });
};

const addProduct = async (req, res) => {
  try {
    const createdProduct = await ProductModel.create(req.body);
    res.status(201).json({
      message: "product created..",
      data: createdProduct,
    });
  } catch (err) {
    res.status(500).json({
      message: "error",
      data: err,
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
      const savedProduct = await ProductModel.create(req.body);

      res.status(200).json({
        message: "Product saved successfully",
        data: savedProduct,
      });
    }
  });
};

const getAllProductByBusinessId = async (req, res) => {
  try {
    const products = await ProductModel.find({
      businessId: req.params.businessId,
    }).populate("categoryId");
    if (products.length === 0) {
      res.status(404).json({ message: "No productas found" });
    } else {
      res.status(200).json({
        message: "product found successfully",
        data: products,
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
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

const getProductById = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: "No Product found" });
    } else {
      res.status(200).json({
        message: "Product found successfully",
        data: product,
      });
    }
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
};
