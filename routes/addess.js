// const express = require('express')
// const Address = require("../models/address")
// const app = express()

// //Get all address
// app.get("/all_address",async (req,res) => {
//     try {
//         var user_set;
//         if(req.session.userid){
//             user_set = true;
//         }else{
//             user_set = false;
//         }
//         const address = await Address.find().populate({ path: "userid", model: "seller_user_table", select: '-soldHistory' })
//         res.status(200).json({ success: true, user_set, allAddress : address })
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message })
//     }
// })

// //Get current user addess
// app.get("/current_user_Address",async (req,res) => {
//     try {
//         var user_set;
//         if (req.session.userid) {
//             user_set = true;
//         } else {
//             user_set = false;
//         }
//         const address = await Address.find({ userid: req.session.userid }).populate({ path: "userid", model: "seller_user_table", select: '-soldHistory'})
//         res.status(200).json({ success: true, user_set, current_user_Address : address})
//     } catch (error) {
//         res.status(500).json({ success : false , error : error.message })
//     }
// })

// //Add seller address
// app.post("/add_address", async (req, res) => {
//     try {
//         const add_address = await Address.create(req.body)
//         res.status(201).json({ success : true , address : add_address })
//     } catch (error) {
//         res.status(500).json({ success : false , error : error.message })
//     }
// })


// module.exports = app;