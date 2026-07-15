import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  FiArrowUpRight,
  FiHeart,
  FiMessageCircle
} from "react-icons/fi";

import { API_URL } from "../../services/api.js";

import "./CardProduto.css";

function CardProduto({ produto, onAbrir }) {
  const [favoritado, setFavoritado] =
    useState(false);

  const numeroWhatsApp = "5518999999999";

  useEffect(() => {
    function verificarFavorito() {
      const favoritosSalvos =
        JSON.parse(
          localStorage.getItem(
            "produtosFavoritos"
          )
        ) || [];

      const estaFavoritado =
        favoritosSalvos.includes(
          produto.id_produto
        );

      setFavoritado(estaFavoritado);
    }

    verificarFavorito();

    window.addEventListener(
      "favoritosAtualizados",
      verificarFavorito
    );

    window.addEventListener(
      "storage",
      verificarFavorito
    );

    return () => {
      window.removeEventListener(
        "favoritosAtualizados",
        verificarFavorito
      );

      window.removeEventListener(
        "storage",
        verificarFavorito
      );
    };
  }, [produto.id_produto]);

  function formatarPreco(valor) {
    return Number(valor).toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL"
      }
    );
  }

  function obterImagem() {
    if (!produto.imagem_principal) {
      return null;
    }

    if (
      produto.imagem_principal.startsWith(
        "http"
      )
    ) {
      return produto.imagem_principal;
    }

    return `${API_URL}${produto.imagem_principal}`;
  }

  function alternarFavorito() {
    const favoritosSalvos =
      JSON.parse(
        localStorage.getItem(
          "produtosFavoritos"
        )
      ) || [];

    let novosFavoritos;

    if (favoritado) {
      novosFavoritos =
        favoritosSalvos.filter(
          (idProduto) =>
            idProduto !==
            produto.id_produto
        );

      toast.success(
        "Produto removido dos favoritos."
      );
    } else {
      novosFavoritos = [
        ...new Set([
          ...favoritosSalvos,
          produto.id_produto
        ])
      ];

      toast.success(
        "Produto adicionado aos favoritos."
      );
    }

    localStorage.setItem(
      "produtosFavoritos",
      JSON.stringify(novosFavoritos)
    );

    setFavoritado(
      (estadoAtual) => !estadoAtual
    );

    window.dispatchEvent(
      new Event(
        "favoritosAtualizados"
      )
    );
  }

  function abrirWhatsApp() {
    const mensagem = encodeURIComponent(
      `Olá! Vim pelo site EVA em Detalhes e gostaria de saber mais sobre o produto: ${produto.nome}.`
    );

    window.open(
      `https://wa.me/${numeroWhatsApp}?text=${mensagem}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  function abrirDetalhes() {
    if (onAbrir) {
      onAbrir(produto);
    }
  }

  const imagem = obterImagem();

  return (
    <article className="cardProduto">
      <div className="cardProdutoImagem">
        {imagem ? (
          <img
            src={imagem}
            alt={produto.nome}
            loading="lazy"
          />
        ) : (
          <div className="cardProdutoSemImagem">
            <span>EVA</span>
            <small>feito à mão</small>
          </div>
        )}

        <div className="cardProdutoSobreposicao" />

        {produto.destaque && (
          <span className="cardProdutoDestaque">
            <FiHeart />
            Destaque
          </span>
        )}

        {produto.permite_personalizacao && (
          <span className="cardProdutoPersonalizavel">
            Personalizável
          </span>
        )}

        <button
          type="button"
          className={
            favoritado
              ? "cardProdutoFavorito cardProdutoFavoritoAtivo"
              : "cardProdutoFavorito"
          }
          onClick={alternarFavorito}
          aria-label={
            favoritado
              ? `Remover ${produto.nome} dos favoritos`
              : `Adicionar ${produto.nome} aos favoritos`
          }
          title={
            favoritado
              ? "Remover dos favoritos"
              : "Adicionar aos favoritos"
          }
        >
          <FiHeart />
        </button>

        <button
          type="button"
          className="cardProdutoVer"
          onClick={abrirDetalhes}
        >
          Ver detalhes
          <FiArrowUpRight />
        </button>
      </div>

      <div className="cardProdutoConteudo">
        <div className="cardProdutoCategoria">
          <span />

          {produto.categoria ||
            "Artesanato em EVA"}
        </div>

        <h3>{produto.nome}</h3>

        <p>{produto.descricao}</p>

        <div className="cardProdutoRodape">
          <div className="cardProdutoPreco">
            <small>
              {produto.preco_sob_consulta
                ? "Valor"
                : "A partir de"}
            </small>

            <strong>
              {produto.preco_sob_consulta
                ? "Sob consulta"
                : formatarPreco(
                    produto.preco
                  )}
            </strong>
          </div>

          <button
            type="button"
            className="cardProdutoBotao"
            onClick={abrirWhatsApp}
            aria-label={`Pedir informações sobre ${produto.nome}`}
            title="Falar pelo WhatsApp"
          >
            <FiMessageCircle />
          </button>
        </div>
      </div>

      <span className="cardProdutoForma cardProdutoFormaUm" />
      <span className="cardProdutoForma cardProdutoFormaDois" />
    </article>
  );
}

export default CardProduto;