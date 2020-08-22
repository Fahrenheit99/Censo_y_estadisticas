CREATE FUNCTION viewtest() RETURNS SETOF RECORD AS $$
DECLARE
	sql text;
	r   record;
BEGIN
	
	sql := 'SELECT * FROM pregunta';
	
	FOR r IN EXECUTE sql LOOP
		RETURN NEXT r;
	END LOOP;
	RETURN;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION viewTest2() RETURNS SETOF pregunta AS $$
    SELECT * FROM pregunta;
$$ LANGUAGE SQL;


--select * from viewTest2() as t; --> este sirve
--select * from get_preguntas() as t; --> este es el bueno, el buenazo
--
select



