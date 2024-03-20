import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import type { NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';

/**
 * A middleware to add a unique correlation ID to each request (if not present already)
 */
@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    req.headers['x-correlation-id'] = req.header('x-correlation-id') || uuidv4();
    next();
  }
}
