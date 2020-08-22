CREATE or replace FUNCTION insert_raza(pnombre varchar(30)) RETURNS void AS $$
BEGIN
  INSERT INTO prueba.raza(nombre) VALUES (pnombre);
END;
$$ LANGUAGE 'plpgsql';

CREATE or replace FUNCTION insert_perro(pnombre varchar(40), pid_raza integer) RETURNS void AS $$
BEGIN
  INSERT INTO prueba.perro(nombre, id_raza) VALUES (pnombre, pid_raza);
END;
$$ LANGUAGE 'plpgsql';

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