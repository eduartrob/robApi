import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const pepper = process.env.HASH_SALT;

export async function hashPassword(password: string): Promise<string> {
    if (!pepper) throw new Error('HASH_SALT not defined in environment variables');
    const combined = password + pepper;
    return bcrypt.hash(combined, 10);
}

export async function comparePassword(password: string, hashed: string): Promise<boolean> {
    if (!pepper) throw new Error('HASH_SALT not defined in environment variables');
    return bcrypt.compare(password + pepper, hashed);
}

export function generateToken(payload: object): string {
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });
}

