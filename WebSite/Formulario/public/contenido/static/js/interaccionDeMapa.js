   /*Para hacer el botón de cambio a 3d*/
   var mapdiv = document.getElementById('map');
   var button = document.createElement("div");
   button.setAttribute("id", "extrude");
   button.setAttribute("class", "mapboxgl-ctrl-group");
   button.innerHTML = "3D";
   mapdiv.appendChild(button);


   var _3d = document.getElementById('extrude');
   _3d.addEventListener('click', function() {
       var indiceActual = administradorFiltros.indiceFiltroActual;
       var indiceEspacioActual = administradorFiltros.indiceEspacioActual;
       var filtroActual = administradorFiltros.listaFiltros[indiceActual];
       var capaActual=undefined;
       var capaNueva = undefined;
       var nuevoIndice= (indiceEspacioActual+1)%2; //los indices solo pueden variar entre 0 y 1
       if(administradorFiltros.cantones){
           capaActual = map.getLayer(filtroActual.listaNombreCapasCantones[indiceEspacioActual]);
           capaNueva = map.getLayer( filtroActual.listaNombreCapasCantones[  nuevoIndice ]);
       }else{
           capaActual = map.getLayer(filtroActual.listaNombreCapasDistritos[indiceEspacioActual]);
           capaNueva = map.getLayer( filtroActual.listaNombreCapasDistritos[  nuevoIndice ]);
       }

       if( nuevoIndice === 1 ){
        _3d.className = 'mapboxgl-ctrl-group-active';
       }else{
        _3d.className = 'mapboxgl-ctrl-group';
       }

       map.setLayoutProperty(capaNueva.id, 'visibility', 'visible');
       map.setLayoutProperty(capaActual.id, 'visibility', 'none');
       administradorFiltros.indiceEspacioActual = nuevoIndice;
   });

   /*Para hacer el botón de cambio a distritos y cantones */
   
   var mapdiv = document.getElementById('map');
   var button = document.createElement("div");
   button.setAttribute("id", "change");
   button.setAttribute("class", "mapboxgl-ctrl-group");
   button.innerHTML = "Distrito";
   mapdiv.appendChild(button);

   var _distric = document.getElementById('change');
   _distric.addEventListener('click', function() {
       var indiceActual = administradorFiltros.indiceFiltroActual;
       var indiceEspacioActual = administradorFiltros.indiceEspacioActual;
       var filtroActual = administradorFiltros.listaFiltros[indiceActual];
       var capaActual=undefined;
       var capaNueva = undefined;
       if(administradorFiltros.cantones){
           capaActual = map.getLayer(filtroActual.listaNombreCapasCantones[indiceEspacioActual]);
           capaNueva = map.getLayer( filtroActual.listaNombreCapasDistritos[indiceEspacioActual]);
           _distric.className = 'mapboxgl-ctrl-group-active';
           administradorFiltros.cantones = false;
        }
        else{
           capaNueva = map.getLayer(filtroActual.listaNombreCapasCantones[indiceEspacioActual]);
           capaActual = map.getLayer( filtroActual.listaNombreCapasDistritos[indiceEspacioActual]);
           _distric.className = 'mapboxgl-ctrl-group';
           administradorFiltros.cantones = true;
        }

        map.setLayoutProperty(capaNueva.id, 'visibility', 'visible');
        map.setLayoutProperty(capaActual.id, 'visibility', 'none');
   });
   


   /*Query with Popup and tooltip example*/

var popup = new mapboxgl.Popup({
   closeButton: false,
   closeOnClick: false
 });
 
 function identifyFeatures(location, layer, fields) {
     //console.log("Nombre Capa: ", layer,"\n Campos: ",fields);
     var identifiedFeatures = map.queryRenderedFeatures(location.point, layer);
     //console.log("Identificadas: ",identifiedFeatures);
     popup.remove();
     if (identifiedFeatures != '') {
         var popupText = "";
         for (i = 0; i < fields.length; i++) {
             if(i === 0){
                var lista = fields[i];
                var texto = lista[0];
                var Corregido = texto[0].toUpperCase() +  texto.slice(1); 
                popupText += "<primerAtributo>" + Corregido + ": " + identifiedFeatures[0].properties[fields[i]]+"</primerAtributo> " + "<" + "br" + ">";
             }else{
                popupText += "<strong>" + fields[i] + ":</strong> " + identifiedFeatures[0].properties[fields[i]] + "<" + "br" + ">";
             }
            };
            popup.setLngLat(location.lngLat)
            .setHTML(popupText)
            .addTo(map);
   }
 }
 
 map.on('click', function(e) {
     var nombreCapaActual = administradorFiltros.obtenerNombreCapaActual();
     var atributosActuales = administradorFiltros.obtenerAtributosActuales();
     identifyFeatures(e, nombreCapaActual, atributosActuales);
 });
 /* //esto es un tooltip que es por movimiento de mouse y no por click
 map.on('mousemove', function(e) {
   identifyFeatures(e, 'cantonesColor', ["nombre", "poblacion"])
 });*/


var mapdiv = document.getElementById('map');
var button = document.createElement("a");
button.setAttribute("id", "toImage");
button.setAttribute("class", "export-to-image mapboxgl-ctrl-group");
button.setAttribute("href","");
button.setAttribute("download","map.png");
button.innerHTML = "";
var img = document.createElement("img");
img.setAttribute("src", "https://img.icons8.com/color/48/000000/download.png");
//"https://img.icons8.com/fluent/48/000000/download.png"
//<img src="https://img.icons8.com/color/48/000000/download.png"/>
button.appendChild(img);
mapdiv.appendChild(button);

var bottonImagen = document.getElementById('toImage');
bottonImagen.addEventListener('click', function() {
    var img = map.getCanvas().toDataURL('image/png');
    this.href = img;
});


function aplicarFiltro(indiceFiltro){
    var indiceActual = administradorFiltros.indiceFiltroActual;
    var indiceEspacioActual = administradorFiltros.indiceEspacioActual;
    var nuevoIndice = indiceFiltro;
    var nombreCapaActual = "";
    var nombreCapaNueva = "";
    var capaNueva = undefined;
    var capaActual = undefined;

    if( administradorFiltros.cantones ){
        nombreCapaActual = administradorFiltros.listaFiltros[indiceActual].listaNombreCapasCantones[indiceEspacioActual];
        nombreCapaNueva = administradorFiltros.listaFiltros[nuevoIndice].listaNombreCapasCantones[indiceEspacioActual];
    }else{
        nombreCapaActual = administradorFiltros.listaFiltros[indiceActual].listaNombreCapasDistritos[indiceEspacioActual];
        nombreCapaNueva = administradorFiltros.listaFiltros[nuevoIndice].listaNombreCapasDistritos[indiceEspacioActual];
    }
    capaActual = map.getLayer(nombreCapaActual);
    capaNueva = map.getLayer(nombreCapaNueva);
    map.setLayoutProperty(capaNueva.id, 'visibility', 'visible');
    map.setLayoutProperty(capaActual.id, 'visibility', 'none');
    administradorFiltros.indiceFiltroActual = nuevoIndice;
}

function existeFiltro(nombre){
    var listaFiltros = administradorFiltros.listaFiltros;
    for(var index=0; index<listaFiltros.length; index++){
        var elemento = listaFiltros[index]; 
        if(elemento.nombreFiltro === nombre){
            return index;
        }
    }
    return -1;
}


function confeccionarFiltro2d(nombre,detalle, recurso){
    var nuevoNombre = nombre +"_"+recurso + "_2d";
    var filtroPlantilla2d={
        'id': 'distritos_2d','source': 'distritos','type': 'fill',
        'layout': {'visibility': 'none'},
        'paint': {'fill-color': ['interpolate',['linear'],['get', 'poblacion'],
                    0,'#EAE212',
                    0.5,'#FF970C',
                    1,'#A71414'],
                'fill-opacity': 0.75}};
    filtroPlantilla2d.id = nuevoNombre;
    filtroPlantilla2d.source = recurso;
    filtroPlantilla2d.paint['fill-color'][2] = detalle;
    //console.log(filtroPlantilla2d);
    return filtroPlantilla2d;
}

function confeccionarFiltro3d(nombre, detalle, recurso){
    var filtroPlantilla3d = {
        'id': 'cantones_3d','type': 'fill-extrusion','source': 'cantones',
        'layout': {'visibility': 'none'},
        'paint': {'fill-extrusion-color': ['interpolate',['linear'],['get','poblacion'],
                0,'#EAE212',
                0.5,'#FF970C',
                1,'#A71414'
            ],
            'fill-extrusion-height': ['interpolate',['linear'],['get','poblacion'],
                0,2000,
                0.5,15000,
                1,30000
            ],
            'fill-extrusion-opacity': 1,
            'fill-extrusion-base': 0
        }
    };
    var nuevoNombre = nombre +"_"+recurso + "_3d";
    filtroPlantilla3d.id = nuevoNombre;
    filtroPlantilla3d.source = recurso;
    filtroPlantilla3d.paint['fill-extrusion-color'][2] = detalle;
    filtroPlantilla3d.paint['fill-extrusion-height'][2] = detalle;
    //console.log(filtroPlantilla3d);
    return filtroPlantilla3d;
}

function crearFiltros(nombre){
    var stringDividido = [];
    stringDividido = nombre.split("|");
    var filtroDetallePromedio = ["/"];
    var filtroDetalleSumatoria = ["+"];// es para realizar la capa del mapa conpuesta
    stringDividido.forEach(element => {
        filtroDetalleSumatoria.push(['get',element]);
    });
    filtroDetallePromedio.push(filtroDetalleSumatoria);
    filtroDetallePromedio.push(['get','poblacion']);
    var capa2dCantones = confeccionarFiltro2d(nombre,filtroDetallePromedio,'cantones');
    var capa3dCantones = confeccionarFiltro3d(nombre,filtroDetallePromedio,'cantones');
    var capa2dDistritos = confeccionarFiltro2d(nombre,filtroDetallePromedio,'distritos');
    var capa3dDistritos = confeccionarFiltro3d(nombre,filtroDetallePromedio,'distritos');
    //console.log(capa3dCantones, capa3dDistritos, capa2dCantones, capa2dDistritos);
    map.addLayer(capa2dCantones);
    map.addLayer(capa3dCantones);
    map.addLayer(capa2dDistritos);
    map.addLayer(capa3dDistritos);
    var nuevoFiltro = {
        nombreFiltro:nombre,
        listaNombreCapasDistritos : [capa2dDistritos.id, capa3dDistritos.id], //el index 0 siempre es el 2d
        listaNombreCapasCantones : [capa2dCantones.id, capa3dCantones.id] //el index o siempre es el 
    };
    administradorFiltros.listaFiltros.push(nuevoFiltro);
    aplicarFiltro(administradorFiltros.listaFiltros.length-1);
}

var filtrador = document.getElementById("getColInfo");
filtrador.addEventListener("click", function(){
    var nombreFiltro = "";
    var listaSeleccionados = $("input[name='filtroEnfermedad']:checked"); 
    if(listaSeleccionados.length ===0 ) return;
    for (var index=0; index<listaSeleccionados.length; index++){
        var elemento = listaSeleccionados[index];
        nombreFiltro = nombreFiltro+elemento.getAttribute("value");
        if(index+1 < listaSeleccionados.length){
            nombreFiltro = nombreFiltro + "|";
        }
    }
    var indiceFiltro = existeFiltro(nombreFiltro);
    if(administradorFiltros.indiceFiltroActual === indiceFiltro){
        return;
    }
    if(  indiceFiltro > -1){
        aplicarFiltro(indiceFiltro);
    }else{
        crearFiltros(nombreFiltro)
    }

    //console.log("Seleccionados: ", nombreFiltro);
});