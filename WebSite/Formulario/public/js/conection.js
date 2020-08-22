//Errors with postgresql: C:\Users\%USERNAME%\AppData\Roaming\pgAdmin
//conection with postgresql
const {Pool} = require('pg');


// const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     password: 'Jafo1997',
//     database: 'Uned'
// });


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    password: 'ProyectoGJK90',
    database: 'postgres'
});
///credenciales de la uned acá bajo

/*
const pool = new Pool({
    user: 'developer',
    host: 'localhost',
    password: 'liit.liit',
    database: 'developer'
});
*/


function stringDeAyuda(lista,stringAdicional){
    /*Esta funciÃ³n pretende hacer que todos los elementos de una lista queden representados mediante un string
    que separa cada elemento con una coma 
    ademÃ¡s tiene una opciÃ³n para concatenar valores extra para las entradas que son texto
    y requiere de comillas simples*/
    var stringAyuda = "";
    for(var index=0; index<lista.length;index++){
        stringAyuda = stringAyuda+stringAdicional+lista[index]+stringAdicional;
        if(index+1 < lista.length){
            stringAyuda = stringAyuda+",";
        }
    }
    return stringAyuda;
}


module.exports = {
    async get_preguntas() {
        let resultados = await pool.query(`select * from get_preguntas() as t;`);
        return resultados;
    },
    async get_relation(lista_enfermedades) { //para grÃ¡ficos
        //console.log(lista_enfermedades);
        var stringAyuda=stringDeAyuda(lista_enfermedades,"");//funciÃ³n especificada arriba
        try{
            let resultados = await pool.query(`select * from get_relation(`+stringAyuda+`) as t; `);
            return resultados;
        }catch(e){
            console.log("Error en conection: ", e);
        }
    },   
    async get_relation_abiertas(lista_enfermedades) { //para grÃ¡ficos
        //console.log(lista_enfermedades);
        var stringAyuda=stringDeAyuda(lista_enfermedades,"");//funciÃ³n especificada arriba
        try{
            let resultados = await pool.query(`select * from get_relation_abiertas(`+stringAyuda+`) as t; `);
            return resultados;
        }catch(e){
            console.log("Error en conection: ", e);
        }
    },  
    async get_cantidad_de_enfermedades_reportadas() { //para grÃ¡ficos puede que no se necesite
        let resultados = await pool.query(`select * from get_cantidad_de_enfermedades_reportadas() as t; `);
        //console.log(resultados.rows);
        return resultados;
    },
    async get_respuestas(id_pregunta) {
        let resultados = await pool.query(`select * from getanswers($1) as t order by idrespuesta;`, [id_pregunta]);
        return resultados;
    },
    async get_formulariosAsociados(id_respuesta) {
        let resultados = await pool.query(`select * from get_formulariosAsociados($1) as t;`, [id_respuesta]);
        return resultados;
    },
    async get_provincias() {
        let resultados = await pool.query('select * from getProvincias() as t;');
        return resultados;
    },
    async get_cantones(idProvincia) {
        let resultados = await pool.query('select * from getCanton($1) as t;', [idProvincia]);
        return resultados;
    },
    async get_distritos(idCanton) {
        let resultados = await pool.query("select * from getDistrito($1) as t;", [idCanton]);
        return resultados;
    },
    async insert_formulario(ip, id_distrito) {
        try{
            let idForm = await pool.query("select newFormulario($1,$2);", [ip, id_distrito]);
            //console.log("Id Formulario ",idForm.rows);
            return idForm;
        }catch(error){
            console.log("OcurriÃ³ un error: \nDescripciÃ³n: ", error);
        }
    },
    async actualizarJsonbConFormulario(idDistrito, listaRespuestas) { //para grÃ¡ficos puede que no se necesite
        if(listaRespuestas.length === 0) return;
        var stringAyuda;
        try{
            stringAyuda = stringDeAyuda(listaRespuestas,"");
            let resultados = await pool.query(`select actualizarJsonbConFormulario(`+idDistrito+`,`+stringAyuda+`);` );
            //console.log(resultados.rows);
            return resultados;
        }catch(e){
            console.log("OcurriÃ³ un error: \nDescripciÃ³n: ", error,"\nUbicaciÃ³n: actualizarJsonbConFormulario");
            console.log("Entradas:\n\tidDistrito: ", idDistrito, "\n\tlistaRespuestas: ", listaRespuestas);
            console.log("String de ayuda: ", stringAyuda);
        }
    },
    async insertRespuestaAbierta(idFormulario,idPregunta,listaRespuestas) {
        // try{

        // }catch(e){
        //     console.log("\t\tOcurriÃ³ un error: \n\t\tDescripciÃ³n: \n\t\t",e, "\n\t\tUbicaciÃ³n: \n\t\t","");
        // }
        var query;
        try{
            idFormulario = parseInt(idFormulario);
            dPregunta = parseInt(idPregunta);
            /*newclose_multipleanswer --> lista, idPregunta, idFormulario
            newopenanswer --> idPregunta, idFormulario, lista
            */
            stringAyuda = "";
            if( Array.isArray(listaRespuestas) ){
                stringAyuda = stringDeAyuda(listaRespuestas,"'");
            }else{
                stringAyuda = "'"+listaRespuestas+"'";
            }
            query = "select newopenanswer("+idPregunta+","+idFormulario+","+"Array["+stringAyuda+"]"+");";
            await pool.query(query);
        }catch(e){
            console.log("\t\tOcurriÃ³ un error: \n\t\tDescripciÃ³n: \n\t\t",e, "\n\t\tUbicaciÃ³n: \n\t\t","insertRespuestaAbierta");
            console.log("\n\t\tEsta fue la entrada: \n\t\t", listaRespuestas, "\n\t\tEste el query: \n\t\t", query);
        }

    },
    async insertRespuestaCerradaMultiple(idFormulario,idPregunta,respuesta) {
        try{
            idFormulario = parseInt(idFormulario);
            idPregunta = parseInt(idPregunta);
            respuesta = parseInt(respuesta);
            var query = "select newclose_multipleanswer(Array["+respuesta+"],"+idPregunta+","+idFormulario+");";
            await pool.query(query);
            //await pool.query("select newclose_multipleanswer(Array[$1],$2,$3);", [respuesta,idPregunta,idFormulario]);
        }catch(e){
            console.log("\t\tOcurriÃ³ un error: \n\t\tDescripciÃ³n: \n\t\t",e, "\n\t\tUbicaciÃ³n: \n\t\t","insertRespuestaCerradaMultiple");
        }
    },
    async openQuery(query){//es para hacer consultas abiertas a la base de datos
        //pass es una contraseÃ±a, deben mandar como parÃ¡metro 899
        const resultados = await pool.query(query);
        return resultados.rows;
    }
}

