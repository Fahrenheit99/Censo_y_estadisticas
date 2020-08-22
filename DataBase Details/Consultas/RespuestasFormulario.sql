--falta que agarre las preguntas abiertas
SELECT * FROM(
SELECT
   f.id_formulario as FormNum,
   ip_formulario as FormIP,
   nombre as Distrito,
   p.id_pregunta as NumPregunta,
   nombre_pregunta as Pregunta,
   r.descripcion_respuesta as Respuesta
   --coalesce(pa.descripcion_respuesta, r.descripcion_respuesta) as Respuesta
FROM
   formulario as f
JOIN distrito as d ON f.id_distrito = d.id_distrito
join pregunta_cerrada_multiple as pcm on f.id_formulario = pcm.id_formulario
join pregunta_abierta as pa on f.id_formulario = pa.id_formulario
join pregunta as p on p.id_pregunta = pcm.id_pregunta --or pa.id_pregunta = p.id_pregunta
join respuesta as r on r.id_respuesta = pcm.id_respuesta --or r.id_respuesta::char = pa.descripcion_respuesta  
--order by f.id_formulario, p.id_pregunta
) AS T1
UNION
SELECT * FROM(
SELECT
   f.id_formulario as FormNum,
   ip_formulario as FormIP,
   nombre as Distrito,
	p.id_pregunta as NumPregunta,
   nombre_pregunta as Pregunta,
   pa.descripcion_respuesta as Respuesta
   --pa.descripcion_respuesta as Respuesta_Abierta
   --pregunta con respuesta y respuesta_cerrada_multiple
   --falta el distrito
FROM
   formulario as f
JOIN distrito as d ON f.id_distrito = d.id_distrito
--join pregunta_cerrada_multiple as pcm on f.id_formulario = pcm.id_formulario
join pregunta_abierta as pa on f.id_formulario = pa.id_formulario
join pregunta as p on pa.id_pregunta = p.id_pregunta
--order by f.id_formulario, p.id_pregunta
) AS T2
order by formnum, numpregunta;
