import { useEffect, useMemo, useState } from "react";

import {
  FiArrowLeft,
  FiCalendar,
  FiCheckCircle,
  FiEye,
  FiImage,
  FiPackage,
  FiPlusCircle,
  FiRefreshCw,
  FiSave,
  FiStar,
  FiTag,
  FiTrash2,
  FiUpload,
  FiX
} from "react-icons/fi";

import { Link, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import api, { API_URL } from "../../services/api.js";

import "./AdminProdutoNovo.css";

function AdminProdutoNovo() {
  const navigate = useNavigate();

  const [categorias, setCategorias] = useState([]);
  const [produtos, setProdutos] = useState([]);

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);

  const [formulario, setFormulario] = useState({
    nome: "",
    descricao: "",
    preco: "",
    preco_sob_consulta: false,
    estoque: 0,
    sob_encomenda: true,
    tempo_producao: "",
    material: "EVA",
    tamanho: "",
    permite_personalizacao: true,
    categoria_id: "",
    exibir_produtos: true,
    exibir_galeria: false,
    destaque: false,
    ativo: true
  });

  const [imagens, setImagens] = useState([]);
  const [imagemPrincipal, setImagemPrincipal] = useState(null);

  useEffect(() => {
    carregarDados();

    return () => {
      imagens.forEach((imagem) => {
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
        console.warn("Erro ao buscar produtos inativos:", erro);
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

      const listaProdutos = [
        ...produtosAtivos,
        ...produtosInativos
      ];

      const produtosSemDuplicar = listaProdutos.filter(
        (produto, index, array) =>
          index ===
          array.findIndex((item) => item.id_produto === produto.id_produto)
      );

      setProdutos(produtosSemDuplicar);
      setCategorias(categoriasAtivas);
    } catch (erro) {
      console.error("Erro ao carregar dados:", erro);

      toast.error("Não foi possível carregar os dados.");
    } finally {
      setCarregando(false);
    }
  }

  const ultimosProdutos = useMemo(() => {
    return [...produtos]
      .sort((a, b) => {
        const dataA = new Date(a.criado_em || 0).getTime();
        const dataB = new Date(b.criado_em || 0).getTime();

        return dataB - dataA;
      })
      .slice(0, 6);
  }, [produtos]);

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

  function formatarData(data) {
    if (!data) {
      return "Data não informada";
    }

    return new Date(data).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function converterPreco(valor) {
    if (valor === null || valor === undefined) {
      return 0;
    }

    const valorFormatado = String(valor).replace(",", ".");

    return Number(valorFormatado);
  }

  function atualizarCampo(campo, valor) {
    setFormulario((estadoAtual) => ({
      ...estadoAtual,
      [campo]: valor
    }));
  }

  function abrirModalCadastro() {
    setModalAberto(true);
  }

  function fecharModalCadastro() {
    imagens.forEach((imagem) => {
      URL.revokeObjectURL(imagem.preview);
    });

    setModalAberto(false);
    setImagens([]);
    setImagemPrincipal(null);

    setFormulario({
      nome: "",
      descricao: "",
      preco: "",
      preco_sob_consulta: false,
      estoque: 0,
      sob_encomenda: true,
      tempo_producao: "",
      material: "EVA",
      tamanho: "",
      permite_personalizacao: true,
      categoria_id: "",
      exibir_produtos: true,
      exibir_galeria: false,
      destaque: false,
      ativo: true
    });
  }

  function selecionarImagens(event) {
    const arquivos = Array.from(event.target.files || []);

    if (arquivos.length === 0) {
      return;
    }

    const imagensFormatadas = arquivos.map((arquivo, index) => ({
      id_temporario: `${Date.now()}-${index}`,
      arquivo,
      preview: URL.createObjectURL(arquivo)
    }));

    setImagens((estadoAtual) => {
      const novaLista = [...estadoAtual, ...imagensFormatadas];

      if (!imagemPrincipal && novaLista.length > 0) {
        setImagemPrincipal(novaLista[0].id_temporario);
      }

      return novaLista;
    });

    event.target.value = "";
  }

  function removerImagem(idTemporario) {
    setImagens((estadoAtual) => {
      const imagemRemovida = estadoAtual.find(
        (imagem) => imagem.id_temporario === idTemporario
      );

      if (imagemRemovida) {
        URL.revokeObjectURL(imagemRemovida.preview);
      }

      const novaLista = estadoAtual.filter(
        (imagem) => imagem.id_temporario !== idTemporario
      );

      if (imagemPrincipal === idTemporario) {
        setImagemPrincipal(novaLista[0]?.id_temporario || null);
      }

      return novaLista;
    });
  }

  function obterPreviewPrincipal() {
    const imagem = imagens.find(
      (item) => item.id_temporario === imagemPrincipal
    );

    return imagem?.preview || null;
  }

  function validarFormulario() {
    if (!formulario.nome.trim()) {
      toast.error("Digite o nome do produto.");
      return false;
    }

    if (!formulario.descricao.trim()) {
      toast.error("Digite a descrição do produto.");
      return false;
    }

    if (!formulario.categoria_id) {
      toast.error("Selecione uma categoria.");
      return false;
    }

    if (
      !formulario.preco_sob_consulta &&
      converterPreco(formulario.preco) <= 0
    ) {
      toast.error("Informe um preço válido ou marque preço sob consulta.");
      return false;
    }

    if (!formulario.tempo_producao.trim()) {
      toast.error("Informe o tempo de produção.");
      return false;
    }

    if (!formulario.material.trim()) {
      toast.error("Informe o material.");
      return false;
    }

    if (!formulario.tamanho.trim()) {
      toast.error("Informe o tamanho.");
      return false;
    }

    if (!formulario.exibir_produtos && !formulario.exibir_galeria) {
      toast.error("O produto precisa aparecer em Produtos ou Galeria.");
      return false;
    }

    if (imagens.length === 0) {
      toast.error("Adicione pelo menos uma imagem.");
      return false;
    }

    if (!imagemPrincipal) {
      toast.error("Selecione uma imagem principal.");
      return false;
    }

    return true;
  }

  async function cadastrarProduto(event) {
    event.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    try {
      setSalvando(true);

      const token = localStorage.getItem("tokenEvaEmDetalhes");

      const respostaProduto = await api.post(
        "/produtos",
        {
          nome: formulario.nome.trim(),
          descricao: formulario.descricao.trim(),
          preco: formulario.preco_sob_consulta
            ? 0
            : converterPreco(formulario.preco),
          preco_sob_consulta: formulario.preco_sob_consulta,
          estoque: Number(formulario.estoque) || 0,
          sob_encomenda: formulario.sob_encomenda,
          tempo_producao: formulario.tempo_producao.trim(),
          material: formulario.material.trim(),
          tamanho: formulario.tamanho.trim(),
          permite_personalizacao: formulario.permite_personalizacao,
          categoria_id: Number(formulario.categoria_id),
          exibir_produtos: formulario.exibir_produtos,
          exibir_galeria: formulario.exibir_galeria,
          destaque: formulario.destaque,
          ativo: formulario.ativo
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const produtoCriado =
        respostaProduto.data.produto ||
        respostaProduto.data.dados ||
        respostaProduto.data;

      const idProduto =
        produtoCriado.id_produto ||
        produtoCriado.id ||
        produtoCriado.produto?.id_produto ||
        respostaProduto.data.id_produto;

      if (!idProduto) {
        toast.error("Produto criado, mas o ID não foi retornado pela API.");
        return;
      }

      const imagensNaoPrincipais = imagens.filter(
        (imagem) => imagem.id_temporario !== imagemPrincipal
      );

      for (const imagem of imagensNaoPrincipais) {
        const formData = new FormData();

        formData.append("imagens", imagem.arquivo);
        formData.append("principal", "false");

        await api.post(`/produtos/${idProduto}/imagens`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        });
      }

      const imagemPrincipalSelecionada = imagens.find(
        (imagem) => imagem.id_temporario === imagemPrincipal
      );

      if (!imagemPrincipalSelecionada) {
        toast.error("Imagem principal não encontrada.");
        return;
      }

      const formDataPrincipal = new FormData();

      formDataPrincipal.append("imagens", imagemPrincipalSelecionada.arquivo);
      formDataPrincipal.append("principal", "true");

      await api.post(`/produtos/${idProduto}/imagens`, formDataPrincipal, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      toast.success("Produto cadastrado com sucesso!");

      fecharModalCadastro();
      carregarDados();
    } catch (erro) {
      console.error("Erro ao cadastrar produto:", erro);

      const mensagemErro =
        erro.response?.data?.mensagem ||
        erro.response?.data?.message ||
        "Não foi possível cadastrar o produto.";

      toast.error(mensagemErro);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <main className="adminProdutoNovoPagina">
      <section className="adminProdutoNovoHero">
        <div className="adminProdutoNovoDecoracao" aria-hidden="true">
          <span className="adminProdutoNovoForma adminProdutoNovoFormaUm" />
          <span className="adminProdutoNovoForma adminProdutoNovoFormaDois" />
        </div>

        <div className="adminProdutoNovoTopo">
          <div>
            <Link to="/dashboard/produtos" className="adminProdutoNovoVoltar">
              <FiArrowLeft />
              Voltar para produtos
            </Link>

            <span className="adminProdutoNovoTag">Cadastro de produtos</span>

            <h1>
              Produtos
              <span>cadastrados</span>
            </h1>

            <p>
              Acompanhe os produtos criados recentemente e cadastre novas peças
              para aparecerem no site EVA em Detalhes.
            </p>
          </div>

          <div className="adminProdutoNovoTopoAcoes">
            <button
              type="button"
              className="adminProdutoNovoBotaoSecundario"
              onClick={carregarDados}
              disabled={carregando}
            >
              <FiRefreshCw />
              Atualizar
            </button>

            <button
              type="button"
              className="adminProdutoNovoBotaoTopo"
              onClick={abrirModalCadastro}
            >
              <FiPlusCircle />
              Cadastrar novo produto
            </button>
          </div>
        </div>
      </section>

      <section className="adminProdutoNovoPainel">
        <div className="adminProdutoNovoPainelTopo">
          <div>
            <span>Histórico recente</span>
            <h2>Últimos produtos cadastrados</h2>
          </div>

          <Link to="/dashboard/produtos">
            Ver todos
            <FiEye />
          </Link>
        </div>

        {carregando ? (
          <div className="adminProdutoNovoSkeleton">
            <span />
            <span />
            <span />
          </div>
        ) : ultimosProdutos.length > 0 ? (
          <div className="adminProdutoNovoLista">
            {ultimosProdutos.map((produto) => {
              const imagem = montarUrlImagem(produto.imagem_principal);

              return (
                <article
                  key={produto.id_produto}
                  className="adminProdutoNovoCard"
                >
                  <div className="adminProdutoNovoCardImagem">
                    {imagem ? (
                      <img src={imagem} alt={produto.nome} />
                    ) : (
                      <FiImage />
                    )}
                  </div>

                  <div className="adminProdutoNovoCardInfo">
                    <span>
                      <FiTag />
                      {produto.categoria ||
                        produto.nome_categoria ||
                        "Sem categoria"}
                    </span>

                    <h3>{produto.nome}</h3>

                    <p>{produto.descricao || "Sem descrição cadastrada."}</p>

                    <div className="adminProdutoNovoCardMeta">
                      <strong>
                        {produto.preco_sob_consulta
                          ? "Sob consulta"
                          : formatarPreco(produto.preco)}
                      </strong>

                      <small>
                        <FiCalendar />
                        {formatarData(produto.criado_em)}
                      </small>
                    </div>
                  </div>

                  <div className="adminProdutoNovoCardBadges">
                    {produto.destaque && <span>Destaque</span>}
                    {produto.sob_encomenda && <span>Sob encomenda</span>}
                    {!produto.ativo && <span>Inativo</span>}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="adminProdutoNovoVazio">
            <FiPackage />
            <h2>Nenhum produto cadastrado ainda</h2>
            <p>
              Clique em “Cadastrar novo produto” para criar a primeira peça do
              site.
            </p>
          </div>
        )}
      </section>

      {modalAberto && (
        <div className="adminProdutoNovoModalOverlay">
          <form
            className="adminProdutoNovoModal"
            onSubmit={cadastrarProduto}
          >
            <button
              type="button"
              className="adminProdutoNovoModalFechar"
              onClick={fecharModalCadastro}
            >
              <FiX />
            </button>

            <section className="adminProdutoNovoGaleria">
              <div className="adminProdutoNovoImagemPrincipal">
                {obterPreviewPrincipal() ? (
                  <img src={obterPreviewPrincipal()} alt="Imagem principal" />
                ) : (
                  <div className="adminProdutoNovoSemImagem">
                    <FiImage />
                    <strong>Nenhuma imagem selecionada</strong>
                    <span>
                      Adicione uma imagem e marque ela como principal.
                    </span>
                  </div>
                )}

                <div className="adminProdutoNovoSelo">
                  <FiCheckCircle />
                  Imagem principal
                </div>
              </div>

              <div className="adminProdutoNovoMiniaturas">
                {imagens.map((imagem) => {
                  const selecionada = imagemPrincipal === imagem.id_temporario;

                  return (
                    <article
                      key={imagem.id_temporario}
                      className={
                        selecionada
                          ? "adminProdutoNovoMiniatura adminProdutoNovoMiniaturaAtiva"
                          : "adminProdutoNovoMiniatura"
                      }
                    >
                      <img src={imagem.preview} alt="Imagem selecionada" />

                      <button
                        type="button"
                        className="adminProdutoNovoPrincipal"
                        onClick={() => setImagemPrincipal(imagem.id_temporario)}
                      >
                        {selecionada ? <FiCheckCircle /> : "Principal"}
                      </button>

                      <button
                        type="button"
                        className="adminProdutoNovoRemover"
                        onClick={() => removerImagem(imagem.id_temporario)}
                      >
                        <FiTrash2 />
                      </button>
                    </article>
                  );
                })}

                <label className="adminProdutoNovoUpload">
                  <FiUpload />
                  <span>Adicionar fotos</span>

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={selecionarImagens}
                  />
                </label>
              </div>
            </section>

            <section className="adminProdutoNovoFormArea">
              <span className="adminProdutoNovoFormTag">
                Novo produto
              </span>

              <h2>Cadastrar peça</h2>

              <p>
                Preencha as informações do produto e escolha como ele será
                exibido no site.
              </p>

              <div className="adminProdutoNovoFormulario">
                <label>
                  <span>Nome do produto</span>

                  <input
                    type="text"
                    value={formulario.nome}
                    onChange={(event) =>
                      atualizarCampo("nome", event.target.value)
                    }
                    placeholder="Ex: Ponteira pedagógica"
                  />
                </label>

                <label>
                  <span>Descrição</span>

                  <textarea
                    value={formulario.descricao}
                    onChange={(event) =>
                      atualizarCampo("descricao", event.target.value)
                    }
                    placeholder="Descreva o produto..."
                  />
                </label>

                <div className="adminProdutoNovoLinha">
                  <label>
                    <span>Preço</span>

                    <input
                      type="text"
                      inputMode="decimal"
                      value={formulario.preco}
                      disabled={formulario.preco_sob_consulta}
                      onChange={(event) =>
                        atualizarCampo("preco", event.target.value)
                      }
                      placeholder="Ex: 35,00"
                    />
                  </label>

                  <label>
                    <span>Estoque</span>

                    <input
                      type="number"
                      min="0"
                      value={formulario.estoque}
                      onChange={(event) =>
                        atualizarCampo("estoque", event.target.value)
                      }
                    />
                  </label>
                </div>

                <div className="adminProdutoNovoLinha">
                  <label>
                    <span>Tempo de produção</span>

                    <input
                      type="text"
                      value={formulario.tempo_producao}
                      onChange={(event) =>
                        atualizarCampo("tempo_producao", event.target.value)
                      }
                      placeholder="Ex: 7 dias úteis"
                    />
                  </label>

                  <label>
                    <span>Tamanho</span>

                    <input
                      type="text"
                      value={formulario.tamanho}
                      onChange={(event) =>
                        atualizarCampo("tamanho", event.target.value)
                      }
                      placeholder="Ex: 15 cm"
                    />
                  </label>
                </div>

                <label>
                  <span>Material</span>

                  <input
                    type="text"
                    value={formulario.material}
                    onChange={(event) =>
                      atualizarCampo("material", event.target.value)
                    }
                    placeholder="Ex: EVA"
                  />
                </label>

                <label>
                  <span>Categoria</span>

                  <select
                    value={formulario.categoria_id}
                    onChange={(event) =>
                      atualizarCampo("categoria_id", event.target.value)
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

                <div className="adminProdutoNovoChecks">
                  <label>
                    <input
                      type="checkbox"
                      checked={formulario.preco_sob_consulta}
                      onChange={(event) =>
                        atualizarCampo(
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
                      checked={formulario.sob_encomenda}
                      onChange={(event) =>
                        atualizarCampo("sob_encomenda", event.target.checked)
                      }
                    />
                    Sob encomenda
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      checked={formulario.permite_personalizacao}
                      onChange={(event) =>
                        atualizarCampo(
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
                      checked={formulario.exibir_produtos}
                      onChange={(event) =>
                        atualizarCampo("exibir_produtos", event.target.checked)
                      }
                    />
                    Exibir em Produtos
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      checked={formulario.exibir_galeria}
                      onChange={(event) =>
                        atualizarCampo("exibir_galeria", event.target.checked)
                      }
                    />
                    Exibir na Galeria
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      checked={formulario.destaque}
                      onChange={(event) =>
                        atualizarCampo("destaque", event.target.checked)
                      }
                    />
                    Produto destaque
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      checked={formulario.ativo}
                      onChange={(event) =>
                        atualizarCampo("ativo", event.target.checked)
                      }
                    />
                    Produto ativo
                  </label>
                </div>

                <div className="adminProdutoNovoAcoes">
                  <button type="button" onClick={fecharModalCadastro}>
                    <FiX />
                    Cancelar
                  </button>

                  <button type="submit" disabled={salvando}>
                    <FiSave />
                    {salvando ? "Salvando..." : "Cadastrar produto"}
                  </button>
                </div>
              </div>
            </section>
          </form>
        </div>
      )}
    </main>
  );
}

export default AdminProdutoNovo;