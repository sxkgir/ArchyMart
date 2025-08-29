const express = require("express");
const router = express.Router();
const crypto = require("crypto")
const Order = require("../models/Order");
const { ensureAuthenticated } = require("../middleware/authMiddleware");
const { mongo } = require("mongoose");
const Student = require("../models/Student");


router.post("/create",ensureAuthenticated ,async(req,res) =>{
    try{
        // Expecting { orderData: { items, totalPrice }, studentRIN?, formID? }
        const { orderData, studentRIN, formID } = req.body || {};
        const { items, totalPrice } = orderData || {};
        const token = "ORD-" + BigInt("0x" + crypto.randomBytes(8).toString("hex")).toString(10);        


        if (req.user.role === "staff"){
            if (studentRIN == null) {
                return res.status(400).json({ message: "studentRIN is required for staff orders." });
            }
            const student = await Student.findOne({ RIN: studentRIN })
            if (!student) {
                return res.status(404).json({ message: "Student not found for provided RIN." });
            }
            const order = new Order({
                orderID: token,
                formID: formID ?? "",
                status: "awaiting-student",
                orderedBy: student._id,
                items:items,
                totalPrice: totalPrice
            })
            await order.save();

            console.log("Order Placed!")


            return res.status(201).json({ message: "Order placed for Student by Staff!", orderID: order.orderID });

        }

        console.log(items)
        if (totalPrice === 0) return res.status(400).json({message: "Cart is empty or Server error contact email login page"});
        console.log(req.user._id)
        //if orders go over millions make check for reapeated tokens
        const order = new Order({
            orderID: token,
            orderedBy: req.user._id,
            items: items,
            totalPrice: totalPrice,
        });

        await order.save();

        res.status(201).json({ message: "Your order has been sent and is being reviewed by the staff!", orderID: order.orderID });

    }
    catch(error){
        console.error("Error creating order:", error);
        res.status(500).json({ message: "Failed to place order" });
    }

})

router.get("/my",ensureAuthenticated ,async(req,res,next) => {
    try{
        const userID = req.user._id; 
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = 12;
        const q = (req.query.q).toString().trim()
        const status = req.query.status;
        const mongoQuery = {};

        mongoQuery.orderedBy = userID;

        const isMaybeOrderID = q.toUpperCase().startsWith("ORD-")
        
        let statusList = []
        // when it is just one it will be a string but when it is two status it will be a array so we need to account for both

        if (Array.isArray(status)) {
            statusList = status;
        } else if (typeof status === "string") {
            statusList = [status];
        }
    

        if(q){
            if(isMaybeOrderID){
                mongoQuery.orderID = q;
            }
            else{
                mongoQuery.formID = q;
            }
        }
        if (statusList.length === 1) {
            mongoQuery.status = statusList[0];         
        } else if (statusList.length > 1) {
            mongoQuery.status = { $in: statusList };   
        }

        console.log(mongoQuery)
        console.log("stauts", status)
        console.log("list", statusList)


        const [total, orders] = await Promise.all([
            Order.countDocuments(mongoQuery), //userID is alr a objectID
            Order.find(mongoQuery)
                .sort({datePlaced: -1})
                .skip((page - 1 ) * limit)
                .limit(limit)
                .lean(),
                
        ])

        const totalPages = Math.max(1, Math.ceil(total/ limit));

        if (page > totalPages) {
        return res.status(400).json({
            message: `Page ${page} does not exist. Total pages: ${totalPages}.`
        });
        } 

        res.json({
            orders,
            page,
            total,
            totalPages
        })

    }
    catch(err){
        console.log(err);
    }
})

router.get("/all", ensureAuthenticated, async(req,res) =>{
    try{
        if (req.user.role !== "staff") return res.status(403).json({
            message: "You are not a staff. How did you get to this page please contact me at jiangh8@rpi.edu"
        })
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = 12;
        const qraw = (req.query.q || "").toString().trim();
        const q = qraw.replace(/\s+/g, " ");
        const mongoQuery = {};
        const status = req.query.status;
        
        const isMaybeOrderID = q.toUpperCase().startsWith("ORD-");
        
        //add formID test case !!!

        const isMaybeEmail = q.includes("@") && q.includes(".");
        const tokens = q.split(" ").filter(Boolean);//filters out empty strings
        const isMaybeFullName = tokens.length === 2 && !isMaybeOrderID && !isMaybeEmail;
        
        console.log(tokens);

        if(q){
            if(isMaybeOrderID){
                mongoQuery.orderID = q;
            }
            else if (isMaybeEmail){
                const student = await Student.findOne({ email: q }).lean()
                if (!student){
                    return res.json({ orders: [], page, total: 0, totalPages: 1, message: "Email not found"});
                }            

                mongoQuery.orderedBy = student._id
            }
            else if (isMaybeFullName){
                const firstName = tokens[0];
                const lastName = tokens[1];

                const students = await Student.find({
                    $or:[
                        {firstName, lastName},
                        {firstName: lastName, lastName: firstName}
                    ]
                })
                .select("_id").lean();


                if (students.length === 0){
                    return res.json({ orders: [], page, total: 0, totalPages: 1, message:"Name not found"});
                }
                mongoQuery.orderedBy = { $in: students.map(s => s._id) };
            }
            else if (!isMaybeFullName){
                if (tokens.length === 1) {
                    return res.json({ orders: [], page, total: 0, totalPages: 1, message: "Invalid, If entering name. Please enter Full Name"});
                }
            }
        }
        
        let statusList = [];
        // when it is just one it will be a string but when it is two status it will be a array so we need to account for both
        if (Array.isArray(status)) {
            statusList = status;
        } else if (typeof status === "string") {
            statusList = [status];
        }

        
        if (statusList.length === 1) {
        mongoQuery.status = statusList[0];         // e.g., "pending"
        } else if (statusList.length > 1) {
        mongoQuery.status = { $in: statusList };   // e.g., { $in: ["pending","confirmed"] }
        }
        console.log(mongoQuery)
        console.log("stauts", status)
        console.log("list", statusList)


        const [total, orders] = await Promise.all([
            Order.countDocuments(mongoQuery),
            Order.find(mongoQuery)
                .sort({datePlaced: -1})
                .skip((page - 1) * limit)
                .limit(limit)
                .populate("orderedBy","firstName lastName email")
                .lean()
        ])

        const totalPages = Math.max(1, Math.ceil(total/ limit));

        if (page > totalPages) {
        return res.status(400).json({
            message: `Page ${page} does not exist. Total pages: ${totalPages}.`
        });
        } 

        res.json({
            orders,
            page,
            total,
            totalPages
        })





    }
    catch(err){
        console.log(err)
    }
})

router.post("/:orderID/decision", async(req,res) =>{
    const orderID = req.params.orderID
    const action = req.body.action
    console.log(orderID)

    if (!["confirmed", "denied", "pick-up", "student-accepted", "canceled"].includes(action)) {
        return res.status(400).json({ error: "Invalid action." });
    }

    try{
        console.log("action:", action)
        const updated = await Order.findOneAndUpdate(
            {orderID},
            {
                status: action,
                confirmedDate: action  === "confirm" ? new Date().toISOString()  : null,
            },
            {new: true}
        );

        if (!updated) return res.status(400).json({ message: "Order not found." }); 

        res.status(200).json({
            message: `Order ${action}ed successfully.`,
            order: updated,
        });
    }
    catch(err){
        console.error("Order decision error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
})

router.get("/week/report", async(req,res) =>{
    try{
        const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
        const end = new Date();                    // moment they click (server time)
        const start = new Date(end.getTime() - ONE_WEEK_MS);

        const yyyy = String(end.getFullYear());
        const mm = String(end.getMonth() + 1).padStart(2, "0"); 
        const dd = String(end.getDate()).padStart(2, "0");      // 01..31
        const stamp = `${mm}${dd}${yyyy}`;



        const orders = await Order.find({
            datePlaced: {$gte: start, $lt:end},
            status: "confirmed"
        })
            .sort({datePlaced: -1 })
            .populate("orderedBy", "firstName lastName RIN")
            .lean()
        
        console.log(orders);
                
        let report = "";
        orders.map(o => {
            report += o.orderedBy.RIN; 
            report += o.orderedBy.firstName;
            report += " " + o.orderedBy.lastName + "\t\t" 
            report += o.totalPrice + "  " + stamp + "TSSW" + "ask bill for what to put here"+ yyyy +"\n"
            
        })

        return res.status(200).json({report})

        
    }
    catch{

    }
})
module.exports = router;