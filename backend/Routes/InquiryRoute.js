const mongoose = require("mongoose");
const router = require("express").Router();

const InquiryController = require("../Controllers/InquiryController");

router.post("/add", InquiryController.addInquiry);
router.get("/getAll", InquiryController.getInquiries);
router.get("/get/:id", InquiryController.getInquiryById);
router.put("/update/:id", InquiryController.updateInquiry);
router.delete("/delete/:id", InquiryController.deleteInquiry);
router.post("/addReply/:id", InquiryController.addReply);
router.post("/updateReply/:id", InquiryController.updateReply);
router.post("/deleteReply/:id", InquiryController.deleteReply);

module.exports = router;