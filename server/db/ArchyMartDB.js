const sql = require('mssql');
//const sql = require('mssql/msnodesqlv8');
const dotenv = require('dotenv');
dotenv.config();


/** 
    const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    server: process.env.SERVERNAME,
    options: {
        encrypt: true, 
        trustServerCertificate: false 
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};
*/

const connectDB = async () => {
    try {
        await sql.connect(config);
        console.log("Connected to Database");
        
    }
    catch (err) {
        console.error("Failed to connect to Database", err);
        throw err; 
    }
};
