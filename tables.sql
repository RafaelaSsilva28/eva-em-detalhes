CREATE TABLE usuarios (
id_usuario SERIAL PRIMARY KEY,
nome VARCHAR(120) NOT NULL CHECK (LENGTH(TRIM(nome)) >= 3),
email VARCHAR(150) NOT NULL UNIQUE CHECK (email LIKE '%@%.%'),
senha VARCHAR(255) NOT NULL CHECK (LENGTH(senha) >= 8),
ativo BOOLEAN NOT NULL DEFAULT TRUE,
criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categorias (
id_categoria SERIAL PRIMARY KEY,
nome VARCHAR(100) NOT NULL UNIQUE CHECK (LENGTH(TRIM(nome)) >= 3),
descricao TEXT NOT NULL CHECK (LENGTH(TRIM(descricao)) >= 5),
ativo BOOLEAN NOT NULL DEFAULT TRUE,
criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE produtos (
id_produto SERIAL PRIMARY KEY,
nome VARCHAR(150) NOT NULL CHECK (LENGTH(TRIM(nome)) >= 3),
descricao TEXT NOT NULL CHECK (LENGTH(TRIM(descricao)) >= 5),
preco NUMERIC(10,2) NOT NULL CHECK (preco >= 0),
preco_sob_consulta BOOLEAN NOT NULL DEFAULT FALSE,
estoque INTEGER NOT NULL DEFAULT 0 CHECK (estoque >= 0),
sob_encomenda BOOLEAN NOT NULL DEFAULT TRUE,
tempo_producao VARCHAR(100) NOT NULL CHECK (LENGTH(TRIM(tempo_producao)) >= 2),
material VARCHAR(150) NOT NULL CHECK (LENGTH(TRIM(material)) >= 2),
tamanho VARCHAR(100) NOT NULL CHECK (LENGTH(TRIM(tamanho)) >= 1),
permite_personalizacao BOOLEAN NOT NULL DEFAULT TRUE,
categoria_id INTEGER NOT NULL,
exibir_produtos BOOLEAN NOT NULL DEFAULT TRUE,
exibir_galeria BOOLEAN NOT NULL DEFAULT FALSE,
destaque BOOLEAN NOT NULL DEFAULT FALSE,
ativo BOOLEAN NOT NULL DEFAULT TRUE,
criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT fk_produto_categoria FOREIGN KEY (categoria_id) REFERENCES categorias(id_categoria) ON DELETE RESTRICT,
CONSTRAINT chk_exibicao_produto CHECK (exibir_produtos = TRUE OR exibir_galeria = TRUE),
CONSTRAINT chk_preco_consulta CHECK (
(preco_sob_consulta = FALSE AND preco > 0)
OR
(preco_sob_consulta = TRUE AND preco >= 0)
)
);

CREATE TABLE imagens_produto (
id_imagem SERIAL PRIMARY KEY,
produto_id INTEGER NOT NULL,
caminho_imagem VARCHAR(500) NOT NULL CHECK (LENGTH(TRIM(caminho_imagem)) >= 5),
principal BOOLEAN NOT NULL DEFAULT FALSE,
ordem INTEGER NOT NULL DEFAULT 0 CHECK (ordem >= 0),
criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT fk_imagem_produto FOREIGN KEY (produto_id) REFERENCES produtos(id_produto) ON DELETE CASCADE
);

CREATE UNIQUE INDEX idx_imagem_principal_produto
ON imagens_produto(produto_id)
WHERE principal = TRUE;

CREATE UNIQUE INDEX idx_ordem_imagem_produto
ON imagens_produto(produto_id,ordem);