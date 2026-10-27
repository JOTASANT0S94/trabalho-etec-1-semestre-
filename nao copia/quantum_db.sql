banco de dados da quantum

CREATE TABLE IF NOT EXISTS cliente(
    id_cliente SERIAL PRIMARY KEY,
    nome VARCHAR (100) NOT NULL,
    email VARCHAR (100) NOT NULL UNIQUE,
    telefone BIGINT NOT NULL,
    endereco VARCHAR(100) UNIQUE
);

CREATE TABLE estoque(
    id_categoria SERIAL PRIMARY KEY,
    descricao_da_categoria TEXT
);
CREATE TABLE produto(
    id_produto SERIAL PRIMARY KEY,
    id_categoria INT REFERENCES estoque(id_categoria),
    nome VARCHAR (100) NOT NULL,
    descricao TEXT NOT NULL,
    preco DECIMAL (10,2) NOT NULL,
    validade DATE
);
CREATE TABLE vendas(
    id_venda SERIAL  PRIMARY KEY,
    data DATE,
    id_cliente INT  REFERENCES cliente(id_cliente),
    id_produto INT REFERENCES produto(id_produto),
    preco_total  DECIMAL (10, 2) 
);


ALTER TABLE estoque RENAME TO categoria;



ALTER TABLE vendas
DROP CONSTRAINT IF EXISTS id_cliente;

ALTER TABLE vendas
ADD CONSTRAINT vendas_cliente_fk
FOREIGN KEY (id_cliente) REFERENCES cliente (id_cliente)
ON DELETE RESTRICT;


ALTER TABLE produto
DROP CONSTRAINT IF EXISTS id_categoria;

ALTER TABLE produto
ADD CONSTRAINT id_categoria_fk
FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria)
ON DELETE CASCADE;