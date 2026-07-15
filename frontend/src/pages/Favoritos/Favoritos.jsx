import {
  useCallback,
  useEffect,
  useState
} from "react";

import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
  FiArrowLeft,
  FiHeart,
  FiShoppingBag
} from "react-icons/fi";

import CardProduto from "../../components/CardProduto/CardProduto.jsx";
import ModalProduto from "../../components/ModalProduto/ModalProduto.jsx";

import api from "../../services/api.js";

import "./Favoritos.css";

function Favoritos() {
  const [todosProdutos, setTodosProdutos] =
    useState([]);

  const [produtosFavoritos, setProdutosFavoritos] =
    useState([]);

  const [carregando, setCarregando] =
    useState(true);

  const [produtoSelecionado, setProdutoSelecionado] =
    useState(null);

  const atualizarProdutosFavoritos = useCallback(
    (produtosDisponiveis = todosProdutos) => {
      const idsFavoritos =
        JSON.parse(
          localStorage.getItem(
            "produtosFavoritos"
          )
        ) || [];

      const favoritosEncontrados =
        produtosDisponiveis.filter(
          (produto) =>
            idsFavoritos.includes(
              produto.id_produto
            ) &&
            produto.ativo
        );

      setProdutosFavoritos(
        favoritosEncontrados
      );
    },
    [todosProdutos]
  );

  useEffect(() => {
    async function buscarProdutos() {
      try {
        setCarregando(true);

        const resposta =
          await api.get("/produtos");

        const produtos =
          Array.isArray(resposta.data)
            ? resposta.data
            : resposta.data.produtos || [];

        setTodosProdutos(produtos);

        const idsFavoritos =
          JSON.parse(
            localStorage.getItem(
              "produtosFavoritos"
            )
          ) || [];

        const favoritosEncontrados =
          produtos.filter(
            (produto) =>
              idsFavoritos.includes(
                produto.id_produto
              ) &&
              produto.ativo
          );

        setProdutosFavoritos(
          favoritosEncontrados
        );
      } catch (erro) {
        console.error(
          "Erro ao carregar favoritos:",
          erro
        );

        toast.error(
          "Não foi possível carregar seus favoritos."
        );
      } finally {
        setCarregando(false);
      }
    }

    buscarProdutos();
  }, []);

  useEffect(() => {
    function sincronizarFavoritos() {
      atualizarProdutosFavoritos();
    }

    window.addEventListener(
      "favoritosAtualizados",
      sincronizarFavoritos
    );

    window.addEventListener(
      "storage",
      sincronizarFavoritos
    );

    return () => {
      window.removeEventListener(
        "favoritosAtualizados",
        sincronizarFavoritos
      );

      window.removeEventListener(
        "storage",
        sincronizarFavoritos
      );
    };
  }, [atualizarProdutosFavoritos]);

  const abrirProduto = useCallback(
    (produto) => {
      setProdutoSelecionado(
        produto.id_produto
      );
    },
    []
  );

  const fecharProduto = useCallback(() => {
    setProdutoSelecionado(null);
  }, []);

  return (
    <main className="favoritosPagina">
      <section className="favoritosHero">
        <div
          className="favoritosDecoracao"
          aria-hidden="true"
        >
          <span className="favoritosForma favoritosFormaUm" />
          <span className="favoritosForma favoritosFormaDois" />

          <FiHeart className="favoritosCoracao favoritosCoracaoUm" />
          <FiHeart className="favoritosCoracao favoritosCoracaoDois" />

          <div className="favoritosLinhaCostura" />

          <span className="favoritosBolinha favoritosBolinhaUm" />
          <span className="favoritosBolinha favoritosBolinhaDois" />
          <span className="favoritosBolinha favoritosBolinhaTres" />
        </div>

        <div className="container favoritosHeroConteudo">
          <span className="favoritosTag">
            Selecionados por você
          </span>

          <h1>
            Seus produtos
            <span>favoritos</span>
          </h1>

          <p>
            Reunimos aqui todas as peças que
            conquistaram seu coração.
          </p>

          <div className="favoritosQuantidade">
            <FiHeart />

            <strong>
              {produtosFavoritos.length}
            </strong>

            <span>
              {produtosFavoritos.length === 1
                ? "produto salvo"
                : "produtos salvos"}
            </span>
          </div>
        </div>
      </section>

      <section className="favoritosConteudo secao">
        <div className="container">
          {carregando ? (
            <div className="favoritosGrid">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="favoritoSkeleton"
                >
                  <div className="favoritoSkeletonImagem" />

                  <div className="favoritoSkeletonTexto">
                    <span />
                    <strong />
                    <p />
                    <p />
                  </div>
                </div>
              ))}
            </div>
          ) : produtosFavoritos.length > 0 ? (
            <>
              <div className="favoritosCabecalho">
                <div>
                  <span>
                    Sua seleção especial
                  </span>

                  <h2>
                    Peças que você amou
                  </h2>
                </div>

                <Link
                  to="/produtos"
                  className="favoritosVerProdutos"
                >
                  <FiShoppingBag />
                  Ver mais produtos
                </Link>
              </div>

              <div className="favoritosGrid">
                {produtosFavoritos.map(
                  (produto) => (
                    <CardProduto
                      key={produto.id_produto}
                      produto={produto}
                      onAbrir={abrirProduto}
                    />
                  )
                )}
              </div>
            </>
          ) : (
            <div className="favoritosVazio">
              <div className="favoritosVazioVisual">
                <span className="favoritosVazioCirculo">
                  <FiHeart />
                </span>

                <span className="favoritosVazioCoracao favoritosVazioCoracaoUm">
                  <FiHeart />
                </span>

                <span className="favoritosVazioCoracao favoritosVazioCoracaoDois">
                  <FiHeart />
                </span>
              </div>

              <span className="favoritosVazioTag">
                Sua coleção está esperando
              </span>

              <h2>
                Você ainda não adicionou
                nenhum favorito
              </h2>

              <p>
                Clique no coração dos produtos
                que mais gostar para encontrá-los
                facilmente nesta página.
              </p>

              <Link
                to="/produtos"
                className="btnPrimario favoritosVazioBotao"
              >
                <FiArrowLeft />
                Conhecer os produtos
              </Link>
            </div>
          )}
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

export default Favoritos;