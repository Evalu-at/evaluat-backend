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
    nome varchar(255) UNIQUE NOT NULL,
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

CREATE TABLE IF NOT EXISTS professor (
    id UUID DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    disciplinas VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS avaliacao (
    id UUID DEFAULT uuid_generate_v4(),
    professor_id UUID NOT NULL,
    turma_id UUID NOT NULL,
	disciplina VARCHAR(255) NOT NULL,
	criterios JSONB NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (professor_id) REFERENCES professor(id),
    FOREIGN KEY (turma_id) REFERENCES turma(id)
);

/*
CREATE TABLE IF NOT EXISTS avaliacao (
	empatia INT NOT NULL,
    organizacao INT NOT NULL,
    feedback INT NOT NULL,
    inovacao INT NOT NULL,
    flexibilidade INT NOT NULL,
    incentivo INT NOT NULL,
    engajamento INT NOT NULL,
    CHECK (empatia IN (0,1,2,3,4,5)),
    CHECK (organizacao IN (0,1,2,3,4,5)),
    CHECK (feedback IN (0,1,2,3,4,5)),
    CHECK (inovacao IN (0,1,2,3,4,5)),
    CHECK (flexibilidade IN (0,1,2,3,4,5)),
    CHECK (incentivo IN (0,1,2,3,4,5)),
    CHECK (engajamento IN (0,1,2,3,4,5)),
	FOREIGN KEY (turma_id) REFERENCES turma(id),
    FOREIGN KEY (professor_id) REFERENCES professor(id)
);
*/
