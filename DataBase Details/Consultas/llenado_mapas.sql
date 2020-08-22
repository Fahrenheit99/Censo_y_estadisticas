/* vista */
create or replace view formularios_x_distrito as
select d.id_distrito, count(d.id_distrito), d.nombre 
from formulario as f
join distrito as d
on f.id_distrito = d.id_distrito
group by d.id_distrito;
/* vista */
create or replace view formularios_x_canton as
select c.id_canton, count(c.id_canton), c.nombre
from formulario as f
join distrito as d on d.id_distrito = f.id_distrito
join canton as c on d.id_canton = c.id_canton
group by c.id_canton;
/*funciones para acceder a las vistas*/

CREATE OR REPLACE FUNCTION get_formulariosxdistrito() 
   RETURNS TABLE (
	  id integer,
	  cantFormularios bigint,
	  nombre varchar
) 
AS $$
BEGIN
   RETURN QUERY SELECT * FROM formularios_x_distrito;
END; 
$$ LANGUAGE 'plpgsql';
-----------------------------------------------------
CREATE OR REPLACE FUNCTION get_formulariosxcanton() 
   RETURNS TABLE (
	  id integer,
	  cantFormularios bigint,
	  nombre varchar
) 
AS $$
BEGIN
   RETURN QUERY SELECT * FROM formularios_x_canton;
END; 
$$ LANGUAGE 'plpgsql';
----------------------------------------------
select * from get_formulariosxdistrito() as t;
select * from get_formulariosxcanton() as t;
--select * from canton where nombre like '%Ji%';


