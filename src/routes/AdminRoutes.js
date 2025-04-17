const express = require("express");
const routes= express.Router();
const AdminController = require("../controllers/AdminController");

routes.get("/stats", AdminController.getStats);
routes.get("/new-users-month", AdminController.getNewUsersThisMonth);
routes.get("/monthly-users", AdminController.getAllMonthlyUserRegistrations);
routes.get("/monthly-business", AdminController.getMonthlyBusinessRegistrations);
routes.get("/rating-distribution", AdminController.getRatingDistribution);
routes.get("/product-count-by-business", AdminController.getProductCountByBusiness);
routes.get("/complaints-trend", AdminController.getWeeklyComplaintsTrend);
routes.get("/complaint-status", AdminController.getComplaintStatusCounts);
routes.get("/products-by-category", AdminController.getProductCountByCategory);
routes.get("/active-inactive-users", AdminController.getActiveInactiveUsers);
routes.get("/user-activity-status", AdminController.getUserActivityStats);

routes.get("/allusers", AdminController.getAllUsers);
routes.delete("/deleteUser/:id", AdminController.deleteUser);
routes.patch("/toggleUserBlock/:id", AdminController.toggleUserBlock);
 routes.get("/allbusiness", AdminController.getAllBusiness);
 routes.delete("/deleteBusiness/:id", AdminController.deleteBusiness);
 routes.patch("/toggleBusinessBlock/:id", AdminController.toggleBusinessBlock);
 routes.post("/adminLogin", AdminController.adminLogin);
 routes.post("/adminSignUp", AdminController.adminSignup);

module.exports = routes;
