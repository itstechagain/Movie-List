import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface JwtPayload {
  id: string;
  username: string;
  email: string;
}

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'secret_key';

export const generateToken = (user: { id: string; username: string; email: string }) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email
    },
    SECRET_KEY,
    { expiresIn: '1h' }
  );
};

export const authenticateUser = (token: string | null) => {
  if (!token) throw new Error('Authentication required');
  
  try {
    return jwt.verify(token, SECRET_KEY) as JwtPayload;
  } catch (err) {
    throw new Error('Invalid/Expired token');
  }
};