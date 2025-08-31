const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const { connectDB } = require("./scripts/seed")
const app = express();
const UserEntryRoutes = require("./routes/UserEntryRoutes");
const OrderRoutes = require("./routes/OrderRoutes")
const ProductRoutes = require("./routes/ProductRoutes")
const passport = require("./strategies/LocalStrategy");
const MongoStore = require("connect-mongo");

const IS_PORD = process.env.NODE_ENV === "production";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('trust proxy', 1);


// If you proxy /api via Nginx from the same origin (https://archymart.cs.rpi.edu),
// you can REMOVE CORS entirely.
// If you keep API on a different origin, keep this but set ORIGIN accordingly.




app.use(
    session({
        secret: process.env.SESSION_SECRET,
        saveUninitialized: false,  
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
            ttl: 24 * 60 * 60, // 1 day (matches your 24h re-verification idea)
        }),
        resave:false,
        cookie: {
            maxAge: 80000 * 100,   
            httpOnly: true,   
            //secure: process.env.NODE_ENV === "production",         
            //sameSite: "lax", 
        },
    })
)

app.use(passport.initialize())
app.use(passport.session())

const PORT = 3000;
// Bind to 127.0.0.1 in prod (Nginx will proxy) ; 0.0.0.0 in dev if needed
//0.0.0.0 binds server to all interfaces 127.0.0.1 LAN IPV etc
const HOST = (IS_PORD) ? "127.0.0.1" : "0.0.0.0";

connectDB()
    .then(() => {
        app.listen(PORT, HOST, () => {
            console.log(`Listening on ${HOST}:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Database connection failed. Server not started.", err);
    });

app.use("/api/auth",UserEntryRoutes)

app.use("/api/orders",OrderRoutes)

app.use("/api/products",ProductRoutes)

module.exports = {IS_PORD};

