import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule,
            ConfigModule,
            MongooseModule.forRootAsync({
              inject: [ConfigService],
              useFactory: async (configService: ConfigService) => configService.getMongoConfig(),
          }),
            ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
