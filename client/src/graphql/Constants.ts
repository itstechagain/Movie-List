import { gql } from '@apollo/client';

// Add Movie/Rating
export const ADD_MOVIE = gql`
  mutation AddMovie($name: String!, $userRating: Float!) {
    addMovie(name: $name, userRating: $userRating) {
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