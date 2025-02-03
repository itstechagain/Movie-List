import mongoose, { Schema, Document } from 'mongoose';

export interface IMovie extends Document {
  name: string;
  userRating: number;
  rating: number;
  user: mongoose.Types.ObjectId;
}

const MovieSchema: Schema<IMovie> = new Schema({
  name: { type: String, required: true },
  userRating: { type: Number, required: true, min: 1, max: 10 },
  rating: { type: Number, required: true }, // TMDB rating
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

export const Movie = mongoose.model<IMovie>('Movie', MovieSchema);