import { UserModule } from '@components/user/user.module';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: 'pz8An9L9uZ4W8UOyg3HTFlS8RBlLZjGwMLrSgTiVbDQ', // Replace with a secure key
      signOptions: { expiresIn: '7d' }, // Configure options as needed
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
