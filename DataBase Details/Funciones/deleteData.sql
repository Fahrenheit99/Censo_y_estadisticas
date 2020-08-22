delete from pregunta_abierta where id_formulario > 0;
delete from pregunta_cerrada_multiple where id_formulario > 0;
delete from formulario where id_formulario > 0;
delete from respuesta where id_respuesta > 0;
delete from pregunta where id_pregunta > 0;
delete from tipo_pregunta where id_tipo_pregunta > 0;

select * from tipo_pregunta;
select * from pregunta_abierta;
select * from pregunta_cerrada_multiple;
select * from formulario;
select * from respuesta;
select * from pregunta;