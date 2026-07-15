import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";

import toast from "react-hot-toast";

import {
  FiArrowRight,
  FiCamera,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiHeart,
  FiImage,
  FiLayers,
  FiMessageCircle,
  FiScissors,
  FiStar,
  FiTag
} from "react-icons/fi";

import ModalProduto from "../../components/ModalProduto/ModalProduto.jsx";

import api, {
  API_URL
} from "../../services/api.js";

import "./Galeria.css";

function Galeria() {
  const [produtos, setProdutos] = useState([]);

  const [categorias, setCategorias] = useState([]);

  const [categoriaSelecionada, setCategoriaSelecionada] = useState("todos");

  const [indiceInicial, setIndiceInicial] = useState(0);

  const [ultimaInteracaoManual, setUltimaInteracaoManual] = useState(0);

  const [carregando, setCarregando] = useState(true);

  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  const numeroWhatsApp = "5518999999999";

  const quantidadePorGrupo = 6;
  const tempoTrocaAutomatica = 12000;
  const tempoPausaAposClique = 15000;

  useEffect(() => {
    async function carregarGaleria() {
      try {
        setCarregando(true);

        const [
          respostaProdutos,
          respostaCategorias
        ] = await Promise.all([
          api.get("/produtos"),
          api.get("/categorias")
        ]);

        const listaProdutos = Array.isArray(respostaProdutos.data)
          ? respostaProdutos.data
          : respostaProdutos.data.produtos || [];

        const listaCategorias = Array.isArray(respostaCategorias.data)
          ? respostaCategorias.data
          : respostaCategorias.data.categorias || [];

        const produtosDaGaleria = listaProdutos.filter(
          (produto) =>
            produto.ativo &&
            produto.exibir_galeria
        );

        const categoriasAtivas = listaCategorias.filter(
          (categoria) => categoria.ativo
        );

        setProdutos(produtosDaGaleria);
        setCategorias(categoriasAtivas);
      } catch (erro) {
        console.error("Erro ao carregar galeria:", erro);

        toast.error("Não foi possível carregar a galeria.");
      } finally {
        setCarregando(false);
      }
    }

    carregarGaleria();
  }, []);

  useEffect(() => {
    setIndiceInicial(0);
    setUltimaInteracaoManual(0);
  }, [categoriaSelecionada]);

  const produtosFiltrados = useMemo(() => {
    if (categoriaSelecionada === "todos") {
      return produtos;
    }

    return produtos.filter(
      (produto) =>
        String(produto.categoria_id) === String(categoriaSelecionada) ||
        String(produto.id_categoria) === String(categoriaSelecionada)
    );
  }, [
    categoriaSelecionada,
    produtos
  ]);

  const produtoDestaque = useMemo(() => {
    const produtoComDestaque = produtosFiltrados.find(
      (produto) =>
        produto.destaque &&
        produto.imagem_principal
    );

    return (
      produtoComDestaque ||
      produtosFiltrados.find((produto) => produto.imagem_principal) ||
      produtosFiltrados[0] ||
      null
    );
  }, [produtosFiltrados]);

  const produtosMural = useMemo(() => {
    if (!produtoDestaque) {
      return produtosFiltrados;
    }

    return produtosFiltrados.filter(
      (produto) =>
        produto.id_produto !== produtoDestaque.id_produto
    );
  }, [
    produtoDestaque,
    produtosFiltrados
  ]);

  const produtosMuralVisiveis = useMemo(() => {
    if (produtosMural.length <= quantidadePorGrupo) {
      return produtosMural;
    }

    return [
      ...produtosMural,
      ...produtosMural
    ].slice(
      indiceInicial,
      indiceInicial + quantidadePorGrupo
    );
  }, [
    indiceInicial,
    produtosMural
  ]);

  const quantidadeGrupos = Math.ceil(
    produtosMural.length / quantidadePorGrupo
  );

  useEffect(() => {
    if (produtosMural.length <= quantidadePorGrupo) {
      return undefined;
    }

    if (produtoSelecionado) {
      return undefined;
    }

    let intervaloId;
    let timeoutId;

    function iniciarIntervalo() {
      intervaloId = setInterval(() => {
        setIndiceInicial((indiceAtual) => {
          const proximoIndice = indiceAtual + quantidadePorGrupo;

          if (proximoIndice >= produtosMural.length) {
            return 0;
          }

          return proximoIndice;
        });
      }, tempoTrocaAutomatica);
    }

    const agora = Date.now();

    const tempoRestanteDaPausa =
      ultimaInteracaoManual > 0
        ? Math.max(
            0,
            tempoPausaAposClique -
              (agora - ultimaInteracaoManual)
          )
        : 0;

    if (tempoRestanteDaPausa > 0) {
      timeoutId = setTimeout(() => {
        iniciarIntervalo();
      }, tempoRestanteDaPausa);
    } else {
      iniciarIntervalo();
    }

    return () => {
      clearInterval(intervaloId);
      clearTimeout(timeoutId);
    };
  }, [
    produtosMural.length,
    produtoSelecionado,
    ultimaInteracaoManual
  ]);

  const abrirProduto = useCallback((produto) => {
    setProdutoSelecionado(produto.id_produto);
  }, []);

  const fecharProduto = useCallback(() => {
    setProdutoSelecionado(null);
  }, []);

  function obterImagem(produto) {
    if (!produto?.imagem_principal) {
      return null;
    }

    const caminho = produto.imagem_principal;

    if (caminho.startsWith("http")) {
      return caminho;
    }

    const apiUrlSemBarraFinal = API_URL.replace(/\/$/, "");

    const caminhoComBarraInicial = caminho.startsWith("/")
      ? caminho
      : `/${caminho}`;

    return `${apiUrlSemBarraFinal}${caminhoComBarraInicial}`;
  }

  function abrirWhatsApp() {
    const mensagem = encodeURIComponent(
      "Olá! Vim pelo site EVA em Detalhes e gostaria de fazer uma peça artesanal personalizada."
    );

    window.open(
      `https://wa.me/${numeroWhatsApp}?text=${mensagem}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  function classeDoItem(index) {
    const estilos = [
      "galeriaMuralItemGrande",
      "galeriaMuralItemAlto",
      "galeriaMuralItemNormal",
      "galeriaMuralItemLargo",
      "galeriaMuralItemNormal",
      "galeriaMuralItemAlto"
    ];

    return estilos[index % estilos.length];
  }

  function proximoGrupo(manual = false) {
    if (manual) {
      setUltimaInteracaoManual(Date.now());
    }

    setIndiceInicial((indiceAtual) => {
      const proximoIndice = indiceAtual + quantidadePorGrupo;

      if (proximoIndice >= produtosMural.length) {
        return 0;
      }

      return proximoIndice;
    });
  }

  function grupoAnterior() {
    setUltimaInteracaoManual(Date.now());

    setIndiceInicial((indiceAtual) => {
      if (indiceAtual === 0) {
        return Math.max(
          0,
          (quantidadeGrupos - 1) * quantidadePorGrupo
        );
      }

      return Math.max(
        0,
        indiceAtual - quantidadePorGrupo
      );
    });
  }

  function selecionarGrupo(indiceGrupo) {
    setUltimaInteracaoManual(Date.now());

    setIndiceInicial(indiceGrupo * quantidadePorGrupo);
  }

  const momentos = [
    {
      icone: <FiHeart />,
      titulo: "Peças afetivas",
      texto:
        "Cada detalhe carrega cuidado, delicadeza e uma intenção especial."
    },
    {
      icone: <FiScissors />,
      titulo: "Feito à mão",
      texto:
        "Recortes, cores e acabamentos criados artesanalmente em EVA."
    },
    {
      icone: <FiStar />,
      titulo: "Inspiração",
      texto:
        "Uma vitrine para imaginar temas, presentes, lembranças e decorações."
    }
  ];

  return (
    <main className="galeriaPagina">
      <section className="galeriaHero">
        <div
          className="galeriaHeroDecoracao"
          aria-hidden="true"
        >
          <span className="galeriaForma galeriaFormaUm" />
          <span className="galeriaForma galeriaFormaDois" />
          <span className="galeriaForma galeriaFormaTres" />

          <FiCamera className="galeriaIconeDecorativo galeriaIconeUm" />
          <FiHeart className="galeriaIconeDecorativo galeriaIconeDois" />
          <FiImage className="galeriaIconeDecorativo galeriaIconeTres" />

          <div className="galeriaLinha galeriaLinhaUm" />
          <div className="galeriaLinha galeriaLinhaDois" />

          <span className="galeriaPonto galeriaPontoUm" />
          <span className="galeriaPonto galeriaPontoDois" />
          <span className="galeriaPonto galeriaPontoTres" />
        </div>

        <div className="container galeriaHeroContainer">
          <div className="galeriaHeroTexto">
            <span className="galeriaTag">
              Mural de inspirações
            </span>

            <h1>
              Uma galeria de
              <span>detalhes encantadores</span>
            </h1>

            <p>
              Um espaço para ver as criações como arte:
              cores, temas, recortes, flores, lembranças e
              ideias feitas em EVA com carinho.
            </p>

            <div className="galeriaHeroBotoes">
              <button
                type="button"
                className="btnPrimario"
                onClick={abrirWhatsApp}
              >
                Pedir uma peça
                <FiMessageCircle />
              </button>

              <a
                href="#mural"
                className="btnSecundario"
              >
                Ver mural
                <FiArrowRight />
              </a>
            </div>
          </div>

          <div className="galeriaHeroVisual">
            <div className="galeriaPolaroid galeriaPolaroidUm">
              <div className="galeriaPolaroidImagem">
                <FiHeart />
              </div>

              <span>feito com amor</span>
            </div>

            <div className="galeriaPolaroid galeriaPolaroidDois">
              <div className="galeriaPolaroidImagem">
                <FiScissors />
              </div>

              <span>cada detalhe importa</span>
            </div>

            <div className="galeriaHeroCentro">
              <FiCamera />

              <strong>
                EVA
                <small>em detalhes</small>
              </strong>
            </div>
          </div>
        </div>
      </section>

      <section className="galeriaMomentos secao">
        <div className="container">
          <div className="galeriaMomentosGrid">
            {momentos.map((momento) => (
              <article
                key={momento.titulo}
                className="galeriaMomentoCard"
              >
                <div className="galeriaMomentoIcone">
                  {momento.icone}
                </div>

                <h3>{momento.titulo}</h3>

                <p>{momento.texto}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="mural"
        className="galeriaMural secao"
      >
        <div
          className="galeriaMuralFundo"
          aria-hidden="true"
        >
          <span />
          <span />
          <div />
        </div>

        <div className="container">
          <header className="secaoCabecalho">
            <span className="secaoTag">
              Portfólio artesanal
            </span>

            <h2 className="secaoTitulo">
              Momentos que
              <span>viraram arte</span>
            </h2>

            <p className="secaoTexto">
              Essa não é só uma lista de produtos. É um
              mural para se inspirar, escolher ideias e
              imaginar novas criações.
            </p>
          </header>

          <div className="galeriaFiltros">
            <button
              type="button"
              className={
                categoriaSelecionada === "todos"
                  ? "galeriaFiltro galeriaFiltroAtivo"
                  : "galeriaFiltro"
              }
              onClick={() => setCategoriaSelecionada("todos")}
            >
              <FiLayers />
              Todos
            </button>

            {categorias.map((categoria) => (
              <button
                key={categoria.id_categoria}
                type="button"
                className={
                  String(categoriaSelecionada) ===
                  String(categoria.id_categoria)
                    ? "galeriaFiltro galeriaFiltroAtivo"
                    : "galeriaFiltro"
                }
                onClick={() =>
                  setCategoriaSelecionada(categoria.id_categoria)
                }
              >
                <FiTag />
                {categoria.nome}
              </button>
            ))}
          </div>

          {carregando ? (
            <div className="galeriaCarregando">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className={`galeriaSkeleton ${classeDoItem(item)}`}
                >
                  <span />
                </div>
              ))}
            </div>
          ) : produtosFiltrados.length > 0 ? (
            <div className="galeriaExperiencia">
              {produtoDestaque && (
                <article className="galeriaObraPrincipal">
                  <div className="galeriaObraImagem">
                    {obterImagem(produtoDestaque) ? (
                      <img
                        src={obterImagem(produtoDestaque)}
                        alt={produtoDestaque.nome}
                      />
                    ) : (
                      <div className="galeriaImagemVazia">
                        <FiImage />
                        <span>EVA</span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => abrirProduto(produtoDestaque)}
                    >
                      <FiEye />
                      Ver detalhes
                    </button>
                  </div>

                  <div className="galeriaObraTexto">
                    <span>
                      Obra em destaque
                    </span>

                    <h3>
                      {produtoDestaque.nome}
                    </h3>

                    <p>
                      {produtoDestaque.descricao ||
                        "Uma criação artesanal feita para encantar em cada detalhe."}
                    </p>

                    <div className="galeriaObraMeta">
                      <small>
                        {produtoDestaque.categoria ||
                          produtoDestaque.nome_categoria ||
                          "Artesanato em EVA"}
                      </small>

                      {produtoDestaque.destaque && (
                        <small>
                          <FiStar />
                          Destaque
                        </small>
                      )}

                      {produtoDestaque.permite_personalizacao && (
                        <small>
                          <FiHeart />
                          Personalizável
                        </small>
                      )}
                    </div>
                  </div>
                </article>
              )}

              <div className="galeriaMuralComLateral">
                <div className="galeriaMuralPrincipal">
                  <div
                    key={`${categoriaSelecionada}-${indiceInicial}`}
                    className="galeriaMuralGrid galeriaMuralAnimado"
                  >
                    {produtosMuralVisiveis.map((produto, index) => {
                      const imagem = obterImagem(produto);

                      return (
                        <article
                          key={`${produto.id_produto}-${index}`}
                          className={`galeriaMuralItem ${classeDoItem(index)}`}
                        >
                          <button
                            type="button"
                            className="galeriaMuralBotao"
                            onClick={() => abrirProduto(produto)}
                            aria-label={`Ver detalhes de ${produto.nome}`}
                          >
                            {imagem ? (
                              <img
                                src={imagem}
                                alt={produto.nome}
                                loading="lazy"
                              />
                            ) : (
                              <div className="galeriaImagemVazia">
                                <FiImage />
                                <span>EVA</span>
                              </div>
                            )}

                            <div className="galeriaMuralOverlay">
                              <span>
                                {produto.categoria ||
                                  produto.nome_categoria ||
                                  "Criação em EVA"}
                              </span>

                              <h3>{produto.nome}</h3>

                              <small>
                                Abrir inspiração
                                <FiArrowRight />
                              </small>
                            </div>
                          </button>

                          <span className="galeriaMuralAlfinete" />
                        </article>
                      );
                    })}
                  </div>

                  {produtosMural.length > quantidadePorGrupo && (
                    <div className="galeriaControlesCarrossel">
                      <button
                        type="button"
                        className="galeriaSeta"
                        onClick={grupoAnterior}
                        aria-label="Grupo anterior"
                      >
                        <FiChevronLeft />
                      </button>

                      <div className="galeriaIndicadores">
                        {Array.from({
                          length: quantidadeGrupos
                        }).map((_, index) => {
                          const indicadorAtivo =
                            Math.floor(
                              indiceInicial / quantidadePorGrupo
                            ) === index;

                          return (
                            <button
                              key={index}
                              type="button"
                              className={
                                indicadorAtivo
                                  ? "galeriaIndicador galeriaIndicadorAtivo"
                                  : "galeriaIndicador"
                              }
                              onClick={() => selecionarGrupo(index)}
                              aria-label={`Mostrar grupo ${index + 1} da galeria`}
                            />
                          );
                        })}
                      </div>

                      <button
                        type="button"
                        className="galeriaSeta"
                        onClick={() => proximoGrupo(true)}
                        aria-label="Próximo grupo"
                      >
                        <FiChevronRight />
                      </button>
                    </div>
                  )}
                </div>

                <aside className="galeriaMuralLateral">
                  <div className="galeriaLateralDecoracao galeriaLateralDecoracaoTopo">
                    <span className="galeriaLateralBolha galeriaLateralBolhaUm" />
                    <span className="galeriaLateralBolha galeriaLateralBolhaDois" />
                    <span className="galeriaLateralTraco" />
                  </div>

                  <article className="galeriaMensagemMural galeriaMensagemMuralFixa">
                    <FiMessageCircle />

                    <h3>
                      Imaginou uma peça diferente?
                    </h3>

                    <p>
                      Envie sua ideia e transforme um tema
                      especial em uma criação personalizada.
                    </p>

                    <button
                      type="button"
                      onClick={abrirWhatsApp}
                    >
                      Chamar no WhatsApp
                      <FiArrowRight />
                    </button>
                  </article>

                  <div className="galeriaLateralDecoracao galeriaLateralDecoracaoBase">
                    <span className="galeriaLateralFlor" />
                    <span className="galeriaLateralFolha" />
                    <span className="galeriaLateralPonto" />
                  </div>
                </aside>
              </div>
            </div>
          ) : (
            <div className="galeriaVazia">
              <div className="galeriaVaziaIcone">
                <FiImage />
              </div>

              <span>
                Galeria em construção
              </span>

              <h2>
                Ainda não há peças nessa categoria
              </h2>

              <p>
                Escolha outra categoria ou volte em breve
                para ver novas inspirações artesanais.
              </p>

              <button
                type="button"
                className="btnPrimario"
                onClick={() => setCategoriaSelecionada("todos")}
              >
                Ver todas as inspirações
                <FiArrowRight />
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="galeriaChamadaFinal">
        <div className="container">
          <div className="galeriaChamadaCard">
            <div
              className="galeriaChamadaDecoracao"
              aria-hidden="true"
            >
              <span />
              <span />
              <span />
            </div>

            <div className="galeriaChamadaTexto">
              <span className="secaoTag">
                Gostou de alguma ideia?
              </span>

              <h2>
                A próxima inspiração pode ser feita para
                você.
              </h2>

              <p>
                Escolha uma referência da galeria ou envie
                uma ideia nova para criar uma peça exclusiva
                em EVA.
              </p>
            </div>

            <button
              type="button"
              className="btnPrimario"
              onClick={abrirWhatsApp}
            >
              Criar minha peça
              <FiMessageCircle />
            </button>
          </div>
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

export default Galeria;