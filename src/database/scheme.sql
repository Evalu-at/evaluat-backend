create table usuario (
	usuario_id uuid DEFAULT gen_random_uuid(),
	email varchar(255) not null,
	nome varchar(255) not null,
	senha varchar(255) not null,
    primary key (usuario_id)
);
