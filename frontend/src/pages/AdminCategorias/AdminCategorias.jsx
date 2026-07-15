import { useEffect, useMemo, useState } from "react";

import {
  FiArrowLeft,
  FiEdit3,
  FiEye,
  FiEyeOff,
  FiFolder,
  FiPlusCircle,
  FiRefreshCw,
  FiSave,
  FiSearch,
  FiTag,
  FiTrash2,
  FiX
} from "react-icons/fi";

import { Link } from "react-router-dom";

import toast from "react-hot-toast";

import api from "../../services/api.js";

import "./AdminCategorias.css";

function AdminCategorias() {
  const [categorias, setCategorias] = useState([]);

  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todas");

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [modalAberto, setModalAberto] = useState(false);
  const [categoriaEditando, setCategoriaEditando] = useState(null);

  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
  const [categoriaParaExcluir, setCategoriaParaExcluir] = useState(null);

  const [formulario, setFormulario] = useState({
    nome: "",
    descricao: "",
    ativo: true
  });

  useEffect(() => {
    carregarCategorias();
  }, []);

  async function carregarCategorias() {
    try {
      setCarregando(true);

      const token = localStorage.getItem("tokenEvaEmDetalhes");

      let listaCategoriasAtivas = [];
      let listaCategoriasInativas = [];

      try {
        const respostaCategoriasAtivas = await api.get("/categorias", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        listaCategoriasAtivas = Array.isArray(respostaCategoriasAtivas.data)
          ? respostaCategoriasAtivas.data
          : respostaCategoriasAtivas.data.categorias || [];
      } catch (erro) {
        console.error("Erro ao buscar categorias ativas:", erro);

        toast.error("Não foi possível buscar as categorias ativas.");
      }

      try {
        const respostaCategoriasInativas = await api.get(
          "/categorias/inativas",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        listaCategoriasInativas = Array.isArray(respostaCategoriasInativas.data)
          ? respostaCategoriasInativas.data
          : respostaCategoriasInativas.data.categorias || [];
      } catch (erro) {
        console.warn(
          "Rota de categorias inativas ainda não disponível:",
          erro
        );

        listaCategoriasInativas = [];
      }

      const listaCategorias = [
        ...listaCategoriasAtivas,
        ...listaCategoriasInativas
      ];

      const categoriasSemDuplicar = listaCategorias.filter(
        (categoria, index, array) =>
          index ===
          array.findIndex(
            (item) => item.id_categoria === categoria.id_categoria
          )
      );

      setCategorias(categoriasSemDuplicar);
    } catch (erro) {
      console.error("Erro geral ao carregar categorias:", erro);

      toast.error("Não foi possível carregar as categorias.");
    } finally {
      setCarregando(false);
    }
  }

  const categoriasFiltradas = useMemo(() => {
    return categorias.filter((categoria) => {
      const textoBusca = busca.trim().toLowerCase();

      const correspondeBusca =
        categoria.nome?.toLowerCase().includes(textoBusca) ||
        categoria.descricao?.toLowerCase().includes(textoBusca);

      const correspondeStatus =
        filtroStatus === "todas" ||
        (filtroStatus === "ativas" && categoria.ativo) ||
        (filtroStatus === "inativas" && !categoria.ativo);

      return correspondeBusca && correspondeStatus;
    });
  }, [categorias, busca, filtroStatus]);

  function abrirModalNovaCategoria() {
    setCategoriaEditando(null);

    setFormulario({
      nome: "",
      descricao: "",
      ativo: true
    });

    setModalAberto(true);
  }

  function abrirModalEditarCategoria(categoria) {
    setCategoriaEditando(categoria);

    setFormulario({
      nome: categoria.nome || "",
      descricao: categoria.descricao || "",
      ativo: categoria.ativo ?? true
    });

    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setCategoriaEditando(null);

    setFormulario({
      nome: "",
      descricao: "",
      ativo: true
    });
  }

  function atualizarCampo(campo, valor) {
    setFormulario((estadoAtual) => ({
      ...estadoAtual,
      [campo]: valor
    }));
  }

  function validarFormulario() {
    if (!formulario.nome.trim()) {
      toast.error("Digite o nome da categoria.");
      return false;
    }

    if (formulario.nome.trim().length < 3) {
      toast.error("O nome precisa ter pelo menos 3 caracteres.");
      return false;
    }

    if (!formulario.descricao.trim()) {
      toast.error("Digite a descrição da categoria.");
      return false;
    }

    if (formulario.descricao.trim().length < 5) {
      toast.error("A descrição precisa ter pelo menos 5 caracteres.");
      return false;
    }

    return true;
  }

  async function salvarCategoria(event) {
    event.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    try {
      setSalvando(true);

      const token = localStorage.getItem("tokenEvaEmDetalhes");

      const dados = {
        nome: formulario.nome.trim(),
        descricao: formulario.descricao.trim(),
        ativo: formulario.ativo
      };

      if (categoriaEditando) {
        await api.patch(
          `/categorias/${categoriaEditando.id_categoria}`,
          dados,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        toast.success("Categoria atualizada com sucesso!");
      } else {
        await api.post("/categorias", dados, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        toast.success("Categoria cadastrada com sucesso!");
      }

      fecharModal();
      carregarCategorias();
    } catch (erro) {
      console.error("Erro ao salvar categoria:", erro);

      const mensagemErro =
        erro.response?.data?.mensagem ||
        erro.response?.data?.message ||
        "Não foi possível salvar a categoria.";

      toast.error(mensagemErro);
    } finally {
      setSalvando(false);
    }
  }

  async function alternarStatusCategoria(categoria) {
    try {
      const token = localStorage.getItem("tokenEvaEmDetalhes");

      await api.patch(
        `/categorias/${categoria.id_categoria}`,
        {
          ativo: !categoria.ativo
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success(
        categoria.ativo
          ? "Categoria inativada com sucesso!"
          : "Categoria ativada com sucesso!"
      );

      carregarCategorias();
    } catch (erro) {
      console.error("Erro ao alterar status:", erro);

      const mensagemErro =
        erro.response?.data?.mensagem ||
        erro.response?.data?.message ||
        "Não foi possível alterar o status da categoria.";

      toast.error(mensagemErro);
    }
  }

  function abrirModalExcluir(categoria) {
    setCategoriaParaExcluir(categoria);
    setModalExcluirAberto(true);
  }

  function fecharModalExcluir() {
    setCategoriaParaExcluir(null);
    setModalExcluirAberto(false);
  }

  async function excluirCategoria() {
    if (!categoriaParaExcluir) {
      return;
    }

    try {
      const token = localStorage.getItem("tokenEvaEmDetalhes");

      await api.delete(
        `/categorias/${categoriaParaExcluir.id_categoria}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success("Categoria excluída com sucesso!");

      fecharModalExcluir();
      carregarCategorias();
    } catch (erro) {
      console.error("Erro ao excluir categoria:", erro);

      const mensagemErro =
        erro.response?.data?.mensagem ||
        erro.response?.data?.message ||
        "Não foi possível excluir a categoria. Verifique se ela possui produtos vinculados.";

      toast.error(mensagemErro);
    }
  }

  return (
    <main className="adminCategoriasPagina">
      <section className="adminCategoriasHero">
        <div className="adminCategoriasDecoracao" aria-hidden="true">
          <span className="adminCategoriasForma adminCategoriasFormaUm" />
          <span className="adminCategoriasForma adminCategoriasFormaDois" />
        </div>

        <div className="adminCategoriasTopo">
          <div>
            <Link to="/dashboard" className="adminCategoriasVoltar">
              <FiArrowLeft />
              Voltar ao painel
            </Link>

            <span className="adminCategoriasTag">Categorias</span>

            <h1>
              Gerenciar
              <span>categorias</span>
            </h1>

            <p>
              Organize os tipos de produtos do site e mantenha a vitrine mais
              fácil de navegar.
            </p>
          </div>

          <div className="adminCategoriasAcoesTopo">
            <button
              type="button"
              className="adminCategoriasBotaoSecundario"
              onClick={carregarCategorias}
              disabled={carregando}
            >
              <FiRefreshCw />
              Atualizar
            </button>

            <button
              type="button"
              className="adminCategoriasBotaoPrincipal"
              onClick={abrirModalNovaCategoria}
            >
              <FiPlusCircle />
              Nova categoria
            </button>
          </div>
        </div>
      </section>

      <section className="adminCategoriasPainel">
        <div className="adminCategoriasFiltros">
          <div className="adminCategoriasBusca">
            <FiSearch />

            <input
              type="text"
              placeholder="Buscar categoria..."
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
            />
          </div>

          <select
            value={filtroStatus}
            onChange={(event) => setFiltroStatus(event.target.value)}
          >
            <option value="todas">Todas</option>
            <option value="ativas">Ativas</option>
            <option value="inativas">Inativas</option>
          </select>
        </div>

        {carregando ? (
          <div className="adminCategoriasSkeleton">
            <span />
            <span />
            <span />
          </div>
        ) : categoriasFiltradas.length > 0 ? (
          <div className="adminCategoriasGrid">
            {categoriasFiltradas.map((categoria) => (
              <article
                key={categoria.id_categoria}
                className={
                  categoria.ativo
                    ? "adminCategoriasCard"
                    : "adminCategoriasCard adminCategoriasCardInativo"
                }
              >
                <div className="adminCategoriasCardIcone">
                  <FiFolder />
                </div>

                <div className="adminCategoriasCardConteudo">
                  <div className="adminCategoriasCardCabecalho">
                    <span>
                      <FiTag />
                      Categoria
                    </span>

                    <strong
                      className={
                        categoria.ativo
                          ? "adminCategoriasStatus adminCategoriasStatusAtivo"
                          : "adminCategoriasStatus adminCategoriasStatusInativo"
                      }
                    >
                      {categoria.ativo ? "Ativa" : "Inativa"}
                    </strong>
                  </div>

                  <h2>{categoria.nome}</h2>

                  <p>{categoria.descricao}</p>

                  <small>ID da categoria: {categoria.id_categoria}</small>
                </div>

                <div className="adminCategoriasCardAcoes">
                  <button
                    type="button"
                    onClick={() => abrirModalEditarCategoria(categoria)}
                  >
                    <FiEdit3 />
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => alternarStatusCategoria(categoria)}
                  >
                    {categoria.ativo ? <FiEyeOff /> : <FiEye />}
                    {categoria.ativo ? "Inativar" : "Ativar"}
                  </button>

                  <button
                    type="button"
                    className="adminCategoriasExcluir"
                    onClick={() => abrirModalExcluir(categoria)}
                  >
                    <FiTrash2 />
                    Excluir
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="adminCategoriasVazio">
            <FiFolder />

            <h2>Nenhuma categoria encontrada</h2>

            <p>
              Cadastre uma nova categoria para organizar os produtos do site.
            </p>

            <button type="button" onClick={abrirModalNovaCategoria}>
              <FiPlusCircle />
              Criar categoria
            </button>
          </div>
        )}
      </section>

      {modalAberto && (
        <div className="adminCategoriasModalOverlay">
          <form className="adminCategoriasModal" onSubmit={salvarCategoria}>
            <button
              type="button"
              className="adminCategoriasModalFechar"
              onClick={fecharModal}
            >
              <FiX />
            </button>

            <div className="adminCategoriasModalDecoracao" aria-hidden="true">
              <span />
              <span />
            </div>

            <div className="adminCategoriasModalIcone">
              {categoriaEditando ? <FiEdit3 /> : <FiPlusCircle />}
            </div>

            <span className="adminCategoriasModalTag">
              {categoriaEditando ? "Editar categoria" : "Nova categoria"}
            </span>

            <h2>
              {categoriaEditando
                ? "Atualizar categoria"
                : "Cadastrar categoria"}
            </h2>

            <p>
              Preencha o nome e uma breve descrição para identificar essa
              categoria no painel e no site.
            </p>

            <div className="adminCategoriasFormulario">
              <label>
                <span>Nome da categoria</span>

                <input
                  type="text"
                  value={formulario.nome}
                  onChange={(event) =>
                    atualizarCampo("nome", event.target.value)
                  }
                  placeholder="Ex: Ponteiras"
                />
              </label>

              <label>
                <span>Descrição</span>

                <textarea
                  value={formulario.descricao}
                  onChange={(event) =>
                    atualizarCampo("descricao", event.target.value)
                  }
                  placeholder="Ex: Ponteiras em EVA para lápis e canetas."
                />
              </label>

              <label className="adminCategoriasCheck">
                <input
                  type="checkbox"
                  checked={formulario.ativo}
                  onChange={(event) =>
                    atualizarCampo("ativo", event.target.checked)
                  }
                />

                Categoria ativa
              </label>
            </div>

            <div className="adminCategoriasModalAcoes">
              <button type="button" onClick={fecharModal}>
                <FiX />
                Cancelar
              </button>

              <button type="submit" disabled={salvando}>
                {salvando ? (
                  <>
                    <FiRefreshCw />
                    Salvando...
                  </>
                ) : (
                  <>
                    <FiSave />
                    Salvar
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {modalExcluirAberto && categoriaParaExcluir && (
        <div className="adminCategoriasModalOverlay">
          <div className="adminCategoriasModal adminCategoriasModalExcluir">
            <button
              type="button"
              className="adminCategoriasModalFechar"
              onClick={fecharModalExcluir}
            >
              <FiX />
            </button>

            <div className="adminCategoriasModalIcone adminCategoriasModalIconeExcluir">
              <FiTrash2 />
            </div>

            <span className="adminCategoriasModalTag">
              Confirmar exclusão
            </span>

            <h2>Excluir categoria?</h2>

            <p>
              Você está prestes a excluir a categoria{" "}
              <strong>{categoriaParaExcluir.nome}</strong>. Essa ação pode não
              ser permitida se existirem produtos vinculados a ela.
            </p>

            <div className="adminCategoriasModalAcoes">
              <button type="button" onClick={fecharModalExcluir}>
                <FiX />
                Cancelar
              </button>

              <button type="button" onClick={excluirCategoria}>
                <FiTrash2 />
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default AdminCategorias;