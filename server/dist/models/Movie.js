import mongoose, { Schema } from 'mongoose';
const MovieSchema = new Schema({
    name: { type: String, required: true },
    userRating: { type: Number, required: true, min: 1, max: 10 },
    rating: { type: Number, required: true }, // TMDB rating
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});
export const Movie = mongoose.model('Movie', MovieSchema);
