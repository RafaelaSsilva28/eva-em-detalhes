const dashboardDocs = {
  "/dashboard": {
    get: {
      tags: ["Dashboard"],
      summary: "Buscar dados do Dashboard",
      description:
        "Retorna os principais indicadores do painel administrativo.",

      security: [
        {
          BearerAuth: []
        }
      ],

      responses: {
        200: {
          description:
            "Dados do Dashboard encontrados com sucesso.",

          content: {
            "application/json": {
              schema: {
                type: "object",

                properties: {
                  total_produtos_ativos: {
                    type: "integer",
                    example: 20
                  },

                  produtos_sob_encomenda_ativos: {
                    type: "integer",
                    example: 12
                  },

                  categorias_ativas: {
                    type: "integer",
                    example: 8
                  },

                  total_imagens_ativas: {
                    type: "integer",
                    example: 45
                  },

                  ultimos_produtos: {
                    type: "array",

                    items: {
                      type: "object",

                      properties: {
                        id_produto: {
                          type: "integer",
                          example: 1
                        },

                        nome: {
                          type: "string",
                          example:
                            "Luva pedagógica dos animais"
                        },

                        preco: {
                          type: "number",
                          format: "double",
                          example: 45
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

                        destaque: {
                          type: "boolean",
                          example: true
                        },

                        ativo: {
                          type: "boolean",
                          example: true
                        },

                        criado_em: {
                          type: "string",
                          format: "date-time",
                          example:
                            "2026-07-09T15:00:00.000Z"
                        },

                        id_categoria: {
                          type: "integer",
                          example: 1
                        },

                        categoria: {
                          type: "string",
                          example:
                            "Recursos pedagógicos"
                        },

                        imagem_principal: {
                          type: "string",
                          nullable: true,
                          example:
                            "/uploads/luva-pedagogica.jpg"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },

        401: {
          description:
            "Token não fornecido ou enviado em formato inválido."
        },

        403: {
          description:
            "Token inválido ou expirado."
        },

        500: {
          description:
            "Erro interno do servidor."
        }
      }
    }
  }
};

export default dashboardDocs;