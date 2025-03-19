const categoryModel = require("../models/CategoryModel")
//categotymodel == category

const getAllCategories = async (req,res)=>{
    

    const categories = await categoryModel.find()

    res.json({
        message:"categories fetched successfully",
        data:categories
    });

}

const addCategory =async (req,res)=>{
    //req.body,req.params, req.header,req.query
    // console.log("request body",req.body)
    // insert into roles() values()
    // database

    const savedCategory = await categoryModel.create(req.body)

    res.json({
        message:"category created",
        data:savedCategory
    })
}

const deleteCategory = async (req,res)=>{
   

    const deletedCategory = await categoryModel.findByIdAndDelete(req.params.id)

    res.json({
        message:"role deleted succesfully...",
        data:deletedCategory
    })

}

const getCategoryById = async (req,res)=>{
    //req.params.id
     const foundCategory = await categoryModel.findById(req.params.id)

     res.json({
        message:"category fetched",
        data:foundCategory
     })
}









module.exports= {
    getAllCategories,addCategory,deleteCategory,getCategoryById
}