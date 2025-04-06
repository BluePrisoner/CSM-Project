const {Pool} = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString : process.env.DATABASE_URL
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