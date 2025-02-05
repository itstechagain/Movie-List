import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET_KEY || 'secret_key';
export const generateToken = (user) => {
    return jwt.sign({
        id: user.id,
        username: user.username,
        email: user.email
    }, SECRET_KEY, { expiresIn: '1h' });
};
export const authenticateUser = (token) => {
    if (!token)
        throw new Error('Authentication required');
    try {
        return jwt.verify(token, SECRET_KEY);
    }
    catch (err) {
        throw new Error('Invalid/Expired token');
    }
};
