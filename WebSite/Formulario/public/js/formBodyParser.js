//interpreta el req.body y hace la inserción correspondiente en las tablas de preguntas y respuestas

var dbConection = require('./conection');

//recibe el req.body del formulario y le da forma para la insersión en base de datos
function formBodyInsert(formBody, idForm){
    //console.log(idForm);
    var enfermdedadesSeleccionadas=[];
    try{
      //console.log("Cuerpo formulario: ", formBody);
      for (const name in formBody) {
        nameParts = name.split('|');
        namePartsLen = nameParts.length;
        var valor = formBody[name];
        idPregunta = nameParts[0];
        idRespuesta = nameParts[namePartsLen-1];
        if(namePartsLen == 1){ //abierta 
          //abierta --> nombre = (id_pregunta) : valor --> lista con valores o un valor solo 
          //console.log("En Body Parser abierta: ",idForm,idPregunta,valor);
          if(valor != "" && valor != "null" && valor != undefined) {
            dbConection.insertRespuestaAbierta(idForm,idPregunta,valor);
            //console.log("\t en el blanco");
          }
        }else if(namePartsLen == 2){ //unica 
          //única --> nombre = id_pregunta+'unica': valor --> id_respuesta
          //console.log("En Body Parser unica: ",idForm,idPregunta,valor);
          if(valor != "" && valor != "null" && valor != undefined) {
            dbConection.insertRespuestaCerradaMultiple(idForm,idPregunta,valor);
            // console.log("\t en el blanco");
          }
        }else if(namePartsLen == 3){ //multiple 
          //múltiple --> nombre = (id_pregunta + '|'+ respuesta_descripcion +'|'+id_respuestas) : valor {solo aparecen los que se marcaron}
          // console.log("En Body Parser multiple: ",idRespuesta,idPregunta,idForm);
          if(!isNaN( parseInt(idRespuesta) ) ){
            dbConection.insertRespuestaCerradaMultiple(idForm,idPregunta,idRespuesta);
            // console.log("\t en el blanco");
            if( parseInt(idPregunta) === 4  ){ //significa que ya se insertaron las enfermedades en base de datos
              enfermdedadesSeleccionadas.push( parseInt(idRespuesta) );
            }
            
          }
        }
        else{//bajo los requerimientos del proyecto original no debería entrar a este else
          console.log("Pasó algo raro");
        }
      }
      //console.log(enfermdedadesSeleccionadas);
      return enfermdedadesSeleccionadas; //retorna las enfermedades reportadas
    }catch(e){
      console.log("Error de envío en parser: ", e);
    }
}


module.exports = {
  formBodyInsert
}




