const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const { connectDB } = require("./db/ArchyMartDB")
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
    origin: 'http://localhost:5173',
    credentials: true,
    })
);

connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Listening on port ${port}`);
        });
    })
    .catch((err) => {
        console.error("Database connection failed. Server not started.", err);
    });
