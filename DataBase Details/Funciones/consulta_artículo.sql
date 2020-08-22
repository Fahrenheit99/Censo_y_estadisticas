
select pcm.id_respuesta as respuesta,count(pcm.id_respuesta) as cantidad_res, --pcm.id_pregunta, pcm.id_formulario, 
d.id_distrito, d.nombre as nombreDistrito, count(d.id_distrito) cantidad_registros 
	from pregunta_cerrada_multiple as pcm
inner join formulario as f 
	on f.id_formulario = pcm.id_formulario
inner join distrito as d
	on d.id_distrito = f.id_distrito
where id_respuesta = any( SELECT a.n from generate_series(9, 32) as a(n) )
group by d.id_distrito, pcm.id_respuesta
order by d.id_distrito;

select pcm.id_respuesta, pcm.id_pregunta, pcm.id_formulario 
	from pregunta_cerrada_multiple as pcm 
join formulario as f on f.id_formulario = pcm.id_formulario
join distrito as d on d.id_distrito = f.id_distrito
where pcm.id_respuesta = any(array[31,32,33]) and d.id_distrito = d.id_distrito; 
