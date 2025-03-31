const routes=require("express").Router()
const contactUsController= require("../controllers/ContactUsController")
routes.get("/contactus/:id",contactUsController.getContactUsById)
routes.post("/contactUs",contactUsController.addContactUs)
routes.delete("/contactus/:id",contactUsController.deleteContactUs)

module.exports = routes




