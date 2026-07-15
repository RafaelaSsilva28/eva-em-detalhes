import {
  FiArrowRight,
  FiFacebook,
  FiInstagram,
  FiMail,
  FiMapPin,
  FiMessageCircle,
  FiPhone
} from "react-icons/fi";

import "./Contato.css";

function Contato() {
  const numeroWhatsApp = "5518999999999";
  const instagram =
    "https://www.instagram.com/artesdarafa.e.v.a";
  const facebook =
    "https://www.facebook.com/";
  const email =
    "evaemdetalhes@email.com";

  function abrirWhatsApp() {
    const mensagem = encodeURIComponent(
      "Olá! Vim pelo site EVA em Detalhes e gostaria de fazer um pedido."
    );

    window.open(
      `https://wa.me/${numeroWhatsApp}?text=${mensagem}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  const contatos = [
    {
      icone: <FiMessageCircle />,
      titulo: "WhatsApp",
      texto: "Fale diretamente para pedir, tirar dúvidas ou combinar personalizados.",
      botao: "Chamar no WhatsApp",
      destaque: true,
      acao: abrirWhatsApp
    },
    {
      icone: <FiInstagram />,
      titulo: "Instagram",
      texto: "Acompanhe novidades, fotos, bastidores e inspirações.",
      botao: "Abrir Instagram",
      link: instagram
    },
    {
      icone: <FiFacebook />,
      titulo: "Facebook",
      texto: "Veja publicações, atualizações e entre em contato pela página.",
      botao: "Abrir Facebook",
      link: facebook
    }
  ];

  return (
    <main className="contatoPagina">
      <section className="contatoHero">
        <div
          className="contatoDecoracao"
          aria-hidden="true"
        >
          <span className="contatoForma contatoFormaUm" />
          <span className="contatoForma contatoFormaDois" />
          <span className="contatoLinha" />
          <span className="contatoPonto contatoPontoUm" />
          <span className="contatoPonto contatoPontoDois" />
        </div>

        <div className="container contatoHeroContainer">
          <div className="contatoHeroTexto">
            <span className="contatoTag">
              Fale conosco
            </span>

            <h1>
              Vamos conversar?
              <span>é rapidinho</span>
            </h1>

            <p>
              Escolha por onde prefere falar e entre em
              contato para pedidos, dúvidas, personalizados
              ou inspirações em EVA.
            </p>

            <button
              type="button"
              className="btnPrimario"
              onClick={abrirWhatsApp}
            >
              Chamar agora no WhatsApp
              <FiMessageCircle />
            </button>
          </div>

          <div className="contatoCardPrincipal">
            <FiPhone />

            <h2>Atendimento rápido</h2>

            <p>
              Para pedidos personalizados, envie sua ideia,
              tema, quantidade e prazo desejado.
            </p>

            <button
              type="button"
              onClick={abrirWhatsApp}
            >
              Iniciar conversa
              <FiArrowRight />
            </button>
          </div>
        </div>
      </section>

      <section className="contatoCanais">
        <div className="container">
          <div className="contatoGrid">
            {contatos.map((contato) => (
              <article
                key={contato.titulo}
                className={
                  contato.destaque
                    ? "contatoCanal contatoCanalDestaque"
                    : "contatoCanal"
                }
              >
                <div className="contatoCanalIcone">
                  {contato.icone}
                </div>

                <h3>{contato.titulo}</h3>

                <p>{contato.texto}</p>

                {contato.acao ? (
                  <button
                    type="button"
                    onClick={contato.acao}
                  >
                    {contato.botao}
                    <FiArrowRight />
                  </button>
                ) : (
                  <a
                    href={contato.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {contato.botao}
                    <FiArrowRight />
                  </a>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="contatoInfo">
        <div className="container contatoInfoContainer">
          <div className="contatoInfoItem">
            <FiMail />
            <div>
              <strong>E-mail</strong>
              <span>{email}</span>
            </div>
          </div>

          <div className="contatoInfoItem">
            <FiMapPin />
            <div>
              <strong>Atendimento</strong>
              <span>Pedidos combinados online</span>
            </div>
          </div>

          <div className="contatoInfoItem">
            <FiMessageCircle />
            <div>
              <strong>Resposta</strong>
              <span>Preferencialmente pelo WhatsApp</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contato;