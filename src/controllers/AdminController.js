
const mailUtil = require("../utils/MailUtil")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const secret = process.env.JWT_SECRET;
require('dotenv').config();
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


 const forgotPassword = async (req, res) => {
  const email = req.body.email;
  const foundAdmin = await AdminModel.findOne({ email: email });

  if (!foundAdmin) {
      return res.status(404).json({ message: "Email not found..." });
  }

  const token = jwt.sign({ _id: foundAdmin._id }, secret, { expiresIn: "15m" });
  console.log("Generated Token:", token);

  const url = `http://localhost:5173/adminResetPassword/${token}`;
  const mailContent = `<html>
                          <a href="${url}">Reset Password</a>   
                       </html>` ;
  
  await mailUtil.forgotSendingMail(foundAdmin.email, "Reset Password", mailContent);
  
  return res.status(200).json({
      message: "Reset password link sent to your mail"
  });
};

const resetPassword = async (req, res) => {
  const token = req.body.token;
  const newPassword = req.body.password;

  try {
      const adminFromToken = jwt.verify(token, secret);
      const admin = await AdminModel.findById(adminFromToken._id);

      if (!admin) {
          return res.status(404).json({ message: "Admin not found" });
      }

      const salt = bcrypt.genSaltSync(10);
      admin.password = bcrypt.hashSync(newPassword, salt);

      await admin.save();

      return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
      console.error("Token Error:", error);
      return res.status(400).json({ message: "Invalid or expired token" });
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

// const getAllMonthlyUserRegistrations = async (req, res) => {
//   try {
//     const now = new Date();
//     const startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1); // Start of 2 months ago

//     const result = await UserModel.aggregate([
//       {
//         $match: {
//           createdAt: { $exists: true, $gte: startDate }
//         }
//       },
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

//     const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
//     // Ensure full 3-month coverage (even if 0 count for a month)
//     const today = new Date();
//     const monthList = Array.from({ length: 3 }, (_, i) => {
//       const d = new Date(today.getFullYear(), today.getMonth() - 2 + i);
//       return { month: d.getMonth() + 1, year: d.getFullYear(), name: monthNames[d.getMonth()] };
//     });

//     const formatted = monthList.map(({ month, year, name }) => {
//       const found = result.find(r => r._id.month === month && r._id.year === year);
//       return {
//         name,
//         count: found ? found.count : 0
//       };
//     });

//     res.status(200).json({ data: formatted });
//   } catch (err) {
//     console.error("Error fetching user registrations:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

const getAllMonthlyUserRegistrations = async (req, res) => {
  try {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1); // Start of 2 months ago

    console.log("Start Date:", startDate);  // Add logging for debugging

    const result = await UserModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
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

    console.log("Aggregated Result:", result);  // Add logging to see the result

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
        month: name,
        count: found ? found.count : 0
      };
    });

    res.status(200).json({ data: formatted });
  } catch (err) {
    console.error("Error fetching user registrations:", err);
    res.status(500).json({ message: err.message });
  }
};




// const getMonthlyBusinessRegistrations = async (req, res) => {
//   try {
//     const now = new Date();
//     const startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1); // Start of 2 months ago

//     const result = await Business.aggregate([
//       {
//         $match: {
//           createdAt: { $exists: true, $gte: startDate }
//         }
//       },
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

//     const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
//     // Ensure full 3-month coverage (even if 0 count for a month)
//     const today = new Date();
//     const monthList = Array.from({ length: 3 }, (_, i) => {
//       const d = new Date(today.getFullYear(), today.getMonth() - 2 + i);
//       return { month: d.getMonth() + 1, year: d.getFullYear(), name: monthNames[d.getMonth()] };
//     });

//     const formatted = monthList.map(({ month, year, name }) => {
//       const found = result.find(r => r._id.month === month && r._id.year === year);
//       return {
//         name,
//         count: found ? found.count : 0
//       };
//     });

//     res.status(200).json({ data: formatted });
//   } catch (err) {
//     console.error("Error fetching user registrations:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// controllers/adminController.js
const getMonthlyBusinessRegistrations = async (req, res) => {
  try {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1); // Start of 2 months ago

    const result = await Business.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
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
    console.error("Error fetching business registrations:", err);
    res.status(500).json({ message: err.message });
  }
};



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
const AdminModel = require("../models/AdminModel");

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

const getWeeklyComplaintsTrend = async (req, res) => {
  try {
    const result = await Complaint.aggregate([
      {
        $addFields: {
          week: { $isoWeek: "$fileddate" } // changed from filedDate to fileddate
        }
      },
      {
        $group: {
          _id: "$week",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $project: {
          _id: 0,
          week: { $concat: ["Week ", { $toString: "$_id" }] },
          count: 1
        }
      }
    ]);

    res.json({ success: true, data: result });
  } catch (err) {
    console.error("Error fetching weekly complaints trend:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


const getComplaintStatusCounts = async (req, res) => {
  try {
    // Aggregate complaints by their status
    const result = await Complaint.aggregate([
      {
        $group: {
          _id: "$status", // Group by complaint status
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id": 1 } // Sort by status (Open, Resolved, Escalated)
      }
    ]);

    // Return the response with the counts for each status
    res.status(200).json({ data: result });
  } catch (err) {
    console.error("Error fetching complaint status counts:", err);
    res.status(500).json({ message: err.message });
  }
};

const getProductCountByCategory = async (req, res) => {
  try {
    const result = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          count: 1
        }
      }
    ]);

    res.status(200).json({ data: result });
  } catch (err) {
    console.error("Error fetching product count by category:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

const getActiveInactiveUsers = async (req, res) => {
  try {
    const result = await User.aggregate([
      {
        $group: {
          _id: "$active",
          count: { $sum: 1 }
        }
      }
    ]);

    const formatted = [
      { name: "Active", value: 0 },
      { name: "Inactive", value: 0 },
    ];

    result.forEach(item => {
      if (item._id === true) {
        formatted[0].value = item.count;
      } else {
        formatted[1].value = item.count;
      }
    });

    res.status(200).json({ success: true, data: formatted });
  } catch (err) {
    console.error("Error getting active/inactive users:", err);
    res.status(500).json({ message: err.message });
  }
};

// const getUserActivityStats = async (req, res) => {
//   try {
//     const tenDaysAgo = new Date();
//     tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

//     const [activeUsers, inactiveUsers] = await Promise.all([
//       UserModel.countDocuments({ lastLogin: { $gte: tenDaysAgo } }),
//       UserModel.countDocuments({ $or: [{ lastLogin: { $lt: tenDaysAgo } }, { lastLogin: null }] }),
//     ]);

//     res.status(200).json({
//       success: true,
//       data: {
//         active: activeUsers,
//         inactive: inactiveUsers,
//       },
//     });
//   } catch (err) {
//     console.error("Error fetching user activity stats:", err);
//     res.status(500).json({ message: err.message });
//   }
// };


const getUserActivityStats = async (req, res) => {
  try {
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

    const [activeUsers, inactiveUsers] = await Promise.all([
      // Users who logged in within the last 10 days (inclusive)
      UserModel.countDocuments({ lastLogin: { $gte: tenDaysAgo } }),
      
      // Users who haven't logged in for more than 10 days
      UserModel.countDocuments({
        $or: [
          { lastLogin: { $lt: tenDaysAgo } },
          { lastLogin: { $exists: false } }, // Optional: Handle users with no login yet
          { lastLogin: null }
        ]
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        active: activeUsers,
        inactive: inactiveUsers,
      },
    });
  } catch (err) {
    console.error("Error fetching user activity stats:", err);
    res.status(500).json({ message: err.message });
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
    forgotPassword,
    resetPassword,
   
    getAllMonthlyUserRegistrations,
    // getMonthlyUserRegistrations,
    getMonthlyBusinessRegistrations,
    getRatingDistribution,
    getWeeklyComplaintsTrend,
    getComplaintStatusCounts,
    getProductCountByBusiness,
    getProductCountByCategory,
    getActiveInactiveUsers,
    getUserActivityStats,
    getAllUsers,
    toggleUserBlock,
    deleteUser,
    getAllBusiness,
    toggleBusinessBlock,
    deleteBusiness,
    adminSignup,
    adminLogin




}

