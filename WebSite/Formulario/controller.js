//Require from node js Libraries
var express = require('express');
var session = require('cookie-session'); // Loads the piece of middleware for sessions
var bodyParser = require('body-parser'); // Loads the piece of middleware for managing the settings
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const requestIp = require('request-ip');
const path = require('path');
var http = require('http');  
var url = require('url');
//require from my files
var dbConection = require('./public/js/conection');
var proccessor = require('./public/js/processor');
var formBodyParser = require('./public/js/formBodyParser');
var mapaCantones = require('./public/js/geoJsonObject');
const processor = require('./public/js/processor');
//mapaJsonCant


//app declaration
var app = express();
//Use
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(requestIp.mw())
/* Using sessions */
app.use(session({ secret: 'todotopsecret' }))
app.use(express.static(path.join(__dirname, 'public')));

//Paths
app.get('/Formulario', function (req, res) {
  var idDistrito = req.query.distrito;
  res.render("formulario.ejs",{distrito: idDistrito});
})

app.get('/API/formStructure', function (req, res) {
  //var idDistrito = req.query.distrito;
  dbConection.get_preguntas().then(preguntas => {
    dbConection.get_respuestas(null).then(respuestas => {
      listotal = proccessor.formBodyBuilder(preguntas.rows, respuestas.rows);
      res.send( { listaPreguntasRespuestas: listotal} );
    });
  })
})

app.get('/', function (req, res) {
  res.render("Inicio.ejs");
})

app.post('/Formulario/Envio', function(req, res){
  try{
    const formBody = req.body;
    const ip = req.clientIp;
    //console.log(formBody);
    dbConection.insert_formulario(ip, formBody['distrito']).then(formQuery => {
    //console.log("Retorno Funcion: ", formQuery);
    var row = formQuery.rows[0];
    var idForm = row['newformulario'];
    var idDistrito = formBody.distrito;;
    delete formBody.distrito;
    var enfermedadesSeleccionadas = formBodyParser.formBodyInsert(formBody, idForm);
    dbConection.actualizarJsonbConFormulario(idDistrito, enfermedadesSeleccionadas);
    res.redirect('/Formulario/Gracias/' + idForm);
  });
  }catch(e){
    console.log("Error de envío: ", e);
  }
})

app.get('/Formulario/Gracias/:idd', function(req,res){ 
  id = req.params.idd;
  //console.log(id);
  res.render("gracias.ejs",{idUser: id });
})

app.get('/Ubicacion', function (req, res) {
  dbConection.get_provincias().then(provincias => {
    listotal = proccessor.displayProvincias(provincias.rows);
    res.render("provincia.ejs", { listaProvincias: listotal });
  })
})

app.get('/Ubicacion/canton', function (req, res) {
  var idProvincia = req.query.provincia;
  if (idProvincia != "") {
    dbConection.get_cantones(idProvincia).then(cantones => {
      listotal = proccessor.displayCantones(cantones.rows);
      res.render("canton.ejs", { listaCantones: listotal });
    })
  }
})

app.get('/Ubicacion/distrito', function (req, res) {
  var idCanton = req.query.canton;
  if (idCanton != "") {
    dbConection.get_distritos(idCanton).then(distritos => {
      listotal = proccessor.displayDistritos(distritos.rows);
      res.render("distrito.ejs", { listaDistrito: listotal });
    })
  }
})

app.get('/Inicio', function (req, res) {
  res.render("Inicio.ejs");
})

app.get('/API/chartsData', function (req, res) {
  try{
    var listaElementos = req.query.lista;
    //console.log(listaElementos[0]);
    var queryRelacion = dbConection.get_relation(listaElementos);
    queryRelacion.then(relaciones=>{
      var lista_para_graficos = proccessor.groupDataForGraphs(relaciones.rows);
      //console.log(lista_para_graficos);
      return res.send(lista_para_graficos);
    })
  }catch(e){
    console.log("Hubo un error: ",e);
  }
})

app.get('/API/wordCloudData', function (req, res) {
  try{
    var listaElementos = req.query.lista;
    //console.log(listaElementos[0]);
    var queryRelacion = dbConection.get_relation_abiertas(listaElementos);
    queryRelacion.then(relaciones=>{
      var lista_para_graficos = proccessor.groupDataForGraphs(relaciones.rows);
      //console.log(lista_para_graficos);
      return res.send(lista_para_graficos);
    })
  }catch(e){
    console.log("Hubo un error: ",e);
  }
})

app.get('/API/mapCant', function (req, res) {
  try{
      //funcion que llama a procesor para traer los archivos del mapa
      var queryCantones = dbConection.openQuery('select * from canton order by id_canton;');
      queryCantones.then(resultados=>{
        //var listaCantones = resultados.rows;
        var mapa = processor.obtenerCantones(resultados);
        //console.log(mapa);
        return res.send(mapa);
      })
    }
  catch(e){
    console.log("Hubo un error: ",e);
  }
})

app.get('/API/mapDist', function (req, res) {
  try{
      //funcion que llama a procesor para traer los archivos del mapa
      var queryDistritos = dbConection.openQuery('select * from distrito order by id_distrito;');//hay que arreglar esto para ser más modular
      queryDistritos.then(resultados=>{
        //var listaDistritos = resultados.rows;
        var mapa = processor.obtenerDistritos(resultados);
        //console.log(mapa);
        return res.send(mapa);
      })
    }
  catch(e){
    console.log("Hubo un error: ",e);
  }
})

app.get('/graficos', function(req, res){
  try{
    var respuestasQuery = dbConection.get_respuestas(4);//hay que hacer este dinámico
    respuestasQuery.then(respuestasUnpacked=>{
      res.render('graficos.ejs',{graphData:respuestasUnpacked.rows});
    })
  }catch(e){
    console.log("Hubo un error: ",e);
  }
})

  .use(function (req, res, next) {
    res.render('404.ejs');
  });

app.listen(8080);