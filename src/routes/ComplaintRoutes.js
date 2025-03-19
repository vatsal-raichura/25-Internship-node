const routes = require("express").Router()

const complaintController = require("../controllers/ComplaintController")
routes.get("/complaints",complaintController.getAllComplaint)
routes.post("/complaint",complaintController.addComplaint)


routes.delete("/complaint/:id",complaintController.deleteComplaint)
routes.get("/complaint/:id",complaintController.getComplaintById)



module.exports = routes