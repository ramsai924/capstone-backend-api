const express = require("express");
var bcrypt = require("bcryptjs");
const sellerUser = require("../models/seller");
const userModel = require("../models/userAuth")
const buyerUser = require("../models/buyer")
const app = express();


//Seller register
app.post("/userRegister",async (req,res) => {
  try {

    const checkUser = await userModel.findOne({ email : req.body.email , role : req.body.role })

    console.log(checkUser)

    if(checkUser){
      return res.status(400).json({ checkUser: "user Details already exits" })
    }else{
      const sellerUsers = await userModel.create(req.body)
      sendToken(sellerUsers, res)
    }
    
  } catch (error) {
        res.status(500).json({ success : false , error : error.message })
  }
})

//Login seller
app.post("/userLogin", async (req,res) => {
  try {
    const sellerUsers = await userModel.findOne({ email : req.body.email }).select('+password')
        if(!sellerUsers){
          return res.status(400).json({ success: false, error: "provide correct email" });
        }

        const checkpass = await sellerUsers.compairHash(req.body.password);
        if(!checkpass){
          return res.status(400).json({ success: false, error: "provide correct password" });
        }

    sendToken(sellerUsers,res)

  } catch (error) {
        res.status(500).json({ success : false , error : error.message })
  }
})

// //Register Buyer
// app.post("/registerbuyer",async (req,res) => {
//   try {
//     const buyerusers = await buyerUser.create(req.body)
//     req.session.userid = buyerusers._id;
//     res.status(201).json({ success: true, user : buyerusers })
//   } catch (error) {
//     res.status(500).json({ success : false , error : error.message })
//   }
// })

// //Login Buyer
// app.post("/loginbuyer", async (req, res) => {
//   try {
//     const buyerusers = await buyerUser.findOne({ email: req.body.email }).select('+password')
//     if(!buyerusers){
//       return res.status(400).json({ success : false , error : "Please provide correct email"})
//     }

//     const checkpass = await buyerusers.compairHashpass(req.body.password)
//     if(!checkpass){
//       return res.status(400).json({ success: false, error: "Please provide correct password" })
//     }
  
//     req.session.userid = buyerusers._id;
//     return res.status(200).json({ success : true , user : buyerusers })

//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message })
//   }
// })


const sendToken = (user, res) => {
  //generate token
  const token = user.getjsonwebToken();

  return res.status(200).json({ success: true, token, user })
}


module.exports = app;
