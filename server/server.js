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

app.set("trust proxy", 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const ORIGIN =
  process.env.NODE_ENV === "production"
    ? "https://archymart.cs.rpi.edu"
    : "http://localhost:5173";

// If you proxy /api via Nginx from the same origin (https://archymart.cs.rpi.edu),
// you can REMOVE CORS entirely.
// If you keep API on a different origin, keep this but set ORIGIN accordingly.
if (process.env.NODE_ENV !== "production") {
    console.log(ORIGIN)
  app.use(
    cors({
      origin: ORIGIN,
      credentials: true,
    })
  );
}

app.use(
    session({
        secret: "ArchyMart Secret",
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
            sameSite: "lax", 
        },
    })
)

app.use(passport.initialize())
app.use(passport.session())

const PORT = 3000;
// Bind to 127.0.0.1 in prod (Nginx will proxy) ; 0.0.0.0 in dev if needed
const HOST = process.env.NODE_ENV === "production" ? "127.0.0.1" : "0.0.0.0";

connectDB()
    .then(() => {
        app.listen(PORT,HOST, () => {
            console.log(`Listening on ${HOST}:${port}`);
        });
    })
    .catch((err) => {
        console.error("Database connection failed. Server not started.", err);
    });

app.use("/api/auth",UserEntryRoutes)

app.use("/api/orders",OrderRoutes)

app.use("/api/products",ProductRoutes)

