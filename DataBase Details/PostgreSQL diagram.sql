-- Create schemas

-- Create tables
CREATE TABLE IF NOT EXISTS tipo_pregunta
(
    id_tipo_pregunta INTEGER NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    nombre_tipo VARCHAR(40),
    PRIMARY KEY(id_tipo_pregunta)
);

CREATE TABLE IF NOT EXISTS pregunta
(
    id_pregunta INTEGER NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    id_tipo_pregunta INTEGER,
    nombre_pregunta VARCHAR(220),
    PRIMARY KEY(id_pregunta)
);

CREATE TABLE IF NOT EXISTS pregunta_cerrada_multiple
(
    id_respuesta INTEGER NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    id_pregunta INTEGER NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    id_formulario INTEGER NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    PRIMARY KEY(id_respuesta, id_pregunta, id_formulario)
);

CREATE TABLE IF NOT EXISTS pregunta_abierta
(
    id_pregunta INTEGER NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    id_formulario INTEGER NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    descripcion_respuesta VARCHAR(60),
    PRIMARY KEY(id_pregunta, id_formulario,descripcion_respuesta)
);

CREATE TABLE IF NOT EXISTS respuesta
(
    id_respuesta INTEGER NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    id_pregunta INTEGER,
    descripcion_respuesta VARCHAR(150),
    PRIMARY KEY(id_respuesta)
);

CREATE TABLE IF NOT EXISTS formulario
(
    id_formulario INTEGER NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    ip_formulario VARCHAR(17),
    id_distrito INTEGER,
    PRIMARY KEY(id_formulario)
);

CREATE TABLE IF NOT EXISTS distrito
(
    id_distrito INTEGER NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    id_canton INTEGER,
    nombre VARCHAR(55),
    cant_habitantes INTEGER,
    PRIMARY KEY(id_distrito)
);

CREATE TABLE IF NOT EXISTS canton
(
    id_canton INTEGER NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    id_provincia INTEGER,
    nombre VARCHAR(55),
    cant_habitantes INTEGER,
    PRIMARY KEY(id_canton)
);

CREATE TABLE IF NOT EXISTS provincia
(
    id_provincia INTEGER NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    nombre VARCHAR(55),
    PRIMARY KEY(id_provincia)
);


-- Create FKs
ALTER TABLE pregunta
    ADD    FOREIGN KEY (id_tipo_pregunta)
    REFERENCES tipo_pregunta(id_tipo_pregunta)
    MATCH SIMPLE
;
    
ALTER TABLE pregunta_abierta
    ADD    FOREIGN KEY (id_pregunta)
    REFERENCES pregunta(id_pregunta)
    MATCH SIMPLE
;
    
ALTER TABLE pregunta_cerrada_multiple
    ADD    FOREIGN KEY (id_pregunta)
    REFERENCES pregunta(id_pregunta)
    MATCH SIMPLE
;
    
ALTER TABLE pregunta_cerrada_multiple
    ADD    FOREIGN KEY (id_respuesta)
    REFERENCES respuesta(id_respuesta)
    MATCH SIMPLE
;
    
ALTER TABLE formulario
    ADD    FOREIGN KEY (id_distrito)
    REFERENCES distrito(id_distrito)
    MATCH SIMPLE
;
    
ALTER TABLE distrito
    ADD    FOREIGN KEY (id_canton)
    REFERENCES canton(id_canton)
    MATCH SIMPLE
;
    
ALTER TABLE canton
    ADD    FOREIGN KEY (id_provincia)
    REFERENCES provincia(id_provincia)
    MATCH SIMPLE
;
    
ALTER TABLE respuesta
    ADD    FOREIGN KEY (id_pregunta)
    REFERENCES pregunta(id_pregunta)
    MATCH SIMPLE
;
    
ALTER TABLE pregunta_cerrada_multiple
    ADD    FOREIGN KEY (id_formulario)
    REFERENCES formulario(id_formulario)
    MATCH SIMPLE
;
    
ALTER TABLE pregunta_abierta
    ADD    FOREIGN KEY (id_formulario)
    REFERENCES formulario(id_formulario)
    MATCH SIMPLE
;
    

-- Create Indexes
