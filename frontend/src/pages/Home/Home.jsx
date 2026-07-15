import {
  useCallback,
  useEffect,
  useState
} from "react";

import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
  FiArrowRight,
  FiCheckCircle,
  FiGift,
  FiHeart,
  FiMessageCircle,
  FiPackage,
  FiScissors,
  FiShoppingBag,
  FiStar
} from "react-icons/fi";

import CardProduto from "../../components/CardProduto/CardProduto.jsx";
import ModalProduto from "../../components/ModalProduto/ModalProduto.jsx";

import api from "../../services/api.js";

import "./Home.css";

function Home() {
  const [produtosDestaque, setProdutosDestaque] =
    useState([]);

  const [indiceInicial, setIndiceInicial] =
    useState(0);

  const [carregando, setCarregando] =
    useState(true);

  const [produtoSelecionado, setProdutoSelecionado] =
    useState(null);

  const numeroWhatsApp = "5518999999999";

  useEffect(() => {
    async function buscarProdutosDestaque() {
      try {
        const resposta = await api.get("/produtos");

        const produtos = Array.isArray(resposta.data)
          ? resposta.data
          : resposta.data.produtos || [];

        const destaques = produtos
          .filter(
            (produto) =>
              produto.ativo &&
              produto.destaque &&
              produto.exibir_produtos
          )
          .slice(0, 12);

        setProdutosDestaque(destaques);
      } catch (erro) {
        console.error(
          "Erro ao buscar produtos em destaque:",
          erro
        );

        toast.error(
          "Não foi possível carregar os produtos em destaque."
        );
      } finally {
        setCarregando(false);
      }
    }

    buscarProdutosDestaque();
  }, []);

  useEffect(() => {
    if (produtosDestaque.length <= 3) {
      return undefined;
    }

    if (produtoSelecionado) {
      return undefined;
    }

    const intervalo = setInterval(() => {
      setIndiceInicial((indiceAtual) => {
        const proximoIndice = indiceAtual + 3;

        if (proximoIndice >= produtosDestaque.length) {
          return 0;
        }

        return proximoIndice;
      });
    }, 5000);

    return () => {
      clearInterval(intervalo);
    };
  }, [
    produtosDestaque,
    produtoSelecionado
  ]);

  const abrirProduto = useCallback((produto) => {
    setProdutoSelecionado(produto.id_produto);
  }, []);

  const fecharProduto = useCallback(() => {
    setProdutoSelecionado(null);
  }, []);

  function selecionarGrupo(indiceGrupo) {
    setIndiceInicial(indiceGrupo * 3);
  }

  function abrirWhatsApp() {
    const mensagem = encodeURIComponent(
      "Olá! Vim pelo site EVA em Detalhes e gostaria de fazer um pedido personalizado."
    );

    window.open(
      `https://wa.me/${numeroWhatsApp}?text=${mensagem}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  const produtosVisiveis =
    produtosDestaque.length <= 3
      ? produtosDestaque
      : [
          ...produtosDestaque,
          ...produtosDestaque
        ].slice(
          indiceInicial,
          indiceInicial + 3
        );

  const quantidadeGrupos = Math.ceil(
    produtosDestaque.length / 3
  );

  const servicos = [
    {
      icone: <FiGift />,
      titulo: "Lembrancinhas",
      texto:
        "Peças delicadas para aniversários, escolas, maternidade, datas comemorativas e eventos especiais."
    },
    {
      icone: <FiStar />,
      titulo: "Personalizados",
      texto:
        "Artes feitas sob medida, combinando tema, cores, nome, detalhes e estilo do seu pedido."
    },
    {
      icone: <FiPackage />,
      titulo: "Decoração",
      texto:
        "Itens em EVA para deixar ambientes, festas, painéis e cantinhos ainda mais encantadores."
    },
    {
      icone: <FiHeart />,
      titulo: "Presentes",
      texto:
        "Produtos artesanais pensados para surpreender com carinho, cuidado e exclusividade."
    }
  ];

  const motivos = [
    "Produção artesanal com acabamento cuidadoso",
    "Peças personalizadas conforme o seu tema",
    "Atendimento direto pelo WhatsApp",
    "Detalhes pensados para cada ocasião"
  ];

  const etapas = [
    {
      numero: "01",
      titulo: "Escolha a peça",
      texto:
        "Veja os produtos disponíveis ou use uma criação como inspiração."
    },
    {
      numero: "02",
      titulo: "Chame no WhatsApp",
      texto:
        "Envie o produto, tema, cores e detalhes que deseja personalizar."
    },
    {
      numero: "03",
      titulo: "Combine os detalhes",
      texto:
        "A produção, prazo e valor são definidos conforme o pedido."
    },
    {
      numero: "04",
      titulo: "Receba com carinho",
      texto:
        "Sua peça é produzida manualmente e preparada com todo cuidado."
    }
  ];

  return (
    <main className="home">
      <section className="homeHero">
        <div
          className="homeFundo"
          aria-hidden="true"
        >
          <span className="forma formaRosa" />
          <span className="forma formaVerde" />
          <span className="forma formaCoral" />

          <div className="flor florUm">
            <span />
            <span />
            <span />
            <span />
            <span />
            <i />
          </div>

          <div className="flor florDois">
            <span />
            <span />
            <span />
            <span />
            <span />
            <i />
          </div>

          <div className="folha folhaUm" />
          <div className="folha folhaDois" />
          <div className="folha folhaTres" />

          <FiScissors className="desenhoIcone tesouraDecorativa" />
          <FiHeart className="desenhoIcone coracaoDecorativo" />
          <FiStar className="desenhoIcone estrelaDecorativa" />

          <div className="linhaCostura linhaCosturaUm" />
          <div className="linhaCostura linhaCosturaDois" />

          <span className="bolinha bolinhaUm" />
          <span className="bolinha bolinhaDois" />
          <span className="bolinha bolinhaTres" />
          <span className="bolinha bolinhaQuatro" />
        </div>

        <div className="container homeHeroContainer">
          <div className="homeConteudo entradaSuave">
            <span className="homeTag">
              Arte feita à mão com carinho
            </span>

            <h1>
              Detalhes que transformam
              <span>EVA em encantamento</span>
            </h1>

            <p>
              Peças artesanais, delicadas e personalizadas
              para tornar momentos, presentes e ambientes
              ainda mais especiais.
            </p>

            <div className="homeBotoes">
              <Link
                to="/produtos"
                className="btnPrimario"
              >
                Conhecer produtos
                <FiArrowRight />
              </Link>

              <Link
                to="/personalizados"
                className="btnSecundario"
              >
                Ver personalizados
              </Link>
            </div>
          </div>

          <div className="homeVisual entradaSuave">
            <div className="homeImagemMoldura">
              <div className="homeImagemInterna">
                <span className="homeImagemTexto">
                  EVA
                </span>

                <small>feito com amor</small>
              </div>

              <span className="homeSelo">
                <FiHeart />
                Artesanal
              </span>
            </div>

            <div className="miniFlor miniFlorUm" />
            <div className="miniFlor miniFlorDois" />
          </div>
        </div>
      </section>

      <section className="homeDestaques secao">
        <div
          className="homeDestaquesFundo"
          aria-hidden="true"
        >
          <span className="destaqueForma destaqueFormaUm" />
          <span className="destaqueForma destaqueFormaDois" />

          <div className="destaqueCostura" />

          <div className="destaqueFlor">
            <span />
            <span />
            <span />
            <span />
            <span />
            <i />
          </div>
        </div>

        <div className="container">
          <header className="secaoCabecalho homeDestaquesCabecalho">
            <span className="secaoTag">
              Escolhidos com carinho
            </span>

            <h2 className="secaoTitulo">
              Criações que encantam em
              <span>cada detalhe</span>
            </h2>

            <p className="secaoTexto">
              Conheça algumas das peças que tornam
              momentos, presentes e ambientes ainda mais
              especiais.
            </p>
          </header>

          {carregando ? (
            <div className="homeDestaquesGrid">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="produtoSkeleton"
                >
                  <div className="skeletonImagem" />

                  <div className="skeletonConteudo">
                    <span />
                    <strong />
                    <p />
                    <p />
                  </div>
                </div>
              ))}
            </div>
          ) : produtosDestaque.length > 0 ? (
            <>
              <div
                key={indiceInicial}
                className="homeDestaquesGrid homeDestaquesAnimado"
              >
                {produtosVisiveis.map(
                  (produto, index) => (
                    <CardProduto
                      key={`${produto.id_produto}-${index}`}
                      produto={produto}
                      onAbrir={abrirProduto}
                    />
                  )
                )}
              </div>

              {produtosDestaque.length > 3 && (
                <div className="homeDestaquesIndicadores">
                  {Array.from({
                    length: quantidadeGrupos
                  }).map((_, index) => {
                    const indicadorAtivo =
                      Math.floor(
                        indiceInicial / 3
                      ) === index;

                    return (
                      <button
                        key={index}
                        type="button"
                        className={
                          indicadorAtivo
                            ? "indicadorProduto indicadorProdutoAtivo"
                            : "indicadorProduto"
                        }
                        onClick={() =>
                          selecionarGrupo(index)
                        }
                        aria-label={`Mostrar grupo ${index + 1}`}
                      />
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="homeSemDestaques">
              <div className="homeSemDestaquesIcone">
                <FiHeart />
              </div>

              <h3>Novas criações chegando</h3>

              <p>
                Em breve, nossas peças em destaque serão
                apresentadas aqui.
              </p>
            </div>
          )}

          <div className="homeDestaquesAcao">
            <Link
              to="/produtos"
              className="btnPrimario"
            >
              Ver todos os produtos
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      <section className="homeServicos secao">
        <div className="container">
          <header className="secaoCabecalho">
            <span className="secaoTag">
              Feito para encantar
            </span>

            <h2 className="secaoTitulo">
              Artes em EVA para
              <span>momentos especiais</span>
            </h2>

            <p className="secaoTexto">
              Cada peça pode carregar uma cor, um tema, um
              nome, uma lembrança ou um detalhe único.
            </p>
          </header>

          <div className="homeServicosGrid">
            {servicos.map((servico) => (
              <article
                key={servico.titulo}
                className="homeServicoCard"
              >
                <div className="homeServicoIcone">
                  {servico.icone}
                </div>

                <h3>{servico.titulo}</h3>

                <p>{servico.texto}</p>

                <span className="homeServicoBrilho" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="homePersonalizados secao">
        <div
          className="homePersonalizadosFundo"
          aria-hidden="true"
        >
          <span className="personalizadoForma personalizadoFormaUm" />
          <span className="personalizadoForma personalizadoFormaDois" />
          <div className="personalizadoCostura" />
        </div>

        <div className="container homePersonalizadosContainer">
          <div className="homePersonalizadosVisual">
            <div className="homePersonalizadosQuadro">
              <span className="homePersonalizadosEtiqueta">
                Sob medida
              </span>

              <div className="homePersonalizadosFlor">
                <span />
                <span />
                <span />
                <span />
                <span />
                <i />
              </div>

              <strong>
                Seu tema
                <small>em cada detalhe</small>
              </strong>
            </div>
          </div>

          <div className="homePersonalizadosTexto">
            <span className="secaoTag">
              Personalização
            </span>

            <h2 className="secaoTitulo">
              Quer uma peça feita
              <span>especialmente para você?</span>
            </h2>

            <p>
              Você pode pedir uma arte personalizada com o
              tema, cores, nome, frase e detalhes que desejar.
              Ideal para festas, lembranças, presentes,
              painéis e ocasiões especiais.
            </p>

            <div className="homeMotivosLista">
              {motivos.map((motivo) => (
                <div
                  key={motivo}
                  className="homeMotivoItem"
                >
                  <FiCheckCircle />
                  <span>{motivo}</span>
                </div>
              ))}
            </div>

            <div className="homePersonalizadosBotoes">
              <button
                type="button"
                className="btnPrimario"
                onClick={abrirWhatsApp}
              >
                Pedir personalizado
                <FiMessageCircle />
              </button>

              <Link
                to="/personalizados"
                className="btnSecundario"
              >
                Ver ideias
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="homeComoFunciona secao">
        <div className="container">
          <header className="secaoCabecalho">
            <span className="secaoTag">
              Processo simples
            </span>

            <h2 className="secaoTitulo">
              Como funciona
              <span>o pedido</span>
            </h2>

            <p className="secaoTexto">
              Tudo é combinado de forma simples, direta e
              com atenção aos detalhes do seu pedido.
            </p>
          </header>

          <div className="homeEtapas">
            {etapas.map((etapa) => (
              <article
                key={etapa.numero}
                className="homeEtapaCard"
              >
                <span className="homeEtapaNumero">
                  {etapa.numero}
                </span>

                <h3>{etapa.titulo}</h3>

                <p>{etapa.texto}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="homeChamadaFinal">
        <div className="container">
          <div className="homeChamadaCard">
            <div
              className="homeChamadaDecoracao"
              aria-hidden="true"
            >
              <span />
              <span />
              <span />
            </div>

            <div className="homeChamadaTexto">
              <span className="secaoTag">
                Vamos criar juntas?
              </span>

              <h2>
                Uma peça feita à mão pode transformar
                qualquer momento.
              </h2>

              <p>
                Escolha um produto pronto ou envie sua ideia
                para criar algo único, delicado e especial.
              </p>
            </div>

            <div className="homeChamadaBotoes">
              <Link
                to="/produtos"
                className="btnPrimario"
              >
                Ver produtos
                <FiShoppingBag />
              </Link>

              <button
                type="button"
                className="btnSecundario"
                onClick={abrirWhatsApp}
              >
                Chamar no WhatsApp
                <FiMessageCircle />
              </button>
            </div>
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

export default Home;