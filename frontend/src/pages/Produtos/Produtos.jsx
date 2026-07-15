import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";

import toast from "react-hot-toast";

import {
  FiFilter,
  FiGrid,
  FiHeart,
  FiRefreshCcw,
  FiSearch,
  FiTag,
  FiX
} from "react-icons/fi";

import CardProduto from "../../components/CardProduto/CardProduto.jsx";
import ModalProduto from "../../components/ModalProduto/ModalProduto.jsx";

import api from "../../services/api.js";

import "./Produtos.css";

function Produtos() {
  const [produtos, setProdutos] =
    useState([]);

  const [categorias, setCategorias] =
    useState([]);

  const [carregando, setCarregando] =
    useState(true);

  const [busca, setBusca] =
    useState("");

  const [categoriaSelecionada, setCategoriaSelecionada] =
    useState("todos");

  const [tipoSelecionado, setTipoSelecionado] =
    useState("todos");

  const [produtoSelecionado, setProdutoSelecionado] =
    useState(null);

  useEffect(() => {
    async function carregarDados() {
      try {
        setCarregando(true);

        const [
          respostaProdutos,
          respostaCategorias
        ] = await Promise.all([
          api.get("/produtos"),
          api.get("/categorias")
        ]);

        const listaProdutos = Array.isArray(
          respostaProdutos.data
        )
          ? respostaProdutos.data
          : respostaProdutos.data.produtos || [];

        const listaCategorias = Array.isArray(
          respostaCategorias.data
        )
          ? respostaCategorias.data
          : respostaCategorias.data.categorias || [];

        const produtosVisiveis =
          listaProdutos.filter(
            (produto) =>
              produto.ativo &&
              produto.exibir_produtos
          );

        const categoriasAtivas =
          listaCategorias.filter(
            (categoria) => categoria.ativo
          );

        setProdutos(produtosVisiveis);
        setCategorias(categoriasAtivas);
      } catch (erro) {
        console.error(
          "Erro ao carregar produtos:",
          erro
        );

        toast.error(
          "Não foi possível carregar os produtos."
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, []);

  const abrirProduto = useCallback((produto) => {
    setProdutoSelecionado(produto.id_produto);
  }, []);

  const fecharProduto = useCallback(() => {
    setProdutoSelecionado(null);
  }, []);

  function limparFiltros() {
    setBusca("");
    setCategoriaSelecionada("todos");
    setTipoSelecionado("todos");
  }

  const produtosFiltrados = useMemo(() => {
    const termo = busca
      .trim()
      .toLowerCase();

    return produtos.filter((produto) => {
      const nome =
        produto.nome?.toLowerCase() || "";

      const descricao =
        produto.descricao?.toLowerCase() || "";

      const categoria =
        produto.categoria?.toLowerCase() || "";

      const combinaBusca =
        termo.length === 0 ||
        nome.includes(termo) ||
        descricao.includes(termo) ||
        categoria.includes(termo);

      const combinaCategoria =
        categoriaSelecionada === "todos" ||
        String(produto.categoria_id) ===
          String(categoriaSelecionada) ||
        String(produto.id_categoria) ===
          String(categoriaSelecionada);

      let combinaTipo = true;

      if (tipoSelecionado === "destaques") {
        combinaTipo = Boolean(produto.destaque);
      }

      if (tipoSelecionado === "personalizados") {
        combinaTipo = Boolean(
          produto.permite_personalizacao
        );
      }

      if (tipoSelecionado === "sob-encomenda") {
        combinaTipo = Boolean(
          produto.sob_encomenda
        );
      }

      if (tipoSelecionado === "pronta-entrega") {
        combinaTipo =
          !produto.sob_encomenda &&
          Number(produto.estoque || 0) > 0;
      }

      return (
        combinaBusca &&
        combinaCategoria &&
        combinaTipo
      );
    });
  }, [
    busca,
    categoriaSelecionada,
    produtos,
    tipoSelecionado
  ]);

  const existeFiltroAtivo =
    busca.trim() !== "" ||
    categoriaSelecionada !== "todos" ||
    tipoSelecionado !== "todos";

  return (
    <main className="produtosPagina">
      <section className="produtosHero">
        <div
          className="produtosHeroDecoracao"
          aria-hidden="true"
        >
          <span className="produtosForma produtosFormaUm" />
          <span className="produtosForma produtosFormaDois" />

          <FiGrid className="produtosHeroIcone produtosHeroIconeUm" />
          <FiHeart className="produtosHeroIcone produtosHeroIconeDois" />

          <div className="produtosCostura" />

          <span className="produtosBolinha produtosBolinhaUm" />
          <span className="produtosBolinha produtosBolinhaDois" />
          <span className="produtosBolinha produtosBolinhaTres" />
        </div>

        <div className="container produtosHeroConteudo">
          <span className="produtosTag">
            Catálogo artesanal
          </span>

          <h1>
            Produtos feitos
            <span>com carinho</span>
          </h1>

          <p>
            Explore peças em EVA delicadas,
            personalizadas e pensadas para deixar
            cada momento mais especial.
          </p>
        </div>
      </section>

      <section className="produtosCatalogo secao">
        <div className="container">
          <div className="produtosPainelFiltros">
            <div className="produtosBusca">
              <FiSearch />

              <input
                type="text"
                placeholder="Buscar por nome, descrição ou categoria..."
                value={busca}
                onChange={(evento) =>
                  setBusca(evento.target.value)
                }
              />

              {busca && (
                <button
                  type="button"
                  onClick={() => setBusca("")}
                  aria-label="Limpar busca"
                >
                  <FiX />
                </button>
              )}
            </div>

            <div className="produtosFiltrosLinha">
              <div className="produtosFiltroGrupo">
                <span>
                  <FiTag />
                  Categoria
                </span>

                <select
                  value={categoriaSelecionada}
                  onChange={(evento) =>
                    setCategoriaSelecionada(
                      evento.target.value
                    )
                  }
                >
                  <option value="todos">
                    Todas as categorias
                  </option>

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

              <div className="produtosFiltroGrupo">
                <span>
                  <FiFilter />
                  Tipo
                </span>

                <select
                  value={tipoSelecionado}
                  onChange={(evento) =>
                    setTipoSelecionado(
                      evento.target.value
                    )
                  }
                >
                  <option value="todos">
                    Todos os produtos
                  </option>

                  <option value="destaques">
                    Destaques
                  </option>

                  <option value="personalizados">
                    Personalizáveis
                  </option>

                  <option value="sob-encomenda">
                    Sob encomenda
                  </option>

                  <option value="pronta-entrega">
                    Pronta entrega
                  </option>
                </select>
              </div>

              {existeFiltroAtivo && (
                <button
                  type="button"
                  className="produtosLimparFiltros"
                  onClick={limparFiltros}
                >
                  <FiRefreshCcw />
                  Limpar filtros
                </button>
              )}
            </div>
          </div>

          <div className="produtosResultadoTopo">
            <div>
              <span>
                {carregando
                  ? "Carregando catálogo"
                  : `${produtosFiltrados.length} ${
                      produtosFiltrados.length === 1
                        ? "produto encontrado"
                        : "produtos encontrados"
                    }`}
              </span>

              <h2>
                {existeFiltroAtivo
                  ? "Resultado da sua busca"
                  : "Todos os produtos"}
              </h2>
            </div>
          </div>

          {carregando ? (
            <div className="produtosGrid">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="produtoPaginaSkeleton"
                >
                  <div className="produtoPaginaSkeletonImagem" />

                  <div className="produtoPaginaSkeletonTexto">
                    <span />
                    <strong />
                    <p />
                    <p />
                  </div>
                </div>
              ))}
            </div>
          ) : produtosFiltrados.length > 0 ? (
            <div className="produtosGrid">
              {produtosFiltrados.map((produto) => (
                <CardProduto
                  key={produto.id_produto}
                  produto={produto}
                  onAbrir={abrirProduto}
                />
              ))}
            </div>
          ) : (
            <div className="produtosVazio">
              <div className="produtosVazioIcone">
                <FiSearch />
              </div>

              <span>
                Nenhum produto encontrado
              </span>

              <h2>
                Não encontramos peças com esses filtros
              </h2>

              <p>
                Tente buscar por outro nome, escolher
                outra categoria ou limpar os filtros para
                ver todos os produtos disponíveis.
              </p>

              <button
                type="button"
                className="btnPrimario"
                onClick={limparFiltros}
              >
                <FiRefreshCcw />
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      </section>

      <ModalProduto
        produtoId={produtoSelecionado}
        aberto={Boolean(produtoSelecionado)}
        onFechar={fecharProduto}
      />
    </main>
  );
}

export default Produtos;