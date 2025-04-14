const routes = require("express").Router()

const userController = require("../controllers/UserController")
routes.get("/users",userController.getAllUsers)

// routes.post("/user",userController.addUser)
routes.post("/user",userController.signup)
routes.delete("/user/:id",userController.deleteUSer)
routes.get("/user/:id",userController.getUserById)
routes.post("/user/login",userController.loginUser)
routes.post("/user/forgotpassword",userController.forgotPassword)
routes.post("/user/resetpassword",userController.resetPassword)
routes.get("/user/getusercounts",userController.getUserCounts)


module.exports = routes