CREATE TABLE IF NOT EXISTS usuario (
	usuario_id uuid DEFAULT gen_random_uuid(),
	email varchar(255) NOT NULL,
	nome varchar(255) unique NOT NULL,
	senha varchar(255) NOT NULL,
    cargo varchar(255) NOT NULL,
    CHECK (cargo IN ('Coordenador','Aluno')),
    PRIMARY KEY (usuario_id)
);

CREATE TABLE IF NOT EXISTS turma (
	turma_id uuid DEFAULT gen_random_uuid(),
    coordenador_id uuid,
    nome varchar(255) NOT NULL,
	cadeira varchar(255) NOT NULL,
	periodo int NOT NULL,
	PRIMARY KEY (turma_id),
    FOREIGN KEY (coordenador_id) REFERENCES usuario(usuario_id)
);
