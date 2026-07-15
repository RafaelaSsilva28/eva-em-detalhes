import "./AdminPerfil.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiSave,
  FiShield,
  FiUser
} from "react-icons/fi";
import toast from "react-hot-toast";

import api from "../../services/api.js";

function AdminPerfil() {
  const navigate = useNavigate();

  const [carregando, setCarregando] = useState(true);
  const [salvandoPerfil, setSalvandoPerfil] = useState(false);
  const [salvandoSenha, setSalvandoSenha] = useState(false);

  const [perfil, setPerfil] = useState({
    nome: "",
    email: ""
  });

  const [senhas, setSenhas] = useState({
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: ""
  });

  const [mostrarSenhas, setMostrarSenhas] = useState({
    senhaAtual: false,
    novaSenha: false,
    confirmarSenha: false
  });

  function obterToken() {
    return localStorage.getItem("tokenEvaEmDetalhes");
  }

  function obterHeaders() {
    const token = obterToken();

    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  }

  function tratarErro(erro, mensagemPadrao) {
    const mensagem =
      erro.response?.data?.mensagem ||
      mensagemPadrao;

    toast.error(mensagem);

    if (
      erro.response?.status === 401 ||
      erro.response?.status === 403
    ) {
      localStorage.removeItem("tokenEvaEmDetalhes");
      localStorage.removeItem("usuarioEvaEmDetalhes");
      navigate("/login");
    }
  }

  async function carregarPerfil() {
    try {
      setCarregando(true);

      const resposta = await api.get(
        "/usuarios/perfil",
        obterHeaders()
      );

      setPerfil({
        nome: resposta.data.usuario.nome || "",
        email: resposta.data.usuario.email || ""
      });
    } catch (erro) {
      tratarErro(
        erro,
        "Não foi possível carregar os dados do perfil."
      );
    } finally {
      setCarregando(false);
    }
  }

  async function salvarPerfil(evento) {
    evento.preventDefault();

    try {
      setSalvandoPerfil(true);

      const resposta = await api.patch(
        "/usuarios/perfil",
        {
          nome: perfil.nome,
          email: perfil.email
        },
        obterHeaders()
      );

      const usuarioAtualizado = resposta.data.usuario;

      localStorage.setItem(
        "usuarioEvaEmDetalhes",
        JSON.stringify(usuarioAtualizado)
      );

      setPerfil({
        nome: usuarioAtualizado.nome || "",
        email: usuarioAtualizado.email || ""
      });

      toast.success("Perfil atualizado com sucesso!");
    } catch (erro) {
      tratarErro(
        erro,
        "Não foi possível atualizar o perfil."
      );
    } finally {
      setSalvandoPerfil(false);
    }
  }

  async function alterarSenha(evento) {
    evento.preventDefault();

    if (senhas.novaSenha !== senhas.confirmarSenha) {
      toast.error("A confirmação de senha não confere.");
      return;
    }

    try {
      setSalvandoSenha(true);

      await api.patch(
        "/usuarios/perfil/senha",
        {
          senhaAtual: senhas.senhaAtual,
          novaSenha: senhas.novaSenha,
          confirmarSenha: senhas.confirmarSenha
        },
        obterHeaders()
      );

      setSenhas({
        senhaAtual: "",
        novaSenha: "",
        confirmarSenha: ""
      });

      toast.success("Senha alterada com sucesso!");
    } catch (erro) {
      tratarErro(
        erro,
        "Não foi possível alterar a senha."
      );
    } finally {
      setSalvandoSenha(false);
    }
  }

  function atualizarCampoPerfil(campo, valor) {
    setPerfil((dadosAtuais) => ({
      ...dadosAtuais,
      [campo]: valor
    }));
  }

  function atualizarCampoSenha(campo, valor) {
    setSenhas((dadosAtuais) => ({
      ...dadosAtuais,
      [campo]: valor
    }));
  }

  function alternarMostrarSenha(campo) {
    setMostrarSenhas((dadosAtuais) => ({
      ...dadosAtuais,
      [campo]: !dadosAtuais[campo]
    }));
  }

  useEffect(() => {
    carregarPerfil();
  }, []);

  if (carregando) {
    return (
      <main className="adminPerfilPagina">
        <section className="adminPerfilCarregando">
          <div className="adminPerfilLoader"></div>
          <p>Carregando dados do perfil...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="adminPerfilPagina">
      <section className="adminPerfilDecoracao adminPerfilDecoracaoUm"></section>
      <section className="adminPerfilDecoracao adminPerfilDecoracaoDois"></section>

      <header className="adminPerfilTopo">
        <button
          type="button"
          className="adminPerfilVoltar"
          onClick={() => navigate("/dashboard")}
        >
          <FiArrowLeft />
          Voltar ao painel
        </button>

        <div className="adminPerfilTituloArea">
          <span className="adminPerfilEtiqueta">
            <FiShield />
            Área administrativa
          </span>

          <h1>
            Minha Conta
            <span>Perfil</span>
          </h1>

          <p>
            Atualize os dados principais da administradora do site
            EVA em Detalhes com segurança.
          </p>
        </div>
      </header>

      <section className="adminPerfilResumo">
        <div className="adminPerfilAvatar">
          <FiUser />
        </div>

        <div>
          <span>Administradora logada</span>
          <strong>{perfil.nome}</strong>
          <p>{perfil.email}</p>
        </div>

        <div className="adminPerfilStatus">
          <FiCheckCircle />
          Conta ativa
        </div>
      </section>

      <section className="adminPerfilGrid">
        <form
          className="adminPerfilCard"
          onSubmit={salvarPerfil}
        >
          <div className="adminPerfilCardTopo">
            <div className="adminPerfilIcone">
              <FiUser />
            </div>

            <div>
              <h2>Dados do perfil</h2>
              <p>Altere seu nome e e-mail de acesso.</p>
            </div>
          </div>

          <label className="adminPerfilCampo">
            <span>Nome</span>

            <div className="adminPerfilInputArea">
              <FiUser />
              <input
                type="text"
                value={perfil.nome}
                onChange={(evento) =>
                  atualizarCampoPerfil("nome", evento.target.value)
                }
                placeholder="Digite seu nome"
              />
            </div>
          </label>

          <label className="adminPerfilCampo">
            <span>E-mail</span>

            <div className="adminPerfilInputArea">
              <FiMail />
              <input
                type="email"
                value={perfil.email}
                onChange={(evento) =>
                  atualizarCampoPerfil("email", evento.target.value)
                }
                placeholder="Digite seu e-mail"
              />
            </div>
          </label>

          <button
            type="submit"
            className="adminPerfilBotaoPrincipal"
            disabled={salvandoPerfil}
          >
            <FiSave />
            {salvandoPerfil ? "Salvando..." : "Salvar alterações"}
          </button>
        </form>

        <form
          className="adminPerfilCard"
          onSubmit={alterarSenha}
        >
          <div className="adminPerfilCardTopo">
            <div className="adminPerfilIcone">
              <FiLock />
            </div>

            <div>
              <h2>Alterar senha</h2>
              <p>Use sua senha atual para criar uma nova.</p>
            </div>
          </div>

          <label className="adminPerfilCampo">
            <span>Senha atual</span>

            <div className="adminPerfilInputArea">
              <FiLock />

              <input
                type={mostrarSenhas.senhaAtual ? "text" : "password"}
                value={senhas.senhaAtual}
                onChange={(evento) =>
                  atualizarCampoSenha("senhaAtual", evento.target.value)
                }
                placeholder="Digite sua senha atual"
              />

              <button
                type="button"
                className="adminPerfilOlho"
                onClick={() => alternarMostrarSenha("senhaAtual")}
              >
                {mostrarSenhas.senhaAtual ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </label>

          <label className="adminPerfilCampo">
            <span>Nova senha</span>

            <div className="adminPerfilInputArea">
              <FiLock />

              <input
                type={mostrarSenhas.novaSenha ? "text" : "password"}
                value={senhas.novaSenha}
                onChange={(evento) =>
                  atualizarCampoSenha("novaSenha", evento.target.value)
                }
                placeholder="Mínimo de 8 caracteres"
              />

              <button
                type="button"
                className="adminPerfilOlho"
                onClick={() => alternarMostrarSenha("novaSenha")}
              >
                {mostrarSenhas.novaSenha ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </label>

          <label className="adminPerfilCampo">
            <span>Confirmar nova senha</span>

            <div className="adminPerfilInputArea">
              <FiLock />

              <input
                type={mostrarSenhas.confirmarSenha ? "text" : "password"}
                value={senhas.confirmarSenha}
                onChange={(evento) =>
                  atualizarCampoSenha("confirmarSenha", evento.target.value)
                }
                placeholder="Repita a nova senha"
              />

              <button
                type="button"
                className="adminPerfilOlho"
                onClick={() => alternarMostrarSenha("confirmarSenha")}
              >
                {mostrarSenhas.confirmarSenha ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </label>

          <button
            type="submit"
            className="adminPerfilBotaoSecundario"
            disabled={salvandoSenha}
          >
            <FiLock />
            {salvandoSenha ? "Alterando..." : "Alterar senha"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default AdminPerfil;