import pool from "../config/db.js";

export async function cadastrarProduto(req, res) {
  try {
    let {
      nome,
      descricao,
      preco,
      preco_sob_consulta,
      estoque,
      sob_encomenda,
      tempo_producao,
      material,
      tamanho,
      permite_personalizacao,
      categoria_id,
      exibir_produtos,
      exibir_galeria,
      destaque
    } = req.body;

    nome = nome?.trim();
    descricao = descricao?.trim();
    tempo_producao = tempo_producao?.trim();
    material = material?.trim();
    tamanho = tamanho?.trim();

    if (
      !nome ||
      !descricao ||
      preco === undefined ||
      preco_sob_consulta === undefined ||
      estoque === undefined ||
      sob_encomenda === undefined ||
      !tempo_producao ||
      !material ||
      !tamanho ||
      permite_personalizacao === undefined ||
      !categoria_id ||
      exibir_produtos === undefined ||
      exibir_galeria === undefined ||
      destaque === undefined
    ) {
      return res.status(400).json({
        mensagem: "Todos os campos do produto são obrigatórios."
      });
    }

    preco = Number(preco);
    estoque = Number(estoque);
    categoria_id = Number(categoria_id);

    if (nome.length < 3) {
      return res.status(400).json({
        mensagem: "O nome deve possuir pelo menos 3 caracteres."
      });
    }

    if (descricao.length < 5) {
      return res.status(400).json({
        mensagem: "A descrição deve possuir pelo menos 5 caracteres."
      });
    }

    if (Number.isNaN(preco) || preco < 0) {
      return res.status(400).json({
        mensagem: "O preço deve ser um número igual ou maior que zero."
      });
    }

    if (
      preco_sob_consulta === false &&
      preco <= 0
    ) {
      return res.status(400).json({
        mensagem:
          "Quando o preço não estiver sob consulta, ele deve ser maior que zero."
      });
    }

    if (
      !Number.isInteger(estoque) ||
      estoque < 0
    ) {
      return res.status(400).json({
        mensagem:
          "O estoque deve ser um número inteiro igual ou maior que zero."
      });
    }

    if (
      !Number.isInteger(categoria_id) ||
      categoria_id <= 0
    ) {
      return res.status(400).json({
        mensagem: "Informe uma categoria válida."
      });
    }

    const camposBooleanos = {
      preco_sob_consulta,
      sob_encomenda,
      permite_personalizacao,
      exibir_produtos,
      exibir_galeria,
      destaque
    };

    for (const [campo, valor] of Object.entries(camposBooleanos)) {
      if (typeof valor !== "boolean") {
        return res.status(400).json({
          mensagem: `O campo ${campo} deve ser verdadeiro ou falso.`
        });
      }
    }

    if (
      exibir_produtos === false &&
      exibir_galeria === false
    ) {
      return res.status(400).json({
        mensagem:
          "O produto deve aparecer na página Produtos, na Galeria ou nas duas."
      });
    }

    const categoriaExistente = await pool.query(
      `SELECT id_categoria
       FROM categorias
       WHERE id_categoria = $1
       AND ativo = TRUE`,
      [categoria_id]
    );

    if (categoriaExistente.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Categoria não encontrada ou inativa."
      });
    }

    const resultado = await pool.query(
      `INSERT INTO produtos (
        nome,
        descricao,
        preco,
        preco_sob_consulta,
        estoque,
        sob_encomenda,
        tempo_producao,
        material,
        tamanho,
        permite_personalizacao,
        categoria_id,
        exibir_produtos,
        exibir_galeria,
        destaque
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12, $13, $14
      )
      RETURNING *`,
      [
        nome,
        descricao,
        preco,
        preco_sob_consulta,
        estoque,
        sob_encomenda,
        tempo_producao,
        material,
        tamanho,
        permite_personalizacao,
        categoria_id,
        exibir_produtos,
        exibir_galeria,
        destaque
      ]
    );

    return res.status(201).json({
      mensagem: "Produto cadastrado com sucesso.",
      produto: resultado.rows[0]
    });
  } catch (erro) {
    console.error("Erro ao cadastrar produto:", erro);

    return res.status(500).json({
      mensagem: "Erro interno ao cadastrar produto."
    });
  }
}

export async function listarProdutos(req, res) {
  try {
    const {
      pagina = 1,
      limite = 12,
      busca,
      categoria_id,
      galeria,
      destaque
    } = req.query;

    const numeroPagina = Number(pagina);
    const quantidadeLimite = Number(limite);

    if (
      !Number.isInteger(numeroPagina) ||
      numeroPagina < 1 ||
      !Number.isInteger(quantidadeLimite) ||
      quantidadeLimite < 1 ||
      quantidadeLimite > 100
    ) {
      return res.status(400).json({
        mensagem:
          "Página e limite devem ser números inteiros válidos. O limite máximo é 100."
      });
    }

    const valores = [];
    const condicoes = [
      "p.ativo = TRUE"
    ];

    if (galeria === "true") {
      condicoes.push("p.exibir_galeria = TRUE");
    } else {
      condicoes.push("p.exibir_produtos = TRUE");
    }

    if (busca) {
      valores.push(`%${busca.trim()}%`);

      condicoes.push(
        `(p.nome ILIKE $${valores.length}
        OR p.descricao ILIKE $${valores.length})`
      );
    }

    if (categoria_id) {
      valores.push(Number(categoria_id));

      condicoes.push(
        `p.categoria_id = $${valores.length}`
      );
    }

    if (destaque === "true") {
      condicoes.push("p.destaque = TRUE");
    }

    const deslocamento =
      (numeroPagina - 1) * quantidadeLimite;

    const consultaTotal = await pool.query(
      `SELECT COUNT(*)::INTEGER AS total
       FROM produtos p
       WHERE ${condicoes.join(" AND ")}`,
      valores
    );

    valores.push(quantidadeLimite);
    const indiceLimite = valores.length;

    valores.push(deslocamento);
    const indiceOffset = valores.length;

    const resultado = await pool.query(
      `SELECT
        p.id_produto,
        p.nome,
        p.descricao,
        p.preco,
        p.preco_sob_consulta,
        p.estoque,
        p.sob_encomenda,
        p.tempo_producao,
        p.material,
        p.tamanho,
        p.permite_personalizacao,
        p.categoria_id,
        c.nome AS categoria,
        p.exibir_produtos,
        p.exibir_galeria,
        p.destaque,
        p.ativo,
        p.criado_em,
        p.atualizado_em,
        (
          SELECT ip.caminho_imagem
          FROM imagens_produto ip
          WHERE ip.produto_id = p.id_produto
          AND ip.principal = TRUE
          LIMIT 1
        ) AS imagem_principal
      FROM produtos p
      INNER JOIN categorias c
        ON c.id_categoria = p.categoria_id
      WHERE ${condicoes.join(" AND ")}
      ORDER BY
        p.destaque DESC,
        p.id_produto DESC
      LIMIT $${indiceLimite}
      OFFSET $${indiceOffset}`,
      valores
    );

    const total = consultaTotal.rows[0].total;
    const totalPaginas = Math.ceil(
      total / quantidadeLimite
    );

    return res.status(200).json({
      pagina: numeroPagina,
      limite: quantidadeLimite,
      total,
      total_paginas: totalPaginas,
      produtos: resultado.rows
    });
  } catch (erro) {
    console.error("Erro ao listar produtos:", erro);

    return res.status(500).json({
      mensagem: "Erro interno ao listar produtos."
    });
  }
}

export async function buscarProdutoPorId(req, res) {
  try {
    const { id } = req.params;

    const produtoResultado = await pool.query(
      `SELECT
        p.id_produto,
        p.nome,
        p.descricao,
        p.preco,
        p.preco_sob_consulta,
        p.estoque,
        p.sob_encomenda,
        p.tempo_producao,
        p.material,
        p.tamanho,
        p.permite_personalizacao,
        p.categoria_id,
        c.nome AS categoria,
        p.exibir_produtos,
        p.exibir_galeria,
        p.destaque,
        p.ativo,
        p.criado_em,
        p.atualizado_em
      FROM produtos p
      INNER JOIN categorias c
        ON c.id_categoria = p.categoria_id
      WHERE p.id_produto = $1
      AND p.ativo = TRUE`,
      [id]
    );

    if (produtoResultado.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Produto não encontrado."
      });
    }

    const imagensResultado = await pool.query(
      `SELECT
        id_imagem,
        caminho_imagem,
        principal,
        ordem,
        criado_em
      FROM imagens_produto
      WHERE produto_id = $1
      ORDER BY principal DESC, ordem ASC`,
      [id]
    );

    return res.status(200).json({
      ...produtoResultado.rows[0],
      imagens: imagensResultado.rows
    });
  } catch (erro) {
    console.error("Erro ao buscar produto:", erro);

    if (erro.code === "22P02") {
      return res.status(400).json({
        mensagem: "O ID do produto deve ser um número inteiro."
      });
    }

    return res.status(500).json({
      mensagem: "Erro interno ao buscar produto."
    });
  }
}

export async function atualizarProduto(req, res) {
  try {
    const { id } = req.params;

    const camposPermitidos = [
      "nome",
      "descricao",
      "preco",
      "preco_sob_consulta",
      "estoque",
      "sob_encomenda",
      "tempo_producao",
      "material",
      "tamanho",
      "permite_personalizacao",
      "categoria_id",
      "exibir_produtos",
      "exibir_galeria",
      "destaque",
      "ativo"
    ];

    const camposEnviados = Object.keys(req.body);

    if (camposEnviados.length === 0) {
      return res.status(400).json({
        mensagem:
          "Informe pelo menos um campo para atualizar."
      });
    }

    const campoInvalido = camposEnviados.find(
      campo => !camposPermitidos.includes(campo)
    );

    if (campoInvalido) {
      return res.status(400).json({
        mensagem: `O campo ${campoInvalido} não pode ser atualizado.`
      });
    }

    const produtoExistente = await pool.query(
      `SELECT *
       FROM produtos
       WHERE id_produto = $1`,
      [id]
    );

    if (produtoExistente.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Produto não encontrado."
      });
    }

    const produtoAtual = produtoExistente.rows[0];

    const produtoAtualizado = {
      ...produtoAtual,
      ...req.body
    };

    produtoAtualizado.nome =
      produtoAtualizado.nome?.trim();

    produtoAtualizado.descricao =
      produtoAtualizado.descricao?.trim();

    produtoAtualizado.tempo_producao =
      produtoAtualizado.tempo_producao?.trim();

    produtoAtualizado.material =
      produtoAtualizado.material?.trim();

    produtoAtualizado.tamanho =
      produtoAtualizado.tamanho?.trim();

    produtoAtualizado.preco =
      Number(produtoAtualizado.preco);

    produtoAtualizado.estoque =
      Number(produtoAtualizado.estoque);

    produtoAtualizado.categoria_id =
      Number(produtoAtualizado.categoria_id);

    if (
      !produtoAtualizado.nome ||
      produtoAtualizado.nome.length < 3
    ) {
      return res.status(400).json({
        mensagem:
          "O nome deve possuir pelo menos 3 caracteres."
      });
    }

    if (
      !produtoAtualizado.descricao ||
      produtoAtualizado.descricao.length < 5
    ) {
      return res.status(400).json({
        mensagem:
          "A descrição deve possuir pelo menos 5 caracteres."
      });
    }

    if (
      Number.isNaN(produtoAtualizado.preco) ||
      produtoAtualizado.preco < 0
    ) {
      return res.status(400).json({
        mensagem:
          "O preço deve ser igual ou maior que zero."
      });
    }

    if (
      produtoAtualizado.preco_sob_consulta === false &&
      produtoAtualizado.preco <= 0
    ) {
      return res.status(400).json({
        mensagem:
          "Quando o preço não estiver sob consulta, ele deve ser maior que zero."
      });
    }

    if (
      !Number.isInteger(produtoAtualizado.estoque) ||
      produtoAtualizado.estoque < 0
    ) {
      return res.status(400).json({
        mensagem:
          "O estoque deve ser um número inteiro igual ou maior que zero."
      });
    }

    if (
      produtoAtualizado.exibir_produtos === false &&
      produtoAtualizado.exibir_galeria === false
    ) {
      return res.status(400).json({
        mensagem:
          "O produto deve aparecer na página Produtos, na Galeria ou nas duas."
      });
    }

    const categoriaExistente = await pool.query(
      `SELECT id_categoria
       FROM categorias
       WHERE id_categoria = $1`,
      [produtoAtualizado.categoria_id]
    );

    if (categoriaExistente.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Categoria não encontrada."
      });
    }

    const resultado = await pool.query(
      `UPDATE produtos
       SET
         nome = $1,
         descricao = $2,
         preco = $3,
         preco_sob_consulta = $4,
         estoque = $5,
         sob_encomenda = $6,
         tempo_producao = $7,
         material = $8,
         tamanho = $9,
         permite_personalizacao = $10,
         categoria_id = $11,
         exibir_produtos = $12,
         exibir_galeria = $13,
         destaque = $14,
         ativo = $15,
         atualizado_em = CURRENT_TIMESTAMP
       WHERE id_produto = $16
       RETURNING *`,
      [
        produtoAtualizado.nome,
        produtoAtualizado.descricao,
        produtoAtualizado.preco,
        produtoAtualizado.preco_sob_consulta,
        produtoAtualizado.estoque,
        produtoAtualizado.sob_encomenda,
        produtoAtualizado.tempo_producao,
        produtoAtualizado.material,
        produtoAtualizado.tamanho,
        produtoAtualizado.permite_personalizacao,
        produtoAtualizado.categoria_id,
        produtoAtualizado.exibir_produtos,
        produtoAtualizado.exibir_galeria,
        produtoAtualizado.destaque,
        produtoAtualizado.ativo,
        id
      ]
    );

    return res.status(200).json({
      mensagem: "Produto atualizado com sucesso.",
      produto: resultado.rows[0]
    });
  } catch (erro) {
    console.error("Erro ao atualizar produto:", erro);

    if (erro.code === "22P02") {
      return res.status(400).json({
        mensagem: "O ID do produto deve ser um número inteiro."
      });
    }

    return res.status(500).json({
      mensagem: "Erro interno ao atualizar produto."
    });
  }
}

export async function excluirProduto(req, res) {
  try {
    const { id } = req.params;

    const resultado = await pool.query(
      `DELETE FROM produtos
       WHERE id_produto = $1
       RETURNING *`,
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Produto não encontrado."
      });
    }

    return res.status(200).json({
      mensagem:
        "Produto excluído definitivamente com sucesso.",
      produto: resultado.rows[0]
    });
  } catch (erro) {
    console.error("Erro ao excluir produto:", erro);

    if (erro.code === "22P02") {
      return res.status(400).json({
        mensagem: "O ID do produto deve ser um número inteiro."
      });
    }

    return res.status(500).json({
      mensagem: "Erro interno ao excluir produto."
    });
  }
}
export async function listarProdutosInativos(req, res) {
  try {
    const produtos = await pool.query(`
      SELECT
        p.id_produto,
        p.nome,
        p.descricao,
        p.preco,
        p.preco_sob_consulta,
        p.estoque,
        p.sob_encomenda,
        p.tempo_producao,
        p.material,
        p.tamanho,
        p.permite_personalizacao,
        p.categoria_id,
        p.exibir_produtos,
        p.exibir_galeria,
        p.destaque,
        p.ativo,
        p.criado_em,
        p.atualizado_em,
        c.nome AS categoria,
        (
          SELECT ip.caminho_imagem
          FROM imagens_produto ip
          WHERE ip.produto_id = p.id_produto
          AND ip.principal = true
          LIMIT 1
        ) AS imagem_principal
      FROM produtos p
      LEFT JOIN categorias c
        ON c.id_categoria = p.categoria_id
      WHERE p.ativo = false
      ORDER BY p.id_produto DESC
    `);

    return res.status(200).json(produtos.rows);
  } catch (erro) {
    console.error("Erro ao listar produtos inativos:", erro);

    return res.status(500).json({
      mensagem: "Erro interno ao listar produtos inativos."
    });
  }
}