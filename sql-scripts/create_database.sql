\c evaluat;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS usuario (
    id UUID DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    cargo VARCHAR(255) NOT NULL,
    email_verificado INT DEFAULT 0 NOT NULL,
    CHECK (cargo IN ('Coordenador','Aluno')),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS turma (
	id UUID DEFAULT uuid_generate_v4(),
    coordenador_id UUID,
    nome varchar(255) NOT NULL,
	periodo int NOT NULL,
	PRIMARY KEY (id),
    FOREIGN KEY (coordenador_id) REFERENCES usuario(id)
);

CREATE TABLE IF NOT EXISTS turma_usuario (
    turma_id UUID,
    usuario_id UUID,
    FOREIGN KEY (turma_id) REFERENCES turma(id),
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

CREATE TABLE IF NOT EXISTS sentimento (
	turma_id UUID,
	sentimento VARCHAR(255),
	email VARCHAR(255),
	FOREIGN KEY (turma_id) REFERENCES turma(id)
);
