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
