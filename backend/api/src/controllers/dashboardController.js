import pool from "../config/db.js";

export async function buscarDadosDashboard(req, res) {
  try {
    const [
      produtosResultado,
      categoriasResultado,
      imagensResultado,
      ultimosProdutosResultado
    ] = await Promise.all([
      pool.query(
        `SELECT
          COUNT(*) FILTER (
            WHERE ativo = TRUE
          )::INTEGER AS total_produtos_ativos,

          COUNT(*) FILTER (
            WHERE ativo = TRUE
            AND sob_encomenda = TRUE
          )::INTEGER AS produtos_sob_encomenda_ativos
        FROM produtos`
      ),

      pool.query(
        `SELECT
          COUNT(*) FILTER (
            WHERE ativo = TRUE
          )::INTEGER AS categorias_ativas
        FROM categorias`
      ),

      pool.query(
        `SELECT
          COUNT(*) FILTER (
            WHERE ativo = TRUE
          )::INTEGER AS total_imagens_ativas
        FROM imagens_produto`
      ),

      pool.query(
        `SELECT
          p.id_produto,
          p.nome,
          p.preco,
          p.preco_sob_consulta,
          p.estoque,
          p.sob_encomenda,
          p.destaque,
          p.ativo,
          p.criado_em,
          c.id_categoria,
          c.nome AS categoria,
          (
            SELECT ip.caminho_imagem
            FROM imagens_produto ip
            WHERE ip.produto_id = p.id_produto
            AND ip.principal = TRUE
            AND ip.ativo = TRUE
            LIMIT 1
          ) AS imagem_principal
        FROM produtos p
        INNER JOIN categorias c
          ON c.id_categoria = p.categoria_id
        WHERE p.ativo = TRUE
        ORDER BY p.criado_em DESC
        LIMIT 5`
      )
    ]);

    return res.status(200).json({
      total_produtos_ativos:
        produtosResultado.rows[0].total_produtos_ativos,

      produtos_sob_encomenda_ativos:
        produtosResultado.rows[0].produtos_sob_encomenda_ativos,

      categorias_ativas:
        categoriasResultado.rows[0].categorias_ativas,

      total_imagens_ativas:
        imagensResultado.rows[0].total_imagens_ativas,

      ultimos_produtos:
        ultimosProdutosResultado.rows
    });
  } catch (erro) {
    console.error(
      "Erro ao buscar dados do dashboard:",
      erro
    );

    return res.status(500).json({
      mensagem:
        "Erro interno ao buscar dados do dashboard."
    });
  }
}