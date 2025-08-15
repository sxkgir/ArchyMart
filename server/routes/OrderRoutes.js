const express = require("express");
const router = express.Router();
const crypto = require("crypto")
const Order = require("../models/Order");
const { ensureAuthenticated } = require("../middleware/authMiddleware")


router.post("/create",ensureAuthenticated ,async(req,res) =>{
    try{
        const {items, totalPrice} = req.body;
        console.log(items)
        if (totalPrice === 0) return res.status(400).json({message: "Cart is empty or Server error contact email login page"});
        console.log(req.user._id)
        const token = crypto.randomBytes(16).toString("hex")
        const order = new Order({
            orderID: token,
            orderedBy: req.user._id,
            items: items,
            totalPrice: totalPrice,
        });

        await order.save();

        console.log("Order Placed!")


        res.status(201).json({ message: "Order placed!", orderID: order.orderID });
 
    }
    catch(error){
        console.error("Error creating order:", error);
        res.status(500).json({ message: "Failed to place order" });
    }

})

router.get("/orders/mine",ensureAuthenticated ,async(req,res,next) => {
    try{
        const userID = req.user._id; 
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = 12;
        const [total, orders] = await Promise.all([
            Order.countDocuments({ orderedBy: userID }), //userID is alr a objectID
            Order.find({orderedBy: userID})
                .sort({datePlaced: -1})
                .skip((page - 1 ) * limit)
                .limit(limit)
                .lean(),
                
        ])

        if (page > totalPages) {
        return res.status(400).json({
            message: `Page ${page} does not exist. Total pages: ${totalPages}.`
        });
        }
        
        res.json({
            orders,
            page,
            limit,
            total,
            totalPages: Math.max(1, Math.ceil(total / limit))
        })

    }
    catch(err){
        console.log(err);
    }
})

module.exports = router;