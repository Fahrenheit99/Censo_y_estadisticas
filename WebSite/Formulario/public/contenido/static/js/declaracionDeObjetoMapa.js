var administradorFiltros={
    listaFiltros : [], //lista con objetos filtro,
    indiceFiltroActual : 0, //hace referencia al indice en la lista de filtros
    cantones : true, //simempre en cantones
    indiceEspacioActual: 0, //siempre el 0, por que son los cantones 2d, hace referencia al indice en las sublistas de filtros
    obtenerNombreCapaActual: function(){
        if(this.cantones){
            return this.listaFiltros[this.indiceFiltroActual].listaNombreCapasCantones[this.indiceEspacioActual];
        }else{
            return this.listaFiltros[this.indiceFiltroActual].listaNombreCapasDistritos[this.indiceEspacioActual];
        }
    },
    obtenerNombreFiltroActual: function(){
        return this.listaFiltros[this.indiceFiltroActual].nombreFiltro;
    },
    obtenerAtributosActuales: function(){
        var nombreActual = this.obtenerNombreFiltroActual();
        var stringDividido = [];
        var stringDividido = nombreActual.split('|');
        var filtroDetalle = [['nombre']];// es para realizar la capa del mapa conpuesta
        stringDividido.forEach(element => {
            filtroDetalle.push([element]);
        });
        //console.log(filtroDetalle);
        return filtroDetalle;        
    }
}

/*esta es la estructura del administrador de filtros y de los sub objetos que posee
var administradorFiltros={
    listaFiltros = [], //lista con objetos filtro,
    indiceActual = 0,
    cantones = true;
}

var filtro = {
    nombreFiltro:"",
    listaNombreCapasDistritos = [], //el index 0 siempre es el 2d
    listaNombreCapasCantones = [] //el index o siempre es el 
}
*/
//console.log("Mapita: ",miniMapHandler);

mapboxgl.accessToken = 'pk.eyJ1IjoiZGVwdGdlbmVybyIsImEiOiJjazJ3M3pqZHAwYzE3M2JxZDF2ZWpsbDNkIn0.kw69zytQseuTLPRZZ8Z2nQ';

    var map = new mapboxgl.Map({
        container: 'map',
        //style: 'mapbox://styles/mapbox/dark-v10',
        style: {
            "version": 8,
            "name": "blank",
            "sources": {
              "openmaptiles": {
                "type": "vector",
                "url": ""
              }
            },
            "layers": [{
              "id": "background",
              "type": "background",
              "paint": {
                "background-color": "#1d1f20"
              }
            }]
          },
        center: [-84.439487, 8.962330],
        preserveDrawingBuffer: true,
        zoom: 7
    });
 

    map.on('load', function() {
        
        map.addSource('cantones', {
            'type': 'geojson',
            'data': miniMapHandler.mapaJsonCant
        });

        map.addSource('distritos', {
            'type': 'geojson',
            'data': miniMapHandler.mapaJsonDist
        });


        map.addControl(new mapboxgl.NavigationControl());
        map.addControl(new mapboxgl.FullscreenControl());

        map.addLayer({ //este está para hacer la opción de 3D
            'id': 'cantones_2d',
            'source': 'cantones',
            'type': 'fill',
            'layout': {
                'visibility': 'visible'
            },
            'paint': {
                'fill-color': [
                        'interpolate',
                        ['linear'],
                        ['get', 'poblacion'],
                        5512,'#EAE212',
                        53107,'#FF970C',
                        288054,'#A71414'
                    ],
                    'fill-opacity': 0.75
            }
        });

        map.addLayer({ //este está para hacer la opción de 3D para distritos
            'id': 'distritos_2d',
            'source': 'distritos',
            'type': 'fill',
            'layout': {
                'visibility': 'none'
            },
            'paint': {
                'fill-color': [
                        'interpolate',
                        ['linear'],
                        ['get', 'poblacion'],
                        0,'#EAE212',
                        9094,'#FF970C',
                        71384,'#A71414'
                    ],
                    'fill-opacity': 0.75
            }
        });

        
        map.addLayer({
            'id': 'cantones_3d',
            'type': 'fill-extrusion',
            'source': 'cantones',
            'layout': {
                'visibility': 'none'
            },
            'paint': {
                'fill-extrusion-color': [
                    'interpolate',
                    ['linear'],
                    ['get','poblacion'],
                    5512,'#EAE212',
                    53107,'#FF970C',
                    288054,'#A71414'
                        /* 
                        5512,'#EAE212',
                        53107,'#FF970C',
                        288054,'#A71414'
                        */
                ],
                'fill-extrusion-height': [
                    'interpolate',
                    ['linear'],
                    ['get','poblacion'],
                    5512,2000,
                    53107,15000,
                    288054,30000
                    
                ],
                'fill-extrusion-opacity': 1,
                'fill-extrusion-base': 0
            }
        });

        map.addLayer({
            'id': 'distritos_3d',
            'type': 'fill-extrusion',
            'source': 'distritos',
            'layout': {
                'visibility': 'none'
            },
            'paint': {
                'fill-extrusion-color': [
                    'interpolate',
                    ['linear'],
                    ['get','poblacion'],
                    0,'#EAE212',
                    9094,'#FF970C',
                    71384,'#A71414'
                        /*
                        0,'#EAE212',
                        9094,'#FF970C',
                        71384,'#A71414'
                        */
                    
                ],
                'fill-extrusion-height': [
                    'interpolate',
                    ['linear'],
                    ['get','poblacion'],
                    0,2000,
                    9094, 15000,
                    71384,30000, 
                ],
                'fill-extrusion-opacity': 1,
                'fill-extrusion-base': 0
            }
        });

        /*Aquí se agregan las diferentes capas a las listas*/
        var filtro = {
            nombreFiltro:'poblacion',
            listaNombreCapasDistritos: ['distritos_2d', 'distritos_3d'], //el index 0 siempre es el 2d
            listaNombreCapasCantones: ['cantones_2d', 'cantones_3d'] //el index o siempre es el 
        }
        administradorFiltros.listaFiltros.push(filtro);
    });

