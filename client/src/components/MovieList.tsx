import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_MOVIES } from '../graphql/Queries.js';
import { ADD_MOVIE, DELETE_MOVIE, EDIT_MOVIE_RATING } from '../graphql/Mutations.js';

const MovieList: React.FC = () => {
  const { loading: moviesLoading, error: moviesError, data: moviesData, refetch } = useQuery(GET_MOVIES);

  const [addMovie] = useMutation(ADD_MOVIE, {
    onCompleted: () => refetch(),
  });

  const [deleteMovie] = useMutation(DELETE_MOVIE, {
    onCompleted: () => refetch(),
  });

  const [editMovieRating] = useMutation(EDIT_MOVIE_RATING, {
    onCompleted: () => refetch(),
  });

  const [movieName, setMovieName] = useState('');
  const [movieRating, setMovieRating] = useState<number | ''>('');
  const [editMovieId, setEditMovieId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState<number | ''>('');

  const handleSubmit = () => {
    if (!movieName || movieRating === '' || movieRating < 1 || movieRating > 10) {
      alert('Please enter a valid movie name and rating (1-10).');
      return;
    }

    // Check for duplicate movie names
    const isDuplicate = moviesData.getMovies.some((movie: any) => movie.name === movieName);
    if (isDuplicate) {
      alert('A movie with this name already exists.');
      return;
    }

    addMovie({
      variables: {
        name: movieName,
        rating: 0, // Assuming the initial rating is 0
        userRating: movieRating,
      },
    });

    setMovieName('');
    setMovieRating('');
  };

  const handleDelete = (id: string) => {
    deleteMovie({ variables: { id } });
  };

  const handleEdit = (id: string, currentRating: number) => {
    setEditMovieId(id);
    setEditRating(currentRating);
  };

  const handleSaveEdit = () => {
    if (editMovieId && editRating !== '' && editRating >= 1 && editRating <= 10) {
      editMovieRating({
        variables: {
          id: editMovieId,
          userRating: editRating,
        },
      });
      setEditMovieId(null);
      setEditRating('');
    } else {
      alert('Please enter a valid rating (1-10).');
    }
  };

  if (moviesLoading) return <p>Loading...</p>;
  if (moviesError) return <p>Error: {moviesError.message}</p>;

  const movies = moviesData?.getMovies || [];

  return (
    <div>
      <h1>Movie Ratings</h1>

      <div>
        <input
          type="text"
          placeholder="Movie Name"
          value={movieName}
          onChange={(e) => setMovieName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Rating (1-10)"
          value={movieRating}
          min="1"
          max="10"
          onChange={(e) => setMovieRating(Number(e.target.value))}
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Movie</th>
            <th>Rating</th>
            <th>My Rating</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie: any) => (
            <tr key={movie.id}>
              <td>{movie.name}</td>
              <td>{movie.rating}</td>
              <td>
                {editMovieId === movie.id ? (
                  <input
                    type="number"
                    value={editRating}
                    min="1"
                    max="10"
                    onChange={(e) => setEditRating(Number(e.target.value))}
                  />
                ) : (
                  movie.userRating
                )}
              </td>
              <td>
                {editMovieId === movie.id ? (
                  <button onClick={handleSaveEdit}>Save</button>
                ) : (
                  <button onClick={() => handleEdit(movie.id, movie.userRating)}>Edit</button>
                )}
              </td>
              <td>
                <button onClick={() => handleDelete(movie.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MovieList;