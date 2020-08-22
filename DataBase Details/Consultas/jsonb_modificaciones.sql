/*
en este archivo vamos a agregar los espacios de información para las tablas de canton y distrito
*/
ALTER TABLE canton
  ADD json_info jsonb;
 
ALTER TABLE distrito
  ADD json_info jsonb;
  
select * from canton;
select * from distrito;
---------------------------------------------------------------
--SERÍA BUENO CORRER ESTAS FUNCIONES AL ACTUALIZAR LA BASE DE DATOS EN CUANTO A LAS ENFERMEDADES
--FUNCIONES QUE DEFINE EL JSONB DE CADA DISTRITO Y CANTON COMO: {nombre:"texto",poblacion:numero}
--ESTAS FUNCIONES SERÍA BUENO USARLAS AL ACTUALIZAR LA CANTIDAD DE HABITANTES DE UN CANTON O DISTRITO
--FUNCIONES QUE AGREGAN LA SIGUIENTE CARACTERÍSTICAS AL OBJECTO DE DISTRITO Y CANTON: enfermedades registradas en la base de datos
	--estas enfermedades son agregadas con un valor de 0 en caso de no existir y en caso de existir no se modifica el valor
	--CABE MENCIONAR QUE EL ID DE PREGUNTA 4 ESTÁ UN POCO ALAMBRADO PARA TRAER LAS ENFERMEDADES
create or replace function definirJsonParaDistritos()
returns void
as $$
declare
	filaTemporalDistrito record;
	filaTemporalEnfermedad record;
begin
for filaTemporalDistrito/*los distritos*/ in select * from distrito
	loop
		if ( filaTemporalDistrito.json_info is NULL ) then
			update distrito set json_info = 
				( (select concat('{"nombre":"',filaTemporalDistrito.nombre,'","poblacion":',filaTemporalDistrito.cant_habitantes,'}'))::jsonb )
				where distrito.id_distrito = filaTemporalDistrito.id_distrito;
		end if;
		for filaTemporalEnfermedad/*las enfermedades reportadas*/ in select * from getanswers(4)
			loop
				if (SELECT filaTemporalDistrito.json_info ? filaTemporalEnfermedad.descripcion) then
				
				else
					UPDATE distrito SET json_info = json_info || 
					( select concat('{"',filaTemporalEnfermedad.descripcion,'":',0,'}') )::jsonb
						where distrito.id_distrito = filaTemporalDistrito.id_distrito;
				end if;
			end loop;
	end loop;
end;
$$ LANGUAGE 'plpgsql';

select definirJsonParaDistritos();
select json_info from distrito;
--reset distrito
--update distrito set json_info = null where id_distrito > 0;
--------------------------------------FUNCIONES PARA LOS CANTONES---------------------------
create or replace function definirJsonParaCantones()
returns void
as $$
declare
	filaTemporalCanton record;
	filaTemporalEnfermedad record;
begin
for filaTemporalCanton/*los distritos*/ in select * from canton
	loop
		if ( filaTemporalCanton.json_info is NULL ) then
			update canton set json_info = 
				( (select concat('{"nombre":"',filaTemporalCanton.nombre,'","poblacion":',filaTemporalCanton.cant_habitantes,'}'))::jsonb )
				where canton.id_canton = filaTemporalCanton.id_canton;
		end if;
		for filaTemporalEnfermedad/*las enfermedades reportadas*/ in select * from getanswers(4)
			loop
				if (SELECT filaTemporalCanton.json_info ? filaTemporalEnfermedad.descripcion) then
				
				else
					UPDATE canton SET json_info = json_info || 
					( select concat('{"',filaTemporalEnfermedad.descripcion,'":',0,'}') )::jsonb
						where canton.id_canton = filaTemporalCanton.id_canton;
				end if;
			end loop;
	end loop;
end;
$$ LANGUAGE 'plpgsql';

--reset canton
--update canton set json_info = null where id_canton > 0;
select definirJsonParaCantones();
select json_info from canton;

-----------------------------------------FUNCION PARA MODIFICAR LOS ATRIBUTOS  DEL JSON B----------------------------------
/*
ESTA FUNCIÓN ESTÁ PENSADA PARA USARSE EN EL ENVÍO DEL FORMULARIO A LA BASE DE DATOS, ES DECIR
CUANDO SE INSERTE UN FORMULARIO SE ACTUALIZARÁ EL JSON B
TANTO DEL DISTRITO COMO DEL CANTON, SERÍA BUENO QUE RECIBA UNA LISTA DE ENFERMEDADES
*/

select * from distrito;
--update distrito set json_info = jsonb_set(json_info, '{nombre}', '"Prueba"') where id_distrito = 1;
--select json_info->'poblacion' from distrito where id_distrito = 1;
create or replace function actualizarJsonbConFormulario(id_distritop integer,VARIADIC listaEnfermedades integer[]  )
/*listaEnfermedades varchar[]*/
returns void
as $$
declare
nombreEnfermedad varchar;
nombreConcatenadoDireccion text[];
nombreConcatenadoAtributo varchar;
id_cantonVar integer;
id_enfermedad integer; --
begin
	foreach id_enfermedad in array listaEnfermedades loop
		
		select descripcion_respuesta into nombreEnfermedad from respuesta where id_respuesta = id_enfermedad;
		select concat('{',nombreEnfermedad,'}')::text[] into nombreConcatenadoDireccion;
		select concat('',nombreEnfermedad) into nombreConcatenadoAtributo;
	
		update distrito 
		set json_info = jsonb_set(json_info, nombreConcatenadoDireccion, 
								  ('' || ((json_info->nombreConcatenadoAtributo)::integer +1))::jsonb )
		where id_distrito = id_distritop;
			
		select id_canton from distrito into id_cantonVar
		where id_distrito = id_distritop;
			
		update canton 
		set json_info = jsonb_set(json_info, nombreConcatenadoDireccion, 
								  ('' || ((json_info->nombreConcatenadoAtributo)::integer +1))::jsonb ) 
		where id_canton = id_cantonVar;
	
	end loop;
end;
$$ LANGUAGE 'plpgsql';
-----HAY QUE VER SI ESTA FUNCIÓN SE MODIFICA PARA RECIBIR ID DE ENFERMEDADES


--------ACÁ SE VA A HACER UN TRIGGER QUE DISPARE LAS FUNCIONES PARA ACTUALIZAR LOS JSON_INFO DE LAS TRABLAS DE DISTRITO Y CANTON

CREATE OR REPLACE FUNCTION actualizarDistrito_Canton_json_info() RETURNS TRIGGER AS $$  
BEGIN  
 perform definirJsonParaDistritos();
 perform definirJsonParaCantones();
RETURN NEW;   
END;  
$$ LANGUAGE plpgsql;  

CREATE TRIGGER insercionEnEnfermedades AFTER INSERT ON respuesta  
FOR EACH ROW EXECUTE PROCEDURE actualizarDistrito_Canton_json_info();  

--insert into respuesta(id_respuesta, id_pregunta, descripcion_respuesta)
--values(83,4,'otro');
--select * from respuesta
--select * from distrito;
--select * from canton;

--select actualizarJsonbConFormulario(1,83);
--select * from canton;

/* --código para hacer inserts en las estadísticas del mapa
DO
$do$
declare
distrito integer;
enfermedad integer;
BEGIN 
   for i in 1..1000000 loop
select random_between(1,473) into distrito;
select random_between(9,32) into enfermedad;
perform  actualizarJsonbConFormulario(distrito, enfermedad);
commit;
end loop;
END
$do$;
*/

select json_info from canton;



