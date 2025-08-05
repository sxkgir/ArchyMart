const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const { connectDB } = require("./scripts/seed")
const app = express();
const port = 3000;
const Product = require("./models/Products");
const UserEntryRoutes = require("./routes/UserEntryRoutes");
const passport = require("./strategies/LocalStrategy");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
    origin: 'http://localhost:5173',
    credentials: true,
    })
);

app.use(
    session({
        secret: "ArchyMart Secret",
        saveUninitialized: false,  
        resave:false,
        cookie: {
            maxAge: 80000 * 100,      
        },
    })
)

app.use(passport.initialize())
app.use(passport.session())

connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Listening on port ${port}`);
        });
    })
    .catch((err) => {
        console.error("Database connection failed. Server not started.", err);
    });

app.use("/api",UserEntryRoutes)

app.get("/api/products", async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch products" });
    }
});