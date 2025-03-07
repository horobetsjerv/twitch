import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { MainURL } from 'URLS';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: true,
    origin: [
      'http://debrabebra.top',
      'https://debrabebra.top', // Добавьте HTTPS явно
      /\.debrabebra\.top$/, // Для поддоменов (если нужно)
    ],
  });
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 4444);
}
bootstrap();
