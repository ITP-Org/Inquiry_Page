const express = require("express");
const mongoose = require("mongoose");
const inquiryRouter = require("../backend/Routes/InquiryRoute");

const app = express();
const cors = require("cors");

// Middleware
app.use(express.json());
app.use(cors());
app.use("/inquiries", inquiryRouter);

// Database connection
mongoose.connect("mongodb+srv://dileena:dileena123@cluster0.lnqtu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("Connected to MongoDB"))
    .then(() => {
        app.listen(5000, () => {
            console.log("Server running on port 5000");
        });
    })
    .catch((err) => console.log(err));

