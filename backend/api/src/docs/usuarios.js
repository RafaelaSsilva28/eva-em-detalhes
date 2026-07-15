const usuariosDocs = {
  "/usuarios": {
    post: {
      tags: ["Usuários"],
      summary: "Cadastrar usuário",
      description:
        "Cadastra um novo usuário. Esta rota exige autenticação por token JWT.",

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
              required: ["nome", "email", "senha"],

              properties: {
                nome: {
                  type: "string",
                  minLength: 3,
                  example: "Rafaela"
                },

                email: {
                  type: "string",
                  format: "email",
                  example: "rafaela@email.com"
                },

                senha: {
                  type: "string",
                  format: "password",
                  minLength: 8,
                  example: "12345678"
                }
              }
            }
          }
        }
      },

      responses: {
        201: {
          description: "Usuário cadastrado com sucesso.",

          content: {
            "application/json": {
              schema: {
                type: "object",

                properties: {
                  mensagem: {
                    type: "string",
                    example: "Usuário cadastrado com sucesso."
                  },

                  usuario: {
                    $ref: "#/components/schemas/Usuario"
                  }
                }
              }
            }
          }
        },

        400: {
          description:
            "Nome, email ou senha não informados ou dados inválidos."
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
            "Já existe um usuário cadastrado com este email."
        },

        500: {
          description:
            "Erro interno do servidor."
        }
      }
    },

    get: {
      tags: ["Usuários"],
      summary: "Listar usuários",
      description:
        "Retorna todos os usuários cadastrados sem exibir suas senhas.",

      security: [
        {
          BearerAuth: []
        }
      ],

      responses: {
        200: {
          description: "Usuários encontrados com sucesso.",

          content: {
            "application/json": {
              schema: {
                type: "array",

                items: {
                  $ref: "#/components/schemas/Usuario"
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
  },

  "/usuarios/{id}": {
    patch: {
      tags: ["Usuários"],
      summary: "Atualizar usuário parcialmente",
      description:
        "Atualiza somente os campos informados de um usuário cadastrado. Também permite ativar ou desativar o usuário.",

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
          description: "ID do usuário que será atualizado.",

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
                  example: "Rafaela de Souza"
                },

                email: {
                  type: "string",
                  format: "email",
                  example: "rafaela@evaemdetalhes.com"
                },

                senha: {
                  type: "string",
                  format: "password",
                  minLength: 8,
                  example: "novaSenha123"
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
                  nome: "Rafaela de Souza"
                }
              },

              atualizarEmail: {
                summary: "Atualizar apenas o email",

                value: {
                  email: "rafaela@evaemdetalhes.com"
                }
              },

              atualizarSenha: {
                summary: "Atualizar apenas a senha",

                value: {
                  senha: "novaSenha123"
                }
              },

              desativarUsuario: {
                summary: "Desativar usuário",

                value: {
                  ativo: false
                }
              },

              ativarUsuario: {
                summary: "Ativar usuário novamente",

                value: {
                  ativo: true
                }
              },

              atualizarVariosCampos: {
                summary: "Atualizar vários campos",

                value: {
                  nome: "Rafaela de Souza Silva",
                  email: "rafaela@email.com",
                  senha: "12345678",
                  ativo: true
                }
              }
            }
          }
        }
      },

      responses: {
        200: {
          description: "Usuário atualizado com sucesso.",

          content: {
            "application/json": {
              schema: {
                type: "object",

                properties: {
                  mensagem: {
                    type: "string",
                    example: "Usuário atualizado com sucesso."
                  },

                  usuario: {
                    $ref: "#/components/schemas/Usuario"
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
            "Usuário não encontrado."
        },

        409: {
          description:
            "Email já utilizado por outro usuário."
        },

        500: {
          description:
            "Erro interno do servidor."
        }
      }
    },

    delete: {
      tags: ["Usuários"],
      summary: "Excluir usuário definitivamente",
      description:
        "Exclui permanentemente um usuário do banco de dados. Para apenas ativar ou desativar o usuário, utilize a rota PATCH.",

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
          description: "ID do usuário que será excluído definitivamente.",

          schema: {
            type: "integer",
            example: 2
          }
        }
      ],

      responses: {
        200: {
          description:
            "Usuário excluído definitivamente com sucesso.",

          content: {
            "application/json": {
              schema: {
                type: "object",

                properties: {
                  mensagem: {
                    type: "string",
                    example:
                      "Usuário excluído definitivamente com sucesso."
                  },

                  usuario: {
                    $ref: "#/components/schemas/Usuario"
                  }
                }
              }
            }
          }
        },

        400: {
          description:
            "ID inválido ou tentativa de excluir o próprio usuário."
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
            "Usuário não encontrado."
        },

        500: {
          description:
            "Erro interno do servidor."
        }
      }
    }
  },

  "/login": {
    post: {
      tags: ["Usuários"],
      summary: "Realizar login",
      description:
        "Verifica o email e a senha e retorna um token JWT. Esta é a única rota pública de usuários.",

      requestBody: {
        required: true,

        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "senha"],

              properties: {
                email: {
                  type: "string",
                  format: "email",
                  example: "rafaela@email.com"
                },

                senha: {
                  type: "string",
                  format: "password",
                  example: "12345678"
                }
              }
            }
          }
        }
      },

      responses: {
        200: {
          description: "Login realizado com sucesso.",

          content: {
            "application/json": {
              schema: {
                type: "object",

                properties: {
                  mensagem: {
                    type: "string",
                    example: "Login realizado com sucesso."
                  },

                  token: {
                    type: "string",
                    example:
                      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  },

                  usuario: {
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
                      }
                    }
                  }
                }
              }
            }
          }
        },

        400: {
          description:
            "Email ou senha não informados."
        },

        401: {
          description:
            "Email ou senha inválidos."
        },

        403: {
          description:
            "Usuário inativo."
        },

        500: {
          description:
            "Erro interno do servidor."
        }
      }
    }
  }
};

export default usuariosDocs;