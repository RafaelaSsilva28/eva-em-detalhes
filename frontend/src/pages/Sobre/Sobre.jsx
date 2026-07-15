import {
  FiArrowRight,
  FiAward,
  FiCheckCircle,
  FiFeather,
  FiHeart,
  FiMessageCircle,
  FiScissors,
  FiShield,
  FiStar,
  FiSun
} from "react-icons/fi";

import { Link } from "react-router-dom";

import "./Sobre.css";

function Sobre() {
  const numeroWhatsApp = "5518999999999";

  function abrirWhatsApp() {
    const mensagem = encodeURIComponent(
      "Olá! Vim pelo site EVA em Detalhes e gostaria de conhecer melhor o trabalho artesanal."
    );

    window.open(
      `https://wa.me/${numeroWhatsApp}?text=${mensagem}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  const pilares = [
    {
      icone: <FiHeart />,
      titulo: "Afeto",
      texto:
        "Cada peça nasce com intenção, carinho e cuidado para transformar momentos simples em lembranças especiais."
    },
    {
      icone: <FiScissors />,
      titulo: "Acabamento",
      texto:
        "Recortes, combinações e detalhes são pensados para entregar uma peça delicada, bonita e bem apresentada."
    },
    {
      icone: <FiFeather />,
      titulo: "Leveza",
      texto:
        "O EVA permite criar peças leves, coloridas e criativas, perfeitas para presentear, decorar e encantar."
    },
    {
      icone: <FiShield />,
      titulo: "Confiança",
      texto:
        "O pedido é combinado com atenção, clareza e respeito ao estilo que cada cliente procura."
    }
  ];

  const processo = [
    {
      numero: "01",
      titulo: "A ideia chega",
      texto:
        "Pode ser um tema, uma cor, uma data especial, uma lembrancinha ou uma inspiração."
    },
    {
      numero: "02",
      titulo: "O detalhe ganha forma",
      texto:
        "A proposta é pensada com cuidado para combinar beleza, delicadeza e personalidade."
    },
    {
      numero: "03",
      titulo: "A peça é criada",
      texto:
        "Cada parte é produzida manualmente, respeitando o estilo e a finalidade do pedido."
    },
    {
      numero: "04",
      titulo: "A memória fica",
      texto:
        "O resultado é uma peça artesanal feita para marcar um momento de forma especial."
    }
  ];

  const frases = [
    "feito à mão",
    "feito com calma",
    "feito com carinho",
    "feito para encantar"
  ];

  return (
    <main className="sobrePagina">
      <section className="sobreHero">
        <div
          className="sobreHeroDecoracao"
          aria-hidden="true"
        >
          <span className="sobreAura sobreAuraUm" />
          <span className="sobreAura sobreAuraDois" />
          <span className="sobreAura sobreAuraTres" />

          <FiScissors className="sobreHeroIcone sobreHeroIconeUm" />
          <FiHeart className="sobreHeroIcone sobreHeroIconeDois" />
          <FiStar className="sobreHeroIcone sobreHeroIconeTres" />

          <div className="sobreLinha sobreLinhaUm" />
          <div className="sobreLinha sobreLinhaDois" />

          <span className="sobrePonto sobrePontoUm" />
          <span className="sobrePonto sobrePontoDois" />
          <span className="sobrePonto sobrePontoTres" />
        </div>

        <div className="container sobreHeroContainer">
          <div className="sobreHeroTexto">
            <span className="sobreTag">
              Nossa essência
            </span>

            <h1>
              Detalhes não são pequenos
              <span>quando carregam afeto</span>
            </h1>

            <p>
              A EVA em Detalhes nasceu para transformar
              ideias em peças artesanais delicadas, criativas
              e cheias de significado.
            </p>

            <div className="sobreHeroBotoes">
              <button
                type="button"
                className="btnPrimario"
                onClick={abrirWhatsApp}
              >
                Falar conosco
                <FiMessageCircle />
              </button>

              <Link
                to="/galeria"
                className="btnSecundario"
              >
                Ver inspirações
                <FiArrowRight />
              </Link>
            </div>
          </div>

          <div className="sobreHeroArte">
            <div className="sobreOrbita">
              <span className="sobreOrbitaLinha" />

              <div className="sobrePlaneta sobrePlanetaUm">
                <FiHeart />
              </div>

              <div className="sobrePlaneta sobrePlanetaDois">
                <FiScissors />
              </div>

              <div className="sobrePlaneta sobrePlanetaTres">
                <FiStar />
              </div>

              <div className="sobreCentro">
                <strong>
                  EVA
                  <small>em detalhes</small>
                </strong>
              </div>
            </div>

            <div className="sobreAssinatura">
              <span>feito com propósito</span>
            </div>
          </div>
        </div>
      </section>

      <section className="sobreManifesto">
        <div className="container sobreManifestoContainer">
          <div className="sobreManifestoNumero">
            01
          </div>

          <div className="sobreManifestoTexto">
            <span className="secaoTag">
              Manifesto
            </span>

            <h2>
              O artesanato tem uma beleza que não se fabrica
              em série.
            </h2>

            <p>
              Ele nasce no tempo do cuidado. No olhar para
              uma cor. No recorte que precisa ficar certo. Na
              escolha de um detalhe que parece pequeno, mas
              muda tudo.
            </p>

            <p>
              Por isso, cada peça da EVA em Detalhes é criada
              para ser mais do que um enfeite: é uma forma de
              tornar uma lembrança, um presente ou uma
              comemoração ainda mais especial.
            </p>
          </div>
        </div>
      </section>

      <section className="sobrePilares secao">
        <div className="container">
          <header className="secaoCabecalho">
            <span className="secaoTag">
              O que guia nosso trabalho
            </span>

            <h2 className="secaoTitulo">
              Uma marca feita de
              <span>cuidado, cor e carinho</span>
            </h2>

            <p className="secaoTexto">
              Cada criação carrega uma combinação de técnica,
              sensibilidade e atenção aos detalhes.
            </p>
          </header>

          <div className="sobrePilaresGrid">
            {pilares.map((pilar, index) => (
              <article
                key={pilar.titulo}
                className="sobrePilarCard"
              >
                <span className="sobrePilarNumero">
                  0{index + 1}
                </span>

                <div className="sobrePilarIcone">
                  {pilar.icone}
                </div>

                <h3>{pilar.titulo}</h3>

                <p>{pilar.texto}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sobreAtelier secao">
        <div
          className="sobreAtelierFundo"
          aria-hidden="true"
        >
          <span />
          <span />
          <div />
        </div>

        <div className="container sobreAtelierContainer">
          <div className="sobreAtelierVisual">
            <div className="sobreMesa">
              <div className="sobreMesaTopo">
                <span />
                <span />
                <span />
              </div>

              <div className="sobreMesaConteudo">
                <FiScissors />

                <strong>
                  Do simples
                  <small>ao inesquecível</small>
                </strong>

                <p>
                  Um pedaço de EVA, quando recebe cuidado,
                  pode virar lembrança, decoração, presente e
                  afeto.
                </p>
              </div>
            </div>
          </div>

          <div className="sobreAtelierTexto">
            <span className="secaoTag">
              Nosso jeito de criar
            </span>

            <h2 className="secaoTitulo">
              Cada peça passa por
              <span>um olhar cuidadoso</span>
            </h2>

            <p>
              Nada é pensado de forma automática. O processo
              artesanal permite que cada pedido receba
              personalidade, delicadeza e um acabamento feito
              com atenção.
            </p>

            <div className="sobreLista">
              <div className="sobreListaItem">
                <FiCheckCircle />
                <span>
                  Escolha de cores que combinam com o tema.
                </span>
              </div>

              <div className="sobreListaItem">
                <FiCheckCircle />
                <span>
                  Produção manual com atenção ao acabamento.
                </span>
              </div>

              <div className="sobreListaItem">
                <FiCheckCircle />
                <span>
                  Possibilidade de criar peças sob medida.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sobreProcesso secao">
        <div className="container">
          <header className="secaoCabecalho">
            <span className="secaoTag">
              Caminho da criação
            </span>

            <h2 className="secaoTitulo">
              Da ideia ao
              <span>detalhe final</span>
            </h2>

            <p className="secaoTexto">
              Um processo simples, cuidadoso e pensado para
              transformar referências em peças especiais.
            </p>
          </header>

          <div className="sobreLinhaTempo">
            {processo.map((etapa) => (
              <article
                key={etapa.numero}
                className="sobreEtapa"
              >
                <span className="sobreEtapaNumero">
                  {etapa.numero}
                </span>

                <h3>{etapa.titulo}</h3>

                <p>{etapa.texto}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sobreFrases">
        <div className="sobreFrasesTrilho">
          {[...frases, ...frases, ...frases].map(
            (frase, index) => (
              <span key={`${frase}-${index}`}>
                {frase}
                <FiSun />
              </span>
            )
          )}
        </div>
      </section>

      <section className="sobreChamadaFinal">
        <div className="container">
          <div className="sobreChamadaCard">
            <div
              className="sobreChamadaDecoracao"
              aria-hidden="true"
            >
              <span />
              <span />
              <span />
            </div>

            <div className="sobreChamadaTexto">
              <span className="secaoTag">
                Vamos criar algo especial?
              </span>

              <h2>
                Sua ideia pode virar uma peça cheia de
                significado.
              </h2>

              <p>
                Conte o que você imaginou e vamos pensar nos
                detalhes para transformar essa ideia em EVA.
              </p>
            </div>

            <button
              type="button"
              className="btnPrimario"
              onClick={abrirWhatsApp}
            >
              Chamar no WhatsApp
              <FiMessageCircle />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Sobre;