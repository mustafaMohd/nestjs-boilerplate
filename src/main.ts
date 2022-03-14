import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new ConfigService('.env');
  await app.listen(await config.getPortConfig());
  // const app = await NestFactory.create(AppModule);
  // await app.listen(3000);
}
bootstrap();
