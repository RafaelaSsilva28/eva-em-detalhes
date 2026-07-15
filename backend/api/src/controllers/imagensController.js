import pool from "../config/db.js";

export async function listarImagensProduto(req, res) {
  try {
    const { id } = req.params;

    const imagens = await pool.query(
      `
      SELECT
        id_imagem,
        produto_id,
        caminho_imagem,
        principal,
        ordem,
        criado_em
      FROM imagens_produto
      WHERE produto_id = $1
      ORDER BY principal DESC, ordem ASC, id_imagem ASC
      `,
      [id]
    );

    return res.status(200).json(imagens.rows);
  } catch (erro) {
    console.error("Erro ao listar imagens do produto:", erro);

    return res.status(500).json({
      mensagem: "Erro interno ao listar imagens do produto."
    });
  }
}

export async function cadastrarImagensProduto(req, res) {
  const client = await pool.connect();

  try {
    const { id } = req.params;
    const { principal } = req.body;

    const arquivos = req.files || [];

    if (arquivos.length === 0) {
      return res.status(400).json({
        mensagem: "Envie pelo menos uma imagem."
      });
    }

    await client.query("BEGIN");

    const produtoExiste = await client.query(
      `
      SELECT id_produto
      FROM produtos
      WHERE id_produto = $1
      `,
      [id]
    );

    if (produtoExiste.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        mensagem: "Produto não encontrado."
      });
    }

    const ultimaOrdem = await client.query(
      `
      SELECT COALESCE(MAX(ordem), -1) AS ultima_ordem
      FROM imagens_produto
      WHERE produto_id = $1
      `,
      [id]
    );

    let ordemAtual =
      Number(ultimaOrdem.rows[0].ultima_ordem) + 1;

    const imagensCadastradas = [];

    const deveSerPrincipal =
      principal === "true" ||
      principal === true;

    if (deveSerPrincipal) {
      await client.query(
        `
        UPDATE imagens_produto
        SET principal = false
        WHERE produto_id = $1
        `,
        [id]
      );
    }

    for (let index = 0; index < arquivos.length; index++) {
      const arquivo = arquivos[index];

      const caminhoImagem = `/uploads/${arquivo.filename}`;

      const imagemPrincipal =
        deveSerPrincipal && index === 0;

      const novaImagem = await client.query(
        `
        INSERT INTO imagens_produto
        (
          produto_id,
          caminho_imagem,
          principal,
          ordem
        )
        VALUES ($1, $2, $3, $4)
        RETURNING
          id_imagem,
          produto_id,
          caminho_imagem,
          principal,
          ordem,
          criado_em
        `,
        [
          id,
          caminhoImagem,
          imagemPrincipal,
          ordemAtual
        ]
      );

      imagensCadastradas.push(novaImagem.rows[0]);

      ordemAtual++;
    }

    await client.query("COMMIT");

    return res.status(201).json({
      mensagem: "Imagem cadastrada com sucesso.",
      imagens: imagensCadastradas
    });
  } catch (erro) {
    await client.query("ROLLBACK");

    console.error("Erro ao cadastrar imagens:", erro);

    return res.status(500).json({
      mensagem: "Erro interno ao cadastrar imagens."
    });
  } finally {
    client.release();
  }
}

export async function definirImagemPrincipal(req, res) {
  const client = await pool.connect();

  try {
    const { id, idImagem } = req.params;

    await client.query("BEGIN");

    const imagemExiste = await client.query(
      `
      SELECT id_imagem
      FROM imagens_produto
      WHERE id_imagem = $1
      AND produto_id = $2
      `,
      [idImagem, id]
    );

    if (imagemExiste.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        mensagem: "Imagem não encontrada para este produto."
      });
    }

    await client.query(
      `
      UPDATE imagens_produto
      SET principal = false
      WHERE produto_id = $1
      `,
      [id]
    );

    const imagemPrincipal = await client.query(
      `
      UPDATE imagens_produto
      SET principal = true
      WHERE id_imagem = $1
      AND produto_id = $2
      RETURNING
        id_imagem,
        produto_id,
        caminho_imagem,
        principal,
        ordem,
        criado_em
      `,
      [idImagem, id]
    );

    await client.query("COMMIT");

    return res.status(200).json({
      mensagem: "Imagem principal atualizada com sucesso.",
      imagem: imagemPrincipal.rows[0]
    });
  } catch (erro) {
    await client.query("ROLLBACK");

    console.error("Erro ao definir imagem principal:", erro);

    return res.status(500).json({
      mensagem: "Erro interno ao definir imagem principal."
    });
  } finally {
    client.release();
  }
}

export async function excluirImagemProduto(req, res) {
  const client = await pool.connect();

  try {
    const { id, idImagem } = req.params;

    await client.query("BEGIN");

    const imagem = await client.query(
      `
      SELECT
        id_imagem,
        principal
      FROM imagens_produto
      WHERE id_imagem = $1
      AND produto_id = $2
      `,
      [idImagem, id]
    );

    if (imagem.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        mensagem: "Imagem não encontrada."
      });
    }

    if (imagem.rows[0].principal) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        mensagem:
          "Não é possível excluir a imagem principal. Defina outra imagem como principal antes."
      });
    }

    await client.query(
      `
      DELETE FROM imagens_produto
      WHERE id_imagem = $1
      AND produto_id = $2
      `,
      [idImagem, id]
    );

    await client.query("COMMIT");

    return res.status(200).json({
      mensagem: "Imagem excluída com sucesso."
    });
  } catch (erro) {
    await client.query("ROLLBACK");

    console.error("Erro ao excluir imagem:", erro);

    return res.status(500).json({
      mensagem: "Erro interno ao excluir imagem."
    });
  } finally {
    client.release();
  }
}