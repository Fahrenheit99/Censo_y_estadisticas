
var miniMapHandler = {};

function asignarPropiedadAMiniMapHandler(nombre, elemento){
    miniMapHandler[nombre] = elemento;
}

$.ajax({url: "/API/mapCant", 
        async: false, 
        success: function(result)
        {
            //console.log("Resultado JQUERY AJAX: ", result);
            asignarPropiedadAMiniMapHandler('mapaJsonCant', result);
        },
        error: function(err){
            console.log("Error: ", err);
        }
});

$.ajax({url: "/API/mapDist", 
        async: false, 
        success: function(result)
        {
            //console.log("Resultado JQUERY AJAX: ", result);
            asignarPropiedadAMiniMapHandler('mapaJsonDist', result);
        },
        error: function(err){
            console.log("Error: ", err);
        }
});

function mostrarMapa(){
    var mapa = document.getElementById("mapa")

    if (mapa.getAttribute("style") === 'display: none;') {
        mapa.setAttribute("style","display: ''");
    } else {   
        mapa.setAttribute("style","display: none;");
    }
}