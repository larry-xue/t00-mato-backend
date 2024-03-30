import { Request } from 'express';

interface RequestUser {
  email: string;
  username: string;
  userId: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: RequestUser
    }
  }
}
