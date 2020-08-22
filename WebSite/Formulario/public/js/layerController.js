//################################################################################################################
/* FUNCIÓN DE KEVIN PARA ASIGNAR ID'S */

//Tenemos que hacer que coincidan los id distritos, para eso tenemos que buscar match (nombre, cant hab) 
//y ponerle id distrito de la base para generar un nuevo geojson. 

// Read Synchrously
var fs = require("fs");
//const { Console } = require('console');//no comprendo para lo que esto se usa

const dbConection = require('./conection');

const storeData = (data, path) => { //esto es para guardar el json en un archivo ya dicho
  try {
    //var text = 'var mapaJsonCant =' + JSON.stringify(data) + ';';
    var text = JSON.stringify(data);
    fs.writeFileSync(path, text);
  } catch (err) {
    console.error(err)
  }
}

const quitarAcentos = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
} 

var sortByProperty = function (property) {
  return function (x, y) {
      return ((x[property] === y[property]) ? 0 : ((x[property] > y[property]) ? 1 : -1));
  };
};

function asignador(mapa, sqlQuery, nombreCampoId, path){
  var consulta = dbConection.openQuery(sqlQuery);
  var listaCaracteristicas = mapa.features;

  consulta.then(listaRegistros=>{
    //console.log(listaRegistros);
    for(var index=0; index<listaRegistros.length; index++){
      var elementoLista = listaRegistros[index];

      var conteoIguales = 0;

      for(var indexj=0; indexj<listaCaracteristicas.length; indexj++){
        caracteristica = listaCaracteristicas[indexj];
  
        var propiedadesUbicacion = caracteristica.properties;
        var poblacionEnJson = parseInt(propiedadesUbicacion['población']);
        var poblacionEnBase = parseInt(elementoLista['cant_habitantes']);

        var nombreEnJson = propiedadesUbicacion['nombre'];
        var nombreEnBase = elementoLista['nombre'];
        console.log(poblacionEnBase, poblacionEnJson);
        var nombreEnBaseSinAcentos = quitarAcentos(nombreEnBase).replace(" ","");
        var nombreEnJsonSinAcentos = quitarAcentos(nombreEnJson).replace(" ","");
        if( (poblacionEnBase === poblacionEnJson) && (nombreEnBaseSinAcentos === nombreEnJsonSinAcentos) ){
          caracteristica['id'] = parseInt( elementoLista[nombreCampoId] );
          conteoIguales++;
        }

        if( (indexj+1 === listaCaracteristicas.length) && (conteoIguales===0) ){
          console.log("\t\t\tEn base: ", nombreEnBaseSinAcentos, "\tPoblacion: ", poblacionEnBase);
        }

      };//for2
      //console.log("Los iguales: ", conteoIguales);
      if(index+1 === listaRegistros.length){
        storeData(mapa,path);
        console.log("______________________________________________________________________FINAL:"+nombreCampoId+"______________________________________________________________________");
      }

    }//for1
  })
}


function asingnarIdaDistritos(){
  var rawdataDistrito = fs.readFileSync('../../json_source/map-dist.json');
  let mapaDistrito = JSON.parse(rawdataDistrito);

  console.log("\t\t\tDistritos");
  console.log("_______________________________________________________________________________________________________\n");
  //console.log("Verificacion de primer registro: ", mapaDistrito.features[0].properties);
  var sqlQuery = "select * from distrito order by id_distrito;"
  asignador(mapaDistrito, sqlQuery, "id_distrito", "../../json_source/map-dist-idResuelto.json");
  console.log("_______________________________________________________________________________________________________");
  console.log("_______________________________________________________________________________________________________");
}

function asingnarIdaCantones(){
  var rawdataCanton = fs.readFileSync( '../../json_source/map-cant.json' );
  let mapaCanton = JSON.parse(rawdataCanton);

  console.log("Cantones\n");
  console.log("_______________________________________________________________________________________________________");
  //console.log("Verificacion de primer registro: ", mapaCanton.features[0].properties);
  var sqlQuery = "select * from canton order by id_canton;"
  asignador(mapaCanton, sqlQuery, 'id_canton','../../json_source/map-cant-idResuelto.json');
  
  console.log("_______________________________________________________________________________________________________");
  console.log("_______________________________________________________________________________________________________");
}
/*
Funcion de ordamiento quicksort
*/

const defaultSortingAlgorithm = (a, b) => {
  if (a.id < b.id) {
    return -1;
  }
  if (a.id > b.id) {
    return 1;
  }
  return 0;
};

const quickSort = ( unsortedArray, sortingAlgorithm = defaultSortingAlgorithm) => {
  // immutable version
  const sortedArray = [...unsortedArray];

  const swapArrayElements = (arrayToSwap, i, j) => {
    const a = arrayToSwap[i];
    arrayToSwap[i] = arrayToSwap[j];
    arrayToSwap[j] = a;
};

const partition = (arrayToDivide, start, end) => {
  const pivot = arrayToDivide[end];
  let splitIndex = start;
  for (let j = start; j <= end - 1; j++) {
    const sortValue = sortingAlgorithm(arrayToDivide[j], pivot);
    if (sortValue === -1) {
      swapArrayElements(arrayToDivide, splitIndex, j);
      splitIndex++;
    }
  }
  swapArrayElements(arrayToDivide, splitIndex, end);
  return splitIndex;
};

  // Recursively sort sub-arrays.
const recursiveSort = (arraytoSort, start, end) => {
    // stop condition
  if (start < end) {
    const pivotPosition = partition(arraytoSort, start, end);
    recursiveSort(arraytoSort, start, pivotPosition - 1);
    recursiveSort(arraytoSort, pivotPosition + 1, end);
  }
};

  // Sort the entire array.
recursiveSort(sortedArray, 0, unsortedArray.length - 1);
  return sortedArray;
};

function ordenarUbicaciones(){
  var rawdataCanton = fs.readFileSync( './json_source/map-cant-idResuelto2.json' );
  let mapaCanton = JSON.parse(rawdataCanton);
  listaCaracteristicas = mapaCanton.features;
  var listaOrdenada = quickSort(listaCaracteristicas);
  mapaCanton.features = listaOrdenada;
  storeData(mapaCanton,'./json_source/map-cant-idResueltoOrdenado.json');
  //---------------------------------------------------------------------
  var rawdataDistrito = fs.readFileSync('./json_source/map-dist-idResuelto2.json');
  let mapaDistrito = JSON.parse(rawdataDistrito);
  listaCaracteristicas = mapaDistrito.features;
  var listaOrdenada = quickSort(listaCaracteristicas);
  mapaDistrito.features = listaOrdenada;
  storeData(mapaDistrito,'./json_source/map-dist-idResueltoOrdenado.json');
}

function arreglarPropiedades(mapa, path){
  var listaCaracteristicas = mapa.features;
  for(var indexj=0; indexj<listaCaracteristicas.length; indexj++){
    var caracteristica = listaCaracteristicas[indexj];
    caracteristica['id'] = parseInt( caracteristica.properties.id );
  };//for1
  storeData(mapa, path);  
}

function arreglarDistritos(){
  var rawdataDistrito = fs.readFileSync('../../json_source/map-dist-idResuelto.json');
  let mapaDistrito = JSON.parse(rawdataDistrito);
  console.log("\t\t\tDISTRITOS");
  arreglarPropiedades(mapaDistrito, "../../json_source/map-dist-idResuelto2.json");
}

function arreglarCantones(){
  var rawdataCanton = fs.readFileSync( '../../json_source/map-cant-idResuelto.json' );
  let mapaCanton = JSON.parse(rawdataCanton);
  console.log("\t\t\tCANTONES");
  arreglarPropiedades(mapaCanton, '../../json_source/map-cant-idResuelto2.json');
}


function unificadorDePoligonos(mapa, path){
    var listaCaracteristicas = mapa.features;
    var nuevaListaCaracteristicas = [];
    var caracteristicaTemporal = listaCaracteristicas[0];
    var coordenadasCaracteristicaTemporal = caracteristicaTemporal.geometry.coordinates;
    for(var index = 1; index<listaCaracteristicas.length; index++){
      var caracteristicaActual = listaCaracteristicas[index];
      if( (caracteristicaTemporal.id === caracteristicaActual.id) && (caracteristicaActual.nombre === caracteristicaTemporal.nombre) ){
        coordenadasCaracteristicaTemporal.push( caracteristicaActual.geometry.coordinates[0] );
      }else{
        nuevaListaCaracteristicas.push(caracteristicaTemporal);
        caracteristicaTemporal = caracteristicaActual;
        coordenadasCaracteristicaTemporal = caracteristicaTemporal.geometry.coordinates;
      }
    }
    mapa.features = nuevaListaCaracteristicas;
    storeData(mapa,path);
}


function emparejarMapas(){ //esto se corre primero
  asingnarIdaDistritos();
  asingnarIdaCantones();
}


function arreglarPropiedadesMapas(){
  arreglarCantones();
  arreglarDistritos();
}


function unificarPoligonosDistritos(){
  var path = "../../json_source/map-dist-Unificado.json";
  var rawdataDistrito = fs.readFileSync('../../json_source/map-dist-idResuelto2.json');
  let mapaDistrito = JSON.parse(rawdataDistrito);
  unificadorDePoligonos(mapaDistrito, path);
}

//emparejarMapas();
ordenarUbicaciones();///esto se corre segundo
//arreglarPropiedadesMapas();
//unificarPoligonosDistritos();