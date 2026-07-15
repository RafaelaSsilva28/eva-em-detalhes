import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import pool from "../config/db.js";

export async function cadastrarUsuario(req, res) {
  try {
    let { nome, email, senha } = req.body;

    nome = nome?.trim();
    email = email?.trim().toLowerCase();
    senha = senha?.trim();

    if (!nome || !email || !senha) {
      return res.status(400).json({
        mensagem: "Nome, email e senha são obrigatórios."
      });
    }

    if (nome.length < 3) {
      return res.status(400).json({
        mensagem: "O nome deve possuir pelo menos 3 caracteres."
      });
    }

    if (!email.includes("@") || !email.includes(".")) {
      return res.status(400).json({
        mensagem: "Informe um email válido."
      });
    }

    if (senha.length < 8) {
      return res.status(400).json({
        mensagem: "A senha deve possuir pelo menos 8 caracteres."
      });
    }

    const usuarioExistente = await pool.query(
      `SELECT id_usuario
       FROM usuarios
       WHERE LOWER(email) = $1`,
      [email]
    );

    if (usuarioExistente.rows.length > 0) {
      return res.status(409).json({
        mensagem: "Já existe um usuário com este email."
      });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const resultado = await pool.query(
      `INSERT INTO usuarios (
        nome,
        email,
        senha
      )
      VALUES ($1, $2, $3)
      RETURNING
        id_usuario,
        nome,
        email,
        ativo,
        criado_em`,
      [nome, email, senhaHash]
    );

    return res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso.",
      usuario: resultado.rows[0]
    });
  } catch (erro) {
    console.error("Erro ao cadastrar usuário:", erro);

    return res.status(500).json({
      mensagem: "Erro interno ao cadastrar usuário."
    });
  }
}

export async function login(req, res) {
  try {
    let { email, senha } = req.body;

    email = email?.trim().toLowerCase();
    senha = senha?.trim();

    if (!email || !senha) {
      return res.status(400).json({
        mensagem: "Email e senha são obrigatórios."
      });
    }

    const resultado = await pool.query(
      `SELECT
        id_usuario,
        nome,
        email,
        senha,
        ativo
      FROM usuarios
      WHERE LOWER(email) = $1`,
      [email]
    );

    if (resultado.rows.length === 0) {
      return res.status(401).json({
        mensagem: "Email ou senha inválidos."
      });
    }

    const usuario = resultado.rows[0];

    if (!usuario.ativo) {
      return res.status(403).json({
        mensagem: "Usuário inativo."
      });
    }

    const senhaCorreta = await bcrypt.compare(
      senha,
      usuario.senha
    );

    if (!senhaCorreta) {
      return res.status(401).json({
        mensagem: "Email ou senha inválidos."
      });
    }

    const token = jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        email: usuario.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "8h"
      }
    );

    return res.status(200).json({
      mensagem: "Login realizado com sucesso.",
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        nome: usuario.nome,
        email: usuario.email
      }
    });
  } catch (erro) {
    console.error("Erro ao realizar login:", erro);

    return res.status(500).json({
      mensagem: "Erro interno ao realizar login."
    });
  }
}

export async function listarUsuarios(req, res) {
  try {
    const resultado = await pool.query(
      `SELECT
        id_usuario,
        nome,
        email,
        ativo,
        criado_em
      FROM usuarios
      ORDER BY id_usuario`
    );

    return res.status(200).json(resultado.rows);
  } catch (erro) {
    console.error("Erro ao listar usuários:", erro);

    return res.status(500).json({
      mensagem: "Erro interno ao listar usuários."
    });
  }
}

export async function atualizarUsuario(req, res) {
  try {
    const { id } = req.params;

    let {
      nome,
      email,
      senha,
      ativo
    } = req.body;

    const usuarioExistente = await pool.query(
      `SELECT
        id_usuario,
        nome,
        email,
        ativo
      FROM usuarios
      WHERE id_usuario = $1`,
      [id]
    );

    if (usuarioExistente.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Usuário não encontrado."
      });
    }

    if (
      nome === undefined &&
      email === undefined &&
      senha === undefined &&
      ativo === undefined
    ) {
      return res.status(400).json({
        mensagem: "Informe pelo menos um campo para atualizar."
      });
    }

    if (nome !== undefined) {
      nome = nome.trim();

      if (nome.length < 3) {
        return res.status(400).json({
          mensagem: "O nome deve possuir pelo menos 3 caracteres."
        });
      }
    }

    if (email !== undefined) {
      email = email.trim().toLowerCase();

      if (!email.includes("@") || !email.includes(".")) {
        return res.status(400).json({
          mensagem: "Informe um email válido."
        });
      }

      const emailEmUso = await pool.query(
        `SELECT id_usuario
         FROM usuarios
         WHERE LOWER(email) = $1
         AND id_usuario <> $2`,
        [email, id]
      );

      if (emailEmUso.rows.length > 0) {
        return res.status(409).json({
          mensagem: "Este email já está sendo utilizado."
        });
      }
    }

    let senhaHash;

    if (senha !== undefined) {
      senha = senha.trim();

      if (senha.length < 8) {
        return res.status(400).json({
          mensagem: "A senha deve possuir pelo menos 8 caracteres."
        });
      }

      senhaHash = await bcrypt.hash(senha, 10);
    }

    if (
      ativo !== undefined &&
      typeof ativo !== "boolean"
    ) {
      return res.status(400).json({
        mensagem: "O campo ativo deve ser verdadeiro ou falso."
      });
    }

    const resultado = await pool.query(
      `UPDATE usuarios
       SET
         nome = COALESCE($1, nome),
         email = COALESCE($2, email),
         senha = COALESCE($3, senha),
         ativo = COALESCE($4, ativo)
       WHERE id_usuario = $5
       RETURNING
         id_usuario,
         nome,
         email,
         ativo,
         criado_em`,
      [
        nome ?? null,
        email ?? null,
        senhaHash ?? null,
        ativo ?? null,
        id
      ]
    );

    return res.status(200).json({
      mensagem: "Usuário atualizado com sucesso.",
      usuario: resultado.rows[0]
    });
  } catch (erro) {
    console.error("Erro ao atualizar usuário:", erro);

    if (erro.code === "22P02") {
      return res.status(400).json({
        mensagem: "O ID do usuário deve ser um número inteiro."
      });
    }

    return res.status(500).json({
      mensagem: "Erro interno ao atualizar usuário."
    });
  }
}
export async function excluirUsuario(req, res) {
  try {
    const { id } = req.params;

    if (Number(id) === req.usuario.id_usuario) {
      return res.status(400).json({
        mensagem: "Você não pode excluir o próprio usuário."
      });
    }

    const usuarioExistente = await pool.query(
      `SELECT
        id_usuario,
        nome,
        email,
        ativo
      FROM usuarios
      WHERE id_usuario = $1`,
      [id]
    );

    if (usuarioExistente.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Usuário não encontrado."
      });
    }

    const resultado = await pool.query(
      `DELETE FROM usuarios
       WHERE id_usuario = $1
       RETURNING
         id_usuario,
         nome,
         email,
         ativo,
         criado_em`,
      [id]
    );

    return res.status(200).json({
      mensagem: "Usuário excluído definitivamente com sucesso.",
      usuario: resultado.rows[0]
    });
  } catch (erro) {
    console.error("Erro ao excluir usuário:", erro);

    if (erro.code === "22P02") {
      return res.status(400).json({
        mensagem: "O ID do usuário deve ser um número inteiro."
      });
    }

    return res.status(500).json({
      mensagem: "Erro interno ao excluir usuário."
    });
  }
}