const express = require("express")
const multer = require("multer")
const path = require("path")
const sellData = require("../models/seller_data_table")
const app = express()

//multer
var storage = multer.diskStorage({
    destination : './public/uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

var uploads = multer({ storage: storage }).single("images");

//get all users Scrap data (development)
app.get("/getAllScrap",async (req,res) => {
    try {
       const scarpData = await sellData.find({ orderStatus : "active"}).populate([
         { path: "userid", model: "seller_user_table", select: "-soldHistory" }
       ]);

       res.status(200).json({ success : true , scarpData })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
})

//get current user scrap data in profile page
app.get("/getCurrentUser",async (req,res) => {
    try {
        
        if(req.session.userid){
            const userScarpData = await sellData.find({ userid : req.session.userid }).populate({ path: "address", model: "address" });
            return res.status(200).json({ success: true, userScarpData });
        }else{
            return res.status(400).json({ success: true, error : "Please login" });
        }
    } catch (error) {
        res.status(500).json({ success : false , error : error.message })
    }
})

//add scrap data
app.post("/", uploads,async (req,res) => {
    try {
          const data = req.body;
          data.image = req.file.path;

          const scarpData = await sellData.create(data);

          res.status(201).json({ success: true, scarpData });
        } catch (error) {
        res.status(500).json({ success : false , error : error.message })
    }
})


//update scrap data
app.post("/update/:id",uploads, async (req,res) => {
    try {
            const data = req.body;
            data.image = req.file.path;
            const updateScrap = await sellData.findByIdAndUpdate({ _id : req.params.id } , data , { new : true , runValidators : true })
            res.status(200).json({ success : true , message : "scrape data updated success "})
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
})

module.exports = app;