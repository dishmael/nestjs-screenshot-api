import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ScreenshotModule } from './screenshot/screenshot.module';
import { RateLimitMiddleware } from './rate-limit/rate-limit.middleware';
import { ScreenshotController } from './screenshot/screenshot.controller';

@Module({
  imports: [AuthModule, ScreenshotModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RateLimitMiddleware).forRoutes(ScreenshotController);
  }
}
