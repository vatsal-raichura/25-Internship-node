const routes = require("express").Router()

const businessController = require("../controllers/BusinessController")
routes.get("/businesses",businessController.getAllBusiness)

// routes.post("/user",userController.addUser)
routes.post("/signup",businessController.BusinessSignUp)
routes.delete("/business/:id",businessController.deleteBusiness)
routes.get("/business/:id",businessController.getAllBusiness)
routes.post("/login",businessController.BusinessLogin)


module.exports = routes