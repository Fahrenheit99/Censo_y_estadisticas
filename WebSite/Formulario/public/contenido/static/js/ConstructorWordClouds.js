function mapCreator(keys, values){
  var result = {};
  keys.forEach((key, i) => result[key] = values[i]);
  //console.log("Creador de mapas ",  result);
  return result;
}

function obtenerDimencionesDeseables(){
  var scrn = window.screen;
  var width = scrn.width * 0.91;
  var height = scrn.height * 0.55;
  return {
    width : width,
    height : height
  };
}

function actualizarWordCloud(data,nombrePadre,index){
  var dimenciones = obtenerDimencionesDeseables();
  var width = dimenciones.width;
  var height = dimenciones.height;

  var idContenedor = nombrePadre+index;

  var contenedor = $('#'+idContenedor);
  var objetoActualizador = contenedor.data('funcionActualizar');
  //console.log("El que actualiza: "); console.log(objetoActualizador);
  keys = data.labels;
  values = data.datasets.datos;
  var word_count = mapCreator(keys,values);
  var word_entries = d3.entries(word_count);
  objetoActualizador.update(word_entries,width,height);
}

function drawWordCloud(data,nombrePadre,index){
  var idContenedor = nombrePadre+index;
  var idBotonDescarga = "download"+"wordcloud"+index;
    /*common se usa para descartar ciertas palabras
    en este caso se deja vacía por motivos de prueba, pero se puede cambiar
    este detalle */
  //console.log("Datos recibidos: ",data);
  var keys,values = [];
  var word_count = {};//usa llave valor //falta hacer la asignación
  keys = data.labels;
  values = data.datasets.datos;
  word_count = mapCreator(keys,values);

  var svg_location = '#'+idContenedor;

  var dimenciones = obtenerDimencionesDeseables();
  var width = dimenciones.width;
  var height = dimenciones.height;

  var fill = d3.scale.category20();

  var word_entries = d3.entries(word_count);

  var xScale = d3.scale.linear()
     .domain([0, d3.max(word_entries, function(d) {
        return d.value;
      })
     ])
     .range([10,100]);

  d3.layout.cloud().size([width, height])
    .timeInterval(20)
    .words(word_entries)
    .fontSize(function(d) { return xScale(+d.value); })
    .text(function(d) { return d.key; })
    .rotate(function() { return parseInt( Math.random() * (50 - -50) + -50);})
    .font("Roboto")
    .on("end", draw)
    .start();

    var svg = d3.select(svg_location).append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("id", "mainSVG"+idContenedor);
    
    var svgDetailing = svg.append("g").attr("transform", "translate(" + [width >> 1, height >> 1] + ")")

  function draw(words) {

      // console.log("Palabritas: ", words);

      var palabras = svgDetailing.selectAll("text")
      .data(words,function(d) { return d.key; });

      // console.log("Despues del data: ", palabras);

      palabras.enter().append("text")
        .style("font-size", function(d) { return xScale(d.value) + "px"; })
        .style("font-family", "Roboto")
        .style("fill", function(d, i) { return fill(i); })
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.key; });
      
      palabras.exit().style('fill-opacity', 1e-6)
      .attr('font-size', 1)
      .remove();//remover palabras sin usar      

      // console.log("Despues del exit: ", palabras);
  }

  d3.select("#"+idBotonDescarga).on('click', function(){ //para agregar botón de descarga, solo así sirve
    var svgString = getSVGString(svg.node());
    svgString2Image( svgString, 2*width, 2*height, 'png', save );

    function save( dataBlob, filesize ){
      saveAs( dataBlob, data.datasets.label+'.png' );
    }
  });


  var contenedor= $("#"+idContenedor);
  contenedor.data("funcionActualizar",
  {
    update: function(words,width, height) {
      
      var xScale = d3.scale.linear()
      .domain([0, d3.max(words, function(d) {
        return d.value;
      })
    ])
    .range([10,100]);
 
    d3.layout.cloud().size([width, height]).timeInterval(20)
     .words(words)
     .fontSize(function(d) { return xScale(+d.value); })
     .text(function(d) { return d.key; })
     .rotate(function() { return parseInt( Math.random() * (50 - -50) + -50);})
     .font("Roboto")
     .on("end", draw)
     .start();
    }
  }
  );

  d3.layout.cloud().stop();
}


