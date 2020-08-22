function llenarAnio() {
    var select = document.getElementById("Año de Nacimiento");
    var fecha = new Date();
    var anio = fecha.getFullYear();
    for (let index = 1950; index <= anio; index++) {
        var option = document.createElement("option");
        option.text = index;
        select.add(option);
    }
}

function esconderPreguntasIniciales() {
    var preguntas = document.getElementsByClassName("recuadroPregunta");
    document.getElementById("enviar").hidden = true;
    for (let index = 1; index < preguntas.length; index++) {
        preguntas.item(index).hidden = true;
    }
}

function esconderPreguntas() {
    var preguntas = document.getElementsByClassName("recuadroPregunta");
    var idPregunta = null;
    var lenPreguntas = preguntas.length - 1;
    for (let index = 0; index <= lenPreguntas; index++) {
        if (preguntas.item(index).hidden == false) {
            idPregunta = index;
            preguntas.item(index).hidden = true;
        }
    }
    if (idPregunta + 1 == lenPreguntas) {
        document.getElementById("enviar").hidden = false;
        document.getElementById("siguiente").hidden = true;
    }
    preguntas.item(idPregunta + 1).hidden = false;
}

function preguntaAnterior() {
    var preguntas = document.getElementsByClassName("recuadroPregunta");
    var idPregunta = null;
    var lenPreguntas = preguntas.length - 1;
    for (let index = 0; index <= lenPreguntas; index++) {
        if (preguntas.item(index).hidden == false) {
            idPregunta = index;
            if (idPregunta == 0) {
                location.href = "javascript:history.go(-1)";
            } else {
                preguntas.item(index).hidden = true;

                preguntas.item(idPregunta - 1).hidden = false;
                if (document.getElementById("siguiente").hidden == true) {
                    document.getElementById("siguiente").hidden = false
                    document.getElementById("enviar").hidden = true;
                }
            }
        }
    }
}