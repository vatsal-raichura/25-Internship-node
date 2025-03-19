
const routes = require("express").Router()

const notificationController = require("../controllers/NotificationsController")
routes.get("/notifications",notificationController.getAllNotification)
routes.post("/notification",notificationController.addNotification)


routes.delete("/notification/:id",notificationController.deleteNotification)
routes.get("/notification/:id",notificationController.getNotificationById)



module.exports = routes