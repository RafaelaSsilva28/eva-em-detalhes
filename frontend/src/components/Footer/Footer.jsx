import {
  FiArrowUp,
  FiFacebook,
  FiHeart,
  FiInstagram,
  FiMessageCircle
} from "react-icons/fi";

import { Link } from "react-router-dom";

import "./Footer.css";

function Footer() {
  const numeroWhatsApp = "5518999999999";
  const instagram =
    "https://www.instagram.com/artesdarafa.e.v.a";
  const facebook =
    "https://www.facebook.com/";

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

  function voltarAoTopo() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  return (
    <footer className="footer">
      <div
        className="footerDecoracao"
        aria-hidden="true"
      >
        <span className="footerForma footerFormaUm" />
        <span className="footerForma footerFormaDois" />
      </div>

      <div className="container footerContainer">
        <div className="footerMarca">
          <Link
            to="/"
            className="footerLogo"
            onClick={voltarAoTopo}
          >
            <span>EVA</span>
            <small>em detalhes</small>
          </Link>

          <p>
            Artesanato em EVA feito com carinho.
          </p>
        </div>

        <nav className="footerLinks">
          <Link to="/">Home</Link>
          <Link to="/produtos">Produtos</Link>
          <Link to="/personalizados">Personalizados</Link>
          <Link to="/galeria">Galeria</Link>
          <Link to="/sobre">Sobre</Link>
          <Link to="/contato">Contato</Link>
        </nav>

        <div className="footerAcoes">
          <a
            href={instagram}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
          >
            <FiInstagram />
          </a>

          <a
            href={facebook}
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
          >
            <FiFacebook />
          </a>

          <button
            type="button"
            onClick={abrirWhatsApp}
            aria-label="WhatsApp"
          >
            <FiMessageCircle />
          </button>

          <button
            type="button"
            className="footerTopo"
            onClick={voltarAoTopo}
            aria-label="Voltar ao topo"
          >
            <FiArrowUp />
          </button>
        </div>
      </div>

      <div className="container footerBase">
        <p>
          © {new Date().getFullYear()} EVA em Detalhes.
        </p>

        <span>
          Feito com <FiHeart /> em cada detalhe.
        </span>
      </div>
    </footer>
  );
}

export default Footer;