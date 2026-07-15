const imagensDocs = {
  "/produtos/{produto_id}/imagens": {
    get: {
      tags: ["Imagens"],
      summary: "Listar imagens do produto",
      description:
        "Retorna todas as imagens cadastradas para um produto. Esta rota é pública.",

      parameters: [
        {
          name: "produto_id",
          in: "path",
          required: true,
          description: "ID do produto.",

          schema: {
            type: "integer",
            example: 1
          }
        }
      ],

      responses: {
        200: {
          description:
            "Imagens encontradas com sucesso.",

          content: {
            "application/json": {
              schema: {
                type: "array",

                items: {
                  $ref:
                    "#/components/schemas/ImagemProduto"
                }
              }
            }
          }
        },

        400: {
          description: "ID inválido."
        },

        404: {
          description:
            "Produto não encontrado."
        },

        500: {
          description:
            "Erro interno do servidor."
        }
      }
    },

    post: {
      tags: ["Imagens"],
      summary: "Adicionar imagens ao produto",
      description:
        "Adiciona até 10 imagens ao produto. A primeira imagem cadastrada será definida como principal automaticamente.",

      security: [
        {
          BearerAuth: []
        }
      ],

      parameters: [
        {
          name: "produto_id",
          in: "path",
          required: true,
          description: "ID do produto.",

          schema: {
            type: "integer",
            example: 1
          }
        }
      ],

      requestBody: {
        required: true,

        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              required: ["imagens"],

              properties: {
                imagens: {
                  type: "array",

                  items: {
                    type: "string",
                    format: "binary"
                  }
                }
              }
            }
          }
        }
      },

      responses: {
        201: {
          description:
            "Imagens cadastradas com sucesso."
        },

        400: {
          description:
            "Nenhuma imagem enviada, formato inválido ou limite excedido."
        },

        401: {
          description:
            "Token não fornecido."
        },

        403: {
          description:
            "Token inválido ou expirado."
        },

        404: {
          description:
            "Produto não encontrado."
        },

        500: {
          description:
            "Erro interno do servidor."
        }
      }
    }
  },

  "/imagens/{id}/principal": {
    patch: {
      tags: ["Imagens"],
      summary: "Definir imagem principal",
      description:
        "Define uma imagem como capa principal do produto.",

      security: [
        {
          BearAuth: []
        }
      ],

      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description:
            "ID da imagem que será definida como principal.",

          schema: {
            type: "integer",
            example: 2
          }
        }
      ],

      responses: {
        200: {
          description:
            "Imagem principal atualizada com sucesso."
        },

        400: {
          description:
            "ID inválido."
        },

        401: {
          description:
            "Token não fornecido."
        },

        403: {
          description:
            "Token inválido ou expirado."
        },

        404: {
          description:
            "Imagem não encontrada."
        },

        500: {
          description:
            "Erro interno do servidor."
        }
      }
    }
  },

  "/imagens/{id}": {
    delete: {
      tags: ["Imagens"],
      summary: "Excluir imagem",
      description:
        "Exclui definitivamente a imagem do banco e da pasta de uploads. O produto deve permanecer com pelo menos uma imagem.",

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
          description:
            "ID da imagem que será excluída.",

          schema: {
            type: "integer",
            example: 2
          }
        }
      ],

      responses: {
        200: {
          description:
            "Imagem excluída definitivamente com sucesso."
        },

        400: {
          description:
            "ID inválido."
        },

        401: {
          description:
            "Token não fornecido."
        },

        403: {
          description:
            "Token inválido ou expirado."
        },

        404: {
          description:
            "Imagem não encontrada."
        },

        409: {
          description:
            "O produto precisa permanecer com pelo menos uma imagem."
        },

        500: {
          description:
            "Erro interno do servidor."
        }
      }
    }
  }
};

export default imagensDocs;