import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const config = new DocumentBuilder()
    .setTitle('Screen Capture')
    .setDescription(
      'This API is used to capture a screenshot of a given URL and return the image.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'fatal', 'error', 'warn'],
  });

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customCss: '.swagger-ui .topbar { display: none }', // this removes the Swagger UI top bar
  });

  app.enableCors({
    origin: [/^https?:\/\/localhost:\d+$/],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
  });

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
