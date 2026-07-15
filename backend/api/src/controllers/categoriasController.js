import pool from "../config/db.js";

export async function cadastrarCategoria(req, res) {
  try {
    const {
      nome,
      descricao,
      ativo
    } = req.body;

    if (!nome || nome.trim().length < 3) {
      return res.status(400).json({
        mensagem: "O nome da categoria precisa ter pelo menos 3 caracteres."
      });
    }

    if (!descricao || descricao.trim().length < 5) {
      return res.status(400).json({
        mensagem: "A descrição da categoria precisa ter pelo menos 5 caracteres."
      });
    }

    const categoriaExiste = await pool.query(
      `
      SELECT id_categoria
      FROM categorias
      WHERE LOWER(nome) = LOWER($1)
      `,
      [nome.trim()]
    );

    if (categoriaExiste.rows.length > 0) {
      return res.status(409).json({
        mensagem: "Já existe uma categoria com esse nome."
      });
    }

    const novaCategoria = await pool.query(
      `
      INSERT INTO categorias
      (
        nome,
        descricao,
        ativo
      )
      VALUES ($1, $2, $3)
      RETURNING
        id_categoria,
        nome,
        descricao,
        ativo,
        criado_em
      `,
      [
        nome.trim(),
        descricao.trim(),
        ativo ?? true
      ]
    );

    return res.status(201).json({
      mensagem: "Categoria cadastrada com sucesso.",
      categoria: novaCategoria.rows[0]
    });
  } catch (erro) {
    console.error("Erro ao cadastrar categoria:", erro);

    return res.status(500).json({
      mensagem: "Erro interno ao cadastrar categoria."
    });
  }
}

export async function listarCategorias(req, res) {
  try {
    const categorias = await pool.query(
      `
      SELECT
        id_categoria,
        nome,
        descricao,
        ativo,
        criado_em
      FROM categorias
      WHERE ativo = true
      ORDER BY nome ASC
      `
    );

    return res.status(200).json(categorias.rows);
  } catch (erro) {
    console.error("Erro ao listar categorias:", erro);

    return res.status(500).json({
      mensagem: "Erro interno ao listar categorias."
    });
  }
}

export async function listarCategoriasInativas(req, res) {
  try {
    const categorias = await pool.query(
      `
      SELECT
        id_categoria,
        nome,
        descricao,
        ativo,
        criado_em
      FROM categorias
      WHERE ativo = false
      ORDER BY nome ASC
      `
    );

    return res.status(200).json(categorias.rows);
  } catch (erro) {
    console.error("Erro ao listar categorias inativas:", erro);

    return res.status(500).json({
      mensagem: "Erro interno ao listar categorias inativas."
    });
  }
}

export async function buscarCategoriaPorId(req, res) {
  try {
    const { id } = req.params;

    const categoria = await pool.query(
      `
      SELECT
        id_categoria,
        nome,
        descricao,
        ativo,
        criado_em
      FROM categorias
      WHERE id_categoria = $1
      `,
      [id]
    );

    if (categoria.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Categoria não encontrada."
      });
    }

    return res.status(200).json(categoria.rows[0]);
  } catch (erro) {
    console.error("Erro ao buscar categoria:", erro);

    return res.status(500).json({
      mensagem: "Erro interno ao buscar categoria."
    });
  }
}

export async function atualizarCategoria(req, res) {
  try {
    const { id } = req.params;

    const {
      nome,
      descricao,
      ativo
    } = req.body;

    const categoriaExiste = await pool.query(
      `
      SELECT
        id_categoria,
        nome,
        descricao,
        ativo
      FROM categorias
      WHERE id_categoria = $1
      `,
      [id]
    );

    if (categoriaExiste.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Categoria não encontrada."
      });
    }

    const categoriaAtual = categoriaExiste.rows[0];

    const novoNome =
      nome !== undefined
        ? nome.trim()
        : categoriaAtual.nome;

    const novaDescricao =
      descricao !== undefined
        ? descricao.trim()
        : categoriaAtual.descricao;

    const novoAtivo =
      ativo !== undefined
        ? ativo
        : categoriaAtual.ativo;

    if (!novoNome || novoNome.length < 3) {
      return res.status(400).json({
        mensagem: "O nome da categoria precisa ter pelo menos 3 caracteres."
      });
    }

    if (!novaDescricao || novaDescricao.length < 5) {
      return res.status(400).json({
        mensagem: "A descrição da categoria precisa ter pelo menos 5 caracteres."
      });
    }

    const nomeDuplicado = await pool.query(
      `
      SELECT id_categoria
      FROM categorias
      WHERE LOWER(nome) = LOWER($1)
      AND id_categoria <> $2
      `,
      [
        novoNome,
        id
      ]
    );

    if (nomeDuplicado.rows.length > 0) {
      return res.status(409).json({
        mensagem: "Já existe outra categoria com esse nome."
      });
    }

    const categoriaAtualizada = await pool.query(
      `
      UPDATE categorias
      SET
        nome = $1,
        descricao = $2,
        ativo = $3
      WHERE id_categoria = $4
      RETURNING
        id_categoria,
        nome,
        descricao,
        ativo,
        criado_em
      `,
      [
        novoNome,
        novaDescricao,
        novoAtivo,
        id
      ]
    );

    return res.status(200).json({
      mensagem: "Categoria atualizada com sucesso.",
      categoria: categoriaAtualizada.rows[0]
    });
  } catch (erro) {
    console.error("Erro ao atualizar categoria:", erro);

    return res.status(500).json({
      mensagem: "Erro interno ao atualizar categoria."
    });
  }
}

export async function excluirCategoria(req, res) {
  try {
    const { id } = req.params;

    const categoriaExiste = await pool.query(
      `
      SELECT id_categoria
      FROM categorias
      WHERE id_categoria = $1
      `,
      [id]
    );

    if (categoriaExiste.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Categoria não encontrada."
      });
    }

    const produtosVinculados = await pool.query(
      `
      SELECT id_produto
      FROM produtos
      WHERE categoria_id = $1
      LIMIT 1
      `,
      [id]
    );

    if (produtosVinculados.rows.length > 0) {
      return res.status(400).json({
        mensagem:
          "Não é possível excluir esta categoria porque existem produtos vinculados a ela. Você pode inativá-la."
      });
    }

    await pool.query(
      `
      DELETE FROM categorias
      WHERE id_categoria = $1
      `,
      [id]
    );

    return res.status(200).json({
      mensagem: "Categoria excluída com sucesso."
    });
  } catch (erro) {
    console.error("Erro ao excluir categoria:", erro);

    return res.status(500).json({
      mensagem: "Erro interno ao excluir categoria."
    });
  }
}