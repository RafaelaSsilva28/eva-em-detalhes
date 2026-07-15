const categoriasDocs = {
  "/categorias": {
    get: {
      tags: ["Categorias"],
      summary: "Listar categorias",
      description:
        "Retorna todas as categorias ativas. Esta rota é pública.",

      responses: {
        200: {
          description: "Categorias encontradas com sucesso.",

          content: {
            "application/json": {
              schema: {
                type: "array",

                items: {
                  $ref: "#/components/schemas/Categoria"
                }
              }
            }
          }
        },

        500: {
          description: "Erro interno do servidor."
        }
      }
    },

    post: {
      tags: ["Categorias"],
      summary: "Cadastrar categoria",
      description:
        "Cadastra uma nova categoria. Esta rota exige autenticação por token JWT.",

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
              type: "object",
              required: ["nome", "descricao"],

              properties: {
                nome: {
                  type: "string",
                  minLength: 3,
                  example: "Ponteiras"
                },

                descricao: {
                  type: "string",
                  minLength: 5,
                  example:
                    "Ponteiras personalizadas para lápis e canetas."
                }
              }
            }
          }
        }
      },

      responses: {
        201: {
          description: "Categoria cadastrada com sucesso.",

          content: {
            "application/json": {
              schema: {
                type: "object",

                properties: {
                  mensagem: {
                    type: "string",
                    example: "Categoria cadastrada com sucesso."
                  },

                  categoria: {
                    $ref: "#/components/schemas/Categoria"
                  }
                }
              }
            }
          }
        },

        400: {
          description:
            "Campos obrigatórios não informados ou dados inválidos."
        },

        401: {
          description:
            "Token não fornecido ou enviado em formato inválido."
        },

        403: {
          description:
            "Token inválido ou expirado."
        },

        409: {
          description:
            "Já existe uma categoria com este nome."
        },

        500: {
          description: "Erro interno do servidor."
        }
      }
    }
  },

  "/categorias/{id}": {
    patch: {
      tags: ["Categorias"],
      summary: "Atualizar categoria parcialmente",
      description:
        "Atualiza somente os campos informados de uma categoria.",

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
          description: "ID da categoria.",

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
                  minLength: 3,
                  example: "Ponteiras personalizadas"
                },

                descricao: {
                  type: "string",
                  minLength: 5,
                  example:
                    "Ponteiras artesanais para lápis, canetas e canetões."
                },

                ativo: {
                  type: "boolean",
                  example: true
                }
              }
            },

            examples: {
              atualizarNome: {
                summary: "Atualizar apenas o nome",

                value: {
                  nome: "Ponteiras personalizadas"
                }
              },

              atualizarDescricao: {
                summary: "Atualizar apenas a descrição",

                value: {
                  descricao:
                    "Ponteiras artesanais para lápis, canetas e canetões."
                }
              },

              desativarCategoria: {
                summary: "Desativar categoria",

                value: {
                  ativo: false
                }
              },

              ativarCategoria: {
                summary: "Ativar categoria",

                value: {
                  ativo: true
                }
              }
            }
          }
        }
      },

      responses: {
        200: {
          description: "Categoria atualizada com sucesso.",

          content: {
            "application/json": {
              schema: {
                type: "object",

                properties: {
                  mensagem: {
                    type: "string",
                    example: "Categoria atualizada com sucesso."
                  },

                  categoria: {
                    $ref: "#/components/schemas/Categoria"
                  }
                }
              }
            }
          }
        },

        400: {
          description:
            "Nenhum campo informado, ID inválido ou dados inválidos."
        },

        401: {
          description:
            "Token não fornecido ou enviado em formato inválido."
        },

        403: {
          description:
            "Token inválido ou expirado."
        },

        404: {
          description:
            "Categoria não encontrada."
        },

        409: {
          description:
            "Nome já utilizado por outra categoria."
        },

        500: {
          description: "Erro interno do servidor."
        }
      }
    },

    delete: {
      tags: ["Categorias"],
      summary: "Excluir categoria definitivamente",
      description:
        "Exclui permanentemente uma categoria. Categorias vinculadas a produtos não podem ser excluídas.",

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
          description: "ID da categoria.",

          schema: {
            type: "integer",
            example: 1
          }
        }
      ],

      responses: {
        200: {
          description:
            "Categoria excluída definitivamente com sucesso.",

          content: {
            "application/json": {
              schema: {
                type: "object",

                properties: {
                  mensagem: {
                    type: "string",
                    example:
                      "Categoria excluída definitivamente com sucesso."
                  },

                  categoria: {
                    $ref: "#/components/schemas/Categoria"
                  }
                }
              }
            }
          }
        },

        400: {
          description: "ID inválido."
        },

        401: {
          description:
            "Token não fornecido ou enviado em formato inválido."
        },

        403: {
          description:
            "Token inválido ou expirado."
        },

        404: {
          description:
            "Categoria não encontrada."
        },

        409: {
          description:
            "Categoria possui produtos vinculados e não pode ser excluída."
        },

        500: {
          description: "Erro interno do servidor."
        }
      }
    }
  }
};

export default categoriasDocs;