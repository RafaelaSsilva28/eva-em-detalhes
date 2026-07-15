import {
  useEffect,
  useState
} from "react";

import toast from "react-hot-toast";

import {
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiHeart,
  FiMessageCircle,
  FiPackage,
  FiScissors,
  FiTag,
  FiX
} from "react-icons/fi";

import api, {
  API_URL
} from "../../services/api.js";

import "./ModalProduto.css";

function ModalProduto({
  produtoId,
  aberto,
  onFechar
}) {
  const [produto, setProduto] =
    useState(null);

  const [imagens, setImagens] =
    useState([]);

  const [
    imagemSelecionada,
    setImagemSelecionada
  ] = useState(0);

  const [carregando, setCarregando] =
    useState(false);

  const [favoritado, setFavoritado] =
    useState(false);

  const numeroWhatsApp =
    "5518999999999";

  useEffect(() => {
    if (!aberto || !produtoId) {
      return undefined;
    }

    let componenteAtivo = true;

    async function carregarProduto() {
      try {
        setCarregando(true);
        setProduto(null);
        setImagens([]);
        setImagemSelecionada(0);

        const [
          respostaProduto,
          respostaImagens
        ] = await Promise.all([
          api.get(
            `/produtos/${produtoId}`
          ),

          api.get(
            `/produtos/${produtoId}/imagens`
          )
        ]);

        if (!componenteAtivo) {
          return;
        }

        const dadosProduto =
          respostaProduto.data.produto ||
          respostaProduto.data;

        const listaImagens =
          Array.isArray(
            respostaImagens.data
          )
            ? respostaImagens.data
            : respostaImagens.data.imagens ||
              [];

        setProduto(dadosProduto);

        setImagens(
          [...listaImagens].sort(
            (imagemA, imagemB) => {
              if (
                imagemA.principal &&
                !imagemB.principal
              ) {
                return -1;
              }

              if (
                !imagemA.principal &&
                imagemB.principal
              ) {
                return 1;
              }

              return (
                Number(imagemA.ordem || 0) -
                Number(imagemB.ordem || 0)
              );
            }
          )
        );

        const favoritos =
          JSON.parse(
            localStorage.getItem(
              "produtosFavoritos"
            )
          ) || [];

        setFavoritado(
          favoritos.includes(
            dadosProduto.id_produto
          )
        );
      } catch (erro) {
        console.error(
          "Erro ao carregar detalhes do produto:",
          erro
        );

        if (componenteAtivo) {
          toast.error(
            "Não foi possível carregar os detalhes do produto."
          );

          onFechar();
        }
      } finally {
        if (componenteAtivo) {
          setCarregando(false);
        }
      }
    }

    carregarProduto();

    return () => {
      componenteAtivo = false;
    };
  }, [
    aberto,
    produtoId
  ]);

  useEffect(() => {
    if (!aberto) {
      return undefined;
    }

    const posicaoRolagem =
      window.scrollY;

    function fecharComEscape(evento) {
      if (evento.key === "Escape") {
        onFechar();
      }
    }

    /*
      Mantém a página do fundo parada,
      sem deslocá-la para cima.
    */
    document.body.style.position =
      "fixed";

    document.body.style.top =
      `-${posicaoRolagem}px`;

    document.body.style.width =
      "100%";

    document.body.style.overflow =
      "hidden";

    window.addEventListener(
      "keydown",
      fecharComEscape
    );

    return () => {
      document.body.style.position =
        "";

      document.body.style.top =
        "";

      document.body.style.width =
        "";

      document.body.style.overflow =
        "";

      window.scrollTo(
        0,
        posicaoRolagem
      );

      window.removeEventListener(
        "keydown",
        fecharComEscape
      );
    };
  }, [
    aberto,
    onFechar
  ]);

  function formatarPreco(valor) {
    return Number(valor).toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL"
      }
    );
  }

  function obterUrlImagem(caminho) {
    if (!caminho) {
      return null;
    }

    if (caminho.startsWith("http")) {
      return caminho;
    }

    return `${API_URL}${caminho}`;
  }

  function alternarFavorito() {
    if (!produto) {
      return;
    }

    const favoritos =
      JSON.parse(
        localStorage.getItem(
          "produtosFavoritos"
        )
      ) || [];

    let novosFavoritos;

    if (favoritado) {
      novosFavoritos =
        favoritos.filter(
          (idProduto) =>
            idProduto !==
            produto.id_produto
        );

      toast.success(
        "Produto removido dos favoritos."
      );
    } else {
      novosFavoritos = [
        ...new Set([
          ...favoritos,
          produto.id_produto
        ])
      ];

      toast.success(
        "Produto adicionado aos favoritos."
      );
    }

    localStorage.setItem(
      "produtosFavoritos",
      JSON.stringify(novosFavoritos)
    );

    setFavoritado(
      (estadoAtual) => !estadoAtual
    );

    window.dispatchEvent(
      new Event(
        "favoritosAtualizados"
      )
    );
  }

  function abrirWhatsApp() {
    if (!produto) {
      return;
    }

    const mensagem = encodeURIComponent(
      `Olá! Vim pelo site EVA em Detalhes e gostaria de saber mais sobre o produto: ${produto.nome}.`
    );

    window.open(
      `https://wa.me/${numeroWhatsApp}?text=${mensagem}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  function imagemAnterior() {
    if (imagens.length <= 1) {
      return;
    }

    setImagemSelecionada(
      (indiceAtual) => {
        if (indiceAtual === 0) {
          return imagens.length - 1;
        }

        return indiceAtual - 1;
      }
    );
  }

  function proximaImagem() {
    if (imagens.length <= 1) {
      return;
    }

    setImagemSelecionada(
      (indiceAtual) => {
        if (
          indiceAtual ===
          imagens.length - 1
        ) {
          return 0;
        }

        return indiceAtual + 1;
      }
    );
  }

  if (!aberto) {
    return null;
  }

  const imagemPrincipal =
    imagens.length > 0
      ? obterUrlImagem(
          imagens[imagemSelecionada]
            ?.caminho_imagem
        )
      : obterUrlImagem(
          produto?.imagem_principal
        );

  return (
    <div
      className="modalProdutoOverlay"
      onMouseDown={onFechar}
    >
      <section
        className="modalProduto"
        onMouseDown={(evento) =>
          evento.stopPropagation()
        }
        role="dialog"
        aria-modal="true"
        aria-label="Detalhes do produto"
      >
        <button
          type="button"
          className="modalProdutoFechar"
          onClick={onFechar}
          aria-label="Fechar detalhes"
        >
          <FiX />
        </button>

        <div className="modalProdutoRolagem">
          {carregando ? (
            <div className="modalProdutoCarregando">
              <div className="modalProdutoSpinner" />

              <p>
                Carregando detalhes...
              </p>
            </div>
          ) : produto ? (
            <div className="modalProdutoConteudo">
              <div className="modalProdutoGaleria">
                <div className="modalProdutoImagemPrincipal">
                  {imagemPrincipal ? (
                    <img
                      src={imagemPrincipal}
                      alt={produto.nome}
                    />
                  ) : (
                    <div className="modalProdutoSemImagem">
                      <span>EVA</span>
                      <small>
                        feito à mão
                      </small>
                    </div>
                  )}

                  {imagens.length > 1 && (
                    <>
                      <button
                        type="button"
                        className="modalProdutoNavegacao modalProdutoAnterior"
                        onClick={imagemAnterior}
                        aria-label="Imagem anterior"
                      >
                        <FiChevronLeft />
                      </button>

                      <button
                        type="button"
                        className="modalProdutoNavegacao modalProdutoProxima"
                        onClick={proximaImagem}
                        aria-label="Próxima imagem"
                      >
                        <FiChevronRight />
                      </button>
                    </>
                  )}

                  <span className="modalProdutoContador">
                    {imagens.length > 0
                      ? `${imagemSelecionada + 1} / ${imagens.length}`
                      : "Peça artesanal"}
                  </span>
                </div>

                {imagens.length > 1 && (
                  <div className="modalProdutoMiniaturas">
                    {imagens.map(
                      (imagem, index) => (
                        <button
                          key={imagem.id_imagem}
                          type="button"
                          className={
                            imagemSelecionada ===
                            index
                              ? "modalProdutoMiniatura modalProdutoMiniaturaAtiva"
                              : "modalProdutoMiniatura"
                          }
                          onClick={() =>
                            setImagemSelecionada(
                              index
                            )
                          }
                          aria-label={`Visualizar imagem ${index + 1}`}
                        >
                          <img
                            src={obterUrlImagem(
                              imagem.caminho_imagem
                            )}
                            alt={`${produto.nome} ${index + 1}`}
                          />
                        </button>
                      )
                    )}
                  </div>
                )}

                <div className="modalProdutoArte">
                  <div className="modalProdutoArteIcone">
                    <FiHeart />
                  </div>

                  <div className="modalProdutoArteTexto">
                    <span>
                      Produção artesanal
                    </span>

                    <strong>
                      Cada detalhe é feito
                      especialmente para você
                    </strong>

                    <p>
                      Cores, tamanho e tema podem ser
                      personalizados conforme o seu
                      pedido.
                    </p>
                  </div>

                  <span className="modalProdutoArteFlor">
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <b />
                  </span>
                </div>
              </div>

              <div className="modalProdutoInformacoes">
                <div className="modalProdutoTopo">
                  <span className="modalProdutoCategoria">
                    <FiTag />

                    {produto.categoria ||
                      "Artesanato em EVA"}
                  </span>

                  <button
                    type="button"
                    className={
                      favoritado
                        ? "modalProdutoFavorito modalProdutoFavoritoAtivo"
                        : "modalProdutoFavorito"
                    }
                    onClick={
                      alternarFavorito
                    }
                  >
                    <FiHeart />

                    <span>
                      {favoritado
                        ? "Favoritado"
                        : "Favoritar"}
                    </span>
                  </button>
                </div>

                <h2>{produto.nome}</h2>

                <div className="modalProdutoPreco">
                  <small>
                    {produto.preco_sob_consulta
                      ? "Valor"
                      : "A partir de"}
                  </small>

                  <strong>
                    {produto.preco_sob_consulta
                      ? "Sob consulta"
                      : formatarPreco(
                          produto.preco
                        )}
                  </strong>
                </div>

                <p className="modalProdutoDescricao">
                  {produto.descricao}
                </p>

                <div className="modalProdutoDetalhes">
                  <div className="modalProdutoDetalhe">
                    <span>
                      <FiScissors />
                    </span>

                    <div>
                      <small>
                        Material
                      </small>

                      <strong>
                        {produto.material ||
                          "Não informado"}
                      </strong>
                    </div>
                  </div>

                  <div className="modalProdutoDetalhe">
                    <span>
                      <FiPackage />
                    </span>

                    <div>
                      <small>
                        Tamanho
                      </small>

                      <strong>
                        {produto.tamanho ||
                          "Sob medida"}
                      </strong>
                    </div>
                  </div>

                  <div className="modalProdutoDetalhe">
                    <span>
                      <FiClock />
                    </span>

                    <div>
                      <small>
                        Produção
                      </small>

                      <strong>
                        {produto.tempo_producao ||
                          "Consulte o prazo"}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="modalProdutoEtiquetas">
                  {produto.sob_encomenda && (
                    <span>
                      Sob encomenda
                    </span>
                  )}

                  {produto.permite_personalizacao && (
                    <span>
                      Personalizável
                    </span>
                  )}

                  {produto.destaque && (
                    <span>
                      Destaque
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  className="modalProdutoWhatsApp"
                  onClick={abrirWhatsApp}
                >
                  <FiMessageCircle />

                  <span>
                    Pedir pelo WhatsApp
                  </span>
                </button>

                <p className="modalProdutoObservacao">
                  O valor e o prazo podem variar
                  conforme tamanho, tema e
                  personalização escolhida.
                </p>
              </div>
            </div>
          ) : null}
        </div>

        <span className="modalProdutoForma modalProdutoFormaUm" />
        <span className="modalProdutoForma modalProdutoFormaDois" />
      </section>
    </div>
  );
}

export default ModalProduto;