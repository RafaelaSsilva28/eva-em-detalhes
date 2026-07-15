import usuariosDocs from "../docs/usuarios.js";
import categoriasDocs from "../docs/categorias.js";
import produtosDocs from "../docs/produtos.js";
import imagensDocs from "../docs/imagens.js";
import dashboardDocs from "../docs/dashboard.js";

const documentacao = {
  openapi: "3.0.3",

  info: {
    title: "API EVA em Detalhes",
    version: "1.0.0",
    description:
      "Documentação da API do site EVA em Detalhes."
  },

  servers: [
    {
      url: "http://localhost:3001",
      description: "Servidor local"
    }
  ],

  tags: [
    {
      name: "Usuários",
      description:
        "Cadastro, login e gerenciamento de usuários."
    },
    {
      name: "Dashboard",
      description:
        "Indicadores principais do painel administrativo."
    },
    {
      name: "Categorias",
      description:
        "Cadastro e gerenciamento de categorias."
    },
    {
      name: "Produtos",
      description:
        "Cadastro e gerenciamento de produtos e trabalhos da galeria."
    },
    {
      name: "Imagens",
      description:
        "Upload e gerenciamento das imagens dos produtos."
    }
  ],

  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description:
          "Informe somente o token JWT recebido na rota de login."
      }
    },

    schemas: {
      Usuario: {
        type: "object",

        properties: {
          id_usuario: {
            type: "integer",
            example: 1
          },

          nome: {
            type: "string",
            example: "Rafaela"
          },

          email: {
            type: "string",
            format: "email",
            example: "rafaela@email.com"
          },

          ativo: {
            type: "boolean",
            example: true
          },

          criado_em: {
            type: "string",
            format: "date-time",
            example: "2026-07-08T20:00:00.000Z"
          }
        }
      },

      Categoria: {
        type: "object",

        properties: {
          id_categoria: {
            type: "integer",
            example: 1
          },

          nome: {
            type: "string",
            example: "Ponteiras"
          },

          descricao: {
            type: "string",
            example:
              "Ponteiras personalizadas para lápis, canetas e canetões."
          },

          ativo: {
            type: "boolean",
            example: true
          },

          criado_em: {
            type: "string",
            format: "date-time",
            example: "2026-07-08T20:00:00.000Z"
          }
        }
      },

      Produto: {
        type: "object",

        properties: {
          id_produto: {
            type: "integer",
            example: 1
          },

          nome: {
            type: "string",
            example: "Ponteira de lápis personalizada"
          },

          descricao: {
            type: "string",
            example:
              "Ponteira artesanal em EVA para lápis ou caneta."
          },

          preco: {
            type: "number",
            format: "double",
            example: 12.5
          },

          preco_sob_consulta: {
            type: "boolean",
            example: false
          },

          estoque: {
            type: "integer",
            example: 0
          },

          sob_encomenda: {
            type: "boolean",
            example: true
          },

          tempo_producao: {
            type: "string",
            example: "5 dias úteis"
          },

          material: {
            type: "string",
            example: "EVA"
          },

          tamanho: {
            type: "string",
            example: "10 cm"
          },

          permite_personalizacao: {
            type: "boolean",
            example: true
          },

          categoria_id: {
            type: "integer",
            example: 1
          },

          categoria: {
            type: "string",
            example: "Ponteiras"
          },

          exibir_produtos: {
            type: "boolean",
            example: true
          },

          exibir_galeria: {
            type: "boolean",
            example: true
          },

          destaque: {
            type: "boolean",
            example: false
          },

          ativo: {
            type: "boolean",
            example: true
          },

          imagem_principal: {
            type: "string",
            nullable: true,
            example:
              "/uploads/ponteira-principal.jpg"
          },

          criado_em: {
            type: "string",
            format: "date-time",
            example: "2026-07-08T20:00:00.000Z"
          },

          atualizado_em: {
            type: "string",
            format: "date-time",
            example: "2026-07-08T20:00:00.000Z"
          }
        }
      },

      ProdutoEntrada: {
        type: "object",

        required: [
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
          "destaque"
        ],

        properties: {
          nome: {
            type: "string",
            minLength: 3,
            example: "Ponteira de lápis personalizada"
          },

          descricao: {
            type: "string",
            minLength: 5,
            example:
              "Ponteira artesanal em EVA para lápis ou caneta."
          },

          preco: {
            type: "number",
            format: "double",
            minimum: 0,
            example: 12.5
          },

          preco_sob_consulta: {
            type: "boolean",
            example: false
          },

          estoque: {
            type: "integer",
            minimum: 0,
            example: 0
          },

          sob_encomenda: {
            type: "boolean",
            example: true
          },

          tempo_producao: {
            type: "string",
            minLength: 2,
            example: "5 dias úteis"
          },

          material: {
            type: "string",
            minLength: 2,
            example: "EVA"
          },

          tamanho: {
            type: "string",
            minLength: 1,
            example: "10 cm"
          },

          permite_personalizacao: {
            type: "boolean",
            example: true
          },

          categoria_id: {
            type: "integer",
            minimum: 1,
            example: 1
          },

          exibir_produtos: {
            type: "boolean",
            example: true
          },

          exibir_galeria: {
            type: "boolean",
            example: true
          },

          destaque: {
            type: "boolean",
            example: false
          }
        }
      },

      ImagemProduto: {
        type: "object",

        properties: {
          id_imagem: {
            type: "integer",
            example: 1
          },

          produto_id: {
            type: "integer",
            example: 1
          },

          caminho_imagem: {
            type: "string",
            example:
              "/uploads/ponteira-principal.jpg"
          },

          principal: {
            type: "boolean",
            example: true
          },

          ordem: {
            type: "integer",
            example: 0
          },

          ativo: {
            type: "boolean",
            example: true
          },

          criado_em: {
            type: "string",
            format: "date-time",
            example: "2026-07-08T20:00:00.000Z"
          }
        }
      },

      Erro: {
        type: "object",

        properties: {
          mensagem: {
            type: "string",
            example:
              "Erro interno do servidor."
          }
        }
      }
    }
  },

  paths: {
    ...usuariosDocs,
    ...dashboardDocs,
    ...categoriasDocs,
    ...produtosDocs,
    ...imagensDocs
  }
};

export default documentacao;