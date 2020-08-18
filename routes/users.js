const express = require("express");
const sellerData = require("../models/seller_data_table")
const sellerUser = require("../models/seller")
const acceptedOrder = require("../models/acceptedOrders")
const Buyer = require("../models/buyer")
const app = express();

//redurect to login
const redirectLogin = (req, res, next) => {
  if (!req.session.userid) {
    res.redirect("/welcome");
  } else {
    next();
  }
};

//redirect to home
const redirectHome = (req, res, next) => {
  if (req.session.userid) {
    res.redirect("/");
  } else {
    next();
  }
};


//getuser details home page
app.get("/",redirectLogin,async (req, res) => {
  try {
   
    if(req.session.userid){
      //seller
      const seller = await sellerUser.findById({ _id: req.session.userid })
        .populate({ path: "soldHistory", model: "seller_table_data" })
      if (seller) {
        const acceptedOrders = await acceptedOrder.find({ sellerid: req.session.userid }).populate([
          { path: "soldDataId", model: "seller_table_data" },
          { path: "buyerid", model: "buyer_user_model", select: "-completedOrders" }
        ])
        return res.status(200).json({ sucess: true, user: seller , acceptedOrders   })
      }

      //buyer
      const buyer = await Buyer.findById({ _id: req.session.userid })
        .populate([
          { path: "completedOrders", model: "seller_user_table" }
        ])
      if (buyer) {
        
        const acceptedOrders = await acceptedOrder.find({ buyerid: req.session.userid }).populate([
          { path: "soldDataId", model: "seller_table_data", populate: { path: "userid", model: "seller_user_table" } }
        ]);

        return res.status(200).json({ sucess: true, user: buyer, acceptedOrders })
      }
    }else{
      return res.status(400).json({ success : false , Error : "users not Set"})
    }


  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
});

//profile
app.get("/profile",async (req,res) => {
  try {
    if (req.session.userid) {
      const seller = await sellerUser.findById({ _id: req.session.userid })
        .populate({ path: "soldHistory", model: "seller_table_data" })
      if (seller) {
        return res.status(200).json({ sucess: true, user: seller })
      }

      const buyer = await Buyer.findById({ _id: req.session.userid })
        .populate([
          { path: "completedOrders", model: "seller_table_data" }
        ])
      if (buyer) {
        return res.status(200).json({ sucess: true, user: buyer })
      }
    } else {
      return res.status(400).json({ success: false, Error: "users not Set" })
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

//update profile details
app.post("/updateprofile", async(req,res) => {
  try {
      if(req.body.usertype === "buyer"){
        const updateBuyer = await Buyer.findByIdAndUpdate({ _id: req.session.userid } , req.body , { new : true , runValidators : true })
        return res.status(200).json({ success : true , message : "details updated success"})
      }else if(req.body.usertype === "seller"){
         const updateBuyer = await sellerUser.findByIdAndUpdate({ _id: req.session.userid } , req.body , { new : true , runValidators : true })
        return res.status(200).json({ success : true , message : "details updated success"})
      }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
})

//Get nearby users (buyer)
app.get("/nearByUsers", async (req, res) => {
  try {
        const lat = req.query.latitude;
        const lon = req.query.longitude;
        const radius = 100/6378;
        console.log(radius)
        const foundUsers = await sellerData
          .find({
            orderStatus: "active",
            location: {
                  $geoWithin: {
                    $centerSphere: [[78.363151, 17.912214], radius],
                  },
                },    
          })
          .populate([
            {
              path: "userid",
              model: "seller_user_table",
              select: "-soldHistory",
            },
          ]);

        res.status(200).json({ length : foundUsers.length ,  foundUsers });


  } catch (error) {
    res.status(500).json({ success : false , error : error.message })
  }
});

//status change to ongoing (buyer)
app.post("/acceptOrder",async (req,res) => {
  try {
       
        const usertype = await Buyer.findById({ _id: req.session.userid })

        if (usertype.usertype === "buyer") {
          const buyerData = await acceptedOrder.create(req.body)
          const usersellerDate = await sellerData.findByIdAndUpdate({ _id: req.body.soldDataId }, { orderStatus: "ongoing" }, { new: true, runValidators: true })
        } else {
          return res.status(400).json({ success: false, Erorr: "You are not Authorized to update details" })
        }

       return res.status(200).json({ success : true , message : "Order accepted"})

  } catch (error) {
    res.status(500).json({ success : false , error : error.message })
  }
})

// //get accepted order data(buyer)
// app.get("/getacceptedOrders",auth,async (req,res) => {
//   try {
    
//     const usertype = await acceptedOrder.find({ buyerid : req.session.userid }).populate({ path: "acceptedOreders", model: "seller_user_table"})
//       return res.status(200).json({ success : true , Data : usertype })
    
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message })
//   }
// })

//status change to completed order(buyer)
app.post("/rejectOrder", async (req, res) => {
  try {
    const usertype = await Buyer.findById({ _id: req.session.userid })

    if (usertype.usertype === "buyer") {
      const pullSellerData = await acceptedOrder.findByIdAndDelete({ _id: req.body.acceptedOrderId })
      const usersellerData = await sellerData.findByIdAndUpdate({ _id: req.body.sellerdataId }, { orderStatus: "active" }, { new: true, runValidators: true })
    } else {
      return res.status(400).json({ success: false, Erorr: "You are not Authorized to update details" })
    }

    return res.status(200).json({ success: true, message: "Order rejected" })
 
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

//status change to completed order(buyer)
app.get("/completeOrder", async (req,res) => {
  try {
        const usertype = await Buyer.findById({ _id: req.session.userid })

        if (usertype.usertype === "buyer") {
          const acceptTable = await acceptedOrder.findByIdAndDelete({ _id: req.body.acceptedOrderId })
          const pushSellerData = await Buyer.findByIdAndUpdate({ _id: req.session.userid }, { $push: { "completedOrders": req.body.sellerdataId } }, { new: true, runValidators: true })
          const usersellerData = await sellerData.findByIdAndUpdate({ _id: req.body.sellerdataId }, { orderStatus: "completed", boughtUser: req.session.userid }, { new: true, runValidators: true })
        } else {
          return res.status(400).json({ success: false, Erorr: "You are not Authorized to update details" })
        }

        return res.status(200).json({ success: true, message: "Order completed" })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})


//logout
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.redirect("/");
      return;
    }

    res.clearCookie("sid");
    res.redirect("/welcome");
  });
});

module.exports = app;
