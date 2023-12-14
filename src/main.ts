import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';


declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));


  const config = new DocumentBuilder()
    .setTitle('On Track Schedule App')
    .setDescription('On Track Schedule Api')
    .setVersion('1.0.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .addSecurityRequirements('access-token')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: false }));

  SwaggerModule.setup('swagger-api', app, document);
  await app.listen(process.env.PORT);

  
}
bootstrap();
