/*
--para generación de formularios ficticios aleatorios

--1 a 81, para saber cuantos cantones hay 
select * from canton; 
-- a al 473
select * from distrito;
--para saber que distritos calzan con un canton, pero van del 1 al 473
select c.id_canton,min(d.id_distrito) as Minimo, max(d.id_distrito) as Maximo  
from distrito as d
join canton as c
on d.id_canton = c.id_canton
group by c.id_canton
order by c.id_canton;
*/
--función para generar número random
CREATE OR REPLACE FUNCTION random_between(low INT ,high INT) 
   RETURNS INT AS
$$
BEGIN
   RETURN floor(random()* (high-low + 1) + low);
END;
$$ language 'plpgsql' STRICT;
--SELECT random_between(1,100);

--función para generar formularios random
create or replace function generate_forms(cantidad int)
returns void as 
$$
DECLARE
   counter INTEGER := 0 ;
   randNum int :=0;
begin
	LOOP 
      EXIT WHEN counter = cantidad ; 
      counter := counter + 1 ; 
      select newformulario('prueba', (select random_between(1,473)) ) INTO randNum;
   END LOOP ; 
   
end;
$$ language 'plpgsql';

--verificar
select generate_forms(12);
select * from formulario;







