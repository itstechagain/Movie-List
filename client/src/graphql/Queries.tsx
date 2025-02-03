import { gql } from '@apollo/client';

// Get User Details
export const GET_USER = gql`
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      username
      email
    }
  }
`;

// Get Current Auth User
export const GET_ME = gql`
  query GetMe {
    me {
      id
      username
      email
    }
  }
`;

// Get Movies
export const GET_MOVIES = gql`
  query GetMovies {
    getMovies {
      id
      name
      rating
      userRating
    }
  }
`;