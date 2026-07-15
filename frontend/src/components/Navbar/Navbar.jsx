import {
  useEffect,
  useState
} from "react";

import {
  FiHeart,
  FiHome,
  FiImage,
  FiInstagram,
  FiMenu,
  FiMessageCircle,
  FiPhone,
  FiShoppingBag,
  FiStar,
  FiUser,
  FiX
} from "react-icons/fi";

import {
  Link,
  NavLink,
  useLocation
} from "react-router-dom";

import logo from "../../assets/logo-eva-em-detalhes.png";

import "./Navbar.css";

function Navbar() {
  const [menuAberto, setMenuAberto] =
    useState(false);

  const [paginaRolada, setPaginaRolada] =
    useState(false);

  const location = useLocation();

  const numeroWhatsApp = "5518999999999";
  const instagram =
    "https://www.instagram.com/artesdarafa.e.v.a";

  useEffect(() => {
    function verificarScroll() {
      setPaginaRolada(window.scrollY > 30);
    }

    verificarScroll();

    window.addEventListener(
      "scroll",
      verificarScroll
    );

    return () => {
      window.removeEventListener(
        "scroll",
        verificarScroll
      );
    };
  }, []);

  useEffect(() => {
    setMenuAberto(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, [location.pathname]);

  useEffect(() => {
    if (menuAberto) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuAberto]);

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

  function lidarComCliqueNoLink(caminho) {
    if (location.pathname === caminho) {
      voltarAoTopo();
    }

    setMenuAberto(false);
  }

  const links = [
    {
      caminho: "/",
      texto: "Home",
      icone: <FiHome />
    },
    {
      caminho: "/produtos",
      texto: "Produtos",
      icone: <FiShoppingBag />
    },
    {
      caminho: "/personalizados",
      texto: "Personalizados",
      icone: <FiStar />
    },
    {
      caminho: "/galeria",
      texto: "Galeria",
      icone: <FiImage />
    },
    {
      caminho: "/sobre",
      texto: "Sobre",
      icone: <FiUser />
    },
    {
      caminho: "/contato",
      texto: "Contato",
      icone: <FiPhone />
    }
  ];

  return (
    <>
      <header
        className={
          paginaRolada
            ? "navbar navbarRolada"
            : "navbar navbarTopo"
        }
      >
        <div
          className="navbarDecoracao"
          aria-hidden="true"
        >
          <span className="navbarForma navbarFormaUm" />
          <span className="navbarForma navbarFormaDois" />
          <span className="navbarLinha" />
        </div>

        <div className="container navbarContainer">
          <Link
            to="/login"
            className="navbarLogo"
            onClick={() =>
              lidarComCliqueNoLink("/login")
            }
            aria-label="Ir para o login administrativo"
            title="Área administrativa"
          >
            <img
              src={logo}
              alt="EVA em Detalhes"
              className="navbarLogoImagem"
            />
          </Link>

          <nav className="navbarLinks">
            {links.map((link) => (
              <NavLink
                key={link.caminho}
                to={link.caminho}
                onClick={() =>
                  lidarComCliqueNoLink(
                    link.caminho
                  )
                }
                className={({ isActive }) =>
                  isActive
                    ? "navbarLink navbarLinkAtivo"
                    : "navbarLink"
                }
              >
                {link.texto}
              </NavLink>
            ))}
          </nav>

          <div className="navbarAcoes">
            <a
              href={instagram}
              target="_blank"
              rel="noreferrer"
              className="navbarSocial"
              aria-label="Abrir Instagram"
            >
              <FiInstagram />
            </a>

            <button
              type="button"
              className="navbarWhatsapp"
              onClick={abrirWhatsApp}
            >
              <FiMessageCircle />
              Pedido
            </button>

            <NavLink
              to="/favoritos"
              onClick={() =>
                lidarComCliqueNoLink("/favoritos")
              }
              className={({ isActive }) =>
                isActive
                  ? "navbarFavoritos navbarFavoritosAtivo"
                  : "navbarFavoritos"
              }
            >
              <FiHeart />
              Favoritos
            </NavLink>

            <button
              type="button"
              className="navbarMenuBotao"
              onClick={() =>
                setMenuAberto(true)
              }
              aria-label="Abrir menu"
            >
              <FiMenu />
            </button>
          </div>
        </div>
      </header>

      <div
        className={
          menuAberto
            ? "drawerOverlay drawerOverlayAberto"
            : "drawerOverlay"
        }
        onClick={() =>
          setMenuAberto(false)
        }
      />

      <aside
        className={
          menuAberto
            ? "drawer drawerAberto"
            : "drawer"
        }
      >
        <div className="drawerTopo">
          <Link
            to="/login"
            className="drawerLogo"
            onClick={() =>
              lidarComCliqueNoLink("/login")
            }
            aria-label="Ir para o login administrativo"
            title="Área administrativa"
          >
            <img
              src={logo}
              alt="EVA em Detalhes"
              className="navbarLogoImagem"
            />
          </Link>

          <button
            type="button"
            className="drawerFechar"
            onClick={() =>
              setMenuAberto(false)
            }
            aria-label="Fechar menu"
          >
            <FiX />
          </button>
        </div>

        <nav className="drawerLinks">
          {links.map((link) => (
            <NavLink
              key={link.caminho}
              to={link.caminho}
              onClick={() =>
                lidarComCliqueNoLink(
                  link.caminho
                )
              }
              className={({ isActive }) =>
                isActive
                  ? "drawerLink drawerLinkAtivo"
                  : "drawerLink"
              }
            >
              {link.icone}
              {link.texto}
            </NavLink>
          ))}

          <NavLink
            to="/favoritos"
            onClick={() =>
              lidarComCliqueNoLink("/favoritos")
            }
            className={({ isActive }) =>
              isActive
                ? "drawerLink drawerLinkAtivo"
                : "drawerLink"
            }
          >
            <FiHeart />
            Favoritos
          </NavLink>
        </nav>

        <div className="drawerContato">
          <button
            type="button"
            onClick={abrirWhatsApp}
          >
            <FiMessageCircle />
            Fazer pedido pelo WhatsApp
          </button>

          <a
            href={instagram}
            target="_blank"
            rel="noreferrer"
          >
            <FiInstagram />
            Ver Instagram
          </a>
        </div>
      </aside>
    </>
  );
}

export default Navbar;