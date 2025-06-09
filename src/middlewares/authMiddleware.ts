import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export function verifyToken(req: Request): { userId: string } {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new Error('no-token');
  }

  const token = authHeader.split(' ')[1]; // "Bearer TOKEN_AQUI"
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    return payload;
  } catch (err) {
    throw new Error('invalid-token');
  }
}