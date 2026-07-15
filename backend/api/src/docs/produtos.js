const produtosDocs = {
  "/produtos": {
    get: {
      tags: ["Produtos"],
      summary: "Listar produtos",
      description:
        "Lista os produtos ativos. A rota é pública e aceita filtros e paginação.",

      parameters: [
        {
          name: "pagina",
          in: "query",
          required: false,
          schema: {
            type: "integer",
            minimum: 1,
            example: 1
          }
        },
        {
          name: "limite",
          in: "query",
          required: false,
          schema: {
            type: "integer",
            minimum: 1,
            maximum: 100,
            example: 12
          }
        },
        {
          name: "busca",
          in: "query",
          required: false,
          schema: {
            type: "string",
            example: "ponteira"
          }
        },
        {
          name: "categoria_id",
          in: "query",
          required: false,
          schema: {
            type: "integer",
            example: 1
          }
        },
        {
          name: "galeria",
          in: "query",
          required: false,
          description:
            "Quando verdadeiro, retorna os itens destinados à galeria.",
          schema: {
            type: "boolean",
            example: false
          }
        },
        {
          name: "destaque",
          in: "query",
          required: false,
          schema: {
            type: "boolean",
            example: true
          }
        }
      ],

      responses: {
        200: {
          description: "Produtos encontrados com sucesso."
        },
        400: {
          description: "Parâmetros de paginação inválidos."
        },
        500: {
          description: "Erro interno do servidor."
        }
      }
    },

    post: {
      tags: ["Produtos"],
      summary: "Cadastrar produto",
      description:
        "Cadastra um novo produto. Esta rota exige token JWT.",

      security: [
        {
          BearerAuth: []
        }
      ],

      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ProdutoEntrada"
            },
            example: {
              nome: "Ponteira de lápis personalizada",
              descricao:
                "Ponteira artesanal em EVA para lápis ou caneta.",
              preco: 12.5,
              preco_sob_consulta: false,
              estoque: 0,
              sob_encomenda: true,
              tempo_producao: "5 dias úteis",
              material: "EVA",
              tamanho: "10 cm",
              permite_personalizacao: true,
              categoria_id: 1,
              exibir_produtos: true,
              exibir_galeria: true,
              destaque: false
            }
          }
        }
      },

      responses: {
        201: {
          description: "Produto cadastrado com sucesso."
        },
        400: {
          description: "Campos obrigatórios ou dados inválidos."
        },
        401: {
          description: "Token não fornecido."
        },
        403: {
          description: "Token inválido ou expirado."
        },
        404: {
          description: "Categoria não encontrada ou inativa."
        },
        500: {
          description: "Erro interno do servidor."
        }
      }
    }
  },

  "/produtos/{id}": {
    get: {
      tags: ["Produtos"],
      summary: "Buscar produto por ID",
      description:
        "Retorna os dados completos e as imagens de um produto. Esta rota é pública.",

      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "integer",
            example: 1
          }
        }
      ],

      responses: {
        200: {
          description: "Produto encontrado com sucesso."
        },
        400: {
          description: "ID inválido."
        },
        404: {
          description: "Produto não encontrado."
        },
        500: {
          description: "Erro interno do servidor."
        }
      }
    },

    patch: {
      tags: ["Produtos"],
      summary: "Atualizar produto parcialmente",
      description:
        "Atualiza somente os campos enviados. Esta rota exige token JWT.",

      security: [
        {
          BearerAuth: []
        }
      ],

      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "integer",
            example: 1
          }
        }
      ],

      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                nome: {
                  type: "string",
                  example: "Ponteira personalizada"
                },
                descricao: {
                  type: "string",
                  example:
                    "Ponteira personalizada em EVA."
                },
                preco: {
                  type: "number",
                  format: "double",
                  example: 15
                },
                preco_sob_consulta: {
                  type: "boolean",
                  example: false
                },
                estoque: {
                  type: "integer",
                  example: 2
                },
                sob_encomenda: {
                  type: "boolean",
                  example: true
                },
                tempo_producao: {
                  type: "string",
                  example: "7 dias úteis"
                },
                material: {
                  type: "string",
                  example: "EVA e cola"
                },
                tamanho: {
                  type: "string",
                  example: "12 cm"
                },
                permite_personalizacao: {
                  type: "boolean",
                  example: true
                },
                categoria_id: {
                  type: "integer",
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
                  example: true
                },
                ativo: {
                  type: "boolean",
                  example: true
                }
              }
            }
          }
        }
      },

      responses: {
        200: {
          description: "Produto atualizado com sucesso."
        },
        400: {
          description: "ID ou dados inválidos."
        },
        401: {
          description: "Token não fornecido."
        },
        403: {
          description: "Token inválido ou expirado."
        },
        404: {
          description: "Produto ou categoria não encontrado."
        },
        500: {
          description: "Erro interno do servidor."
        }
      }
    },

    delete: {
      tags: ["Produtos"],
      summary: "Excluir produto definitivamente",
      description:
        "Exclui permanentemente o produto e suas imagens do banco. Esta rota exige token JWT.",

      security: [
        {
          BearerAuth: []
        }
      ],

      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "integer",
            example: 1
          }
        }
      ],

      responses: {
        200: {
          description:
            "Produto excluído definitivamente com sucesso."
        },
        400: {
          description: "ID inválido."
        },
        401: {
          description: "Token não fornecido."
        },
        403: {
          description: "Token inválido ou expirado."
        },
        404: {
          description: "Produto não encontrado."
        },
        500: {
          description: "Erro interno do servidor."
        }
      }
    }
  }
};

export default produtosDocs;