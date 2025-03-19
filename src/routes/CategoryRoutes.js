const routes = require("express").Router()
const categoryController = require("../controllers/CategoryController")
routes.get("/getcategories",categoryController.getAllCategories)
routes.post("/addcategory",categoryController.addCategory)
routes.delete("/:id",categoryController.deleteCategory)
routes.get("/:id",categoryController.getCategoryById)


module.exports = routes