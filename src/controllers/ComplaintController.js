const ComplaintModel = require("../models/ComplaintModel");
const ProductModel = require("../models/ProductModel");

const bcrypt = require("bcrypt")
const mongoose = require("mongoose")




const getAllComplaint = async (req,res)=>{
    const complaints = await ComplaintModel.find().populate({
      path: "productId",
      select: "name brand price productURL",
    })
    .populate({
      path: "userId",
      select: "firstname lastname",
    })
    
    .exec();



    res.json({
        message:"complaints fetched successfully",
        data:complaints

    })
 }

 



// const updateComplaint = async (req, res) => {
//   try {
//     const { status, resolutionMessage } = req.body;

//     // Validate status transitions
//     const complaint = await ComplaintModel.findById(req.params.id);

//     if (!complaint) {
//       return res.status(404).json({ message: "Complaint not found" });
//     }

//     // Enforce transition logic
//     if (status === "resolved" && complaint.status === "open") {
//       // Allow direct resolution
//       complaint.status = "resolved";
//       complaint.resolutionMessage = resolutionMessage;
//     } else if (status === "escalated" && complaint.status === "open") {
//       // Allow escalation
//       complaint.status = "escalated";
//     } else if (status === "resolved" && complaint.status === "escalated") {
//       // Escalated complaint now being resolved
//       complaint.status = "resolved";
//       complaint.resolutionMessage = resolutionMessage;
//     } else {
//       return res.status(400).json({ message: "Invalid status transition" });
//     }

//     await complaint.save();

//     res.status(200).json({
//       message: "Complaint updated successfully",
//       data: complaint,
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: "Error while updating complaint",
//       err: err.message,
//     });
//   }
// };


// const updateComplaint = async (req, res) => {
//   try {
//     const { status, resolutionMessage } = req.body;

//     // Optional: Only allow resolving with a message
//     if (status === "Resolved"  || status === "Escalated" && !resolutionMessage) {
      
//       return res.status(400).json({
//         message: "Resolution message is required when resolving a complaint.",
//       });
//     }

//     const updatedComplaint = await ComplaintModel.findByIdAndUpdate(
//       req.params.id,
//       {
//         $set: {
//           ...req.body,
//           status,
//           resolutionMessage,
//         },
//       },
//       { new: true }
//     );

//     if (!updatedComplaint) {
//       return res.status(404).json({ message: "Complaint not found" });
//     }

//     res.status(200).json({
//       message: "Complaint updated successfully",
//       data: updatedComplaint,
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: "Error while updating complaint",
//       err: err.message,
//     });
//   }
// };
// const updateComplaint = async (req, res) => {
//   try {
//     const { status, resolutionMessage } = req.body;

//     // Ensure resolutionMessage is provided if status is Resolved or Escalated
//     if (
//       (status === "Resolved" || status === "Escalated") &&
//       (!resolutionMessage || resolutionMessage.trim() === "")
//     ) {
//       return res.status(400).json({
//         message: "Resolution message is required when complaint is escalated or resolved.",
//       });
//     }

//     // Update complaint by ID
//     const updatedComplaint = await ComplaintModel.findByIdAndUpdate(
//       req.params.id,
//       {
//         $set: {
//           status,
//           resolutionMessage,
//         },
//       },
//       { new: true }
//     );

//     if (!updatedComplaint) {
//       return res.status(404).json({ message: "Complaint not found" });
//     }

//     res.status(200).json({
//       message: "Complaint updated successfully",
//       data: updatedComplaint,
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: "Error while updating complaint",
//       err: err.message,
//     });
//   }
// };


// GET /api/complaints/resolution-times
const getResolutionTimes = async (req, res) => {
  try {
    const resolvedComplaints = await ComplaintModel.find({ status: "Resolved" })
      .populate("productId", "name");

    const resolutionTimes = resolvedComplaints.map((complaint) => {
      const start = new Date(complaint.createdAt);
      const end = new Date(complaint.updatedAt);
      const hoursToResolve = (end - start) / (1000 * 60 * 60); // milliseconds to hours

      return {
        product: complaint.productId?.name || "Unknown Product",
        hoursToResolve: parseFloat(hoursToResolve.toFixed(2)),
      };
    });

    res.status(200).json({
      message: "Resolution times fetched successfully",
      data: resolutionTimes,
    });
  } catch (error) {
    console.error("Error fetching resolution times:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};


const updateComplaint = async (req, res) => {
  try {
    const { status, resolutionMessage } = req.body;

    // Ensure resolution message is present for Resolved or Escalated
    if (
      (status === "Resolved" || status === "Escalated") &&
      (!resolutionMessage || resolutionMessage.trim() === "")
    ) {
      return res.status(400).json({
        message: "Resolution message is required for Escalated or Resolved complaints.",
      });
    }

    // Prepare update object
    const updateData = { status };
    if (resolutionMessage) {
      updateData.resolutionMessage = resolutionMessage;
    }

    const updatedComplaint = await ComplaintModel.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedComplaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.status(200).json({
      message: "Complaint updated successfully",
      data: updatedComplaint,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error while updating complaint",
      err: err.message,
    });
  }
};



const getAllComplaintsByUserId = async (req, res) => {
   try {
     const userId = req.params.userId;
     console.log("🔍 Received Request for userId:", userId);
 
     if (!userId || userId === "undefined") {
       return res.status(400).json({ message: "Invalid user ID" });
     }
 
     const complaints = await ComplaintModel.find({ userId: new mongoose.Types.ObjectId(userId) })
       .populate("productId","name")
       .populate("userId", "firstname lastname");;
 
     if (!complaints.length) {
       return res.status(404).json({ message: "No complaints found" });
     }
 
     res.status(200).json({ message: "Complaints retrieved", data: complaints });
   } catch (err) {
     console.error("🔥 Error:", err);
     res.status(500).json({ message: err.message });
   }
 };

 const getComplaintsByProductId = async (req, res) => {
  try {
    const complaints = await ComplaintModel.find({ productId: req.params.productId })
      .populate("userId", "firstname lastname email")
      .populate("productId", "name brand");

    if (!complaints.length) {
      return res.status(404).json({ message: "No complaints found for this product" });
    }

    res.status(200).json({
      message: "Complaints for product retrieved successfully",
      data: complaints,
    });
  } catch (error) {
    console.error("Error fetching complaints by product:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

 
 





 
 

 

const addComplaint = async (req, res) => {
  try {
    const { productId, userId, description } = req.body;

    // Validate required fields
    if (!productId || !userId || !description || description.trim() === "") {
      return res.status(400).json({
        message: "Missing required fields: productId, userId, and description are required.",
      });
    }

    // Optional: validate status is one of the allowed ones
    // const validStatuses = ["Open", "Resolved", "Escalated"];
    // if (status && !validStatuses.includes(status.toLowerCase())) {
    //   return res.status(400).json({
    //     message: `Invalid status value. Allowed values: ${validStatuses.join(", ")}`,
    //   });
    // }

    const createdComplaint = await ComplaintModel.create(req.body);

    // Link complaint to product
    await ProductModel.findByIdAndUpdate(createdComplaint.productId, {
      $push: { complaints: createdComplaint._id },
    });

    res.status(201).json({
      message: "Complaint created successfully.",
      data: createdComplaint,
    });
  } catch (err) {
    console.error("Error while creating complaint:", err);
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};



 const deleteComplaint = async(req,res)=>{
    const deletedComplaint = await ComplaintModel.findByIdAndDelete(req.params.id)
    res.json({
        message:"user deleted ....",
        data:deletedComplaint
    })
 }

 const getComplaintById = async (req,res)=>{
    const specificComplaint = await ComplaintModel.findById(req.params.id)
    res.json({
        message:"service found successfully",
        data:specificComplaint
    })
 }

 module.exports={
    getAllComplaint,addComplaint,deleteComplaint,getComplaintById,getAllComplaintsByUserId,updateComplaint,getComplaintsByProductId,getResolutionTimes
 }
