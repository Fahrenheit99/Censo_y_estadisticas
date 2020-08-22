
const storeData = (data, path) => {
    try {
      //var text = 'var mapaJsonCant =' + JSON.stringify(data) + ';';
      var text = JSON.stringify(data);
      fs.writeFileSync(path, text);
    } catch (err) {
      console.error(err)
    }
  }

// Read Synchrously
var fs = require("fs");
//var x = require( "../../json_source/map-dist.geojson" );
console.log("\n *START* \n");
var rawdata = fs.readFileSync( "../../json_source/map-dist.geojson" );
let mapa = JSON.parse(rawdata);
//console.log("Output Content : \n"+ content);
console.log(mapa.features[0].properties);

mapa.features.forEach(function callback(currentValue, index, array) {
    currentValue.properties.Formularios = 0;
    //console.log(currentValue);
});

storeData(mapa,"../../json_source/map-dist.geojson");

console.log("\n *EXIT* \n");
