--select newQuestion();
--select newQuestion(2,'SEXO');
--select newQuestion(2,'Fecha de Nacimiento');
--select * from tipo_pregunta;
--select getQuestionType(1);
--select newQuestionType('Abierta');
--select newQuestionType('Unica');
--select newQuestionType('Multiple');
--select * from tipo_pregunta order by id_tipo_pregunta;
--update tipo_pregunta set nombre_tipo = 'Unica' where id_tipo_pregunta=2;
--select get_preguntas();

--select newMultipleRaces( Array['P1', 'P2', 'Mastil', 'Ñonga'] );
--select * from prueba.raza;

--insert into provincia(nombre) values('San Jose');
--select * from provincia;
--insert into canton(id_provincia, nombre) values (1, 'changos');
--select * from canton;
--insert into distrito(id_canton, nombre) values (1, 'manolo');
--select * from distrito;

--select newFormulario('192.56.78.0', 1);
--select * from formulario;

--select * from tipo_pregunta;

--select newQuestion(3, 'Colores preferidos'); --id es 3

--select * from pregunta;


select newopenanswer(3, 1, Array['rojo','verde', 'blanco','azul']);

/*
newclose_multipleanswer --> lista, idPregunta, idFormulario
newopenanswer --> idPregunta, idFormulario, lista
*/


select * from pregunta;
delete from pregunta where id_pregunta = 2;
select * from pregunta_abierta;
select * from pregunta_cerrada_multiple;
select * from formulario;
select * from pregunta;
select * from respuesta;
--delte all
delete from pregunta_abierta where id_formulario > 0;
delete from pregunta_cerrada_multiple where id_formulario > 0;
delete from formulario where id_formulario > 0;
delete from respuesta where id_respuesta > 0;
delete from pregunta where id_pregunta > 0;
--25,2
select newclose_multipleanswer(Array[1],1,25);
--delete from pregunta_abierta where true;










