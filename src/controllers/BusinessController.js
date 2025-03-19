const BusinessModel = require("../models/BusinessModel");

const bcrypt = require("bcrypt");

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
    const createdUser = await BusinessModel.create(req.body);
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
};
