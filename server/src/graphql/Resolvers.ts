import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Movie } from '../models/Movie.js';
import { GraphQLContext } from '../types/Types.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';
import { generateToken } from '../middleware/Auth.js';

dotenv.config();

const resolvers = {
  Query: {
    getUser: async (
      _: unknown,
      { id }: { id?: string },
      context: GraphQLContext
    ) => {
      const userId = id || context.user?.id;
      if (!userId) throw new Error(" User ID Not Found");
      
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("User ID Not An ObjectID");
      }

      const user = await User.findById(new mongoose.Types.ObjectId(userId)).populate('movies').lean();
      
      if (!user) throw new Error('User Not Found');
      
      return user;
    },

    getMovies: async (_: unknown, __: unknown, context: GraphQLContext) => {
      if (!context.user) throw new Error('Not authenticated');
      return Movie.find({ user: context.user.id });
    },

    me: async (_: unknown, __: unknown, context: GraphQLContext) => {
      if (!context.user) throw new Error('Not authenticated');
      return User.findById(context.user.id).populate('movies');
    }
  },

  Mutation: {
    register: async (
      _: unknown,
      { username, email, password }: { username: string; email: string; password: string }
    ) => {
      if (await User.findOne({ email })) throw new Error('Email already in use');
      if (await User.findOne({ username })) throw new Error('Username already taken');

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();

      const token = generateToken({
        id: newUser._id.toString(),
        username: newUser.username,
        email: newUser.email
      });

      return { user: newUser, token };
    },

    login: async (
      _: unknown,
      { email, password }: { email: string; password: string }
    ) => {
      
      const user = await User.findOne({ email });
      if (!user) throw new Error('User not found');

      const validPassword = await user.comparePassword(password);
      if (!validPassword) throw new Error('Invalid password');

      const token = generateToken({
        id: user._id.toString(),
        username: user.username,
        email: user.email
      });

      return { user, token };
    },

    addMovie: async (
      _: unknown,
      { name, userRating }: { name: string; userRating: number },
      context: GraphQLContext
    ) => {
      try {
      if (!context.user) throw new Error('Not authenticated');

      // TMDB API call
      const tmdbResponse = await axios.get(
        `https://api.themoviedb.org/3/search/movie`,
        {
          params: {
            api_key: process.env.TMDB_API_KEY,
            query: name
          }
        }
      );

      if (!tmdbResponse.data.results.length || !tmdbResponse.data.results?.length) {
        throw new Error('Movie not found on TMDB');
      }
      const tmdbMovie = tmdbResponse.data.results[0];

      // Check for existing movie
      const existingMovie = await Movie.findOne({
        name: { $regex: new RegExp(tmdbMovie.title, 'i') },
        user: context.user.id
      });

      if (existingMovie) throw new Error('Movie already in your list');

      const movie = new Movie({
        name: tmdbMovie.title,
        rating: tmdbMovie.vote_average,
        userRating,
        user: context.user.id
      });

      await movie.save();
      await User.findByIdAndUpdate(context.user.id, {
        $push: { movies: movie._id }
      });

      return movie;
    } catch (error) {
      console.error('Add Movie Error:', error);
      throw new Error('Failed to add movie');
    }
  },

    deleteMovie: async (
      _: unknown,
      { id }: { id: string },
      context: GraphQLContext
    ) => {
      if (!context.user) throw new Error('Not authenticated');
      
      const movie = await Movie.findOneAndDelete({
        _id: id,
        user: context.user.id
      });
      
      if (!movie) throw new Error('Movie not found');
      
      await User.findByIdAndUpdate(context.user.id, {
        $pull: { movies: movie._id }
      });

      return movie;
    },

    editMovieRating: async (
      _: unknown,
      { id, userRating }: { id: string; userRating: number },
      context: GraphQLContext
    ) => {
      if (!context.user) throw new Error('Not authenticated');
      
      const movie = await Movie.findOneAndUpdate(
        { _id: id, user: context.user.id },
        { userRating },
        { new: true }
      );
      
      if (!movie) throw new Error('Movie not found');
      return movie;
    }
  }
};

export default resolvers;