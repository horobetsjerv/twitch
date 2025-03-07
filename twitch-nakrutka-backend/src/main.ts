import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { MainURL } from 'URLS';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ credentials: true, origin: [/debrabebra\.top$/] });
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 4444);
}
bootstrap();
