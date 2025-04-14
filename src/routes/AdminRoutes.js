const express = require("express");
const routes= express.Router();
const AdminController = require("../controllers/AdminController");

routes.get("/stats", AdminController.getStats);
routes.get("/ratings-per-product", AdminController.getRatingsPerProduct);
routes.get("/rating-distribution", AdminController.getRatingDistribution);
routes.get("/complaint-status", AdminController.getComplaintStatus);
routes.get("/user-growth", AdminController.getUserGrowth);
routes.get("/weekly-complaints", AdminController.getWeeklyComplaints);
routes.get("/product-count-by-business", AdminController.getProductCountByBusiness);
routes.get("/average-rating-per-product", AdminController.getAverageRatingPerProduct);
routes.get("/complaint-resolution-time", AdminController.getComplaintResolutionTime);
routes.get("/recent-complaints", AdminController.getRecentComplaints);
routes.get("/new-user-by-month", AdminController.getNewUsersByMonth);
routes.get("/active-inactive-users", AdminController.getActiveInactiveUserData);
routes.get("/allusers", AdminController.getAllUsers);
routes.delete("/deleteUser/:id", AdminController.deleteUser);
routes.patch("/toggleUserBlock/:id", AdminController.toggleUserBlock);
 routes.get("/allbusiness", AdminController.getAllBusiness);
 routes.delete("/deleteBusiness/:id", AdminController.deleteBusiness);
 routes.patch("/toggleBusinessBlock/:id", AdminController.toggleBusinessBlock);
 routes.post("/adminLogin", AdminController.adminLogin);
 routes.post("/adminSignUp", AdminController.adminSignup);

module.exports = routes;
