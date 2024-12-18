import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import * as fastifyMultipart from 'fastify-multipart';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      bodyLimit: 50 * 1024 * 1024, // 50MB
    }),
    {
      rawBody: true,
    },
  );
  app.register(fastifyMultipart, {
    addToBody: true,
    limits: { fileSize: 10 * 1024 * 1024 }, // Giới hạn kích thước tệp
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.listen(3006);
}
bootstrap();
