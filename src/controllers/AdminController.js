
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





const getNewUsersByMonth = async (req, res) => {
    try {
      const data = await User.aggregate([
        {
          $group: {
            _id: {
              month: { $month: "$createdAt" },
              year: { $year: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]);
  
      const formatted = data.map((item) => {
        const { month, year } = item._id;
        const monthName = month
          ? new Date(year, month - 1).toLocaleString("default", { month: "short" })
          : "Unknown";
        const label = month && year ? `${monthName} ${year}` : "Unknown";
        return {
          label,
          count: item.count,
        };
      });
  
      res.json(formatted);
    } catch (error) {
      console.error("Error in getNewUserPerMonth:", error);
      res.status(500).json({ message: "Server error" });
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

  const getRatingsPerProduct= async (req, res) => {
    const ratings = await Rating.find().populate("productId");
    const reviewMap = {};
    ratings.forEach((r) => {
      const product = r.productId?.name || "Unknown";
      reviewMap[product] = (reviewMap[product] || 0) + 1;
    });
    res.json(Object.entries(reviewMap).map(([name, count]) => ({ name, count })));
  }

  const getRatingDistribution= async (req, res) => {
    const ratings = await Rating.find();
    const distribution = [0, 0, 0, 0, 0];
    ratings.forEach((r) => {
      distribution[r.rating - 1] += 1;
    });
    res.json(distribution.map((value, index) => ({ name: `${index + 1}★`, value })));
  }

  const getComplaintStatus =  async (req, res) => {
    const complaints = await Complaint.find();
    const statusMap = { Open: 0, Resolved: 0, Escalated: 0 };
    complaints.forEach((c) => {
      if (statusMap[c.status] !== undefined) statusMap[c.status] += 1;
    });
    res.json(Object.entries(statusMap).map(([name, value]) => ({ name, value })));
  }

  const getUserGrowth =  async (req, res) => {
    const users = await User.find();
    const rawMonthlyUsers = {};
    users.forEach((u) => {
      const date = new Date(u.createdAt);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      rawMonthlyUsers[key] = (rawMonthlyUsers[key] || 0) + 1;
    });

    const data = Object.entries(rawMonthlyUsers).map(([key, count]) => {
      const [year, month] = key.split("-").map(Number);
      return {
        name: `${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][month]} ${year}`,
        count,
        date: new Date(year, month),
      };
    });

    res.json(data.sort((a, b) => a.date - b.date).map(({ name, count }) => ({ name, count })));
  }

  const getActiveInactiveUserData = async (req, res) => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    console.log(`Today: ${today}`);
    console.log(`Thirty Days Ago: ${thirtyDaysAgo}`);

    try {
        const activeUsers = await User.countDocuments({
            lastLogin: { $gte: thirtyDaysAgo }
        });
        const inactiveUsers = await User.countDocuments({
            lastLogin: { $lt: thirtyDaysAgo }
        });

        console.log(`Active Users: ${activeUsers}, Inactive Users: ${inactiveUsers}`);
        
        // Check if the queries returned anything
        if (activeUsers === 0 && inactiveUsers === 0) {
            console.log('No users found, check the lastLogin field or query');
        }

        res.json({ activeUsers, inactiveUsers });
    } catch (error) {
        console.error(error);  // Log error for debugging
        res.status(500).send("Server Error");
    }
};

  

  const getWeeklyComplaints= async (req, res) => {
    const complaints = await Complaint.find();
    const weeklyMap = {};
    complaints.forEach((c) => {
      const filed = new Date(c.fileddate);
      const week = `${filed.getFullYear()}-W${Math.ceil(((filed - new Date(filed.getFullYear(), 0, 1)) / 86400000 + filed.getDay() + 1) / 7)}`;
      weeklyMap[week] = (weeklyMap[week] || 0) + 1;
    });
    res.json(Object.entries(weeklyMap).map(([name, count]) => ({ name, count })));
  }

  const getProductCountByBusiness= async (req, res) => {
    const products = await Product.find().populate("businessId");
    const businessProductMap = {};
    products.forEach((p) => {
      const businessName = p.businessId?.businessname || "Unknown";
      businessProductMap[businessName] = (businessProductMap[businessName] || 0) + 1;
    });
    res.json(Object.entries(businessProductMap).map(([name, count]) => ({ name, count })));
  }

  const getAverageRatingPerProduct =  async (req, res) => {
    const ratings = await Rating.find().populate("productId");
    const ratingMap = {};
    ratings.forEach((r) => {
      const product = r.productId?.name || "Unknown";
      if (!ratingMap[product]) ratingMap[product] = [];
      ratingMap[product].push(r.rating);
    });

    const avgRatings = Object.entries(ratingMap).map(([name, list]) => {
      const total = list.reduce((sum, r) => sum + r, 0);
      return { name, avg: +(total / list.length).toFixed(2) };
    });

    res.json(avgRatings);
  }

  const getComplaintResolutionTime=  async (req, res) => {
    const complaints = await Complaint.find({ status: "Resolved" }).populate("productId");
    const resolutionTimes = complaints.map((c) => {
      const filed = new Date(c.fileddate);
      const resolved = new Date(c.updatedAt);
      const days = Math.round((resolved - filed) / (1000 * 60 * 60 * 24));
      return {
        name: c.productId?.name || "Unknown",
        days,
      };
    });
    res.json(resolutionTimes);
  }

  const getRecentComplaints =  async (req, res) => {
    const complaints = await Complaint.find()
      .populate("userId")
      .populate("productId")
      .sort({ fileddate: -1 })
      .limit(5);
    res.json(complaints);
  }



module.exports={
    getNewUsersByMonth,
    getStats,
    getRecentComplaints,
    getComplaintResolutionTime,
    getAverageRatingPerProduct,
    getProductCountByBusiness,
    getWeeklyComplaints,
    getUserGrowth,
    getComplaintStatus,
    getRatingDistribution,
    getRatingsPerProduct,
    getActiveInactiveUserData,
    getAllUsers,
    toggleUserBlock,
    deleteUser,
    getAllBusiness,
    toggleBusinessBlock,
    deleteBusiness,
    adminSignup,
    adminLogin




}

