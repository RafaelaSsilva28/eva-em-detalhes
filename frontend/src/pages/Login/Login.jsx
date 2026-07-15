import {
  useEffect,
  useState
} from "react";

import {
  FiArrowLeft,
  FiEye,
  FiEyeOff,
  FiHeart,
  FiLock,
  FiLogIn,
  FiMail,
  FiScissors,
  FiShield,
  FiStar
} from "react-icons/fi";

import {
  Link,
  useNavigate
} from "react-router-dom";

import toast from "react-hot-toast";

import api from "../../services/api.js";

import logo from "../../assets/logo-eva-em-detalhes.png";

import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [senha, setSenha] =
    useState("");

  const [mostrarSenha, setMostrarSenha] =
    useState(false);

  const [carregando, setCarregando] =
    useState(false);

  useEffect(() => {
    const token = localStorage.getItem("tokenEvaEmDetalhes");

    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  async function fazerLogin(event) {
    event.preventDefault();

    if (!email.trim()) {
      toast.error("Digite o e-mail.");
      return;
    }

    if (!senha.trim()) {
      toast.error("Digite a senha.");
      return;
    }

    try {
      setCarregando(true);

      const resposta = await api.post("/login", {
        email,
        senha
      });

      const token =
        resposta.data.token ||
        resposta.data.accessToken ||
        resposta.data?.dados?.token;

      const usuario =
        resposta.data.usuario ||
        resposta.data.user ||
        resposta.data?.dados?.usuario ||
        null;

      if (!token) {
        toast.error(
          "Login realizado, mas o token não foi encontrado."
        );

        return;
      }

      localStorage.setItem(
        "tokenEvaEmDetalhes",
        token
      );

      if (usuario) {
        localStorage.setItem(
          "usuarioEvaEmDetalhes",
          JSON.stringify(usuario)
        );
      }

      toast.success(
        "Login realizado com sucesso!"
      );

      navigate("/dashboard");
    } catch (erro) {
      console.error(
        "Erro ao fazer login:",
        erro
      );

      const mensagemErro =
        erro.response?.data?.mensagem ||
        erro.response?.data?.message ||
        "E-mail ou senha inválidos.";

      toast.error(mensagemErro);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="loginPagina">
      <div
        className="loginDecoracao"
        aria-hidden="true"
      >
        <span className="loginForma loginFormaUm" />
        <span className="loginForma loginFormaDois" />
        <span className="loginForma loginFormaTres" />

        <FiScissors className="loginIconeDecorativo loginIconeUm" />
        <FiHeart className="loginIconeDecorativo loginIconeDois" />
        <FiStar className="loginIconeDecorativo loginIconeTres" />

        <span className="loginLinha loginLinhaUm" />
        <span className="loginLinha loginLinhaDois" />

        <span className="loginPonto loginPontoUm" />
        <span className="loginPonto loginPontoDois" />
        <span className="loginPonto loginPontoTres" />
      </div>

      <section className="loginContainer">
        <div className="loginTexto">
          <Link
            to="/"
            className="loginVoltar"
          >
            <FiArrowLeft />
            Voltar ao site
          </Link>

          <span className="loginTag">
            Área administrativa
          </span>

          <h1>
            Bem-vinda ao painel da
            <span>EVA em Detalhes</span>
          </h1>

          <p>
            Acesse sua área exclusiva para gerenciar produtos,
            imagens, categorias e os detalhes do seu site
            artesanal.
          </p>

          <div className="loginBeneficios">
            <div className="loginBeneficio">
              <FiShield />
              <span>Acesso protegido</span>
            </div>

            <div className="loginBeneficio">
              <FiScissors />
              <span>Gestão artesanal</span>
            </div>

            <div className="loginBeneficio">
              <FiHeart />
              <span>Controle dos produtos</span>
            </div>
          </div>
        </div>

        <div className="loginCardArea">
          <div className="loginCardBrilho" />

          <form
            className="loginCard"
            onSubmit={fazerLogin}
            autoComplete="on"
          >
            <div className="loginLogoArea">
              <div className="loginLogoSelo">
                <img
                  src={logo}
                  alt="EVA em Detalhes"
                />
              </div>

              <span>Painel ADM</span>

              <h2>Entrar na conta</h2>

              <p>
                Use seu e-mail e senha cadastrados para
                acessar.
              </p>
            </div>

            <div className="loginCampos">
              <label className="loginCampo">
                <span>E-mail</span>

                <div className="loginInputBox">
                  <FiMail />

                  <input
                    type="email"
                    name="email"
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    autoComplete="username"
                  />
                </div>
              </label>

              <label className="loginCampo">
                <span>Senha</span>

                <div className="loginInputBox">
                  <FiLock />

                  <input
                    type={
                      mostrarSenha
                        ? "text"
                        : "password"
                    }
                    name="password"
                    placeholder="Digite sua senha"
                    value={senha}
                    onChange={(event) =>
                      setSenha(event.target.value)
                    }
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    className="loginMostrarSenha"
                    onClick={() =>
                      setMostrarSenha(
                        !mostrarSenha
                      )
                    }
                    aria-label={
                      mostrarSenha
                        ? "Ocultar senha"
                        : "Mostrar senha"
                    }
                  >
                    {mostrarSenha ? (
                      <FiEyeOff />
                    ) : (
                      <FiEye />
                    )}
                  </button>
                </div>
              </label>
            </div>

            <button
              type="submit"
              className="loginBotao"
              disabled={carregando}
            >
              {carregando ? (
                <>
                  <span className="loginLoader" />
                  Entrando...
                </>
              ) : (
                <>
                  Entrar no painel
                  <FiLogIn />
                </>
              )}
            </button>

            <div className="loginAviso">
              <FiShield />

              <span>
                Acesso exclusivo para administradora do site.
              </span>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

export default Login;