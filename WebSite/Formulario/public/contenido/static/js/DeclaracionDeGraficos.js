function changePalete() {
    //console.log("Paletas: ", paletas);
    //console.log("Gráficos: ", graficosHechos);
    var paletteIndex = document.getElementById("graphPaletteStyle").value;
    for (chart in graficosHechos) {
        //console.log( "grafico: ", graficosHechos[chart] );
        var graph = graficosHechos[chart];
        graph.palette(paletas[parseInt(paletteIndex)]);
    }
}


function addButtonChange(id) {
    var buttonChangeID = 'change' + id;
    var buttonChange = document.getElementById(buttonChangeID);
    buttonChange.setAttribute("class", "btn btn-primary");
    //console.log( buttonChange );
    var barName = 'barDiv' + id;
    var pieName = 'pieDiv' + id;
    buttonChange.addEventListener('click', function () {
        var barElement = document.getElementById(barName);
        var pieElement = document.getElementById(pieName);
        // console.log(barName, barElement);
        //console.log(pieName, pieElement);
        //console.log(buttonChangeID);
        if ((pieElement.style.display === "") || (pieElement.style.display === 'none')) {
            barElement.style.display = 'none';
            pieElement.style.display = 'inline-block';
        } else {
            barElement.style.display = 'inline-block';
            pieElement.style.display = 'none';
        }
    });
}

function descargarGraficoDinamico(id,tipo) {
    var graficoDiv = tipo+'Div' + id;

        //console.log("Tipo: "+graficoDiv);

    var pieElement = document.getElementById(graficoDiv);
    var descargable;
    var nombreGrafico;
  
    if ((pieElement.style.display === "") || (pieElement.style.display === 'none')) {
        descargable = document.getElementById("bar"+id);
        nombreGrafico = "bar";
    } else {
        descargable = document.getElementById("pie"+id);
        nombreGrafico = "pie";
    }
    descargar(descargable,nombreGrafico);
}

function descargar(canvas, nombre){//recibe el canvas y los descarga en el navegador
    var link = document.createElement('a');
    link.download = nombre+'.png';
    link.href = canvas.toDataURL()
    link.click();
    link.remove();
}


function hacerGrafico(id, estructura, tipo) {
    var identificador = tipo+id;
    var canvasBar = $("#"+identificador);
    // var canvasBar = document.getElementBy(identificador);
    let segment;
    var identificadorGrafico = new Chart(canvasBar, {
        type: tipo,
        data: {
            labels: estructura.labels,
            datasets: [{
                label: estructura.datasets.label,
                data: estructura.datasets.datos
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },onHover: function (evt, elements) {
                if (elements && elements.length) {
                  segment = elements[0];
                  this.chart.update();
                  selectedIndex = segment["_index"];
                  segment._model.outerRadius += 20;
                } else {
                  if (segment) {
                    segment._model.outerRadius -= 20;
                  }
                  segment = null;
                }
              }
        }
    });
    canvasBar.data('grafico', identificadorGrafico);
    //console.log("Grafico hecho: ", identificadorGrafico);
}

function makeGraph(id, datos) {
    //función que declara los gráficos de barra y pie
    hacerGrafico(id, datos, "bar");
    hacerGrafico(id, datos, "pie");
    addButtonChange(id);
}

function addDataToGraph(chart, labels, data) {
    //console.log("*** INSERT *** ");
    //console.log("LABELS: ",chart.data.labels,"LARGO: ",chart.data.labels.length);
    var chartLabels = chart.data.labels;
    labels.forEach(element =>{
        chartLabels.push(element);
    });
    //console.log("LABELS 2: ",chart.data.labels,"LARGO: ",chart.data.labels.length);

    //console.log("DATASET: ",chart.data.datasets[0].data, "LARGO: ", chart.data.datasets[0].data.length);
    var values = chart.data.datasets[0].data;
    data.forEach(element => {
        values.push(element);
    });
    //console.log("DATASET2: ",chart.data.datasets[0].data, "LARGO: ", chart.data.datasets[0].data.length);
    chart.update();
}

function removeDataFromGraph(chart){
    var labels = chart.data.labels;
    while(labels.length > 0){
        chart.data.labels[(labels.length)-1] = null;
        chart.data.labels.pop();
    }
    var values = chart.data.datasets[0].data;
    while(values.length > 0){
        values[ values.length-1 ] = null;
        values.pop();
    }
    chart.update();//se actualiza cuando se insertan los datos
}

function updateGraph(index, estructura) {
    //console.log("Estructura: ", estructura);
    var nameBar = "bar"+index;
    var namePie = "pie"+index;
    var barGraph = $('#'+nameBar).data('grafico');
    var pieGraph = $('#'+namePie).data('grafico');
    var data = barGraph.config.data;
    //console.log("Datos obtenidos: ", data);
    removeDataFromGraph(barGraph); /*solo se quitan los datos del gráfico de barras
    por que la referencia al data set esla misma que la del de pie*/
    //removeDataFromGraph(pieGraph);
    addDataToGraph(barGraph,estructura.labels,estructura.datasets.datos);/*solo se agregan los datos del gráfico de barras
    por que la referencia al data set esla misma que la del de pie*/
    //addDataToGraph(pieGraph,estructura.labels,estructura.datasets.datos);
    pieGraph.update();
}



