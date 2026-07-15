BEGIN;

INSERT INTO categorias (nome,descricao,ativo)
VALUES
('Recursos pedagógicos','Painéis, calendários, chamadinhas e materiais educativos feitos em EVA.',TRUE),
('Ponteiras','Ponteiras personalizadas para lápis, canetas e canetões.',TRUE),
('Luvas pedagógicas','Luvas artesanais utilizadas em atividades educativas e contação de histórias.',TRUE),
('Aventais','Aventais pedagógicos e temáticos personalizados em EVA.',TRUE),
('Caixas','Caixas, cestos e organizadores decorados artesanalmente.',TRUE),
('Acessórios','Tiaras, crachás, máscaras e outros acessórios personalizados.',TRUE),
('Datas comemorativas','Trabalhos de Páscoa, Natal, Festa Junina e outras datas especiais.',TRUE),
('Decoração','Placas, personagens, enfeites de porta e peças decorativas.',TRUE)
ON CONFLICT (nome) DO NOTHING;

INSERT INTO produtos (
nome,
descricao,
preco,
preco_sob_consulta,
estoque,
sob_encomenda,
tempo_producao,
material,
tamanho,
permite_personalizacao,
categoria_id,
exibir_produtos,
exibir_galeria,
destaque,
ativo
)
SELECT
'Chamadinha Jardim Encantado',
'Painel pedagógico personalizado para organizar a chamada diária dos alunos.',
85.00,
FALSE,
0,
TRUE,
'7 a 10 dias úteis',
'EVA, cola e detalhes decorativos',
'50 cm x 70 cm',
TRUE,
id_categoria,
TRUE,
TRUE,
TRUE,
TRUE
FROM categorias
WHERE nome = 'Recursos pedagógicos'
AND NOT EXISTS (
SELECT 1
FROM produtos
WHERE nome = 'Chamadinha Jardim Encantado'
);

INSERT INTO produtos (
nome,
descricao,
preco,
preco_sob_consulta,
estoque,
sob_encomenda,
tempo_producao,
material,
tamanho,
permite_personalizacao,
categoria_id,
exibir_produtos,
exibir_galeria,
destaque,
ativo
)
SELECT
'Calendário Pedagógico',
'Calendário artesanal com meses, dias e informações para uso em sala de aula.',
95.00,
FALSE,
0,
TRUE,
'7 a 10 dias úteis',
'EVA, velcro e detalhes decorativos',
'50 cm x 70 cm',
TRUE,
id_categoria,
TRUE,
TRUE,
TRUE,
TRUE
FROM categorias
WHERE nome = 'Recursos pedagógicos'
AND NOT EXISTS (
SELECT 1
FROM produtos
WHERE nome = 'Calendário Pedagógico'
);

INSERT INTO produtos (
nome,
descricao,
preco,
preco_sob_consulta,
estoque,
sob_encomenda,
tempo_producao,
material,
tamanho,
permite_personalizacao,
categoria_id,
exibir_produtos,
exibir_galeria,
destaque,
ativo
)
SELECT
'Painel O Tempo Está',
'Painel educativo para trabalhar as condições do tempo com as crianças.',
75.00,
FALSE,
0,
TRUE,
'5 a 8 dias úteis',
'EVA e detalhes decorativos',
'45 cm x 60 cm',
TRUE,
id_categoria,
TRUE,
TRUE,
FALSE,
TRUE
FROM categorias
WHERE nome = 'Recursos pedagógicos'
AND NOT EXISTS (
SELECT 1
FROM produtos
WHERE nome = 'Painel O Tempo Está'
);

INSERT INTO produtos (
nome,
descricao,
preco,
preco_sob_consulta,
estoque,
sob_encomenda,
tempo_producao,
material,
tamanho,
permite_personalizacao,
categoria_id,
exibir_produtos,
exibir_galeria,
destaque,
ativo
)
SELECT
'Ponteira de Lápis Personalizada',
'Ponteira artesanal em EVA para lápis ou caneta, produzida no tema escolhido.',
12.00,
FALSE,
0,
TRUE,
'3 a 5 dias úteis',
'EVA e cola',
'Até 10 cm',
TRUE,
id_categoria,
TRUE,
TRUE,
TRUE,
TRUE
FROM categorias
WHERE nome = 'Ponteiras'
AND NOT EXISTS (
SELECT 1
FROM produtos
WHERE nome = 'Ponteira de Lápis Personalizada'
);

INSERT INTO produtos (
nome,
descricao,
preco,
preco_sob_consulta,
estoque,
sob_encomenda,
tempo_producao,
material,
tamanho,
permite_personalizacao,
categoria_id,
exibir_produtos,
exibir_galeria,
destaque,
ativo
)
SELECT
'Luva Pedagógica Animais',
'Luva temática para atividades pedagógicas e contação de histórias.',
45.00,
FALSE,
0,
TRUE,
'5 a 8 dias úteis',
'EVA, tecido e detalhes decorativos',
'Tamanho adulto',
TRUE,
id_categoria,
TRUE,
TRUE,
TRUE,
TRUE
FROM categorias
WHERE nome = 'Luvas pedagógicas'
AND NOT EXISTS (
SELECT 1
FROM produtos
WHERE nome = 'Luva Pedagógica Animais'
);

INSERT INTO produtos (
nome,
descricao,
preco,
preco_sob_consulta,
estoque,
sob_encomenda,
tempo_producao,
material,
tamanho,
permite_personalizacao,
categoria_id,
exibir_produtos,
exibir_galeria,
destaque,
ativo
)
SELECT
'Avental Pedagógico Personalizado',
'Avental temático produzido para professores, contação de histórias e atividades educativas.',
110.00,
FALSE,
0,
TRUE,
'10 a 15 dias úteis',
'EVA, tecido e detalhes decorativos',
'Tamanho adulto',
TRUE,
id_categoria,
TRUE,
TRUE,
TRUE,
TRUE
FROM categorias
WHERE nome = 'Aventais'
AND NOT EXISTS (
SELECT 1
FROM produtos
WHERE nome = 'Avental Pedagógico Personalizado'
);

INSERT INTO produtos (
nome,
descricao,
preco,
preco_sob_consulta,
estoque,
sob_encomenda,
tempo_producao,
material,
tamanho,
permite_personalizacao,
categoria_id,
exibir_produtos,
exibir_galeria,
destaque,
ativo
)
SELECT
'Caixa Decorada com Flores',
'Caixa artesanal decorada em EVA para organização ou presente.',
55.00,
FALSE,
0,
TRUE,
'5 a 8 dias úteis',
'EVA, papelão e cola',
'20 cm x 20 cm',
TRUE,
id_categoria,
TRUE,
TRUE,
FALSE,
TRUE
FROM categorias
WHERE nome = 'Caixas'
AND NOT EXISTS (
SELECT 1
FROM produtos
WHERE nome = 'Caixa Decorada com Flores'
);

INSERT INTO produtos (
nome,
descricao,
preco,
preco_sob_consulta,
estoque,
sob_encomenda,
tempo_producao,
material,
tamanho,
permite_personalizacao,
categoria_id,
exibir_produtos,
exibir_galeria,
destaque,
ativo
)
SELECT
'Tiara Temática em EVA',
'Tiara personalizada com personagens, animais ou temas escolhidos pelo cliente.',
25.00,
FALSE,
0,
TRUE,
'3 a 5 dias úteis',
'EVA, tiara e detalhes decorativos',
'Tamanho infantil ou adulto',
TRUE,
id_categoria,
TRUE,
TRUE,
FALSE,
TRUE
FROM categorias
WHERE nome = 'Acessórios'
AND NOT EXISTS (
SELECT 1
FROM produtos
WHERE nome = 'Tiara Temática em EVA'
);

INSERT INTO produtos (
nome,
descricao,
preco,
preco_sob_consulta,
estoque,
sob_encomenda,
tempo_producao,
material,
tamanho,
permite_personalizacao,
categoria_id,
exibir_produtos,
exibir_galeria,
destaque,
ativo
)
SELECT
'Kit de Páscoa Personalizado',
'Conjunto artesanal com coelhos, ovos e enfeites decorativos para a Páscoa.',
0.00,
TRUE,
0,
TRUE,
'7 a 12 dias úteis',
'EVA e detalhes decorativos',
'Tamanho conforme o pedido',
TRUE,
id_categoria,
TRUE,
TRUE,
FALSE,
TRUE
FROM categorias
WHERE nome = 'Datas comemorativas'
AND NOT EXISTS (
SELECT 1
FROM produtos
WHERE nome = 'Kit de Páscoa Personalizado'
);

INSERT INTO produtos (
nome,
descricao,
preco,
preco_sob_consulta,
estoque,
sob_encomenda,
tempo_producao,
material,
tamanho,
permite_personalizacao,
categoria_id,
exibir_produtos,
exibir_galeria,
destaque,
ativo
)
SELECT
'Placa Profissional Personalizada',
'Placa artesanal com nome, profissão e elementos decorativos personalizados.',
65.00,
FALSE,
0,
TRUE,
'5 a 8 dias úteis',
'EVA e base estruturada',
'30 cm x 20 cm',
TRUE,
id_categoria,
TRUE,
TRUE,
TRUE,
TRUE
FROM categorias
WHERE nome = 'Decoração'
AND NOT EXISTS (
SELECT 1
FROM produtos
WHERE nome = 'Placa Profissional Personalizada'
);

INSERT INTO produtos (
nome,
descricao,
preco,
preco_sob_consulta,
estoque,
sob_encomenda,
tempo_producao,
material,
tamanho,
permite_personalizacao,
categoria_id,
exibir_produtos,
exibir_galeria,
destaque,
ativo
)
SELECT
'Enfeite de Porta Personalizado',
'Enfeite de porta produzido com nome, personagem e cores escolhidas pelo cliente.',
0.00,
TRUE,
0,
TRUE,
'7 a 10 dias úteis',
'EVA e base estruturada',
'Tamanho conforme o pedido',
TRUE,
id_categoria,
FALSE,
TRUE,
FALSE,
TRUE
FROM categorias
WHERE nome = 'Decoração'
AND NOT EXISTS (
SELECT 1
FROM produtos
WHERE nome = 'Enfeite de Porta Personalizado'
);

COMMIT;