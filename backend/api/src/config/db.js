import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? {
          rejectUnauthorized: false
        }
      : false
});

export async function testarConexao() {
  try {
    await pool.query("SELECT NOW()");
    console.log("Banco de dados conectado com sucesso.");
  } catch (erro) {
    console.error("Erro ao conectar com o banco de dados:", erro);
  }
}

pool.on("error", (erro) => {
  console.error("Erro inesperado no banco de dados:", erro);
});

export default pool;