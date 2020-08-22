CREATE or replace FUNCTION newQuestion(pidNombre integer, pnombre varchar(220)) RETURNS void AS $$
BEGIN
  INSERT INTO pregunta( id_tipo_pregunta ,nombre_pregunta) VALUES (pidNombre,pnombre);
END;
$$ LANGUAGE 'plpgsql';
---------------------------------
alter table pregunta add column activo smallint default 1;
-----------------------------------------
CREATE OR REPLACE FUNCTION get_preguntas () 
   RETURNS TABLE (
	  id integer,
      tipo integer,
      nombre VARCHAR,
	  estado smallint,
	  titulo varchar
) 
AS $$
BEGIN
   RETURN QUERY SELECT * FROM pregunta where activo = 1;
END; 
$$ LANGUAGE 'plpgsql';
---------------------------------

CREATE or replace FUNCTION newQuestionType(pnombre varchar) RETURNS void AS $$
BEGIN
  INSERT INTO tipo_pregunta(nombre_tipo) VALUES (pnombre);
END;
$$ LANGUAGE 'plpgsql';
---------------------------------
CREATE or replace FUNCTION getQuestionType(pidTipo integer) RETURNS 
table (
	nombre varchar
)
AS $$
BEGIN
  return query select nombre_tipo from tipo_pregunta where id_tipo_pregunta = pidTipo;
END;
$$ LANGUAGE 'plpgsql';

--################################

CREATE or replace FUNCTION newFormulario(pipFormulario varchar , pidDistrito integer) 
RETURNS integer AS $$
	Declare
  		resultado integer;
BEGIN
  INSERT INTO formulario( ip_formulario ,id_distrito) 
  VALUES (pipFormulario , pidDistrito);
  select currval(pg_get_serial_sequence('formulario', 'id_formulario')) into resultado;
  return resultado;
END;
$$ LANGUAGE 'plpgsql';
--------------------------------
CREATE or replace FUNCTION getProvincias() RETURNS 
table (
	id integer, 
	nombre varchar
)
AS $$
BEGIN
  return query select * from provincia order by id_provincia;
END;
$$ LANGUAGE 'plpgsql';
--################################

CREATE or replace FUNCTION getCanton(pidProvincia integer) RETURNS 
table (
	idCanton integer,
	idProvincia integer,
	nombreCanton varchar
)
AS $$
BEGIN
  return query select id_canton, id_provincia, nombre from canton where id_provincia = COALESCE(pidProvincia, id_provincia);
END;
$$ LANGUAGE 'plpgsql';

--################################

CREATE or replace FUNCTION getDistrito(pidCanton integer) RETURNS 
table (
	idDistrito integer,
	idCanton integer,
	nombreDistrito varchar
)
AS $$
BEGIN
  return query select id_distrito, id_canton, nombre from distrito where id_canton = COALESCE(pidCanton, id_canton);
END;
$$ LANGUAGE 'plpgsql';
---------------------------------

CREATE or replace FUNCTION newAnswer(pidPregunta integer, pDescripcion varchar) RETURNS void AS $$
BEGIN
  INSERT INTO respuesta( id_pregunta, descripcion_respuesta) VALUES (pidPregunta , pDescripcion);
END;
$$ LANGUAGE 'plpgsql';

--################################
alter table pregunta add column tituloEstadistica varchar(220);
--#####################################
alter table respuesta add column activo smallint default 1;
--##########################################3
CREATE or replace FUNCTION getAnswers(pidPregunta integer) RETURNS 
table (
	idRespuesta integer,
	idPregunta integer,
	descripcion varchar,
	estado smallint
)
AS $$
BEGIN
  	return query select *
		from respuesta where id_pregunta = COALESCE(pidPregunta, id_pregunta) and
	activo > 0;
END;
$$ LANGUAGE 'plpgsql';

---------------------------------

CREATE or replace FUNCTION newMultipleRaces(listaRazas varchar[]) RETURNS void AS $$
--funcion de prueba que funciona
DECLARE
   number_raza integer := array_length(listaRazas, 1);
   raza_index integer := 1;
BEGIN
   WHILE raza_index <= number_raza LOOP
	  INSERT INTO prueba.raza(nombre, ip) VALUES (listaRazas[raza_index], 'nada');
      raza_index = raza_index + 1;
   END LOOP;
END;
$$ LANGUAGE 'plpgsql';
-------------------------------------------------------------
CREATE or replace FUNCTION newOpenAnswer(idPregunta integer,idFormulario integer,listaRespuestas varchar[]) RETURNS void AS $$
--funcion de prueba que funciona
DECLARE
   number_respuestas integer := array_length(listaRespuestas, 1);
   respuestas_index integer := 1;
BEGIN
   WHILE respuestas_index <= number_respuestas LOOP
	  INSERT INTO pregunta_abierta(id_pregunta, id_formulario, descripcion_respuesta) 
	  VALUES (idPregunta, idFormulario, listaRespuestas[respuestas_index]);
      respuestas_index = respuestas_index + 1;
   END LOOP;
END;
$$ LANGUAGE 'plpgsql';

--################################

CREATE or replace FUNCTION newClose_MultipleAnswer(listaRespuestas integer[],idPregunta integer,idFormulario integer) RETURNS void AS $$
--funcion de prueba que funciona
DECLARE
   number_respuestas integer := array_length(listaRespuestas, 1);
   respuestas_index integer := 1;
BEGIN
   WHILE respuestas_index <= number_respuestas LOOP
	  INSERT INTO pregunta_cerrada_multiple(id_respuesta,id_pregunta, id_formulario) 
	  VALUES (listaRespuestas[respuestas_index],idPregunta, idFormulario);
      respuestas_index = respuestas_index + 1;
   END LOOP;
END;
$$ LANGUAGE 'plpgsql';

---------------------------------

CREATE or replace FUNCTION asignarEstadoAPregunta(listaIdPregunta integer[],listaEstados integer[]) RETURNS void AS $$
--funcion de prueba que funciona
DECLARE
   cantidadIdPreguntas integer := array_length(listaIdPregunta, 1);
   cantidadEstados integer := array_length(listaEstados, 1);
   idPreguntaIndex integer := 1;
BEGIN
   WHILE idPreguntaIndex <= cantidadIdPreguntas LOOP
	  update pregunta set activo = coalesce(listaEstados[(idPreguntaIndex%cantidadEstados)],listaEstados[(idPreguntaIndex%cantidadEstados)+1]) 
	  	where id_pregunta = listaIdPregunta[idPreguntaIndex];
	  idPreguntaIndex = idPreguntaIndex + 1;
   END LOOP;
END;
$$ LANGUAGE 'plpgsql';
/*
################################################################
uso de la función de arriba: 
select asignarEstadoAPregunta(array[1,2,3,4],array[1]);--todos 1
select asignarEstadoAPregunta(array[1,2,3,4],array[0,1,1,1]); --todos 1 menos el registro 1
select * from pregunta;
################################################################
*/



