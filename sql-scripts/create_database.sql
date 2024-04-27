
\c evaluat;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS usuario (
    id UUID DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    cargo VARCHAR(255) NOT NULL,
    CHECK (cargo IN ('Coordenador','Aluno')),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS turma (
	turma_id UUID DEFAULT uuid_generate_v4(),
    coordenador_id uuid,
    nome varchar(255) NOT NULL,
	cadeira varchar(255) NOT NULL,
	periodo int NOT NULL,
	PRIMARY KEY (turma_id),
    FOREIGN KEY (coordenador_id) REFERENCES usuario(id)
);
