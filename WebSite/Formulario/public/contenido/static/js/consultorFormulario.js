var idDistrito;
/*

<!-- <input type="hidden" class="form-control" id="<%=distrito%>" name="<%='distrito'%>" value="<%=distrito%>"> -->
*/
function modficarDistrito(id){
    idDistrito = id;
}

function getPreguntas(){
    $.get( "/API/formStructure" )
        .done(function( data ) {
            //data : { listaPreguntasRespuestas: listotal, distrito: idDistrito}
            iteradorPreguntas(data.listaPreguntasRespuestas);
            modficarDistrito(data.distrito); //puede que esta linea no sea necesaria
            
            llenarAnio();
            esconderPreguntasIniciales();
        })
        .fail(function() {
            alert( "Error de conexión, intente de nuevo" );
        });
}

/*
function obtenerDistritos(){
    $.get( "/API/DistritoGeter" )
        .done(function( data ) {
            //desplegar provincias            
            //llenarCuadroCanton(); //en constructor formulario
        })
        .fail(function() {
            alert( "Error de conexión, intente de nuevo" );
        });
}

function obtenerCantones(){
    $.get( "/API/CantonGeter" )
        .done(function( data ) {
            //desplegar provincias            
            //llenarCuadroCanton(); //en constructor formulario
        })
        .fail(function() {
            alert( "Error de conexión, intente de nuevo" );
        });
}


function obtenerProvincias(){
    $.get( "/API/ProvinciaGeter" )
        .done(function( data ) {
            //desplegar provincias            
            //llenarCuadroProvincias(); //en constructor formulario
        })
        .fail(function() {
            alert( "Error de conexión, intente de nuevo" );
        });
}
function crearCuadroUbicaciones(){
    //aquí se manda a armar las diferentes cosas, creo que lo mejor es ponerlo en el constructor
}
*/

$( document ).ready(function() {
    getPreguntas();
})