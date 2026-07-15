import {
  FiArrowRight,
  FiCheckCircle,
  FiGift,
  FiHeart,
  FiMessageCircle,
  FiPackage,
  FiScissors,
  FiStar,
  FiTag
} from "react-icons/fi";

import { Link } from "react-router-dom";

import "./Personalizados.css";

function Personalizados() {
  const numeroWhatsApp = "5518999999999";

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

  const tiposPersonalizados = [
    {
      icone: <FiGift />,
      titulo: "Lembrancinhas",
      texto:
        "Para aniversários, escolas, maternidade, datas comemorativas e eventos especiais."
    },
    {
      icone: <FiTag />,
      titulo: "Nomes e temas",
      texto:
        "Peças com nome, personagem, cor, frase e detalhes pensados para a ocasião."
    },
    {
      icone: <FiPackage />,
      titulo: "Kits personalizados",
      texto:
        "Conjuntos combinando cores, tema e identidade visual para deixar tudo harmonioso."
    },
    {
      icone: <FiHeart />,
      titulo: "Presentes especiais",
      texto:
        "Artes delicadas para presentear alguém com uma peça única e feita com carinho."
    }
  ];

  const possibilidades = [
    "Tema da festa ou personagem",
    "Nome da criança ou pessoa homenageada",
    "Cores específicas",
    "Frases, datas e detalhes especiais",
    "Tamanho aproximado da peça",
    "Quantidade desejada"
  ];

  const etapas = [
    {
      numero: "01",
      titulo: "Envie sua ideia",
      texto:
        "Conte qual peça deseja, o tema, as cores, nome, frase e qualquer referência que tiver."
    },
    {
      numero: "02",
      titulo: "Combinamos os detalhes",
      texto:
        "A produção, prazo, valor e possibilidades são alinhados diretamente pelo WhatsApp."
    },
    {
      numero: "03",
      titulo: "A peça é produzida",
      texto:
        "Tudo é feito manualmente, com atenção ao acabamento e aos detalhes escolhidos."
    },
    {
      numero: "04",
      titulo: "Você recebe com carinho",
      texto:
        "A peça fica pronta para encantar, presentear ou completar seu momento especial."
    }
  ];

  const ideias = [
    "Aniversário infantil",
    "Dia dos professores",
    "Maternidade",
    "Volta às aulas",
    "Festa junina",
    "Natal",
    "Páscoa",
    "Dia das mães",
    "Decoração de sala",
    "Painel escolar",
    "Lembrança de evento",
    "Presente afetivo"
  ];

  return (
    <main className="personalizadosPagina">
      <section className="personalizadosHero">
        <div
          className="personalizadosHeroDecoracao"
          aria-hidden="true"
        >
          <span className="personalizadosForma personalizadosFormaUm" />
          <span className="personalizadosForma personalizadosFormaDois" />
          <span className="personalizadosForma personalizadosFormaTres" />

          <FiScissors className="personalizadosIcone personalizadosIconeUm" />
          <FiHeart className="personalizadosIcone personalizadosIconeDois" />
          <FiStar className="personalizadosIcone personalizadosIconeTres" />

          <div className="personalizadosLinha personalizadosLinhaUm" />
          <div className="personalizadosLinha personalizadosLinhaDois" />

          <span className="personalizadosBolinha personalizadosBolinhaUm" />
          <span className="personalizadosBolinha personalizadosBolinhaDois" />
          <span className="personalizadosBolinha personalizadosBolinhaTres" />
        </div>

        <div className="container personalizadosHeroContainer">
          <div className="personalizadosHeroTexto">
            <span className="personalizadosTag">
              Feito do seu jeito
            </span>

            <h1>
              Personalizados em EVA
              <span>para momentos únicos</span>
            </h1>

            <p>
              Transforme uma ideia, tema ou detalhe especial
              em uma peça artesanal cheia de carinho,
              delicadeza e personalidade.
            </p>

            <div className="personalizadosHeroBotoes">
              <button
                type="button"
                className="btnPrimario"
                onClick={abrirWhatsApp}
              >
                Pedir pelo WhatsApp
                <FiMessageCircle />
              </button>

              <Link
                to="/galeria"
                className="btnSecundario"
              >
                Ver Galeria
                <FiArrowRight />
              </Link>
            </div>
          </div>

          <div className="personalizadosHeroVisual">
            <div className="personalizadosQuadroPrincipal">
              <span className="personalizadosSelo">
                <FiHeart />
                Sob medida
              </span>

              <div className="personalizadosFlorGrande">
                <span />
                <span />
                <span />
                <span />
                <span />
                <i />
              </div>

              <strong>
                Sua ideia
                <small>virando arte</small>
              </strong>
            </div>

            <div className="personalizadosMiniCard personalizadosMiniCardUm">
              <FiGift />
              <span>Lembranças</span>
            </div>

            <div className="personalizadosMiniCard personalizadosMiniCardDois">
              <FiStar />
              <span>Temas</span>
            </div>
          </div>
        </div>
      </section>

      <section className="personalizadosTipos secao">
        <div className="container">
          <header className="secaoCabecalho">
            <span className="secaoTag">
              O que personalizar
            </span>

            <h2 className="secaoTitulo">
              Peças criadas para
              <span>combinar com você</span>
            </h2>

            <p className="secaoTexto">
              Cada encomenda pode ser adaptada ao tema, às
              cores, ao tamanho e ao estilo que você deseja.
            </p>
          </header>

          <div className="personalizadosTiposGrid">
            {tiposPersonalizados.map((tipo) => (
              <article
                key={tipo.titulo}
                className="personalizadosTipoCard"
              >
                <div className="personalizadosTipoIcone">
                  {tipo.icone}
                </div>

                <h3>{tipo.titulo}</h3>

                <p>{tipo.texto}</p>

                <span className="personalizadosTipoDetalhe" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="personalizadosDetalhes secao">
        <div
          className="personalizadosDetalhesFundo"
          aria-hidden="true"
        >
          <span />
          <span />
          <div />
        </div>

        <div className="container personalizadosDetalhesContainer">
          <div className="personalizadosDetalhesTexto">
            <span className="secaoTag">
              Detalhes do pedido
            </span>

            <h2 className="secaoTitulo">
              Quanto mais detalhes,
              <span>mais especial fica</span>
            </h2>

            <p>
              Para criar uma peça personalizada, você pode
              enviar referências, explicar o tema e combinar
              todos os detalhes pelo WhatsApp.
            </p>

            <div className="personalizadosChecklist">
              {possibilidades.map((item) => (
                <div
                  key={item}
                  className="personalizadosChecklistItem"
                >
                  <FiCheckCircle />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="btnPrimario"
              onClick={abrirWhatsApp}
            >
              Enviar minha ideia
              <FiMessageCircle />
            </button>
          </div>

          <div className="personalizadosDetalhesVisual">
            <div className="personalizadosBlocoCriativo">
              <div className="personalizadosBlocoTopo">
                <span />
                <span />
                <span />
              </div>

              <div className="personalizadosBlocoConteudo">
                <FiScissors />

                <strong>
                  Tema + cores + nome
                </strong>

                <p>
                  Cada escolha ajuda a transformar o pedido
                  em uma peça única.
                </p>
              </div>

              <div className="personalizadosBlocoRodape">
                <span>feito à mão</span>
                <span>com carinho</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="personalizadosComoFunciona secao">
        <div className="container">
          <header className="secaoCabecalho">
            <span className="secaoTag">
              Passo a passo
            </span>

            <h2 className="secaoTitulo">
              Como pedir
              <span>seu personalizado</span>
            </h2>

            <p className="secaoTexto">
              O atendimento é simples e direto, para entender
              exatamente o que você quer antes da produção.
            </p>
          </header>

          <div className="personalizadosEtapas">
            {etapas.map((etapa) => (
              <article
                key={etapa.numero}
                className="personalizadosEtapaCard"
              >
                <span className="personalizadosEtapaNumero">
                  {etapa.numero}
                </span>

                <h3>{etapa.titulo}</h3>

                <p>{etapa.texto}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="personalizadosIdeias secao">
        <div className="container personalizadosIdeiasContainer">
          <div className="personalizadosIdeiasTexto">
            <span className="secaoTag">
              Inspirações
            </span>

            <h2 className="secaoTitulo">
              Ideias de temas
              <span>para personalizar</span>
            </h2>

            <p>
              Use essas sugestões como ponto de partida ou
              envie uma ideia totalmente diferente para criar
              algo exclusivo.
            </p>
          </div>

          <div className="personalizadosIdeiasLista">
            {ideias.map((ideia) => (
              <span key={ideia}>
                {ideia}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="personalizadosChamadaFinal">
        <div className="container">
          <div className="personalizadosChamadaCard">
            <div
              className="personalizadosChamadaDecoracao"
              aria-hidden="true"
            >
              <span />
              <span />
              <span />
            </div>

            <div className="personalizadosChamadaTexto">
              <span className="secaoTag">
                Vamos criar?
              </span>

              <h2>
                Sua ideia pode virar uma peça linda em EVA.
              </h2>

              <p>
                Chame no WhatsApp, conte o que você imaginou
                e combine todos os detalhes do seu pedido.
              </p>
            </div>

            <button
              type="button"
              className="btnPrimario"
              onClick={abrirWhatsApp}
            >
              Fazer pedido personalizado
              <FiMessageCircle />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Personalizados;