import jwt from 'jsonwebtoken';

export const authMiddleware = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token || !token.startsWith('Bearer ')) {
      return res.status(404).json({ message: 'No Token found' });
    }

    token = token.split(' ')[1]; 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid Token', error });
  }
};