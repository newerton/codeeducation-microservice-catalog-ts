import { NestFactory } from '@nestjs/core';
import { applyGlobalConfig } from 'global-config';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  applyGlobalConfig(app);
  await app.listen(3001);
}
bootstrap();
