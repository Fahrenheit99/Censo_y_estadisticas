--al parecer este dice la cantidad de ocurrencias de una pregunta en las respuestas, e incluye las abiertas como otros
--se arregló solo para que tirara las de las enfermedades autoinmunes como otros
create or replace view respuestas_resgistradas as
select p.id_pregunta as idp ,p.nombre_pregunta as pregunta, r.id_respuesta as idr ,r.descripcion_respuesta as respuesta, ocurrencias 
from 
--empezando consulta anidada
	(select  pcm.id_respuesta as respuesta, count(pcm.id_respuesta) as ocurrencias
	from pregunta_cerrada_multiple as pcm
		group by pcm.id_respuesta
		order by pcm.id_respuesta) as cerradas
--termino de consulta anidada
join respuesta as r 
	on r.id_respuesta = respuesta
join pregunta as p
	on r.id_pregunta = p.id_pregunta--;
union
--consulta para catalogar las preguntas abiertas como "otros"
(select p.id_pregunta, p.nombre_pregunta, 0 ,'Otros' as respuesta,count(pregunta) as otros from
--sub consulta
	(select id_formulario as form, id_pregunta as pregunta
	from pregunta_abierta as pa
	group by id_formulario, id_pregunta
	order by id_pregunta) as preludio_abiertas
--fin de sub consulta 
join pregunta as p
 	on p.id_pregunta = pregunta
where p.id_pregunta = 4
group by p.id_pregunta);

--método para acceder a la vista

CREATE OR REPLACE FUNCTION get_respuestas_resgistradas() 
   RETURNS TABLE (
	  id_pregunta integer,
	  pregunta varchar,
	  id_respuesta integer,
	  respuesta varchar,
	  ocurrencias bigint
) 
AS $$
BEGIN
   RETURN QUERY SELECT * FROM respuestas_resgistradas
   order by idp;
END; 
$$ LANGUAGE 'plpgsql';


select * from get_respuestas_resgistradas() as t;

--conulta para ver las personas que reportaron tener más de 1 enfermedad autoinmune
create or replace view cantidad_de_enfermedades_reportadas as
select apar.id_formulario as formulario, apariciones
from (select id_formulario ,count(*) as apariciones from pregunta_cerrada_multiple as pcm
	where pcm.id_pregunta = 4
	group by id_formulario
	order by id_formulario) as apar;


--método para la consulta de la vista de enfermedades reportadas

CREATE OR REPLACE FUNCTION get_cantidad_de_enfermedades_reportadas() 
   RETURNS TABLE (
	   formulario integer,
	   apariciones bigint
) 
AS $$
BEGIN
   RETURN QUERY SELECT * FROM cantidad_de_enfermedades_reportadas;
END; 
$$ LANGUAGE 'plpgsql';
----------------------------------------------------------------------
select * from get_cantidad_de_enfermedades_reportadas() as t; 


/*
|----------------------------------------------------------------|
|Formulario --> id distrito --> id canton						 |
|respuestas_cerradas_multiples --> id_respuesta, id_formulario   |
|respuestas --> id respuestas, id pregunta, descripcion          |
|pregunta --> id_pregunta, descripcion 							 |
|________________________________________________________________|
sobre esta tabla se pueden aplicar consultas para saber los datos exactos y así poder colocar los filtros
preguntar por cada pregunta,distrito y cantón y hacer un count, hay que ver la manera de descartar la opción de "otros"
y agregarla en la base de datos para poder filtrar mejor
*/

create or replace view respuestas_registradas_x_ubicacion as
select f.id_formulario, pcm.id_pregunta, p.nombre_pregunta as pregunta,
r.id_respuesta, r.descripcion_respuesta as respuesta, d.id_distrito , d.nombre as distrito , c.id_canton, c.nombre as canton
-------------------------------------------------------------------------
from formulario as f 
join distrito as d
	on f.id_distrito = d.id_distrito
join canton as c
	on c.id_canton = d.id_canton
join pregunta_cerrada_multiple as pcm
	on pcm.id_formulario = f.id_formulario
join pregunta as p
	on pcm.id_pregunta = p.id_pregunta
join respuesta as r
	on r.id_respuesta = pcm.id_respuesta;
--order by id_distrito, id_formulario,id_pregunta;
select * from respuestas_registradas_x_ubicacion
order by id_distrito, id_formulario, id_pregunta;--compensar la falta de orden
------------------------FUNCIÓN DE CONSULTA
CREATE OR REPLACE FUNCTION get_respuestas_y_ubicacion() 
   RETURNS TABLE (
	   id_formulario integer,
	   id_pregunta integer,
	   pregunta varchar,
	   id_respuesta integer,
	   respuesta varchar,
	   id_distrito integer,
	   distrito varchar,
	   id_canton integer,
	   canton varchar
) 
AS $$
BEGIN
   RETURN QUERY select * from respuestas_registradas_x_ubicacion
						order by id_distrito, id_formulario, id_pregunta;--compensar la falta de orden
END; 
$$ LANGUAGE 'plpgsql';
---------------------USAGE-------------------
select * from get_respuestas_y_ubicacion() as t; 
--4 es el # de pregunta que representa la enfermedades
--hay que ver el rango en el que se mueven esas enfermedades 
--hay que ver que formularios tienen anclada esas enfermedades y consultarlos 


/*
consulta para ver las posibles respuestas a la pregunta de las enfermedades --> (no por el asunto del async-await)
crear consulta para saber los formularios asociados a una enfermedad y ver la relación
confeccionar el json
hacer la estructura para actualizar el json
*/

/*VISTA Y MÉTODOS PARA LOS GRÁFICOS Y LAS RELACIONES DE PREGUNTA-ITEM para las preguntas
unicas y multiples*/

create or replace view respuestas_registradas_resumen as
select f.id_formulario, pcm.id_pregunta, p.nombre_pregunta as pregunta,
r.id_respuesta, r.descripcion_respuesta as respuesta
--esta consulta va a permitir ver la relación entre las enfermedades y los demás items
-------------------------------------------------------------------------
from formulario as f 
join pregunta_cerrada_multiple as pcm
	on pcm.id_formulario = f.id_formulario
join pregunta as p
	on pcm.id_pregunta = p.id_pregunta
join respuesta as r
	on r.id_respuesta = pcm.id_respuesta;
------------------------FUNCIÓN DE CONSULTA
CREATE OR REPLACE FUNCTION get_respuestas_resumen() 
   RETURNS TABLE (
	   id_formulario integer,
	   id_pregunta integer,
	   pregunta varchar,
	   id_respuesta integer,
	   respuesta varchar
) 
AS $$
BEGIN
   RETURN QUERY select * from respuestas_registradas_resumen
						order by id_formulario, id_pregunta;--compensar la falta de orden
END; 
$$ LANGUAGE 'plpgsql';
---------------------USAGE-------------------
select * from get_respuestas_resumen() as t; 


--------------------------para obtener formualrios asociados a una respuesta------------------------
create or replace function get_formulariosAsociados(id_respuestap integer) returns 
table(
	id_respuesta integer,
	id_pregunta integer,
	id_formulario integer
)
as $$
begin
	return query select * from pregunta_cerrada_multiple as pcm
	where pcm.id_respuesta = coalesce(id_respuestap, pcm.id_respuesta)
	order by id_formulario;
end;
$$ LANGUAGE 'plpgsql';
------------------usage
select * from get_formulariosAsociados(33) as t;




----------PRUEBA------
select id_formulario, id_pregunta, pregunta, id_respuesta, respuesta
	from respuestas_registradas_resumen
	where id_respuesta != 33 and id_formulario in (select id_formulario from pregunta_cerrada_multiple where id_respuesta=33)
	and id_respuesta in (1,2)
	order by id_formulario, id_pregunta;--compensar la falta de orden
---with count--- AND JOIN-----PRUEBA
select rrr.id_formulario, rrr.id_pregunta, rrr.pregunta, rrr.id_respuesta, rrr.respuesta, counter.conteo from 
(select id_respuesta, count(id_respuesta) as conteo
	from respuestas_registradas_resumen
	where id_respuesta != 33/*este campo es dinámico*/ 
 			and id_formulario in 
 								(select id_formulario from pregunta_cerrada_multiple where id_respuesta=33)/*este campo es dinámico*/
	group by id_respuesta) as counter
join respuestas_registradas_resumen as rrr on
counter.id_respuesta = rrr.id_respuesta
order by rrr.id_respuesta;
/*-------------METODO QUE TRAE LA RELACIÓN DE UNA ENFERMEDAD CON LOS DEMÁS ITEMS
QUE SE CONSIDERAN RESPUESTAS UNICAS Y MPULTIPLES*/
CREATE OR REPLACE FUNCTION GET_RELATION( VARIADIC list integer[] /*list integer[]*/)
RETURNS TABLE(
	id_pregunta integer,
	pregunta varchar,
	id_respuesta integer,
	respuesta varchar,
	conteo bigint
)
AS $$
BEGIN
RETURN QUERY select p.id_pregunta, p.tituloestadistica as pregunta, 
r.id_respuesta, r.descripcion_respuesta as respuesta, counter.conteo from 
(select count(rrr.id_respuesta) as conteo, rrr.id_respuesta
	from respuestas_registradas_resumen as rrr
	where rrr.id_respuesta != ANY(list)  
 			and rrr.id_formulario in 
 					(select pcm.id_formulario from pregunta_cerrada_multiple as pcm where pcm.id_respuesta = ANY(list))
	group by rrr.id_respuesta) as counter
join respuesta as r on
r.id_respuesta = counter.id_respuesta
join pregunta as p on
r.id_pregunta = p.id_pregunta
order by r.id_respuesta;
END;
$$ LANGUAGE 'plpgsql';

----USAGE-----------
select * from get_relation(32)as t;--12 al parecer no tiene casos registrados
--32 --> 1 MASCULINO
--29 --> 1 FEMENINO
--23 --> 1 MASCULINO
select * from respuesta where id_pregunta = 4;
--9 al 32

select * from getanswers(4);

/*VISTA Y MÉTODOS PARA LOS GRÁFICOS Y LAS RELACIONES DE PREGUNTA-ITEM para las preguntas
abiertas*/

create or replace view respuestas_registradas_abiertas_resumen as
select f.id_formulario, pa.id_pregunta, p.tituloestadistica as tituloestadistica,
lower(pa.descripcion_respuesta) as respuesta
--esta consulta va a permitir ver la relación entre las enfermedades y los demás items
-------------------------------------------------------------------------
from formulario as f 
join pregunta_abierta as pa
	on pa.id_formulario = f.id_formulario
join pregunta as p
	on pa.id_pregunta = p.id_pregunta;

/*-------------METODO QUE TRAE LA RELACIÓN DE UNA ENFERMEDAD CON LOS DEMÁS ITEMS
QUE SE CONSIDERAN RESPUESTAS ABIERTAS*/
CREATE OR REPLACE FUNCTION GET_RELATION_ABIERTAS( VARIADIC list integer[] /*list integer[]*/)
RETURNS TABLE(
	id_pregunta integer,
	pregunta varchar,
	respuesta text,
	conteo bigint
)
AS $$
BEGIN
RETURN QUERY select pa.id_pregunta, pa.tituloestadistica,pa.respuesta,count(pa.respuesta) as conteo
	from respuestas_registradas_abiertas_resumen as pa
where id_formulario in (select pcm.id_formulario 
							from pregunta_cerrada_multiple as pcm 
						where pcm.id_respuesta = ANY(list))
group by pa.id_pregunta,pa.tituloestadistica,pa.respuesta
order by pa.id_pregunta;
END;
$$ LANGUAGE 'plpgsql';

--------------------------USAGE----------------------------
select * from GET_RELATION_ABIERTAS(19,12,31,32) as t;
--9 al 32
--31,32 --> 1951,2001
--12 --> 1954, ""









