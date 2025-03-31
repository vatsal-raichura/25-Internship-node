const ContactModel = require("../models/ContactUsModel")
const mailUtil = require("../utils/MailUtil")

const addContactUs= async (req,res) => {
  

  const savedContactUs= await ContactModel.create(req.body)
  

  await mailUtil.contactUsSendingMail(savedContactUs.email,"Thankyou for Contact Us","For any query please contact on these mail")

  res.json({
    message:"messge send successfully",
    data:savedContactUs
  })
}

const deleteContactUs= async (req,res) => {

   

const deletedContactUs= await ContactModel.findByIdAndDelete(req.params.id)

res.json({
  message:"message deleted..",
    data:deletedContactUs
})
  
}


const getContactUsById= async(req,res)=>{
  //req param.id

  const foundContactUs= await ContactModel.findById(req.params.id)

  res.json({
    message:"message fatched..",
    data:foundContactUs

  })
}

module.exports={
    addContactUs,deleteContactUs,getContactUsById
}