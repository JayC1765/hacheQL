import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLString,
  GraphQLScalarType,
}
  from 'graphql';

import db from '../models/starWarsModel';

const BigInt = new GraphQLScalarType({
  name: 'BigInt',
  serialize: (val) => val,
});

const personType = new GraphQLObjectType({
  name: 'Person',
  fields: {
    _id: { type: BigInt },
    name: { type: new GraphQLNonNull(GraphQLString) },
    mass: { type: GraphQLString },
    hair_color: { type: GraphQLString },
    skin_color: { type: GraphQLString },
    eye_color: { type: GraphQLString },
    birth_year: { type: GraphQLString },
    gender: { type: GraphQLString },
    species_id: { type: BigInt },
    homeworld_id: { type: BigInt },
  },
});

const filmType = new GraphQLObjectType({
  name: 'Film',
  fields: {
    _id: { type: BigInt },
    title: { type: new GraphQLNonNull(GraphQLString) },
    episode_id: { type: new GraphQLNonNull(GraphQLInt) },
    opening_crawl: { type: new GraphQLNonNull(GraphQLString) },
    director: { type: new GraphQLNonNull(GraphQLString) },
    producer: { type: new GraphQLNonNull(GraphQLString) },
    release_date: { type: new GraphQLNonNull(GraphQLString) },
  },
});

const vesselType = new GraphQLObjectType({
  name: 'Vessel',
  fields: {
    _id: { type: BigInt },
    name: { type: new GraphQLNonNull(GraphQLString) },
    manufacturer: { type: GraphQLString },
    model: { type: GraphQLString },
    vessel_type: { type: new GraphQLNonNull(GraphQLString) },
    vessel_class: { type: new GraphQLNonNull(GraphQLString) },
    cost_in_credits: { type: BigInt },
    length: { type: GraphQLString },
    max_atmosphering_speed: { type: GraphQLString },
    crew: { type: GraphQLInt },
    passengers: { type: GraphQLInt },
    cargo_capacity: { type: GraphQLString },
    consumables: { type: GraphQLString },
  },
});

const speciesType = new GraphQLObjectType({
  name: 'Species',
  fields: {
    _id: { type: BigInt },
    name: { type: new GraphQLNonNull(GraphQLString) },
    classification: { type: GraphQLString },
    average_height: { type: GraphQLString },
    average_lifespan: { type: GraphQLString },
    hair_colors: { type: GraphQLString },
    skin_colors: { type: GraphQLString },
    eye_colors: { type: GraphQLString },
    language: { type: GraphQLString },
    homeworld_id: { type: BigInt },
  },
});

const planetType = new GraphQLObjectType({
  name: 'Planet',
  fields: {
    _id: { type: BigInt },
    name: { type: GraphQLString },
    rotation_period: { type: GraphQLInt },
    orbital_period: { type: GraphQLInt },
    diameter: { type: GraphQLInt },
    climate: { type: GraphQLString },
    gravity: { type: GraphQLString },
    terrain: { type: GraphQLString },
    surface_water: { type: GraphQLString },
    population: { type: BigInt },
  },
});

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    films: {
      type: new GraphQLList(filmType),
      resolve: () => db.query('SELECT * FROM films;').then((result) => result.rows).catch((e) => e),
    },
    planets: {
      type: new GraphQLList(planetType),
      resolve: () => db.query('SELECT * FROM planets;').then((result) => result.rows).catch((e) => e),
    },
    species: {
      type: new GraphQLList(speciesType),
      resolve: () => db.query('SELECT * FROM planets;').then((result) => result.rows).catch((e) => e),
    },
    people: {
      type: new GraphQLList(personType),
      resolve: () => db.query('SELECT * FROM people;').then((result) => result.rows).catch((e) => e),
    },
    vessels: {
      type: new GraphQLList(vesselType),
      resolve: () => db.query('SELECT * FROM people;').then((result) => result.rows).catch((e) => e),
    },
  },
});

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addFilm: {
      type: filmType,
      args: {
        _id: { type: new GraphQLNonNull(BigInt) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        episode_id: { type: new GraphQLNonNull(GraphQLInt) },
        opening_crawl: { type: new GraphQLNonNull(GraphQLString) },
        director: { type: new GraphQLNonNull(GraphQLString) },
        producer: { type: new GraphQLNonNull(GraphQLString) },
        release_date: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (_, {
        _id,
        title,
        episode_id: episodeId,
        opening_crawl: openingCrawl,
        director,
        producer,
        release_date: releaseDate,
      }) => (
        db.query('INSERT INTO films(_id, title, episode_id, opening_crawl, director, producer, release_date) VALUES($1, $2, $3, $4, $5, $6, now()) ON CONFLICT (_id) DO UPDATE SET title=$2, episode_id=$3, opening_crawl=$4, director=$5, producer=$6, release_date=now() RETURNING *;', [_id, title, episodeId, openingCrawl, director, producer]).then((result) => result.rows[0]).catch((e) => e)
      ),
    },
  },
});


const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});

// Starship specs?

export default {
  schema,
};
