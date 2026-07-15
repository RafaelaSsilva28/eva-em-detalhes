import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

export async function testarConexao() {
  try {
    const conexao = await pool.connect();

    console.log("Banco de dados conectado com sucesso.");

    conexao.release();
  } catch (erro) {
    console.error("Erro ao conectar com o banco de dados:");
    console.error(erro.message);
  }
}

export default pool;