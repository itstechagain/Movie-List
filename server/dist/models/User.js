import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    movies: [{ type: Schema.Types.ObjectId, ref: 'Movie' }]
});
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    if (this.password.startsWith('$2a$') || this.password.startsWith('$2b$'))
        return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};
export const User = mongoose.model('User', UserSchema);
