
const routes = require("express").Router()

const ratingController = require("../controllers/RatingController")
routes.get("/ratings",ratingController.getAllRating)
routes.post("/rating",ratingController.addRating)


routes.delete("/rating/:id",ratingController.deleteRating)
routes.get("/rating/:id",ratingController.getRatingById)

routes.get("/reviewandratingbyuserId/:userId",ratingController.getAllRatingsByUserId)
routes.get('/:productId/reviews', ratingController.getProductReviews);





module.exports = routes