import { gql } from '@apollo/client';

// SignUp
export const SIGNUP = gql`
  mutation Register($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;

// Login
export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;

// Add Movie/Rating
export const ADD_MOVIE = gql`
  mutation AddMovie($name: String!, $rating: Float!, $userRating: Float!) {
    addMovie(name: $name, rating: $rating, userRating: $userRating) {
      id
      name
      rating
      userRating
    }
  }
`;

// Delete Movie
export const DELETE_MOVIE = gql`
  mutation DeleteMovie($id: ID!) {
    deleteMovie(id: $id) {
      id
      name
    }
  }
`;

// Edit Rating
export const EDIT_MOVIE_RATING = gql`
  mutation EditMovieRating($id: ID!, $userRating: Float!) {
    editMovieRating(id: $id, userRating: $userRating) {
      id
      name
      userRating
    }
  }
`;