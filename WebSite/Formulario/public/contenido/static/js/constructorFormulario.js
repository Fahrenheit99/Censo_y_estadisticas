//guardar el id distrito

//crea la estructura inicial de una para una pregunta como el título y el cuadro
//y retorna la referencia al cuadro para seguir la estructura
function nuevoEsqueletoPregunta(pregunta,padreCuadroPregunta){

    var padrePregunta = document.createElement("div");
    padrePregunta.setAttribute("class", "col_one_third recuadroPregunta");
    padrePregunta.setAttribute("id", pregunta["id"]);

    var tituloPregunta = document.createElement("h3");
    tituloPregunta.setAttribute("class","tituloPregunta" );
    tituloPregunta.innerHTML = pregunta['nombre'] + ":";

    padrePregunta.appendChild(tituloPregunta);

    padreCuadroPregunta.appendChild(padrePregunta);

    return padrePregunta;
}

function crearDropDown(pregunta,opciones, container,textoTipo){
    var select = document.createElement("select");
    select.setAttribute("class","form-control-opcion");
    select.setAttribute("name",pregunta["id"]+"|",textoTipo);

    var opcion = document.createElement("option");
    opcion.setAttribute("value",null);
    opcion.innerHTML = "Seleccione una opción";

    container.appendChild(select);
    select.appendChild(opcion);

    opciones.forEach(function(respuesta,index){
        var opcion = document.createElement("option");
        opcion.setAttribute("value",respuesta["idrespuesta"]);
        opcion.innerHTML = respuesta["descripcion"];
        select.appendChild(opcion);
    })
}

function crearCheckBoxes(pregunta,opciones, container){
    var opcionOtros = [];//esto es para dar la opción de prepara el botón de otros para la respuestas
    //extensibles, este array se retorna y se puede descartar si no se ocupa
    var nombreMultiple, input, label;
    var idpregunta, respuestaDescripcion, idrespuesta;

    opciones.forEach(function(respuesta,index){
        idpregunta = pregunta["id"];
        respuestaDescripcion = respuesta["descripcion"];
        idrespuesta = respuesta["idrespuesta"];
        nombreMultiple = idpregunta+"|"+respuestaDescripcion+"|"+idrespuesta;
        
        input = document.createElement("input");
        input.setAttribute("type","checkbox");
        input.setAttribute("id",idrespuesta);
        input.setAttribute("name",nombreMultiple);
        input.setAttribute("value",respuestaDescripcion);

        label = document.createElement("label");
        label.setAttribute("for", respuestaDescripcion);
        label.innerHTML = respuestaDescripcion;

        var br = document.createElement("br");

        container.appendChild(input);
        container.appendChild(label);
        container.appendChild(br);        

        var respuestaMinuscula = respuestaDescripcion.toLowerCase(); 
        if(respuestaMinuscula  === "otro" || respuestaMinuscula  === "otros") opcionOtros.push(input);
    })
    var br = document.createElement("br");
    container.appendChild(br);    
    return opcionOtros;
}

function crearFecha(pregunta, container){
    var select = document.createElement("select");
    select.setAttribute("class","form-control-opcion");
    select.setAttribute("name",pregunta["id"]);
    select.setAttribute("id",pregunta["nombre"]);

    var opcion = document.createElement("option");
    opcion.setAttribute("value",null);
    opcion.innerHTML = "Seleccione una opción";

    container.appendChild(select);
    select.appendChild(opcion);
}

function crearInputUsuarioDinamicoEsqueleto(padreEsqueleto,pregunta){
    var container = document.createElement("div");
    container.setAttribute("class", "container");
    container.setAttribute("id", pregunta['id'] +"container");

    padreEsqueleto.appendChild(container);

    var row = document.createElement("div");
    row.setAttribute("class", "row");

    var col = document.createElement("div");
    col.setAttribute("class", "col-md-12");

    var dinamicFields = document.createElement("div");
    dinamicFields.setAttribute("data-role", "dynamic-fields");

    var divinline = document.createElement("div");
    divinline.setAttribute("class", "form-inline");

    container.appendChild(row);
    row.appendChild(col);
    col.appendChild(dinamicFields);
    dinamicFields.appendChild(divinline);

    var buttonAdd = document.createElement("button");
    buttonAdd.setAttribute("class", "btn btn-primary");
    buttonAdd.setAttribute("data-role", "add");
    var buttonAddSpan = document.createElement("button");
    buttonAddSpan.setAttribute("class","glyphicon glyphicon-plus symbol");
    //buttonAddSpan.setAttribute("class","symbol");
    //buttonAddSpan.innerHTML = "+";
    buttonAdd.appendChild(buttonAddSpan);

    var buttonDelete = document.createElement("button");
    buttonDelete.setAttribute("class", "btn btn-danger");
    buttonDelete.setAttribute("data-role", "remove");
    buttonDelete.setAttribute("style", "display:none;");
    var buttonDeleteSpan = document.createElement("button");
    buttonDeleteSpan.setAttribute("class","glyphicon glyphicon-remove symbol");
    //buttonDeleteSpan.setAttribute("class","symbol");
    //buttonDeleteSpan.innerHTML = "x";
    buttonDelete.appendChild(buttonDeleteSpan);

    divinline.appendChild(buttonAdd);
    divinline.appendChild(buttonDelete); 
    return divinline; //este será el nuevo padre del span dinámico del usuario
}

function crearInputUsuario(pregunta,nuevoPadre){
    var inputNombre = pregunta['id'] + '|' + 'input0';

    var div = document.createElement("div");
    div.setAttribute("class", "form-group marginLeft");

    var label = document.createElement("label");
    label.setAttribute("class","sr-only");
    label.setAttribute("for",pregunta["nombre"]);

    var input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("hint",pregunta["nombre"]);
    input.setAttribute("class", "form-control inputField");
    input.setAttribute("id", inputNombre);
    input.setAttribute("placeholder", "Respuesta");
    input.setAttribute("name", pregunta['id']);

    div.appendChild(label);
    div.appendChild(input);
    nuevoPadre.insertBefore(div, nuevoPadre.firstChild);
}

function inputDinamicoUsuario(pregunta, padreEsqueleto){
    var nuevoPadre = crearInputUsuarioDinamicoEsqueleto(padreEsqueleto,pregunta);
    crearInputUsuario(pregunta,nuevoPadre);
    return nuevoPadre; //para hacer la eliminación de dicho registro
}



function campoDinamico(inputNombre,pregunta,padreEsqueleto){
    //esta función es para agregar o remover los campos de texto cuando se realiza un click sobre 
    //una opción de otros
    //creo que se puede dividir más o ser más modular
    if(document.getElementById(inputNombre)){
        var campoDin = document.getElementById(inputNombre);
        campoDin.hidden = "true";
        padreEsqueleto.removeChild( campoDin );
        return;
    }

    inputDinamicoUsuario(pregunta, padreEsqueleto);
}

function asignarFuncionOtro(listaOpciones,pregunta, padreEsqueleto){
    //var inputNombre = pregunta['id'] + '|' + 'input0';
    listaOpciones.forEach( function(elemento, index){
        var inputNombre = pregunta['id'] + "container";
        elemento.addEventListener("click",function(){
            campoDinamico(inputNombre,pregunta,padreEsqueleto);
        });
    });
}

function confeccionarPregunta(pregunta, listaRespuestas, padrePregunta){
    var tipoPregunta = pregunta['tipo'];
    var textoTipo;
    if(tipoPregunta === 1){ //abierta
        inputDinamicoUsuario(pregunta, padrePregunta);
    }else if( tipoPregunta === 2){//única
        textoTipo = "unica";
        crearDropDown(pregunta,listaRespuestas, padrePregunta, textoTipo);
    }else if( tipoPregunta === 3){//múltiple
        crearCheckBoxes(pregunta,listaRespuestas, padrePregunta);
    }else if( tipoPregunta === 4){//fecha
        crearFecha(pregunta, padrePregunta);
    }else if( tipoPregunta === 5){//extensible (multiple con opción de respuesta personalizada)
        var listaOpcionOtros = crearCheckBoxes(pregunta,listaRespuestas, padrePregunta);
        asignarFuncionOtro(listaOpcionOtros,pregunta,padrePregunta);
    }
}

function agregarUltimosDetalles(padreCuadroPregunta){
    var input = document.createElement("input");
    input.setAttribute("type","hidden");
    input.setAttribute("id","inputCounter");
    input.setAttribute("value","1");

    var a = document.createElement("a");
    a.setAttribute("id","siguiente");
    a.setAttribute("class","next");
    a.setAttribute("onclick","esconderPreguntas()");
    a.innerHTML = "❯";

    var hr = document.createElement("hr");

    var div = document.createElement("div");
    div.setAttribute("class","col_one_third");
    div.setAttribute("style","margin-left: 47%;");

    var button = document.createElement("button");
    button.setAttribute("type","submit");
    button.setAttribute("id","enviar");
    button.setAttribute("class","btn btn-success");
    button.innerHTML = "Enviar";
    div.appendChild(button);

    padreCuadroPregunta.appendChild(input);
    padreCuadroPregunta.appendChild(a);
    padreCuadroPregunta.appendChild(hr);
    padreCuadroPregunta.appendChild(div);
}

//functión central para la inserción de las preguntas en el template
function iteradorPreguntas(listaPreguntasRespuestas){
    var padreCuadroPregunta = document.getElementById("formContainer");
    var padrePregunta;

    listaPreguntasRespuestas.forEach( function(collection, indexI){      
        var pregunta = collection.shift();
        padrePregunta = nuevoEsqueletoPregunta(pregunta,padreCuadroPregunta);
        confeccionarPregunta(pregunta, collection, padrePregunta);
    })//for each
    agregarUltimosDetalles(padreCuadroPregunta);
}//function