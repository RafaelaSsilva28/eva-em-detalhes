import { useEffect, useMemo, useState } from "react";

import {
  FiArrowLeft,
  FiCheckCircle,
  FiEdit3,
  FiEye,
  FiEyeOff,
  FiFilter,
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

import "./AdminProdutos.css";

function AdminProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("todas");
  const [statusFiltro, setStatusFiltro] = useState("todos");
  const [tipoFiltro, setTipoFiltro] = useState("todos");

  const [carregando, setCarregando] = useState(true);
  const [produtoExcluindo, setProdutoExcluindo] = useState(null);

  const [produtoEditando, setProdutoEditando] = useState(null);
  const [carregandoEdicao, setCarregandoEdicao] = useState(false);
  const [salvandoEdicao, setSalvandoEdicao] = useState(false);

  const [formEdicao, setFormEdicao] = useState({
    nome: "",
    descricao: "",
    preco: "",
    preco_sob_consulta: false,
    estoque: "",
    sob_encomenda: true,
    tempo_producao: "",
    material: "",
    tamanho: "",
    permite_personalizacao: true,
    categoria_id: "",
    exibir_produtos: true,
    exibir_galeria: false,
    destaque: false,
    ativo: true
  });

  const [imagensProduto, setImagensProduto] = useState([]);
  const [novasImagens, setNovasImagens] = useState([]);
  const [imagemPrincipalSelecionada, setImagemPrincipalSelecionada] =
    useState(null);

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    return () => {
      novasImagens.forEach((imagem) => {
        URL.revokeObjectURL(imagem.preview);
      });
    };
  }, [novasImagens]);

  async function carregarDados() {
    try {
      setCarregando(true);

      const token = localStorage.getItem("tokenEvaEmDetalhes");

      const [
        respostaProdutosAtivos,
        respostaProdutosInativos,
        respostaCategorias
      ] = await Promise.all([
        api.get("/produtos", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }),
        api.get("/produtos/inativos", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }),
        api.get("/categorias", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      ]);

      const listaProdutosAtivos = Array.isArray(respostaProdutosAtivos.data)
        ? respostaProdutosAtivos.data
        : respostaProdutosAtivos.data.produtos || [];

      const listaProdutosInativos = Array.isArray(respostaProdutosInativos.data)
        ? respostaProdutosInativos.data
        : respostaProdutosInativos.data.produtos || [];

      const listaProdutos = [
        ...listaProdutosAtivos,
        ...listaProdutosInativos
      ];

      const produtosSemDuplicar = listaProdutos.filter(
        (produto, index, array) =>
          index ===
          array.findIndex((item) => item.id_produto === produto.id_produto)
      );

      const listaCategorias = Array.isArray(respostaCategorias.data)
        ? respostaCategorias.data
        : respostaCategorias.data.categorias || [];

      setProdutos(produtosSemDuplicar);
      setCategorias(listaCategorias);
    } catch (erro) {
      console.error("Erro ao carregar produtos:", erro);
      toast.error("Não foi possível carregar os produtos.");
    } finally {
      setCarregando(false);
    }
  }

function montarUrlImagem(caminho) {
  if (!caminho) {
    return null;
  }

  if (caminho.startsWith("http")) {
    return caminho;
  }

  const apiUrlSemBarraFinal = API_URL.replace(/\/$/, "");

  const caminhoComBarraInicial = caminho.startsWith("/")
    ? caminho
    : `/${caminho}`;

  return `${apiUrlSemBarraFinal}${caminhoComBarraInicial}`;
}

  function obterImagem(produto) {
    return montarUrlImagem(produto?.imagem_principal);
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

  function converterPreco(valor) {
    if (valor === null || valor === undefined) {
      return 0;
    }

    const valorFormatado = String(valor).replace(",", ".");

    return Number(valorFormatado);
  }

  async function alternarStatus(produto) {
    try {
      const token = localStorage.getItem("tokenEvaEmDetalhes");

      await api.patch(
        `/produtos/${produto.id_produto}`,
        {
          ativo: !produto.ativo
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success(produto.ativo ? "Produto desativado." : "Produto ativado.");
      carregarDados();
    } catch (erro) {
      console.error("Erro ao alterar status:", erro);
      toast.error("Não foi possível alterar o status.");
    }
  }

  async function excluirProduto() {
    if (!produtoExcluindo) {
      return;
    }

    try {
      const token = localStorage.getItem("tokenEvaEmDetalhes");

      await api.delete(`/produtos/${produtoExcluindo.id_produto}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast.success("Produto excluído.");
      setProdutoExcluindo(null);
      carregarDados();
    } catch (erro) {
      console.error("Erro ao excluir produto:", erro);
      toast.error("Não foi possível excluir o produto.");
    }
  }

  async function abrirModalEdicao(produto) {
    try {
      setCarregandoEdicao(true);
      setProdutoEditando(produto);
      setNovasImagens([]);
      setImagensProduto([]);
      setImagemPrincipalSelecionada(null);

      const [respostaProduto, respostaImagens] = await Promise.all([
        api.get(`/produtos/${produto.id_produto}`),
        api.get(`/produtos/${produto.id_produto}/imagens`)
      ]);

      const dadosProduto =
        respostaProduto.data.produto ||
        respostaProduto.data.dados ||
        respostaProduto.data;

      const imagens = Array.isArray(respostaImagens.data)
        ? respostaImagens.data
        : respostaImagens.data.imagens || [];

      setFormEdicao({
        nome: dadosProduto.nome || "",
        descricao: dadosProduto.descricao || "",
        preco: dadosProduto.preco ?? "",
        preco_sob_consulta: dadosProduto.preco_sob_consulta ?? false,
        estoque: dadosProduto.estoque ?? 0,
        sob_encomenda: dadosProduto.sob_encomenda ?? true,
        tempo_producao: dadosProduto.tempo_producao || "",
        material: dadosProduto.material || "",
        tamanho: dadosProduto.tamanho || "",
        permite_personalizacao:
          dadosProduto.permite_personalizacao ?? true,
        categoria_id: dadosProduto.categoria_id || "",
        exibir_produtos: dadosProduto.exibir_produtos ?? true,
        exibir_galeria: dadosProduto.exibir_galeria ?? false,
        destaque: dadosProduto.destaque ?? false,
        ativo: dadosProduto.ativo ?? true
      });

      setImagensProduto(imagens);

      const imagemPrincipal = imagens.find((imagem) => imagem.principal);

      if (imagemPrincipal) {
        setImagemPrincipalSelecionada({
          tipo: "existente",
          id_imagem: imagemPrincipal.id_imagem
        });
      }
    } catch (erro) {
      console.error("Erro ao abrir edição:", erro);
      toast.error("Não foi possível carregar os dados do produto.");
      setProdutoEditando(null);
    } finally {
      setCarregandoEdicao(false);
    }
  }

  function fecharModalEdicao() {
    novasImagens.forEach((imagem) => {
      URL.revokeObjectURL(imagem.preview);
    });

    setProdutoEditando(null);
    setNovasImagens([]);
    setImagensProduto([]);
    setImagemPrincipalSelecionada(null);
  }

  function atualizarCampoEdicao(campo, valor) {
    setFormEdicao((estadoAtual) => ({
      ...estadoAtual,
      [campo]: valor
    }));
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

    setNovasImagens((estadoAtual) => [...estadoAtual, ...imagensFormatadas]);

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

    if (
      imagemPrincipalSelecionada?.tipo === "nova" &&
      imagemPrincipalSelecionada?.id_temporario === idTemporario
    ) {
      setImagemPrincipalSelecionada(null);
    }
  }

  async function excluirImagemExistente(imagem) {
    if (!produtoEditando) {
      return;
    }

    const selecionadaComoPrincipal =
      imagemPrincipalSelecionada?.tipo === "existente" &&
      imagemPrincipalSelecionada?.id_imagem === imagem.id_imagem;

    if (imagem.principal || selecionadaComoPrincipal) {
      toast.error(
        "Não é possível excluir a imagem principal. Escolha outra imagem como principal antes."
      );
      return;
    }

    try {
      const token = localStorage.getItem("tokenEvaEmDetalhes");

      await api.delete(
        `/produtos/${produtoEditando.id_produto}/imagens/${imagem.id_imagem}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success("Imagem removida.");

      setImagensProduto((estadoAtual) =>
        estadoAtual.filter((item) => item.id_imagem !== imagem.id_imagem)
      );
    } catch (erro) {
      console.error("Erro ao excluir imagem:", erro);

      const mensagemErro =
        erro.response?.data?.mensagem ||
        erro.response?.data?.message ||
        "Não foi possível excluir a imagem.";

      toast.error(mensagemErro);
    }
  }

  function obterImagemPrincipalPreview() {
    if (imagemPrincipalSelecionada?.tipo === "existente") {
      const imagem = imagensProduto.find(
        (item) => item.id_imagem === imagemPrincipalSelecionada.id_imagem
      );

      if (imagem) {
        return montarUrlImagem(imagem.caminho_imagem);
      }
    }

    if (imagemPrincipalSelecionada?.tipo === "nova") {
      const imagem = novasImagens.find(
        (item) =>
          item.id_temporario === imagemPrincipalSelecionada.id_temporario
      );

      if (imagem) {
        return imagem.preview;
      }
    }

    if (imagensProduto.length > 0) {
      return montarUrlImagem(imagensProduto[0].caminho_imagem);
    }

    if (novasImagens.length > 0) {
      return novasImagens[0].preview;
    }

    return null;
  }

  function validarEdicao() {
    if (!formEdicao.nome.trim()) {
      toast.error("Digite o nome do produto.");
      return false;
    }

    if (!formEdicao.descricao.trim()) {
      toast.error("Digite a descrição do produto.");
      return false;
    }

    if (!formEdicao.categoria_id) {
      toast.error("Selecione uma categoria.");
      return false;
    }

    if (!formEdicao.preco_sob_consulta && converterPreco(formEdicao.preco) <= 0) {
      toast.error("Informe um preço válido ou marque preço sob consulta.");
      return false;
    }

    if (!formEdicao.tempo_producao.trim()) {
      toast.error("Informe o tempo de produção.");
      return false;
    }

    if (!formEdicao.material.trim()) {
      toast.error("Informe o material.");
      return false;
    }

    if (!formEdicao.tamanho.trim()) {
      toast.error("Informe o tamanho.");
      return false;
    }

    if (!formEdicao.exibir_produtos && !formEdicao.exibir_galeria) {
      toast.error("O produto precisa aparecer em Produtos ou Galeria.");
      return false;
    }

    const totalImagens = imagensProduto.length + novasImagens.length;

    if (totalImagens === 0) {
      toast.error("Adicione pelo menos uma imagem para o produto.");
      return false;
    }

    if (!imagemPrincipalSelecionada) {
      toast.error("Selecione uma imagem principal para o produto.");
      return false;
    }

    return true;
  }

  async function salvarEdicaoProduto(event) {
    event.preventDefault();

    if (!produtoEditando || !validarEdicao()) {
      return;
    }

    try {
      setSalvandoEdicao(true);

      const token = localStorage.getItem("tokenEvaEmDetalhes");

      await api.patch(
        `/produtos/${produtoEditando.id_produto}`,
        {
          nome: formEdicao.nome.trim(),
          descricao: formEdicao.descricao.trim(),
          preco: formEdicao.preco_sob_consulta
            ? 0
            : converterPreco(formEdicao.preco),
          preco_sob_consulta: formEdicao.preco_sob_consulta,
          estoque: Number(formEdicao.estoque) || 0,
          sob_encomenda: formEdicao.sob_encomenda,
          tempo_producao: formEdicao.tempo_producao.trim(),
          material: formEdicao.material.trim(),
          tamanho: formEdicao.tamanho.trim(),
          permite_personalizacao: formEdicao.permite_personalizacao,
          categoria_id: Number(formEdicao.categoria_id),
          exibir_produtos: formEdicao.exibir_produtos,
          exibir_galeria: formEdicao.exibir_galeria,
          destaque: formEdicao.destaque,
          ativo: formEdicao.ativo
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const novasNaoPrincipais = novasImagens.filter((imagem) => {
        return !(
          imagemPrincipalSelecionada?.tipo === "nova" &&
          imagemPrincipalSelecionada?.id_temporario === imagem.id_temporario
        );
      });

      for (const imagem of novasNaoPrincipais) {
        const formData = new FormData();

        formData.append("imagens", imagem.arquivo);
        formData.append("principal", "false");

        await api.post(
          `/produtos/${produtoEditando.id_produto}/imagens`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data"
            }
          }
        );
      }

      if (imagemPrincipalSelecionada.tipo === "existente") {
        await api.patch(
          `/produtos/${produtoEditando.id_produto}/imagens/${imagemPrincipalSelecionada.id_imagem}/principal`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      }

      if (imagemPrincipalSelecionada.tipo === "nova") {
        const imagemPrincipalNova = novasImagens.find(
          (imagem) =>
            imagem.id_temporario ===
            imagemPrincipalSelecionada.id_temporario
        );

        if (!imagemPrincipalNova) {
          toast.error("Imagem principal selecionada não encontrada.");
          return;
        }

        const formData = new FormData();

        formData.append("imagens", imagemPrincipalNova.arquivo);
        formData.append("principal", "true");

        await api.post(
          `/produtos/${produtoEditando.id_produto}/imagens`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data"
            }
          }
        );
      }

      toast.success("Produto atualizado com sucesso!");
      fecharModalEdicao();
      carregarDados();
    } catch (erro) {
      console.error("Erro ao salvar edição:", erro);

      const mensagemErro =
        erro.response?.data?.mensagem ||
        erro.response?.data?.message ||
        "Não foi possível salvar as alterações.";

      toast.error(mensagemErro);
    } finally {
      setSalvandoEdicao(false);
    }
  }

  const produtosFiltrados = useMemo(() => {
    return produtos.filter((produto) => {
      const textoBusca = busca.trim().toLowerCase();

      const nome = produto.nome?.toLowerCase() || "";
      const descricao = produto.descricao?.toLowerCase() || "";

      const categoria =
        produto.categoria?.toLowerCase() ||
        produto.nome_categoria?.toLowerCase() ||
        "";

      const correspondeBusca =
        !textoBusca ||
        nome.includes(textoBusca) ||
        descricao.includes(textoBusca) ||
        categoria.includes(textoBusca);

      const correspondeCategoria =
        categoriaFiltro === "todas" ||
        String(produto.categoria_id) === String(categoriaFiltro) ||
        String(produto.id_categoria) === String(categoriaFiltro);

      const correspondeStatus =
        statusFiltro === "todos" ||
        (statusFiltro === "ativos" && produto.ativo === true) ||
        (statusFiltro === "inativos" && produto.ativo === false);

      const correspondeTipo =
        tipoFiltro === "todos" ||
        (tipoFiltro === "destaques" && produto.destaque === true) ||
        (tipoFiltro === "sob-encomenda" && produto.sob_encomenda === true) ||
        (tipoFiltro === "pronta-entrega" && produto.sob_encomenda === false);

      return (
        correspondeBusca &&
        correspondeCategoria &&
        correspondeStatus &&
        correspondeTipo
      );
    });
  }, [busca, categoriaFiltro, produtos, statusFiltro, tipoFiltro]);

  const totalAtivos = produtos.filter((produto) => produto.ativo).length;
  const totalInativos = produtos.filter((produto) => !produto.ativo).length;
  const totalDestaques = produtos.filter((produto) => produto.destaque).length;

  const totalSobEncomenda = produtos.filter(
    (produto) => produto.sob_encomenda
  ).length;

  function limparFiltros() {
    setBusca("");
    setCategoriaFiltro("todas");
    setStatusFiltro("todos");
    setTipoFiltro("todos");
  }

  return (
    <main className="adminProdutosPagina">
      <section className="adminProdutosHero">
        <div className="adminProdutosDecoracao" aria-hidden="true">
          <span className="adminProdutosForma adminProdutosFormaUm" />
          <span className="adminProdutosForma adminProdutosFormaDois" />

          <FiPackage className="adminProdutosIconeDecorativo adminProdutosIconeUm" />
          <FiStar className="adminProdutosIconeDecorativo adminProdutosIconeDois" />
        </div>

        <div className="adminProdutosTopo">
          <div>
            <Link to="/dashboard" className="adminProdutosVoltar">
              <FiArrowLeft />
              Voltar ao dashboard
            </Link>

            <span className="adminProdutosTag">Administração</span>

            <h1>
              Gerenciar
              <span>produtos</span>
            </h1>

            <p>
              Visualize, filtre, edite, ative ou desative as peças cadastradas
              no site.
            </p>
          </div>

          <div className="adminProdutosAcoesTopo">
            <button
              type="button"
              onClick={carregarDados}
              className="adminProdutosBotaoSecundario"
              disabled={carregando}
            >
              <FiRefreshCw />
              Atualizar
            </button>

            <Link
              to="/dashboard/produtos/novo"
              className="adminProdutosBotaoPrimario"
            >
              <FiPlusCircle />
              Novo produto
            </Link>
          </div>
        </div>

        <div className="adminProdutosResumo">
          <article>
            <FiPackage />
            <div>
              <span>Total</span>
              <strong>{produtos.length}</strong>
            </div>
          </article>

          <article>
            <FiEye />
            <div>
              <span>Ativos</span>
              <strong>{totalAtivos}</strong>
            </div>
          </article>

          <article>
            <FiEyeOff />
            <div>
              <span>Inativos</span>
              <strong>{totalInativos}</strong>
            </div>
          </article>

          <article>
            <FiStar />
            <div>
              <span>Destaques</span>
              <strong>{totalDestaques}</strong>
            </div>
          </article>

          <article>
            <FiTag />
            <div>
              <span>Sob encomenda</span>
              <strong>{totalSobEncomenda}</strong>
            </div>
          </article>
        </div>
      </section>

      <section className="adminProdutosConteudo">
        <div className="adminProdutosFiltros">
          <div className="adminProdutosBusca">
            <FiSearch />

            <input
              type="text"
              placeholder="Buscar por nome, descrição ou categoria..."
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
            />
          </div>

          <div className="adminProdutosSelectBox">
            <FiTag />

            <select
              value={categoriaFiltro}
              onChange={(event) => setCategoriaFiltro(event.target.value)}
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
          </div>

          <div className="adminProdutosSelectBox">
            <FiEye />

            <select
              value={statusFiltro}
              onChange={(event) => setStatusFiltro(event.target.value)}
            >
              <option value="todos">Todos os status</option>
              <option value="ativos">Ativos</option>
              <option value="inativos">Inativos</option>
            </select>
          </div>

          <div className="adminProdutosSelectBox">
            <FiFilter />

            <select
              value={tipoFiltro}
              onChange={(event) => setTipoFiltro(event.target.value)}
            >
              <option value="todos">Todos os tipos</option>
              <option value="destaques">Destaques</option>
              <option value="sob-encomenda">Sob encomenda</option>
              <option value="pronta-entrega">Pronta entrega</option>
            </select>
          </div>

          <button
            type="button"
            className="adminProdutosLimpar"
            onClick={limparFiltros}
          >
            <FiX />
            Limpar
          </button>
        </div>

        {carregando ? (
          <div className="adminProdutosCarregando">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <span key={item} />
            ))}
          </div>
        ) : produtosFiltrados.length > 0 ? (
          <div className="adminProdutosGrid">
            {produtosFiltrados.map((produto) => {
              const imagem = obterImagem(produto);

              return (
                <article
                  key={produto.id_produto}
                  className={
                    produto.ativo
                      ? "adminProdutoCard"
                      : "adminProdutoCard adminProdutoCardInativo"
                  }
                >
                  <div className="adminProdutoImagem">
                    {imagem ? (
                      <img src={imagem} alt={produto.nome} loading="lazy" />
                    ) : (
                      <div className="adminProdutoSemImagem">
                        <FiImage />
                        <span>Sem foto</span>
                      </div>
                    )}

                    <div className="adminProdutoBadges">
                      {produto.destaque && (
                        <span>
                          <FiStar />
                          Destaque
                        </span>
                      )}

                      {produto.sob_encomenda && <span>Sob encomenda</span>}
                      {!produto.ativo && <span>Inativo</span>}
                    </div>
                  </div>

                  <div className="adminProdutoInfo">
                    <span className="adminProdutoCategoria">
                      {produto.categoria ||
                        produto.nome_categoria ||
                        "Sem categoria"}
                    </span>

                    <h3>{produto.nome}</h3>

                    <p>
                      {produto.descricao ||
                        "Produto sem descrição cadastrada."}
                    </p>

                    <div className="adminProdutoMeta">
                      <strong>
                        {produto.preco_sob_consulta
                          ? "Sob consulta"
                          : formatarPreco(produto.preco)}
                      </strong>

                      <small>Estoque: {produto.estoque ?? 0}</small>
                    </div>
                  </div>

                  <div className="adminProdutoAcoes">
                    <button
                      type="button"
                      className="adminProdutoAcao adminProdutoEditar"
                      onClick={() => abrirModalEdicao(produto)}
                    >
                      <FiEdit3 />
                      Editar
                    </button>

                    <button
                      type="button"
                      className="adminProdutoAcao"
                      onClick={() => alternarStatus(produto)}
                    >
                      {produto.ativo ? (
                        <>
                          <FiEyeOff />
                          Desativar
                        </>
                      ) : (
                        <>
                          <FiEye />
                          Ativar
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      className="adminProdutoAcao adminProdutoExcluir"
                      onClick={() => setProdutoExcluindo(produto)}
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
          <div className="adminProdutosVazio">
            <FiPackage />

            <h2>Nenhum produto encontrado</h2>

            <p>
              Tente limpar os filtros ou cadastre um novo produto para aparecer
              aqui.
            </p>

            <button type="button" onClick={limparFiltros}>
              Limpar filtros
            </button>
          </div>
        )}
      </section>

      {produtoExcluindo && (
        <div className="adminModalOverlay">
          <div className="adminModalExcluirProduto">
            <button
              type="button"
              className="adminModalFechar"
              onClick={() => setProdutoExcluindo(null)}
            >
              <FiX />
            </button>

            <div className="adminModalIcone">
              <FiTrash2 />
            </div>

            <h2>Excluir produto?</h2>

            <p>
              Você tem certeza que deseja excluir{" "}
              <strong>{produtoExcluindo.nome}</strong>? Essa ação não poderá
              ser desfeita.
            </p>

            <div className="adminModalAcoes">
              <button type="button" onClick={() => setProdutoExcluindo(null)}>
                Cancelar
              </button>

              <button
                type="button"
                onClick={excluirProduto}
                className="adminModalExcluir"
              >
                Excluir produto
              </button>
            </div>
          </div>
        </div>
      )}

      {produtoEditando && (
        <div className="adminModalOverlay">
          <form
            className="adminModalProdutoEditar"
            onSubmit={salvarEdicaoProduto}
          >
            <button
              type="button"
              className="adminModalFechar"
              onClick={fecharModalEdicao}
            >
              <FiX />
            </button>

            {carregandoEdicao ? (
              <div className="adminEdicaoCarregando">
                Carregando dados do produto...
              </div>
            ) : (
              <>
                <div className="adminModalProdutoGaleria">
                  <div className="adminModalProdutoImagemPrincipal">
                    {obterImagemPrincipalPreview() ? (
                      <img
                        src={obterImagemPrincipalPreview()}
                        alt="Imagem principal do produto"
                      />
                    ) : (
                      <div className="adminModalProdutoSemImagem">
                        <FiImage />
                        <strong>Sem imagem principal</strong>
                        <span>Adicione uma imagem e marque como principal.</span>
                      </div>
                    )}

                    <div className="adminModalProdutoSelo">
                      <FiCheckCircle />
                      Imagem principal
                    </div>
                  </div>

                  <div className="adminModalProdutoMiniaturas">
                    {imagensProduto.map((imagem) => {
                      const selecionada =
                        imagemPrincipalSelecionada?.tipo === "existente" &&
                        imagemPrincipalSelecionada?.id_imagem ===
                          imagem.id_imagem;

                      return (
                        <article
                          key={imagem.id_imagem}
                          className={
                            selecionada
                              ? "adminMiniaturaProduto adminMiniaturaProdutoAtiva"
                              : "adminMiniaturaProduto"
                          }
                        >
                          <img
                            src={montarUrlImagem(imagem.caminho_imagem)}
                            alt="Imagem do produto"
                          />

                          <button
                            type="button"
                            className="adminMiniaturaPrincipal"
                            onClick={() =>
                              setImagemPrincipalSelecionada({
                                tipo: "existente",
                                id_imagem: imagem.id_imagem
                              })
                            }
                          >
                            {selecionada ? <FiCheckCircle /> : "Principal"}
                          </button>

                          {!selecionada && (
                            <button
                              type="button"
                              className="adminMiniaturaExcluir"
                              onClick={() => excluirImagemExistente(imagem)}
                            >
                              <FiTrash2 />
                            </button>
                          )}
                        </article>
                      );
                    })}

                    {novasImagens.map((imagem) => {
                      const selecionada =
                        imagemPrincipalSelecionada?.tipo === "nova" &&
                        imagemPrincipalSelecionada?.id_temporario ===
                          imagem.id_temporario;

                      return (
                        <article
                          key={imagem.id_temporario}
                          className={
                            selecionada
                              ? "adminMiniaturaProduto adminMiniaturaProdutoAtiva"
                              : "adminMiniaturaProduto"
                          }
                        >
                          <img
                            src={imagem.preview}
                            alt="Nova imagem selecionada"
                          />

                          <button
                            type="button"
                            className="adminMiniaturaPrincipal"
                            onClick={() =>
                              setImagemPrincipalSelecionada({
                                tipo: "nova",
                                id_temporario: imagem.id_temporario
                              })
                            }
                          >
                            {selecionada ? <FiCheckCircle /> : "Principal"}
                          </button>

                          <button
                            type="button"
                            className="adminMiniaturaExcluir"
                            onClick={() =>
                              removerNovaImagem(imagem.id_temporario)
                            }
                          >
                            <FiTrash2 />
                          </button>
                        </article>
                      );
                    })}

                    <label className="adminMiniaturaUpload">
                      <FiUpload />
                      <span>Adicionar fotos</span>

                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={selecionarNovasImagens}
                      />
                    </label>
                  </div>
                </div>

                <div className="adminModalProdutoInfo">
                  <span className="adminModalProdutoTag">Edição do produto</span>

                  <h2>{produtoEditando.nome}</h2>

                  <p>
                    Atualize os dados, escolha a categoria, defina preço e
                    mantenha apenas uma imagem principal selecionada.
                  </p>

                  <div className="adminFormularioEdicao">
                    <label>
                      <span>Nome do produto</span>

                      <input
                        type="text"
                        value={formEdicao.nome}
                        onChange={(event) =>
                          atualizarCampoEdicao("nome", event.target.value)
                        }
                      />
                    </label>

                    <label>
                      <span>Descrição</span>

                      <textarea
                        value={formEdicao.descricao}
                        onChange={(event) =>
                          atualizarCampoEdicao("descricao", event.target.value)
                        }
                      />
                    </label>

                    <div className="adminFormularioLinha">
                      <label>
                        <span>Preço</span>

                        <input
                          type="text"
                          inputMode="decimal"
                          value={formEdicao.preco}
                          disabled={formEdicao.preco_sob_consulta}
                          onChange={(event) =>
                            atualizarCampoEdicao("preco", event.target.value)
                          }
                        />
                      </label>

                      <label>
                        <span>Estoque</span>

                        <input
                          type="number"
                          min="0"
                          value={formEdicao.estoque}
                          onChange={(event) =>
                            atualizarCampoEdicao("estoque", event.target.value)
                          }
                        />
                      </label>
                    </div>

                    <div className="adminFormularioLinha">
                      <label>
                        <span>Tempo de produção</span>

                        <input
                          type="text"
                          value={formEdicao.tempo_producao}
                          onChange={(event) =>
                            atualizarCampoEdicao(
                              "tempo_producao",
                              event.target.value
                            )
                          }
                        />
                      </label>

                      <label>
                        <span>Tamanho</span>

                        <input
                          type="text"
                          value={formEdicao.tamanho}
                          onChange={(event) =>
                            atualizarCampoEdicao("tamanho", event.target.value)
                          }
                        />
                      </label>
                    </div>

                    <label>
                      <span>Material</span>

                      <input
                        type="text"
                        value={formEdicao.material}
                        onChange={(event) =>
                          atualizarCampoEdicao("material", event.target.value)
                        }
                      />
                    </label>

                    <label>
                      <span>Categoria</span>

                      <select
                        value={formEdicao.categoria_id}
                        onChange={(event) =>
                          atualizarCampoEdicao(
                            "categoria_id",
                            event.target.value
                          )
                        }
                      >
                        <option value="">Selecione uma categoria</option>

                        {categorias.map((categoria) => (
                          <option
                            key={categoria.id_categoria}
                            value={categoria.id_categoria}
                          >
                            {categoria.nome}
                          </option>
                        ))}
                      </select>
                    </label>

                    <div className="adminChecksEdicao">
                      <label>
                        <input
                          type="checkbox"
                          checked={formEdicao.preco_sob_consulta}
                          onChange={(event) =>
                            atualizarCampoEdicao(
                              "preco_sob_consulta",
                              event.target.checked
                            )
                          }
                        />
                        Preço sob consulta
                      </label>

                      <label>
                        <input
                          type="checkbox"
                          checked={formEdicao.sob_encomenda}
                          onChange={(event) =>
                            atualizarCampoEdicao(
                              "sob_encomenda",
                              event.target.checked
                            )
                          }
                        />
                        Sob encomenda
                      </label>

                      <label>
                        <input
                          type="checkbox"
                          checked={formEdicao.permite_personalizacao}
                          onChange={(event) =>
                            atualizarCampoEdicao(
                              "permite_personalizacao",
                              event.target.checked
                            )
                          }
                        />
                        Permite personalização
                      </label>

                      <label>
                        <input
                          type="checkbox"
                          checked={formEdicao.exibir_produtos}
                          onChange={(event) =>
                            atualizarCampoEdicao(
                              "exibir_produtos",
                              event.target.checked
                            )
                          }
                        />
                        Exibir em Produtos
                      </label>

                      <label>
                        <input
                          type="checkbox"
                          checked={formEdicao.exibir_galeria}
                          onChange={(event) =>
                            atualizarCampoEdicao(
                              "exibir_galeria",
                              event.target.checked
                            )
                          }
                        />
                        Exibir na Galeria
                      </label>

                      <label>
                        <input
                          type="checkbox"
                          checked={formEdicao.destaque}
                          onChange={(event) =>
                            atualizarCampoEdicao(
                              "destaque",
                              event.target.checked
                            )
                          }
                        />
                        Produto destaque
                      </label>

                      <label>
                        <input
                          type="checkbox"
                          checked={formEdicao.ativo}
                          onChange={(event) =>
                            atualizarCampoEdicao("ativo", event.target.checked)
                          }
                        />
                        Produto ativo
                      </label>
                    </div>

                    <div className="adminModalAcoes">
                      <button type="button" onClick={fecharModalEdicao}>
                        Cancelar
                      </button>

                      <button
                        type="submit"
                        className="adminModalSalvar"
                        disabled={salvandoEdicao}
                      >
                        {salvandoEdicao ? "Salvando..." : "Salvar alterações"}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </form>
        </div>
      )}
    </main>
  );
}

export default AdminProdutos;