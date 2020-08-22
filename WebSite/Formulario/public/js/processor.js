var fs = require("fs");

function formBodyBuilder(listaPreguntas, listaRespuestas){
    //console.log(listaPreguntas);
    listaAsoc = [];
    listaPreguntas.forEach(pregunta => {
        temp = [pregunta];
        listaRespuestas.forEach( respuesta =>{
            if( pregunta['id'] == respuesta['idpregunta'] ){
                temp.push(respuesta);
            }
        });
        listaAsoc.push(temp);
    });
    return listaAsoc;
}

function displayProvincias(listaProvincias){
    listaResutado = [];
    listaProvincias.forEach(p => {
        listaResutado.push(p);
    });
    return listaResutado;
}

function displayCantones(listaCantones){
    listaResutado = [];
    listaCantones.forEach(p => {
        listaResutado.push(p);
    });
    return listaResutado;
}

function displayDistritos(listaDistritos){
    listaResultado = [];
    listaDistritos.forEach(p => {
        listaResultado.push(p);
    });
    return listaResultado;
}


/*Esta función recibe columnas directamente de una consulta de base de datos y las procesa
para formar una estructura de la siguiente forma:

[
    {
        labels: []//una lista con strings
        dataset: {
            label : //un string que es un título
            , datos: []//una lista de datos que corresponden al objeto "labels"
        }
    }//un objeto de la lista
    , ...//los demás objetos
]//una lista de objetos

 */
function groupDataForGraphs(lista_resultados){
    // console.log("LISTA RESULTADO", lista_resultados);
    var lista_preguntas = [];
    var pregunta = {};
    //la pregunta tiene un título y una lista de respuestas
    var lista_respuestas = [];
    var lista_valores = [];
    var respuesta = {};
    //contex data
    var noAsignation = true;
    var id_pregunta;
    for(var index=0; index<lista_resultados.length; index++){
        element = lista_resultados[index];
        if(noAsignation){
            respuesta.label = element.pregunta;
            lista_respuestas.push(element.respuesta);
            lista_valores.push(parseInt(element.conteo));
            id_pregunta = element.id_pregunta;
            noAsignation = false;
            //console.log(pregunta);
        }else{
            if(id_pregunta == element.id_pregunta){
                lista_respuestas.push(element.respuesta);
                lista_valores.push(parseInt(element.conteo));
            }else{
                /*PARTE DE ASIGNACIONES */
                pregunta.labels = lista_respuestas;
                respuesta.datos = lista_valores;
                pregunta.datasets = respuesta;
                lista_preguntas.push( pregunta );
                //limpiando objetos y listas
                pregunta = {};
                lista_respuestas = [];
                lista_valores = [];
                respuesta = {};
                //modificar bandera para que entre en el apartado de no asignación
                //restar 1 al index ayuda a que el alemento diferente sea el primero
                index--;
                noAsignation = true;
            }
        }
    }
    //console.log(lista_preguntas);
    return lista_preguntas;
}

function actualizarMapa(mapa, actualizador, campoID){
    var listaCaracteristicas = mapa.features;
    var newJ=0;
    for(var index=0; index<actualizador.length; index++){
        var fila = actualizador[index];
        //var newJ = index===0?0:index-1;
        /*Esta linea permite asignar un j que esté en un rango aceptable para aplicar el for
        en este sentido se desea recorrer la menor cantidad de propiedades para no hacer el programa lento */
        //var newJ = parseInt(index/81);
        for(var j=newJ; j<listaCaracteristicas.length;j++){
            var caracteristica = listaCaracteristicas[j];
            if(caracteristica.id > fila[campoID]){
                newJ = j-1;
                break;
            }else if (caracteristica.id === fila[campoID]){
                caracteristica.properties = fila.json_info;
            }else{
                continue;
            }
        }
    }
}

function obtenerCantones(actualizador){
    var path = "./json_source/map-cant-idResueltoOrdenado.json";
    var rawdataCanton = fs.readFileSync( path );
    let mapaCanton = JSON.parse(rawdataCanton);
    actualizarMapa(mapaCanton, actualizador, 'id_canton');
    return mapaCanton;
}

function obtenerDistritos(actualizador){
    var path = "./json_source/map-dist-idResueltoOrdenado.json";
    var rawdataDistrito = fs.readFileSync( path );
    let mapaDistrito = JSON.parse(rawdataDistrito);
    actualizarMapa(mapaDistrito, actualizador,'id_distrito');
    return mapaDistrito;
}

module.exports = {
    groupDataForGraphs,
    formBodyBuilder,
    displayProvincias,
    displayCantones,
    displayDistritos,
    obtenerCantones,
    obtenerDistritos
}