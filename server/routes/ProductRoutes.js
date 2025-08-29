const express = require("express");
const router = express.Router();
const Product = require("../models/Products");
const {ensureAuthenticated} = require("../middleware/authMiddleware")


router.get("/getAll", ensureAuthenticated ,async (req, res) => {
    try {
        if (req.user.role === "student"){
            const products = await Product.find({is3D : false}); 
            res.json({products, role: req.user.role});
        }
        const products = await Product.find({});
        res.json({products, role: req.user.role});
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

router.post("/addOne", ensureAuthenticated, async (req, res) => {
  try {
    if (req.user.role !== "staff") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const {
      productName,
      categoryName,
      price,         
      singleItem,
      availability,
      sqrFeet,      
      is3D
    } = req.body || {};

    // basic validation
    if (!productName || !categoryName || price === undefined) {
      return res.status(400).json({ message: "productName, categoryName, and price are required." });
    }

    const priceNum = Number(price);
    if (!Number.isFinite(priceNum) || priceNum < 0) {
      return res.status(400).json({ message: "price must be a non-negative number." });
    }

    let sqrFeetNum;
    if (sqrFeet !== undefined && sqrFeet !== null && String(sqrFeet).trim() !== "") {
      sqrFeetNum = Number(sqrFeet);
      if (!Number.isFinite(sqrFeetNum) || sqrFeetNum < 0) {
        return res.status(400).json({ message: "sqrFeet must be a non-negative number." });
      }
    }

    // highest productID + 1
    const last = await Product.findOne({}, { productID: 1 }).sort({ productID: -1 }).lean();
    const nextId = ((last && last.productID) || 0) + 1;

    // build doc
    const doc = {
      productID: nextId,
      productName: String(productName).trim(),
      categoryName: String(categoryName).trim(),
      price: priceNum,
      singleItem: !!singleItem,
      availability: !!availability,
      is3D: !!is3D
    };
    if (sqrFeetNum !== undefined) doc.sqrFeet = sqrFeetNum; // requires schema field to persist
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");

    // match your dataset style: "YYYY/MM/DD 0:00:00"
    doc.dateAdded = `${yyyy}/${mm}/${dd} 0:00:00`;

    const created = await Product.create(doc);
    console.log(created)
    return res.status(201).json({ product: created, message: "Product Created Successfully" });
  } catch (err) {
    // handle duplicate productID (if unique index is added later)
    if (err && err.code === 11000) {
      return res.status(409).json({ message: "Duplicate productID." });
    }
    console.error("Create product error:", err);
    return res.status(500).json({ message: "Failed to add product" });
  }
});

router.post("/deleteMany", ensureAuthenticated, async (req, res) => {
  try {
    if (req.user.role !== "staff") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const ids = req.body?.ids;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "ids (array of productID numbers) is required." });
    }

    // Normalize to numbers and filter invalids
    const idNums = ids
      .map((x) => Number(x))
      .filter((n) => Number.isFinite(n));

    if (idNums.length === 0) {
      return res.status(400).json({ message: "No valid product IDs provided." });
    }

    const result = await Product.deleteMany({ productID: { $in: idNums } });
    return res.json({message: `Successfully Deleted ${count}`});
  } catch (err) {
    console.error("deleteMany error:", err);
    return res.status(500).json({ error: "Failed to delete products" });
  }
});

module.exports = router;