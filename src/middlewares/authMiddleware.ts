import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export function verifyToken(req: Request): { userId: string } {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new Error('no-token');
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    return { userId: payload.id };
  } catch (err) {
    throw new Error('invalid-token');
  }
}