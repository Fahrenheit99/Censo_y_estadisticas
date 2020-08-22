/*Recibe un índice y un tipo de gráfico y crea la estructura necesaria para el funcionamiento
de las funciones que lo ocuparán */
function agregarGrafico(index, tipo, divPadre, bigContainer){
    var chartDiv= document.createElement("div");

    chartDiv.setAttribute("id",tipo+"Div"+index);
    chartDiv.setAttribute("class",tipo);

    divPadre.appendChild(chartDiv);
    bigContainer.appendChild(divPadre);
}

function agregarCanvas(index,tipo){
    var chartDiv = document.getElementById(tipo+"Div"+index);
    var chartCanvas= document.createElement("canvas");
    chartCanvas.setAttribute("id",tipo+index);
    chartDiv.appendChild(chartCanvas);
}

function agregarTitulo(divPadre,index,element){
    var titulo = document.createElement("h2");
    titulo.innerHTML  = element.datasets.label;
    titulo.setAttribute("class", "titleTex");
    titulo.setAttribute("id","titleTex"+index);
    divPadre.appendChild(titulo);
}

function agregarBotonesGrafico(index,divPadre,tipo){
    var changeDiv= document.createElement("div");
    var downloadDiv = document.createElement("div");

    changeDiv.setAttribute("id","change"+index);
    changeDiv.setAttribute("class","Changebutton");
    changeDiv.setAttribute("identifier",index);
    changeDiv.innerText = "Cambiar vista";

    downloadDiv.setAttribute("id","download"+tipo+index);
    downloadDiv.setAttribute("class","btn btn-primary margin");
    if(tipo !="wordcloud"){
        downloadDiv.setAttribute("onclick","descargarGraficoDinamico("+index+","+"'"+tipo+"'"+")");
        divPadre.appendChild(changeDiv);
    }

    downloadDiv.setAttribute("identifier",index);
    downloadDiv.innerText = "Descargar";
    divPadre.appendChild(downloadDiv);
}

//permite ver la cantidad de graficos creados que son numerales
//retorna el número de gráficos que hay mediante un elemento html que sirve como contador
//cada vez que se crea un gráfico este elemento se incrementa
//si el elemento no exite, lo crea con valor inicial 0 + el parámetro
function contadorDeGraficosNumerales(cantidad){
    var contador;
    var nuevaCantidad;
    if( document.getElementById("contadorDeGraficos") != null){
        //console.log("Si existe");
        contador = document.getElementById("contadorDeGraficos");

        var cantidadActual = parseInt( contador.getAttribute("cantidad") );
        nuevaCantidad = cantidadActual+parseInt(cantidad);
        if(cantidad > 0) contador.setAttribute("cantidad", nuevaCantidad);//si la cantidad es 0 es por que solo 
        //nos importa saber el valor actual
    }else{
        //onsole.log("No existe el contador");
        contador = document.createElement("div");
        nuevaCantidad = 0+ parseInt(cantidad);
        contador.setAttribute("cantidad", nuevaCantidad);
        contador.setAttribute("id","contadorDeGraficos");
        var body = document.getElementsByTagName("body");
        body[0].appendChild(contador);
    }
    return nuevaCantidad;
}


function makeAllGraphs(lista_preguntas){
    /*Esta función está hecha para que se generen los gráficos de pie y barra y 
    los elementos de desacarga de estos */
    var cantidadActual = contadorDeGraficosNumerales(0);
    for(var index=0; index<lista_preguntas.length; index++){
        var element = lista_preguntas[index];

        if( document.getElementById("bar"+cantidadActual) != null){ //el gráfico ya existe, solo requiere actualización
            updateGraph(cantidadActual, element);
        }else{//el gráfico no existe
            var bigGraphContainer = document.getElementById("graficosNumerales");
            var divPadre = document.createElement("div");
            divPadre.setAttribute("class", "divPadre");
            agregarGrafico(cantidadActual, "bar",divPadre,bigGraphContainer);
            agregarCanvas(cantidadActual,"bar");

            agregarGrafico(cantidadActual, "pie",divPadre,bigGraphContainer);
            agregarCanvas(cantidadActual,"pie");

            agregarBotonesGrafico(cantidadActual,divPadre,"pie");
            makeGraph(cantidadActual,element);
            cantidadActual = contadorDeGraficosNumerales(1);
        }
    }
}

//esto es para hacer los gráficos de fechas
//esto se puede corregir manejando los datos de fechas de manera más eficiente 
//y realizando cambios en el manejo de estos datos a nivel de base de datos
//esta función puede cambiar en versiones posteriores
function cambiarAnnosAEdad(elemento){
    var lista_datos = elemento.labels;
    for(var i=0; i<lista_datos.length;i++){
        var anno = lista_datos[i];
        var edad;
        if(anno === ""){
            edad = "N/A";
        }
        else{
            edad = new Date().getFullYear() - parseInt(anno);
        }
        lista_datos[i] = edad;
    }
    //console.log(elemento);
}



function makeWordClouds(lista_preguntas){
    var bigGraphContainer = document.getElementById("graficosNoNumerales");
    for(var index=0; index<lista_preguntas.length; index++){
        var element = lista_preguntas[index];

        if(index === 0){
            //console.log("Aquí se esperan graficos de fechas");
            cambiarAnnosAEdad(element);
            makeAllGraphs([element]);
            continue;
        }

        if( document.getElementById("wordcloudDiv"+index) != null){ //el gráfico ya existe, solo requiere actualización
            //este trozo de código es debido a un 
            //bug que se presenta en los word cloud
            //en el cual se traslapan las palabras que 
            //ya existen en el nuevo data
            //si hay un cambio de tamaño pero no de posición
            //por eso las eliminaremos con un string vacío y las
            //volvemos a poner con el data real
            var elementoSennuelo= {
                labels:[],
                datasets:{
                    label:[],
                    datos:[]
                }
            };
            actualizarWordCloud(elementoSennuelo,"wordcloudDiv",index);
            actualizarWordCloud(element,"wordcloudDiv",index);
        }else{//el gráfico no existe
            var divPadre = document.createElement("div");
            divPadre.setAttribute("class", "divPadre");
            agregarTitulo(divPadre,index,element);
            agregarGrafico(index, "wordcloud",divPadre,bigGraphContainer);//hay que ver que el programa agregue un tipo de dato diferente
            agregarBotonesGrafico(index,divPadre,"wordcloud");
            //console.log("Elemento a enviar: ", element);
            drawWordCloud(element,"wordcloudDiv",index);
        }
    }
}

$( document ).ready(function() {
    //console.log("Listo");
        $("#getColInfo").click(function(){
        //console.log("Esto llega");
        //obtener los valores selecionados por el usuario
        var enfermedades = [];
        $.each($("input[name='filtroEnfermedad']:checked"), function(){
            enfermedades.push($(this).attr("id"));
        });
        if(enfermedades.length ===0) return;
        //console.log(enfermedades);
        //realizar la consulta al servidor de node js para obtener la información de los gráficos
        $.get( "/API/chartsData", { lista:enfermedades } )
            .done(function( data ) {
                makeAllGraphs(data);
                //createStyleButtons(); //este está comentado por que la paleta de colores no se ha implementado
            })
            .fail(function() {
                alert( "Error de conexión, intente de nuevo" );
            });

        //realizar la consulta al servidor de node js para obtener la información de las nubes de palabras
        $.get( "/API/wordCloudData", { lista:enfermedades } )
            .done(function( data ) {
                makeWordClouds(data);
            })
            .fail(function() {
                alert( "Error de conexión, intente de nuevo" );
            });

    }); 
})

function mostrarGraficos(){
    var graficos = document.getElementById("multipleGraphContainer")

    if (graficos.getAttribute("style") === 'display: none;') {
        graficos.setAttribute("style","display: ''");
    } else {   
        graficos.setAttribute("style","display: none;");
    }
}
