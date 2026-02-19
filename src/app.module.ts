import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: Number(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USERNAME || 'root',
      password: process.env.DATABASE_PASSWORD || 'root',
      database: process.env.DATABASE_NAME || 'postgres',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      retryAttempts: 100,
      retryDelay: 100,
      autoLoadEntities: true,
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
