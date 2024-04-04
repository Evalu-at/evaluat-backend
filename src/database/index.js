const { Pool } = require('pg');

const pool = new Pool({
    user: 'luix',
    host: 'localhost',
    database: 'postgres',
    password: 'meme',
    port: 5432
});

pool.connect();

exports.query = async (query, values) => {
    const { rows } = await pool.query(query, values);
    return rows;
};
