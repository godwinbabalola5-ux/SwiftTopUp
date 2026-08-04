const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({

    host: process.env.DB_HOST,

    user: process.env.DB_USER,

    password: process.env.DB_PASSWORD,

    database: process.env.DB_NAME,

    waitForConnections: true,

    connectionLimit: 10,

    queueLimit: 0

});

const query = (sql, params = [], callback) => {

    if (typeof params === "function") {
        callback = params;
        params = [];
    }

    const runQuery = () => pool.query(sql, params);

    if (typeof callback === "function") {
        runQuery()
            .then(([rows]) => callback(null, rows))
            .catch((error) => callback(error, null));
        return;
    }

    return runQuery();
};

const execute = (sql, params = [], callback) => {

    if (typeof params === "function") {
        callback = params;
        params = [];
    }

    const runQuery = () => pool.execute(sql, params);

    if (typeof callback === "function") {
        runQuery()
            .then(([rows]) => callback(null, rows))
            .catch((error) => callback(error, null));
        return;
    }

    return runQuery();
};

const getConnection = () => pool.getConnection();

(async () => {

    try {

        const connection = await getConnection();

        console.log("✅ Connected to MySQL Database!");

        connection.release();

    } catch (error) {

        console.error("❌ Database connection failed:", error.message);

    }

})();

module.exports = {
    query,
    execute,
    getConnection,
    pool
};