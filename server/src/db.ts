import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
    user: process.env.PG_USER as string,
    password: process.env.PG_PASSWORD as string,
    host: process.env.PG_HOST as string,
    port: Number(process.env.PG_PORT as string),
    database: process.env.PG_DATABASE as string,
});

export default pool;
