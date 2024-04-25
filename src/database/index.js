const { Pool } = require("pg");
const fs = require("fs");

const pool = new Pool({
    user: "evaluat-adm",
    host: "localhost",
    database: "postgres",
    password: "910f4444bb75187fcbc4ba493281a15b",
    port: 5432,
});

pool.connect();

// Create Table from scheme.sql query
const data = fs.readFileSync("./src/database/scheme.sql");

const queryArr = data.toString().split(");");
queryArr.pop();

queryArr.forEach((query) => {
    query += ");";
    query = query.trim();

    pool.query(query, (err) => {
        if (err) return err;
    });
});

exports.query = async (query, values) => {
    const { rows } = await pool.query(query, values);
    return rows;
};

// Foi comentado para nao gerar erro de acesso ao banco de dados em PCs que nao tenham o PostgreSQL
