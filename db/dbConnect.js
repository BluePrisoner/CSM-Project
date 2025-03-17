const {Pool} = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString : process.env.NEW_DATABASE_URL,
    ssl: { rejectUnauthorized: false }, //use if ssl is required,
    idleTimeoutMillis: 0,
    max:20
});

async function connection () {
    await pool.connect();
    try {
        console.log('Connected to postgres DB.....')
    } catch (err) {
        console.log('Connection to DB failed...', err)
    }
}

connection();
module.exports = pool;