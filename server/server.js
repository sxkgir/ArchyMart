const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const { connectDB } = require("./scripts/seed")
const app = express();
const port = 3000;
const UserEntryRoutes = require("./routes/UserEntryRoutes");
const OrderRoutes = require("./routes/OrderRoutes")
const ProductRoutes = require("./routes/ProductRoutes")
const passport = require("./strategies/LocalStrategy");
const MongoStore = require("connect-mongo");
const { ensureAuthenticated } = require("./middleware/authMiddleware")

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
        store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
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

app.use("/api/auth",UserEntryRoutes)

app.use("/api/orders",OrderRoutes)

app.use("/api/products",ProductRoutes)

