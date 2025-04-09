const routes = require("express").Router()

const complaintController = require("../controllers/ComplaintController")
routes.get("/complaints",complaintController.getAllComplaint)
routes.post("/complaint",complaintController.addComplaint)


routes.delete("/complaint/:id",complaintController.deleteComplaint)
routes.get("/complaint/:id",complaintController.getComplaintById)
routes.get("/complaintbyuserId/:userId",complaintController.getAllComplaintsByUserId)

routes.get('/product/:productId', complaintController.getComplaintsByProductId);
routes.put('/update/:id', complaintController.updateComplaint);






module.exports = routes