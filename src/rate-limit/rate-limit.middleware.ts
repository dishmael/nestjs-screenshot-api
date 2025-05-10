import { Injectable, NestMiddleware, Logger, HttpStatus } from '@nestjs/common';
import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

type RateLimitRequest = Request & { user?: { tier?: string } };
type RateTier = 'free' | 'paid';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RateLimitMiddleware.name);
  private readonly windowMs = 60 * 1000; // 1 minute
  private readonly rateLimits: Record<RateTier, number> = {
    free: 5, // Free tier: 1 requests per minute
    paid: 60, // Paid tier: 60 requests per minute
  };

  private readonly rateLimiters: Record<RateTier, RateLimitRequestHandler> = {
    free: this.createRateLimiter('free'),
    paid: this.createRateLimiter('paid'),
  };

  private createRateLimiter(tier: RateTier): RateLimitRequestHandler {
    return rateLimit({
      windowMs: this.windowMs,
      max: this.rateLimits[tier],
      message: { error: 'Rate limit exceeded. Upgrade your tier!' },
      handler: (req: Request, res: Response) => {
        this.logger.warn(`Rate limit exceeded for ${tier}-tier user`);
        res.status(HttpStatus.TOO_MANY_REQUESTS).json({
          errorCode: 'Too Many Requests',
          errorMessage: 'Rate limit exceeded. Upgrade your tier!',
        });
      },
    });
  }

  use(req: RateLimitRequest, res: Response, next: NextFunction): void {
    const tier = (req.user?.tier as RateTier) || 'free'; // Default to free
    const limiter = this.rateLimiters[tier];

    // Apply the rate limiter middleware
    void limiter(req, res, next);
  }
}
