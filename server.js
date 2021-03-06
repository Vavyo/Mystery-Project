'use strict';


//Load Environment Variables from the .env file
require('dotenv').config();

// Application Dependencies
const express = require('express');
// const cors = require('cors');
const pg = require('pg');
pg.defaults.ssl = process.env.NODE_ENV === 'production' && { rejectUnauthorized: false };
const superagent = require('superagent');
const methodOverride = require('method-override');

// Database Setup
if (!process.env.DATABASE_URL) {
  throw 'DATABASE_URL is missing!';
}
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => { throw err; });


// Our Dependencies

//Application Setup
const PORT = process.env.PORT || 3001 || 3002 || 3003;
console.log('Server is running on port: ', PORT);
const app = express();

// app.get('/', getWorkout);

app.get('/', (request, response) => {
  response.render('index');
});

//Express Middleware
app.use(express.urlencoded({ extended: true }));

//Specify a directory for static resources
app.use(express.static('./public'));


//Cors Middleware
// app.use(cors());
app.use(methodOverride('_method'));

//Set the view engine for server-side templating
app.set('view engine', 'ejs');


app.use('*', (request, response) => response.send('Sorry, that route does not exist.'));

// function getWorkout(request, response){
//   const SQL = `
//     SELECT *
//     FROM WorkoutTable
//     `;
//     console.log('response');

//   client.query(SQL)
//     .then(results => {
//       const {rowCount, rows} = results;
//       console.log('DB', rows, rowCount);
//       response.render('pages/index', {
//         books: rows,
//       });
//     })
//     .catch(err => {
//       errorHandler(err, request, response);
//     });
// }


//Has to be after stuff loads too
app.use(notFoundHandler);

//Has to be after stuff loads
app.use(errorHandler);

function errorHandler(error, request, response, next) {
  console.error(error);
  response.status(500).json({
    error: true,
    message: error.message,
  });
}

function notFoundHandler(request, response) {
  response.status(404).json({
    notFound: true,
  });
}

client.connect() //<<--keep in server.js
  .then(() => {
    console.log('PG connected!');
    app.listen(PORT, () => console.log(`App is listening on ${PORT}`)); //<<--these are tics not single quotes
  })
  .catch(err => {
    throw `PG error!:  ${err.message}`;//<<--these are tics not single quotes
  });

