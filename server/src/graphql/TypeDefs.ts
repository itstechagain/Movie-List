import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    movies: [Movie!]!
  }

  type Movie {
    id: ID!
    name: String!
    rating: Float!
    userRating: Float!
    user: User!
  }

  type AuthPayload {
    user: User
    token: String!
  }

  type Query {
    getUser(id: ID!): User
    getMovies: [Movie!]!
    me: User
  }

  type Mutation {
    register(username: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    addMovie(name: String!, userRating: Float!): Movie!
    deleteMovie(id: ID!): Movie!
    editMovieRating(id: ID!, userRating: Float!): Movie!
  }
`;

export default typeDefs;