import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import process from 'process';
import db from './models/starWarsModel';
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
}
  from 'graphql';

import { graphqlHTTP } from 'express-graphql';
import types from './graphql/types';

const PORT = 3000;

// ESM model for __dirname
const folderPath = dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(express.json());

// serve static files
app.use((req, res, next) => {
  // If we see this console log, then the request made it through to the server.
  console.log('request received');
  return next();
}, express.static(path.resolve(folderPath, '../build')));

app.get('/graphql/etag', (req, res) => (
  res.set({
    ETag: 'bacon',
    'Cache-Control': 'max-age=600, public',
  }).send('Old man')));
// app.get('/graphql/etag', (req, res) => {
//   console.log('etag requested');
//   res.send('etag');
// });

// graphiql
app.use('/graphql', graphqlHTTP({
  schema: types.schema,
  graphiql: true,
}));

// catch all for pages not found
app.use((req, res) => res.sendStatus(404));

// error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error!',
    status: 500,
    message: { err: 'An error occurred!' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

process.on('SIGINT', () => {
  console.log('\nGracefully shutting down API server');
  process.kill(process.pid, 'SIGTERM');
});
