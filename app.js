const express= require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const router = express.Router();

const app = express()
app.use(cors())
app.use(express.json())

router.post("/user", (req, res) => {
    console.log("Received data:", req.body); // Log the incoming data

    // Mock response
    res.status(201).json({ message: "User data received", data: req.body });
});

const roleRoutes = require("./src/routes/RoleRoutes")
app.use(roleRoutes)

const userRoutes = require("./src/routes/UserRoutes")
app.use(userRoutes)

const businessRoutes = require("./src/routes/BusinessRoutes")
app.use("/business",businessRoutes)

const adminRoutes = require("./src/routes/AdminRoutes")
app.use("/admin",adminRoutes)


const categoryRoutes = require("./src/routes/CategoryRoutes")
app.use("/category",categoryRoutes)

const productRoutes = require("./src/routes/ProductRoutes")
app.use("/product",productRoutes)

const complaintRoutes = require("./src/routes/ComplaintRoutes")
app.use("/complaint",complaintRoutes)

const ratingRoutes = require("./src/routes/RatingRoutes")
app.use("/rating",ratingRoutes)

const discussionRoutes = require("./src/routes/ForumDiscussionsRoutes")
app.use("/discussion",discussionRoutes)



const notificationRoutes = require("./src/routes/NotificationsRoutes")
app.use("/notification",notificationRoutes)

const contactUsRoutes = require("./src/routes/ContactUsRoutes")
app.use("/contact",contactUsRoutes)



mongoose.connect("mongodb://127.0.0.1:27017/25_node_intership").then(()=>{
    console.log("database connected....")
})


const PORT = 3000
app.listen(PORT,()=>{
    console.log("server started on port  number",PORT)
})

module.exports = router;


// app.get("/test",(req,res)=>{
    //     console.log("test api is called")
    //     res.send("hello test api is called")
    // })
    
    // app.get("/users",(req,res)=>{
    //     res.json({
    //         message:"user api is called...",
    //         data:["ram","shyam","hari","dhruv","raj","vatsal"]
    //     })
    // })
    
    // app.get("/employees",(req,res)=>{
    //     res.json({
    //         message:"user api is called...",
    //         data:[{
    //             emp_id:1,
    //             name:"raj",
    //             age:21,
    //             salary:50000,
    //             },
    //         {
    //             emp_id:2,
    //             name:"dhruv",
    //             age:23,
    //             salary:60000,
                
    //         },
    //         {
    //             emp_id:3,
    //             name:"vatsal",
    //             age:22,
    //             salary:50000,
                
    //         }]
    //     })
    // })
    


































// console.log("hello")
// var user = require('./user')
// console.log(user)
// console.log(user.userName)
// console.log(user.userAge)
// user.printUserData(100)


