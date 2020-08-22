/*

COPY provincia(id_provincia,nombre) 
FROM 'C:\provincias.csv' DELIMITER ';' CSV HEADER;

SELECT * FROM provincia
*/

/*
COPY canton(id_canton,id_provincia,nombre,cant_habitantes) 
FROM 'C:\cantones.csv' DELIMITER ';' CSV HEADER;


SELECT * FROM canton

*/

COPY distrito(id_distrito,id_canton,nombre,cant_habitantes) 
FROM 'C:\distritos.csv' DELIMITER ';' CSV HEADER;


SELECT * FROM distrito