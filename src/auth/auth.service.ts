import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  verifyToken(token: string): string | jwt.JwtPayload | null {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }
    try {
      return jwt.verify(token, secret);
    } catch (error) {
      if (error instanceof Error) {
        console.error('JWT verification failed:', error.message);
        throw new Error('Invalid token: ' + error.message);
      }
      console.error('JWT verification encountered an unexpected error:', error);
      throw new Error('Invalid token due to an unexpected error.');
    }
  }
}
