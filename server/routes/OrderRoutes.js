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

module.exports = router;