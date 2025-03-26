
const routes = require("express").Router()

const ratingController = require("../controllers/RatingController")
routes.get("/ratings",ratingController.getAllRating)
routes.post("/rating",ratingController.addRating)


routes.delete("/rating/:id",ratingController.deleteRating)
routes.get("/rating/:id",ratingController.getRatingById)





module.exports = routes