const express = require("express");
const sellerData = require("../models/seller_data_table")
const sellerUser = require("../models/seller")
const Buyer = require("../models/buyer")
const app = express();


function auth(req,res,next){
  if(req.session.userid){
    next()
  }else{
    res.redirect("/welcome")
  }
}

//getuser details
app.get("/", auth,async (req, res) => {
  try {
   
    if(req.session.userid){
      const seller = await sellerUser.findById({ _id: req.session.userid })
        .populate({ path: "soldHistory", model: "seller_table_data" })
      if (seller) {
        return res.status(200).json({ sucess: true, user: seller })
      }

      const buyer = await Buyer.findById({ _id: req.session.userid })
        .populate([
          { path: "acceptedOreders", model: "seller_user_table" },
          { path: "completedOrders", model: "seller_user_table" }
        ])
      if (buyer) {
        return res.status(200).json({ sucess: true, user: buyer })
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
          { path: "acceptedOreders", model: "seller_user_table" },
          { path: "completedOrders", model: "seller_user_table" }
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


app.post("/updateprofile", async(req,res) => {
  try {
      
  } catch (error) {
    
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




            // const radius = 1000 / 6378;
            // const foundUsers = await sellerData.aggregate([
            //   // Match conditions
            //   { $match: { orderStatus: "active" } },

            //   // Join with 'seller_user_table' collection
            //   {
            //     $lookup: {
            //       from: "seller_user_table",
            //       localField: "userid",
            //       foreignField: "_id",
            //       as: "userid",
            //     },
            //   },

            //   // deconstruct userId because by default lookup will return an array
            //   { $unwind: { path: "$userid" } },

            //   // join address collection
            //   {
            //     $lookup: {
            //       from: "address",
            //       localField: "address",
            //       foreignField: "_id",
            //       as: "address",
            //     },
            //   },

            //   // deconstruct address because by default lookup will return an array
            //   { $unwind: { path: "$address" } },

            //   // match condition for address location
            //   {
            //     $match: {
            //       "address.location": {
            //         $geoWithin: {
            //           $centerSphere: [[78.363151, 17.912214], radius],
            //         },
            //       },
            //     },
            //   },
            // ]);

        res.status(200).json({ length : foundUsers.length ,  foundUsers });


  } catch (error) {
    res.status(500).json({ success : false , error : error.message })
  }
});

//status change to ongoing (buyer)
app.post("/acceptOrder",auth,async (req,res) => {
  try {
       
          const usertype = await Buyer.findById({ _id : req.session.userid })

          if(usertype.usertype === "buyer"){
            const buyerData = await Buyer.findByIdAndUpdate({ _id: req.session.userid }, { $push: { "acceptedOreders": req.body.sellerdataId } }, { new: true, runValidators: true })
            const usersellerDate = await sellerData.findByIdAndUpdate({ _id: req.body.sellerdataId }, { orderStatus: "ongoing" }, { new: true, runValidators: true })
          }else{
            return res.status(400).json({ success: false, Erorr: "You are not Authorized to update details" })
          }

       return res.status(200).json({ success : true , message : "Order accepted"})

  } catch (error) {
    res.status(500).json({ success : false , error : error.message })
  }
})

//get accepted order data(buyer)
app.get("/getacceptedOrders",auth,async (req,res) => {
  try {
    
      const usertype = await Buyer.findById({ _id: req.session.userid }).populate({ path: "acceptedOreders", model: "seller_user_table"})
      return res.status(200).json({ success : true , Data : usertype })
    
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

//status change to completed order(buyer)
app.get("/completeOrder", auth, async (req,res) => {
  try {
        const usertype = await Buyer.findById({ _id: req.session.userid })

        if (usertype.usertype === "buyer") {
          const pullSellerData = await Buyer.findByIdAndUpdate({ _id: req.session.userid }, { $pull: { "acceptedOreders": req.body.sellerdataId } }, { new: true, runValidators: true })
          const pushSellerData = await Buyer.findByIdAndUpdate({ _id: req.session.userid }, { $push: { "completedOrders": req.body.sellerdataId } }, { new: true, runValidators: true })
          const usersellerData = await sellerData.findByIdAndUpdate({ _id: req.body.sellerdataId }, { orderStatus: "completed" }, { new: true, runValidators: true })
        } else {
          return res.status(400).json({ success: false, Erorr: "You are not Authorized to update details" })
        }

        return res.status(200).json({ success: true, message: "Order accepted" })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

module.exports = app;
