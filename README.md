# Censo-Enfermedad-Autoinmune

Herramienta para Recolección y Visualizacion de Datos de Pacientes con Enfermedades Autoinmunes en Costa Rica.

## Iniciando el proyecto

En estas instrucciones hay una guía sobre como inicializar el proyceto.

### Pre-requisitos

- [Node js](https://nodejs.org/es/download/) (No olvide NPM)
- Git console o Git desktop


### Instalación

#### Clonar repositorio

Puede ver estas guías de [Git](https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository)

#### Descargar dependencias de NPM

Asegurece de estar en la dirección "../WebSite/Formulario" y ejecute el comando: 

`npm install` 

Espere un momento mientras se instalan las dependencias.

### Configuración inicial de la base de datos:

Puedes realizar un backup de la base de datos Postgresql con los datos que se encuentran en la carpeta [backup](https://github.com/Fahrenheit99/Censo-Enfermedad-Autoinmune/tree/master/DataBase%20Details/BackUp), en esta carpeta encontrará un backup de la estructura sin datos y una con datos de prueba. 

## Comprobando la instalación

Corra el comando `npm start` ó `node ./controller.js`

### Abra la aplicación

Ingrese a la dirección de `localhost:8080` (verifica tu localhost) y explore el proyecto.

## Desarrollo y Producción

Como nota mental, para trabajar con el proyecto en desarrollo procure correrlo con el comando `npm start` ó `node ./controller.js`, pero para efectos de producción procure ejecutar:

- `pm2 start controller.js` para ejecutar el proyecto.
- `pm2 stop controller.js` para detener la instancia del proyecto.
- `pm2 logs` para ver los mensajes de la aplicación.

	***Consulte la Librería [PM2](https://pm2.keymetrics.io/docs/usage/quick-start/ ) para más información, puede que los comandos de PM2 requieran más atención en la instalación en Windows que en Linux***

## Hecho con: 

* [Node](https://nodejs.org/es/) - Programación a nivel de servidor.
  - [Express](https://expressjs.com/es/) - Manejo de la aplicación.
* [EJS Templates](https://www.npmjs.com/package/ejs) - Manejo de interfaz.
* [D3](https://d3js.org/) - Usado para construir los WordCloud o Nubes de Palabras.
  - [jsondavies/d3-wordcloud](https://github.com/jasondavies/d3-cloud) - Software de uso libre que se usó para las nubes de Palabras.
* [Chart.js](https://www.chartjs.org/) - Para generar los gráficos numéricos.
* [MapBox GL JS](https://docs.mapbox.com/mapbox-gl-js/api/) - Para generación de Mapas.
* [PostgreSQL](https://www.postgresql.org/) - Motor de base de datos.


## Autores

* **Gerardo Villalobos** - *Documentación e investigación* - [@gera0693](https://github.com/gera0693)
* **Jafet Leiva** - *Apariencia y Frontend* - [@Jafethll28](https://github.com/Jafethll28)
* **Kevin Zamora** - *Lógica Frontend, Backend y Base de datos* - [@Fahrenheit99](https://github.com/Fahrenheit99)

## Reconocimientos y Agradecimientos.

* **Adriana Céspedes** -[acespedesv](https://github.com/acespedesv) - Cliente y QA
* **Rodolfo Mora** - [Rjmoraza](https://github.com/Rjmoraza) - Guru
* [jsondavies/d3-wordcloud](https://github.com/jasondavies/d3-cloud) - Your code were very helpful.


