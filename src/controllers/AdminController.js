
const mailUtil = require("../utils/MailUtil")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const secret = "secret"
const Product = require("../models/ProductModel");
const Rating = require("../models/RatingModel");
const Complaint = require("../models/ComplaintModel");
const User = require("../models/UserModel");
const Business = require("../models/BusinessModel");
const Admin = require("../models/AdminModel");

// In AdminController.js

const moment = require('moment');

const adminSignup = async(req,res)=>{
     
  try{
     
     const salt = bcrypt.genSaltSync(10);
     const hashedPassword = bcrypt.hashSync(req.body.password, salt);
     req.body.password = hashedPassword;
     
     const createdAdmin = await Admin.create(req.body)
     await mailUtil.adminSendingMail(createdAdmin.email,"welcome to Buyer Talk","this is welcome mail")
     res.status(201).json({
         message:"Admin created..",
         data:createdAdmin


     })

  }catch(err){

     


     res.status(500).json({
         message:"error",
         data:err.message
     })

  }

}

const adminLogin = async (req,res) =>{


  const email = req.body.email;
  const password = req.body.password;
 
  const foundAdminFromEmail = await Admin.findOne({email: email}).populate("roleId");
  console.log(foundAdminFromEmail);
 
  if(foundAdminFromEmail != null){
      
      const isMatch = bcrypt.compareSync(password,foundAdminFromEmail.password);
 
      if(isMatch == true){
          res.status(200).json({
              message:"login successfully",
              data:foundAdminFromEmail
          });
 
      }else{
          res.status(401).json({
              message:"invalid cred....",
          });
      }
  }else{
      res.status(404).json({
          message:"Email not found..."
      });
  }
 };


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // exclude password
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};

const toggleUserBlock = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({ success: true, message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully` });
  } catch (error) {
    console.error("Failed to update user block status:", error);
    res.status(500).json({ success: false, message: "Failed to update user status" });
  }
};


const deleteUser = async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getAllBusiness = async (req, res) => {
  try {
    const businesses = await Business.find({}, "-password"); // exclude password
    res.status(200).json({ success: true, data: businesses });
  } catch (error) {
    console.error("Failed to fetch business providers:", error);
    res.status(500).json({ success: false, message: "Failed to fetch business providers" });
  }
};

const toggleBusinessBlock = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) return res.status(404).json({ success: false, message: "Business provider not found" });

    business.isBlocked = !business.isBlocked;
    await business.save();

    res.status(200).json({ success: true, message: `Business Provider ${business.isBlocked ? 'blocked' : 'unblocked'} successfully` });
  } catch (error) {
    console.error("Failed to update business provider block status:", error);
    res.status(500).json({ success: false, message: "Failed to update business provider status" });
  }
};


const deleteBusiness = async (req, res) => {
  try {
    const result = await Business.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ success: false, message: "Business provider not found" });

    res.status(200).json({ success: true, message: "Business provider deleted successfully" });
  } catch (error) {
    console.error("Error deleting business provider:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getNewUsersThisMonth = async (req, res) => {
  try {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const newUsersCount = await User.countDocuments({
      createdAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
    });

    res.status(200).json({ newUsersThisMonth: newUsersCount });
  } catch (err) {
    console.error("Error fetching new users this month:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// const getMonthlyUserRegistrations = async (req, res) => {
//   try {
//     const users = await User.aggregate([
//       {
//         $group: {
//           _id: {
//             year: { $year: "$createdAt" },
//             month: { $month: "$createdAt" }
//           },
//           count: { $sum: 1 }
//         }
//       },
//       {
//         $sort: {
//           "_id.year": 1,
//           "_id.month": 1
//         }
//       }
//     ]);

//     const formatted = users.map(({ _id, count }) => ({
//       name: `${_id.month}/${_id.year}`,
//       count
//     }));

//     res.status(200).json({ data: formatted });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// const getMonthlyUserRegistrations = async (req, res) => {
//   try {
//     const registrations = await User.aggregate([
//       {
//         $group: {
//           _id: {
//             year: { $year: "$createdAt" },
//             month: { $month: "$createdAt" }
//           },
//           count: { $sum: 1 }
//         }
//       },
//       {
//         $sort: {
//           "_id.year": 1,
//           "_id.month": 1
//         }
//       }
//     ]);

//     // Determine the date range (first and last months with data)
//     const now = new Date();
//     const start = new Date(registrations[0]?._id?.year || now.getFullYear(), (registrations[0]?._id?.month || now.getMonth() + 1) - 1, 1);
//     const end = new Date(now.getFullYear(), now.getMonth(), 1);

//     const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
//                         "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

//     const completeData = [];
//     const registrationMap = new Map();

//     // Create a quick lookup map from the aggregation result
//     registrations.forEach(({ _id, count }) => {
//       const key = `${_id.year}-${_id.month}`;
//       registrationMap.set(key, count);
//     });

//     // Fill in all months between start and end
//     let current = new Date(start);
//     while (current <= end) {
//       const year = current.getFullYear();
//       const month = current.getMonth() + 1;
//       const key = `${year}-${month}`;
//       completeData.push({
//         name: `${monthNames[month - 1]} ${year}`,
//         count: registrationMap.get(key) || 0
//       });

//       current.setMonth(current.getMonth() + 1);
//     }

//     res.status(200).json({ data: completeData });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

const UserModel = require("../models/UserModel");

const getAllMonthlyUserRegistrations = async (req, res) => {
  try {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1); // Start of 2 months ago

    const result = await UserModel.aggregate([
      {
        $match: {
          createdAt: { $exists: true, $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1
        }
      }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Ensure full 3-month coverage (even if 0 count for a month)
    const today = new Date();
    const monthList = Array.from({ length: 3 }, (_, i) => {
      const d = new Date(today.getFullYear(), today.getMonth() - 2 + i);
      return { month: d.getMonth() + 1, year: d.getFullYear(), name: monthNames[d.getMonth()] };
    });

    const formatted = monthList.map(({ month, year, name }) => {
      const found = result.find(r => r._id.month === month && r._id.year === year);
      return {
        name,
        count: found ? found.count : 0
      };
    });

    res.status(200).json({ data: formatted });
  } catch (err) {
    console.error("Error fetching user registrations:", err);
    res.status(500).json({ message: err.message });
  }
};



const getMonthlyBusinessRegistrations = async (req, res) => {
  try {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1); // Start of 2 months ago

    const result = await Business.aggregate([
      {
        $match: {
          createdAt: { $exists: true, $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1
        }
      }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Ensure full 3-month coverage (even if 0 count for a month)
    const today = new Date();
    const monthList = Array.from({ length: 3 }, (_, i) => {
      const d = new Date(today.getFullYear(), today.getMonth() - 2 + i);
      return { month: d.getMonth() + 1, year: d.getFullYear(), name: monthNames[d.getMonth()] };
    });

    const formatted = monthList.map(({ month, year, name }) => {
      const found = result.find(r => r._id.month === month && r._id.year === year);
      return {
        name,
        count: found ? found.count : 0
      };
    });

    res.status(200).json({ data: formatted });
  } catch (err) {
    console.error("Error fetching user registrations:", err);
    res.status(500).json({ message: err.message });
  }
};

// controllers/adminController.js
const RatingModel = require("../models/RatingModel");

const getRatingDistribution = async (req, res) => {
  try {
    const distribution = await RatingModel.aggregate([
      {
        $group: {
          _id: "$rating", // Group by rating value (1–5)
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 } // Sort ratings from 1 to 5
      }
    ]);

    const fullDistribution = [1, 2, 3, 4, 5].map(rating => {
      const found = distribution.find(d => d._id === rating);
      return {
        rating: `${rating}★`,
        count: found ? found.count : 0
      };
    });

    res.status(200).json({ data: fullDistribution });
  } catch (err) {
    console.error("Error fetching rating distribution:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getRatingDistribution };

// controllers/adminController.js
const ProductModel = require("../models/ProductModel");
const BusinessModel = require("../models/BusinessModel");

const getProductCountByBusiness = async (req, res) => {
  try {
    const result = await ProductModel.aggregate([
      {
        $group: {
          _id: "$businessId",
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "businesses",
          localField: "_id",
          foreignField: "_id",
          as: "business"
        }
      },
      {
        $unwind: "$business"
      },
      {
        $project: {
          _id: 0,
          businessName: "$business.businessname",
          count: 1
        }
      },
      {
        $sort: { count: -1 } // Optional: highest product count first
      }
    ]);

    res.status(200).json({ data: result });
  } catch (err) {
    console.error("Error fetching product count by business:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};










  const getStats= async (req, res) => {
    const [products, ratings, complaints, users, businesses] = await Promise.all([
      Product.find(),
      Rating.find(),
      Complaint.find(),
      User.find(),
      Business.find(),
    ]);
    // const currentMonth = new Date().getMonth();
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const totalUsers = await User.countDocuments();

const newUsersThisMonth = await User.countDocuments({
  createdAt: { $gte: startOfMonth }
});

const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
const activeUsers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }); 
const inactiveUsers = totalUsers - activeUsers;
    // const newUsersThisMonth = users.filter(
    //   (u) => new Date(u.createdAt).getMonth() === currentMonth
    // ).length;

    res.json({
      totalProducts: products.length,
      totalRatings: ratings.length,
      totalComplaints: complaints.length,
      totalUsers: users.length,
      totalBusinesses: businesses.length,
      newUsersThisMonth,
      activeUsers,
      inactiveUsers,
    });
  }

 



module.exports={
   
    getStats,
    getNewUsersThisMonth,
   
    getAllMonthlyUserRegistrations,
    // getMonthlyUserRegistrations,
    getMonthlyBusinessRegistrations,
    getRatingDistribution,
    getProductCountByBusiness,
    getAllUsers,
    toggleUserBlock,
    deleteUser,
    getAllBusiness,
    toggleBusinessBlock,
    deleteBusiness,
    adminSignup,
    adminLogin




}

