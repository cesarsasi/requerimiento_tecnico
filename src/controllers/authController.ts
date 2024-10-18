import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from '../models/userModel';

dotenv.config();

class AuthController {
  constructor() {
  }
  
  async login(req: Request, res: Response){
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email : email  } });
      if (user){
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          res.status(401).json({ message: 'Invalid credentials' });
          return;
        }
        const token = jwt.sign(
          { id: user.id, role: user.role },
          process.env.JWT_SECRET as string,
          { expiresIn: '1h' }
        );
        res.status(200).json({ token });
        return;
      }
    } catch (error) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
  }

  authenticate(req: Request, res: Response, next: NextFunction){
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      res.status(401).json({ message: 'No token, access denied' });
      return;
    }
    const token = authHeader.replace('Bearer ', '');
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      req.user = decoded as { id: string, role: string };
      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  }

  authorize(roles: string[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (!req.user || !roles.includes(req.user.role)) {
        res.status(403).json({ message: 'Access denied' });
        return;
      }
      next();
    };
  }
}

export default new AuthController;