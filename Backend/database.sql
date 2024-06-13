
CREATE TABLE public.Palabra (
	id serial PRIMARY KEY,
	texto varchar(250) NOT NULL
	
);


CREATE TABLE public.Categoria (
	id serial  PRIMARY KEY,
	nombre varchar(250) NOT NULL
	
);

CREATE TABLE public.PalabrasPorCategoria(
	--id serial NOT NULL,
	cate_id INTEGER REFERENCES Categoria(id),
	pala_id INTEGER REFERENCES Palabra(id),
	PRIMARY KEY (pala_id, cate_id)
	
);


CREATE TABLE public.SaladeJuego(
	id serial  PRIMARY KEY,
	nombre varchar(225) NOT NULL,
    estado varchar(225) NOT NULL,
	cate_id INTEGER REFERENCES Categoria(id)

);

CREATE TABLE public.songs (
	id uuid NOT NULL,
	title varchar(255) NOT NULL,
	artist varchar(255) NOT NULL,
	album varchar(255) NOT NULL,
	"year" int4 NOT NULL,
	genre varchar(255) NOT NULL,
	duration interval NULL,
	CONSTRAINT songs_pkey PRIMARY KEY (id)
);


