import { CreateUserRequestDto } from '@components/user/dto/request/create-user.request.dto';
import { RegisterNewUserDto } from '@components/user/dto/request/register-new-user.dto';
import { USER_ROLE } from '@components/user/user.constant';
import { UserService } from '@components/user/user.service';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ResponseBuilder } from '@utils/response-builder';

@Injectable()
export class AuthService {
  constructor(
    @Inject('UserServiceInterface')
    private readonly usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string; user: any }> {
    const { user, result } = await this.usersService.checkLogin(username, pass);
    user.password = undefined;
    if (!result) {
      throw new UnauthorizedException();
    }
    const payload = { userId: user._id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user,
    };
  }
  async signUp(request: RegisterNewUserDto): Promise<any> {
    const {
      username,
      password,
      checkpassword,
      name,
      email,
      numberphone,
      gender,
      dob,
    } = request;
    if (password !== checkpassword) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage('Không trùng mật khẩu')
        .build();
    }
    const [day, month, year] = dob.split('/');
    const createUserRequestDto = new CreateUserRequestDto();
    createUserRequestDto.username = username;
    createUserRequestDto.password = password;
    createUserRequestDto.name = name;
    createUserRequestDto.email = email;
    createUserRequestDto.phone = numberphone;
    createUserRequestDto.gender = gender;
    createUserRequestDto.role = USER_ROLE.USER;
    createUserRequestDto.dob = new Date(`${year}-${month}-${day}`);
    return await this.usersService.create(createUserRequestDto);
  }
}
