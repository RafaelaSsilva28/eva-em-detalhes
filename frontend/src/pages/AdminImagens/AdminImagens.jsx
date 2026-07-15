import { useEffect, useMemo, useState } from "react";

import {
  FiArrowLeft,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiImage,
  FiPackage,
  FiPlusCircle,
  FiRefreshCw,
  FiSearch,
  FiStar,
  FiTag,
  FiTrash2,
  FiUpload,
  FiX
} from "react-icons/fi";

import { Link } from "react-router-dom";

import toast from "react-hot-toast";

import api, { API_URL } from "../../services/api.js";

import "./AdminImagens.css";

function AdminImagens() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [busca, setBusca] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("todas");
  const [filtroExibicao, setFiltroExibicao] = useState("todos");

  const [carregando, setCarregando] = useState(true);
  const [carregandoImagens, setCarregandoImagens] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const [modalAberto, setModalAberto] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [imagensProduto, setImagensProduto] = useState([]);

  const [novasImagens, setNovasImagens] = useState([]);

  const [imagemParaExcluir, setImagemParaExcluir] = useState(null);

  useEffect(() => {
    carregarDados();

    return () => {
      novasImagens.forEach((imagem) => {
        URL.revokeObjectURL(imagem.preview);
      });
    };
  }, []);

  async function carregarDados() {
    try {
      setCarregando(true);

      const token = localStorage.getItem("tokenEvaEmDetalhes");

      let produtosAtivos = [];
      let produtosInativos = [];
      let categoriasAtivas = [];
      let categoriasInativas = [];

      try {
        const respostaProdutos = await api.get("/produtos", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        produtosAtivos = Array.isArray(respostaProdutos.data)
          ? respostaProdutos.data
          : respostaProdutos.data.produtos || [];
      } catch (erro) {
        console.error("Erro ao buscar produtos ativos:", erro);
      }

      try {
        const respostaProdutosInativos = await api.get("/produtos/inativos", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        produtosInativos = Array.isArray(respostaProdutosInativos.data)
          ? respostaProdutosInativos.data
          : respostaProdutosInativos.data.produtos || [];
      } catch (erro) {
        console.warn("Rota de produtos inativos não encontrada:", erro);
      }

      try {
        const respostaCategorias = await api.get("/categorias", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        categoriasAtivas = Array.isArray(respostaCategorias.data)
          ? respostaCategorias.data
          : respostaCategorias.data.categorias || [];
      } catch (erro) {
        console.error("Erro ao buscar categorias:", erro);
      }

      try {
        const respostaCategoriasInativas = await api.get(
          "/categorias/inativas",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        categoriasInativas = Array.isArray(respostaCategoriasInativas.data)
          ? respostaCategoriasInativas.data
          : respostaCategoriasInativas.data.categorias || [];
      } catch (erro) {
        console.warn("Rota de categorias inativas não encontrada:", erro);
      }

      const listaProdutos = [...produtosAtivos, ...produtosInativos];

      const produtosSemDuplicar = listaProdutos.filter(
        (produto, index, array) =>
          index ===
          array.findIndex((item) => item.id_produto === produto.id_produto)
      );

      const listaCategorias = [...categoriasAtivas, ...categoriasInativas];

      const categoriasSemDuplicar = listaCategorias.filter(
        (categoria, index, array) =>
          index ===
          array.findIndex(
            (item) => item.id_categoria === categoria.id_categoria
          )
      );

      setProdutos(produtosSemDuplicar);
      setCategorias(categoriasSemDuplicar);
    } catch (erro) {
      console.error("Erro geral ao carregar imagens:", erro);

      toast.error("Não foi possível carregar os dados.");
    } finally {
      setCarregando(false);
    }
  }

  const produtosFiltrados = useMemo(() => {
    return produtos.filter((produto) => {
      const textoBusca = busca.trim().toLowerCase();

      const correspondeBusca =
        produto.nome?.toLowerCase().includes(textoBusca) ||
        produto.descricao?.toLowerCase().includes(textoBusca) ||
        produto.categoria?.toLowerCase().includes(textoBusca) ||
        produto.nome_categoria?.toLowerCase().includes(textoBusca);

      const correspondeCategoria =
        categoriaSelecionada === "todas" ||
        String(produto.categoria_id) === String(categoriaSelecionada);

      const apareceProdutos = Boolean(produto.exibir_produtos);
      const apareceGaleria = Boolean(produto.exibir_galeria);

      const correspondeExibicao =
        filtroExibicao === "todos" ||
        (filtroExibicao === "galeria" && apareceGaleria) ||
        (filtroExibicao === "produtos" && apareceProdutos) ||
        (filtroExibicao === "ambos" && apareceProdutos && apareceGaleria) ||
        (filtroExibicao === "semGaleria" && !apareceGaleria);

      return correspondeBusca && correspondeCategoria && correspondeExibicao;
    });
  }, [produtos, busca, categoriaSelecionada, filtroExibicao]);

  function montarUrlImagem(caminho) {
    if (!caminho) {
      return null;
    }

    if (caminho.startsWith("http")) {
      return caminho;
    }

    return `${API_URL}${caminho}`;
  }

  function formatarPreco(valor) {
    if (
      valor === null ||
      valor === undefined ||
      Number.isNaN(Number(valor))
    ) {
      return "Sob consulta";
    }

    return Number(valor).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  }

  async function abrirModalImagens(produto) {
    try {
      setProdutoSelecionado(produto);
      setModalAberto(true);
      setCarregandoImagens(true);

      const resposta = await api.get(`/produtos/${produto.id_produto}/imagens`);

      const listaImagens = Array.isArray(resposta.data)
        ? resposta.data
        : resposta.data.imagens || [];

      const imagensOrdenadas = [...listaImagens].sort((a, b) => {
        if (a.principal && !b.principal) {
          return -1;
        }

        if (!a.principal && b.principal) {
          return 1;
        }

        return Number(a.ordem || 0) - Number(b.ordem || 0);
      });

      setImagensProduto(imagensOrdenadas);
    } catch (erro) {
      console.error("Erro ao buscar imagens do produto:", erro);

      toast.error("Não foi possível carregar as imagens do produto.");
    } finally {
      setCarregandoImagens(false);
    }
  }

  function fecharModal() {
    novasImagens.forEach((imagem) => {
      URL.revokeObjectURL(imagem.preview);
    });

    setModalAberto(false);
    setProdutoSelecionado(null);
    setImagensProduto([]);
    setNovasImagens([]);
    setImagemParaExcluir(null);
  }

  function selecionarNovasImagens(event) {
    const arquivos = Array.from(event.target.files || []);

    if (arquivos.length === 0) {
      return;
    }

    const imagensFormatadas = arquivos.map((arquivo, index) => ({
      id_temporario: `${Date.now()}-${index}`,
      arquivo,
      preview: URL.createObjectURL(arquivo)
    }));

    setNovasImagens((estadoAtual) => [
      ...estadoAtual,
      ...imagensFormatadas
    ]);

    event.target.value = "";
  }

  function removerNovaImagem(idTemporario) {
    setNovasImagens((estadoAtual) => {
      const imagemRemovida = estadoAtual.find(
        (imagem) => imagem.id_temporario === idTemporario
      );

      if (imagemRemovida) {
        URL.revokeObjectURL(imagemRemovida.preview);
      }

      return estadoAtual.filter(
        (imagem) => imagem.id_temporario !== idTemporario
      );
    });
  }

  async function enviarNovasImagens() {
    if (!produtoSelecionado) {
      return;
    }

    if (novasImagens.length === 0) {
      toast.error("Selecione pelo menos uma imagem.");
      return;
    }

    try {
      setSalvando(true);

      const token = localStorage.getItem("tokenEvaEmDetalhes");

      const formData = new FormData();

      novasImagens.forEach((imagem) => {
        formData.append("imagens", imagem.arquivo);
      });

      const produtoSemImagemPrincipal =
        imagensProduto.length === 0 ||
        !imagensProduto.some((imagem) => imagem.principal);

      formData.append(
        "principal",
        produtoSemImagemPrincipal ? "true" : "false"
      );

      await api.post(
        `/produtos/${produtoSelecionado.id_produto}/imagens`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      novasImagens.forEach((imagem) => {
        URL.revokeObjectURL(imagem.preview);
      });

      setNovasImagens([]);

      toast.success("Imagens adicionadas com sucesso!");

      await abrirModalImagens(produtoSelecionado);
      await carregarDados();
    } catch (erro) {
      console.error("Erro ao enviar imagens:", erro);

      const mensagemErro =
        erro.response?.data?.mensagem ||
        erro.response?.data?.message ||
        "Não foi possível enviar as imagens.";

      toast.error(mensagemErro);
    } finally {
      setSalvando(false);
    }
  }

  async function definirImagemPrincipal(imagem) {
    if (!produtoSelecionado) {
      return;
    }

    try {
      setSalvando(true);

      const token = localStorage.getItem("tokenEvaEmDetalhes");

      await api.patch(
        `/produtos/${produtoSelecionado.id_produto}/imagens/${imagem.id_imagem}/principal`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success("Imagem principal atualizada!");

      await abrirModalImagens(produtoSelecionado);
      await carregarDados();
    } catch (erro) {
      console.error("Erro ao definir imagem principal:", erro);

      const mensagemErro =
        erro.response?.data?.mensagem ||
        erro.response?.data?.message ||
        "Não foi possível definir a imagem principal.";

      toast.error(mensagemErro);
    } finally {
      setSalvando(false);
    }
  }

  async function excluirImagem() {
    if (!produtoSelecionado || !imagemParaExcluir) {
      return;
    }

    try {
      setSalvando(true);

      const token = localStorage.getItem("tokenEvaEmDetalhes");

      await api.delete(
        `/produtos/${produtoSelecionado.id_produto}/imagens/${imagemParaExcluir.id_imagem}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success("Imagem excluída com sucesso!");

      setImagemParaExcluir(null);

      await abrirModalImagens(produtoSelecionado);
      await carregarDados();
    } catch (erro) {
      console.error("Erro ao excluir imagem:", erro);

      const mensagemErro =
        erro.response?.data?.mensagem ||
        erro.response?.data?.message ||
        "Não foi possível excluir a imagem.";

      toast.error(mensagemErro);
    } finally {
      setSalvando(false);
    }
  }

  async function alternarGaleria(produto) {
    if (produto.exibir_galeria && !produto.exibir_produtos) {
      toast.error(
        "Esse produto precisa aparecer em Produtos ou Galeria. Ative Produtos antes de remover da Galeria."
      );

      return;
    }

    try {
      const token = localStorage.getItem("tokenEvaEmDetalhes");

      await api.patch(
        `/produtos/${produto.id_produto}`,
        {
          exibir_galeria: !produto.exibir_galeria
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success(
        produto.exibir_galeria
          ? "Produto removido da galeria!"
          : "Produto adicionado à galeria!"
      );

      carregarDados();
    } catch (erro) {
      console.error("Erro ao alterar exibição na galeria:", erro);

      const mensagemErro =
        erro.response?.data?.mensagem ||
        erro.response?.data?.message ||
        "Não foi possível alterar a exibição na galeria.";

      toast.error(mensagemErro);
    }
  }

  return (
    <main className="adminImagensPagina">
      <section className="adminImagensHero">
        <div className="adminImagensDecoracao" aria-hidden="true">
          <span className="adminImagensForma adminImagensFormaUm" />
          <span className="adminImagensForma adminImagensFormaDois" />
        </div>

        <div className="adminImagensTopo">
          <div>
            <Link to="/dashboard" className="adminImagensVoltar">
              <FiArrowLeft />
              Voltar ao painel
            </Link>

            <span className="adminImagensTag">Galeria e imagens</span>

            <h1>
              Gerenciar
              <span>imagens</span>
            </h1>

            <p>
              Controle as fotos dos produtos, escolha a imagem principal e
              defina quais peças aparecem na galeria do site.
            </p>
          </div>

          <button
            type="button"
            className="adminImagensBotaoAtualizar"
            onClick={carregarDados}
            disabled={carregando}
          >
            <FiRefreshCw />
            Atualizar
          </button>
        </div>
      </section>

      <section className="adminImagensPainel">
        <div className="adminImagensFiltros">
          <div className="adminImagensBusca">
            <FiSearch />

            <input
              type="text"
              placeholder="Buscar produto..."
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
            />
          </div>

          <select
            value={categoriaSelecionada}
            onChange={(event) => setCategoriaSelecionada(event.target.value)}
          >
            <option value="todas">Todas as categorias</option>

            {categorias.map((categoria) => (
              <option
                key={categoria.id_categoria}
                value={categoria.id_categoria}
              >
                {categoria.nome}
              </option>
            ))}
          </select>

          <select
            value={filtroExibicao}
            onChange={(event) => setFiltroExibicao(event.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="galeria">Na galeria</option>
            <option value="semGaleria">Fora da galeria</option>
            <option value="produtos">Em produtos</option>
            <option value="ambos">Produtos e galeria</option>
          </select>
        </div>

        {carregando ? (
          <div className="adminImagensSkeleton">
            <span />
            <span />
            <span />
          </div>
        ) : produtosFiltrados.length > 0 ? (
          <div className="adminImagensGrid">
            {produtosFiltrados.map((produto) => {
              const imagem = montarUrlImagem(produto.imagem_principal);

              return (
                <article
                  key={produto.id_produto}
                  className={
                    produto.exibir_galeria
                      ? "adminImagensCard adminImagensCardGaleria"
                      : "adminImagensCard"
                  }
                >
                  <div className="adminImagensCardImagem">
                    {imagem ? (
                      <img src={imagem} alt={produto.nome} />
                    ) : (
                      <div className="adminImagensSemImagem">
                        <FiImage />
                        <span>Sem imagem</span>
                      </div>
                    )}

                    {produto.destaque && (
                      <div className="adminImagensDestaque">
                        <FiStar />
                        Destaque
                      </div>
                    )}
                  </div>

                  <div className="adminImagensCardInfo">
                    <span>
                      <FiTag />
                      {produto.categoria ||
                        produto.nome_categoria ||
                        "Sem categoria"}
                    </span>

                    <h2>{produto.nome}</h2>

                    <p>{produto.descricao || "Sem descrição cadastrada."}</p>

                    <strong>
                      {produto.preco_sob_consulta
                        ? "Sob consulta"
                        : formatarPreco(produto.preco)}
                    </strong>

                    <div className="adminImagensBadges">
                      {produto.exibir_produtos && <small>Produtos</small>}
                      {produto.exibir_galeria && <small>Galeria</small>}
                      {!produto.ativo && <small>Inativo</small>}
                    </div>

                    <div className="adminImagensCardAcoes">
                      <button
                        type="button"
                        onClick={() => abrirModalImagens(produto)}
                      >
                        <FiImage />
                        Gerenciar imagens
                      </button>

                      <button
                        type="button"
                        onClick={() => alternarGaleria(produto)}
                      >
                        {produto.exibir_galeria ? <FiEyeOff /> : <FiEye />}
                        {produto.exibir_galeria
                          ? "Remover da galeria"
                          : "Colocar na galeria"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="adminImagensVazio">
            <FiPackage />

            <h2>Nenhum produto encontrado</h2>

            <p>
              Cadastre produtos e imagens para controlar a galeria do site.
            </p>

            <Link to="/dashboard/produtos/novo">
              <FiPlusCircle />
              Cadastrar produto
            </Link>
          </div>
        )}
      </section>

      {modalAberto && produtoSelecionado && (
        <div className="adminImagensModalOverlay">
          <div className="adminImagensModal">
            <button
              type="button"
              className="adminImagensModalFechar"
              onClick={fecharModal}
            >
              <FiX />
            </button>

            <section className="adminImagensModalResumo">
              <span className="adminImagensModalTag">Produto selecionado</span>

              <h2>{produtoSelecionado.nome}</h2>

              <p>
                Gerencie as fotos desse produto. A imagem principal será usada
                nos cards do site.
              </p>

              <div className="adminImagensModalBadges">
                {produtoSelecionado.exibir_produtos && <span>Produtos</span>}
                {produtoSelecionado.exibir_galeria && <span>Galeria</span>}
                {produtoSelecionado.destaque && <span>Destaque</span>}
              </div>

              <label className="adminImagensUpload">
                <FiUpload />

                <strong>Adicionar novas imagens</strong>

                <small>JPG, PNG ou WEBP</small>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={selecionarNovasImagens}
                />
              </label>

              {novasImagens.length > 0 && (
                <div className="adminImagensNovas">
                  {novasImagens.map((imagem) => (
                    <article key={imagem.id_temporario}>
                      <img src={imagem.preview} alt="Nova imagem" />

                      <button
                        type="button"
                        onClick={() => removerNovaImagem(imagem.id_temporario)}
                      >
                        <FiX />
                      </button>
                    </article>
                  ))}

                  <button
                    type="button"
                    className="adminImagensEnviar"
                    onClick={enviarNovasImagens}
                    disabled={salvando}
                  >
                    <FiUpload />
                    {salvando ? "Enviando..." : "Enviar imagens"}
                  </button>
                </div>
              )}
            </section>

            <section className="adminImagensModalGaleria">
              <div className="adminImagensModalGaleriaTopo">
                <div>
                  <span>Imagens cadastradas</span>
                  <h3>Fotos do produto</h3>
                </div>

                <strong>{imagensProduto.length} foto(s)</strong>
              </div>

              {carregandoImagens ? (
                <div className="adminImagensCarregando">
                  Carregando imagens...
                </div>
              ) : imagensProduto.length > 0 ? (
                <div className="adminImagensListaFotos">
                  {imagensProduto.map((imagem) => {
                    const urlImagem = montarUrlImagem(imagem.caminho_imagem);

                    return (
                      <article
                        key={imagem.id_imagem}
                        className={
                          imagem.principal
                            ? "adminImagensFoto adminImagensFotoPrincipal"
                            : "adminImagensFoto"
                        }
                      >
                        <img src={urlImagem} alt="Imagem do produto" />

                        {imagem.principal && (
                          <span>
                            <FiCheckCircle />
                            Principal
                          </span>
                        )}

                        <div className="adminImagensFotoAcoes">
                          {!imagem.principal && (
                            <button
                              type="button"
                              onClick={() => definirImagemPrincipal(imagem)}
                              disabled={salvando}
                            >
                              <FiCheckCircle />
                              Tornar principal
                            </button>
                          )}

                          <button
                            type="button"
                            className="adminImagensExcluirFoto"
                            onClick={() => setImagemParaExcluir(imagem)}
                            disabled={salvando}
                          >
                            <FiTrash2 />
                            Excluir
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="adminImagensSemFotos">
                  <FiImage />

                  <h3>Nenhuma imagem cadastrada</h3>

                  <p>
                    Adicione fotos para esse produto aparecer melhor no site.
                  </p>
                </div>
              )}
            </section>
          </div>
        </div>
      )}

      {imagemParaExcluir && (
        <div className="adminImagensConfirmarOverlay">
          <div className="adminImagensConfirmar">
            <button
              type="button"
              className="adminImagensModalFechar"
              onClick={() => setImagemParaExcluir(null)}
            >
              <FiX />
            </button>

            <div className="adminImagensConfirmarIcone">
              <FiTrash2 />
            </div>

            <span>Confirmar exclusão</span>

            <h2>Excluir imagem?</h2>

            <p>
              Essa imagem será removida do produto. Se ela for a principal, o
              backend pode impedir a exclusão até você escolher outra imagem.
            </p>

            <div className="adminImagensConfirmarAcoes">
              <button
                type="button"
                onClick={() => setImagemParaExcluir(null)}
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={excluirImagem}
                disabled={salvando}
              >
                {salvando ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default AdminImagens;