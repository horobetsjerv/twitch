import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Bot } from './entities/bot.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRoles } from './entities/user-roles.entity';
import { Role } from './entities/role.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'twitch',
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Bot, User, UserRoles, Role]),
    JwtModule.register({
      secret: 'yourSecretKey',
      signOptions: { expiresIn: '30d' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
