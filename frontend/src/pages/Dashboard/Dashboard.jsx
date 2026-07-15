import { useEffect, useState } from "react";

import {
  FiArrowRight,
  FiCamera,
  FiGrid,
  FiHome,
  FiImage,
  FiLogOut,
  FiPackage,
  FiPlusCircle,
  FiRefreshCw,
  FiShoppingBag,
  FiStar,
  FiTag,
  FiUser
} from "react-icons/fi";

import { Link, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import api from "../../services/api.js";

import logo from "../../assets/logo-eva-em-detalhes.png";

import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [carregando, setCarregando] = useState(true);

  const [dashboard, setDashboard] = useState({
    totalProdutosAtivos: 0,
    totalCategoriasAtivas: 0,
    totalImagensAtivas: 0,
    totalSobEncomenda: 0,
    ultimosProdutos: []
  });

  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("usuarioEvaEmDetalhes");

    if (usuarioSalvo) {
      setUsuario(JSON.parse(usuarioSalvo));
    }

    carregarDashboard();
  }, []);

  async function carregarDashboard() {
    try {
      setCarregando(true);

      const token = localStorage.getItem("tokenEvaEmDetalhes");

      if (!token) {
        toast.error("Faça login para acessar o painel.");
        navigate("/login");
        return;
      }

      const resposta = await api.get("/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const dados =
        resposta.data.dashboard ||
        resposta.data.dados ||
        resposta.data;

      setDashboard({
        totalProdutosAtivos:
          dados.totalProdutosAtivos ||
          dados.total_produtos_ativos ||
          dados.produtosAtivos ||
          dados.produtos_ativos ||
          0,

        totalCategoriasAtivas:
          dados.totalCategoriasAtivas ||
          dados.total_categorias_ativas ||
          dados.categoriasAtivas ||
          dados.categorias_ativas ||
          0,

        totalImagensAtivas:
          dados.totalImagensAtivas ||
          dados.total_imagens_ativas ||
          dados.imagensAtivas ||
          dados.imagens_ativas ||
          0,

        totalSobEncomenda:
          dados.totalSobEncomenda ||
          dados.total_sob_encomenda ||
          dados.produtos_sob_encomenda_ativos ||
          dados.sobEncomenda ||
          dados.sob_encomenda ||
          0,

        ultimosProdutos:
          dados.ultimosProdutos ||
          dados.ultimos_produtos ||
          []
      });
    } catch (erro) {
      console.error("Erro ao carregar dashboard:", erro);

      if (erro.response?.status === 401 || erro.response?.status === 403) {
        localStorage.removeItem("tokenEvaEmDetalhes");
        localStorage.removeItem("usuarioEvaEmDetalhes");

        toast.error("Sessão expirada. Faça login novamente.");
        navigate("/login");
        return;
      }

      toast.error("Não foi possível carregar o painel.");
    } finally {
      setCarregando(false);
    }
  }

  function sair() {
    localStorage.removeItem("tokenEvaEmDetalhes");
    localStorage.removeItem("usuarioEvaEmDetalhes");

    toast.success("Você saiu do painel.");

    navigate("/");
  }

  const cardsResumo = [
    {
      titulo: "Produtos ativos",
      valor: dashboard.totalProdutosAtivos,
      descricao: "Produtos visíveis no site",
      icone: <FiShoppingBag />
    },
    {
      titulo: "Categorias",
      valor: dashboard.totalCategoriasAtivas,
      descricao: "Categorias disponíveis",
      icone: <FiTag />
    },
    {
      titulo: "Imagens",
      valor: dashboard.totalImagensAtivas,
      descricao: "Fotos cadastradas",
      icone: <FiImage />
    },
    {
      titulo: "Sob encomenda",
      valor: dashboard.totalSobEncomenda,
      descricao: "Produtos personalizados",
      icone: <FiPackage />
    }
  ];

  const atalhos = [
    {
      titulo: "Cadastrar produto",
      descricao: "Adicionar uma nova peça artesanal ao site.",
      icone: <FiPlusCircle />,
      caminho: "/dashboard/produtos/novo"
    },
    {
      titulo: "Gerenciar produtos",
      descricao: "Editar, ativar, destacar ou remover produtos.",
      icone: <FiPackage />,
      caminho: "/dashboard/produtos"
    },
    {
      titulo: "Categorias",
      descricao: "Organizar os produtos por tipos e coleções.",
      icone: <FiGrid />,
      caminho: "/dashboard/categorias"
    },
    {
      titulo: "Imagens",
      descricao: "Cadastrar fotos e definir imagens principais.",
      icone: <FiCamera />,
      caminho: "/dashboard/imagens"
    },
    {
      titulo: "Meu perfil",
      descricao: "Alterar nome, e-mail e senha da administradora.",
      icone: <FiUser />,
      caminho: "/dashboard/perfil"
    }
  ];

  return (
    <main className="dashboardPagina">
      <aside className="dashboardSidebar">
        <div className="dashboardLogoArea">
          <div className="dashboardLogoSelo">
            <img src={logo} alt="EVA em Detalhes" />
          </div>

          <div>
            <strong>EVA</strong>
            <span>em detalhes</span>
          </div>
        </div>

        <nav className="dashboardMenu">
          <Link to="/dashboard" className="dashboardMenuItem dashboardMenuAtivo">
            <FiHome />
            Painel
          </Link>

          <Link to="/dashboard/produtos" className="dashboardMenuItem">
            <FiPackage />
            Produtos
          </Link>

          <Link to="/dashboard/categorias" className="dashboardMenuItem">
            <FiTag />
            Categorias
          </Link>

          <Link to="/dashboard/imagens" className="dashboardMenuItem">
            <FiImage />
            Imagens
          </Link>

          <Link to="/dashboard/perfil" className="dashboardMenuItem">
            <FiUser />
            Perfil
          </Link>

          <Link to="/" className="dashboardMenuItem">
            <FiArrowRight />
            Ver site
          </Link>
        </nav>

        <button type="button" className="dashboardSair" onClick={sair}>
          <FiLogOut />
          Sair
        </button>
      </aside>

      <section className="dashboardConteudo">
        <header className="dashboardTopo">
          <div>
            <span className="dashboardTag">Painel administrativo</span>

            <h1>
              Bem-vinda
              <span>
                {usuario?.nome ? `, ${usuario.nome}` : ""}
              </span>
            </h1>

            <p>
              Gerencie os produtos, categorias, imagens e detalhes do site EVA
              em Detalhes.
            </p>
          </div>

          <div className="dashboardTopoAcoes">
            <button
              type="button"
              className="dashboardBotaoSecundario"
              onClick={carregarDashboard}
              disabled={carregando}
            >
              <FiRefreshCw />
              Atualizar
            </button>

            <Link to="/dashboard/perfil" className="dashboardBotaoSecundario">
              <FiUser />
              Meu perfil
            </Link>

            <Link to="/dashboard/produtos/novo" className="dashboardBotaoPrimario">
              <FiPlusCircle />
              Novo produto
            </Link>
          </div>
        </header>

        <section className="dashboardResumo">
          {cardsResumo.map((card) => (
            <article key={card.titulo} className="dashboardResumoCard">
              <div className="dashboardResumoIcone">
                {card.icone}
              </div>

              <div>
                <span>{card.titulo}</span>
                <strong>{carregando ? "..." : card.valor}</strong>
                <p>{card.descricao}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="dashboardGrid">
          <div className="dashboardPainel dashboardAtalhos">
            <div className="dashboardSecaoTitulo">
              <div>
                <span>Atalhos rápidos</span>
                <h2>O que deseja fazer?</h2>
              </div>
            </div>

            <div className="dashboardAtalhosGrid">
              {atalhos.map((atalho) => (
                <Link
                  key={atalho.titulo}
                  to={atalho.caminho}
                  className="dashboardAtalhoCard"
                >
                  <div className="dashboardAtalhoIcone">
                    {atalho.icone}
                  </div>

                  <div>
                    <h3>{atalho.titulo}</h3>
                    <p>{atalho.descricao}</p>
                  </div>

                  <FiArrowRight className="dashboardAtalhoSeta" />
                </Link>
              ))}
            </div>
          </div>

          <div className="dashboardPainel dashboardUltimos">
            <div className="dashboardSecaoTitulo">
              <div>
                <span>Atualizações</span>
                <h2>Últimos produtos</h2>
              </div>

              <Link to="/dashboard/produtos">
                Ver todos
                <FiArrowRight />
              </Link>
            </div>

            {carregando ? (
              <div className="dashboardListaCarregando">
                <span />
                <span />
                <span />
              </div>
            ) : dashboard.ultimosProdutos.length > 0 ? (
              <div className="dashboardListaProdutos">
                {dashboard.ultimosProdutos.slice(0, 5).map((produto) => (
                  <article
                    key={produto.id_produto || produto.id}
                    className="dashboardProdutoItem"
                  >
                    <div className="dashboardProdutoIcone">
                      <FiPackage />
                    </div>

                    <div>
                      <h3>{produto.nome}</h3>

                      <p>
                        {produto.categoria ||
                          produto.nome_categoria ||
                          "Sem categoria"}
                      </p>
                    </div>

                    {produto.destaque && (
                      <span className="dashboardProdutoDestaque">
                        <FiStar />
                        Destaque
                      </span>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <div className="dashboardVazio">
                <FiUser />

                <h3>Nenhum produto recente</h3>

                <p>
                  Cadastre produtos para acompanhar as atualizações por aqui.
                </p>
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

export default Dashboard;