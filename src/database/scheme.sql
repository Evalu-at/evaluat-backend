create table if not exists usuario (
	usuario_id uuid DEFAULT gen_random_uuid(),
	email varchar(255) not null,
	nome varchar(255) not null,
	senha varchar(255) not null,
    cargo varchar(255) not null,
    CHECK (cargo in ('Coordenador','Aluno')),
    primary key (usuario_id)
);
-- precisa adicionar coluna de verified_email, para saber se o email é verificado
