const {Pool} = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString : process.env.DATABASE_URL
})

pool.connect()
    .then(() => {console.log('Connected to postgres DB.....')})
    .catch((err)=>{console.log('Connection to DB failed...', err)});

module.exports = pool;