const routes = require("express").Router()


const businessController = require("../controllers/BusinessController")
const { verifyBusiness } = require("../middlewares/authMiddlewares")
routes.get("/businesses",businessController.getAllBusiness)

// routes.post("/user",userController.addUser)
routes.post("/signup",businessController.BusinessSignUp)
routes.delete("/business/:id",businessController.deleteBusiness)
routes.get("/business/:id",businessController.getBusinessById)
routes.post("/login",businessController.BusinessLogin)
routes.post("/forgotpassword",businessController.forgotPassword)
routes.post("/resetpassword",businessController.resetPassword)
routes.get("/ratings", businessController.getBusinessRatings);



module.exports = routes