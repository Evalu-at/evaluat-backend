create table usuario (
	id int unique not null,
	email varchar(255) not null,
	nome varchar(255) not null,
	senha varchar(255) not null
);
