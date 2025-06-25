import { Request, Response } from 'express';
import { isTokenBlacklisted } from '../utils/tokenBlackList';
import jwt from 'jsonwebtoken';


declare global {
  namespace Express {
    interface Request {
      user?: { userId: string };
    }
  }
}

export function verifyToken(req: Request): { userId: string } {
  const authHeader = req.headers.authorization;
  if (!authHeader) throw new Error('no-token');

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    return { userId: payload.id };
  } catch (err) {
    throw new Error('invalid-token');
  }
}

export function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  return null;
}

export async function authMiddleware(req: Request, res: Response, next: Function): Promise<void> {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token){
    res.status(401).json({ message: "Token requerido" });
    return;
  }  
  const isBlacklisted = await isTokenBlacklisted(token);
  if (isBlacklisted) {
    res.status(401).json({ message: "Token revocado" });
    return;
  }

  try {
    if(token){}
    const payload = verifyToken(req);
    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido" });
    return;
  }
}