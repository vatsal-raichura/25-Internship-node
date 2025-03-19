const cloudinary = require("cloudinary").v2

const uploadFileToCloudinary = async (file)=>{

    cloudinary.config({
        cloud_name:"donyz4ypg",
        api_key:"423384444592271",
        api_secret:"S4N30-xij0BDag_kxvn65bHk7-s"
    })

    const cloudinaryResponse = await cloudinary.uploader.upload(file.path)
    return cloudinaryResponse;
}


module.exports={
    uploadFileToCloudinary
}