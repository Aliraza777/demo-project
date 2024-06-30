import { Body, Controller, Get, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { ResponseDto } from '../../global/dto/response.dto';
import { BypassAuth } from '../../global/decorators/bypass.auth.decorator';
import { User } from '../../models/user.entity';
import { CreateUserOnFirebaseDto } from './dto/create.user.on.firebase.dto';
import { CreateUserDto } from './dto/create.user.dto';
import { AuthProviderEnum } from '../../global/enums/auth.provider.enum';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @BypassAuth()
  @Post('create-user')
  async createUserOnDatabase(
    @Body() user: CreateUserDto,
  ): Promise<ResponseDto<User>> {
    const resp = await this.userService.createUserOnDatabase(user);
    return new ResponseDto(HttpStatus.OK, 'User Created!', resp);
  }

  // @Transactional()
  // @BypassAuth()
  // @Post('create')
  // async createUser(@Body() user: CreateUserDto): Promise<ResponseDto<User>> {
  //   const newUser = await this.userService.createUser(user);
  //   return new ResponseDto<User>(HttpStatus.OK, 'User', newUser);
  // }
  // @BypassAuth()
  // @Post('create-user-firebase')
  // async createUserOnFirebase(
  //   @Body() user: CreateUserOnFirebaseDto,
  // ): Promise<ResponseDto<any>> {
  //   const resp = await this.userService.createUserOnFireBase(user);
  //   return new ResponseDto(HttpStatus.OK, 'User Created!', resp);
  // }

  @BypassAuth()
  @Post('auth-token')
  @ApiBody({
    schema: {
      default: { email: 'abc@xyz.com', password: 'password' },
      example: { email: 'abc@xyz.com', password: 'password' },
    },
  })
  async getFirebaseTokenByEmailAndPassword(
    @Body('email')
    email: string,
    @Body('password') password: string,
  ): Promise<ResponseDto<string>> {
    return new ResponseDto<string>(
      HttpStatus.OK,
      'User firebase token!',
      await this.userService.getFirebaseTokenByEmailAndPassword(
        email,
        password,
      ),
    );
  }

  @BypassAuth()
  @Get('all-users')
  async getAllUsers(): Promise<ResponseDto<[User[], number]>> {
    const resp = await this.userService.getAllUsers();
    return new ResponseDto(HttpStatus.OK, 'All Users!', resp);
  }

  // @Patch('update-user/:uid')
  // @ApiConsumes('multipart/form-data')
  // async updateUser(
  //   @Body() user: UpdateUserDto,
  //   @Param('uid') uid: string,
  // ): Promise<ResponseDto<User>> {
  //   const resp = await this.userService.updateUser(user, uid);
  //   return new ResponseDto(HttpStatus.OK, 'User Updated!', resp);
  // }

  // @Delete(':uid')
  // async deleteUser(@Param('uid') uid: string): Promise<ResponseDto<boolean>> {
  //   const resp = await this.userService.deleteUser(uid);
  //   return new ResponseDto(HttpStatus.OK, 'User Deleted!', resp);
  // }
  @BypassAuth()
  @ApiQuery({
    required: false,
    type: String,
    name: 'provider',
    enum: Object.values(AuthProviderEnum),
  })
  @Get()
  async getLoggedInUser(@Query('provider') provider: AuthProviderEnum = null) {
    return new ResponseDto(
      HttpStatus.OK,
      'Get User',
      await this.userService.getLoggedInUser(provider),
    );
  }
  // @Patch()
  // @ApiConsumes('multipart/form-data')
  // @FormDataRequest({ limits: { files: 12 } })
  // async updateUser(@Body() user: UpdateUserDto) {
  //   return new ResponseDto(
  //     HttpStatus.OK,
  //     'User Updated',
  //     await this.userService.updateUser(user),
  //   );
  // }
  // @Get(':uuid')
  // async getUserByUserId(
  //   @Param('uuid') uuid: string,
  // ): Promise<ResponseDto<User>> {
  //   const resp = await this.userService.getUserByUserId(uuid, true);
  //   return new ResponseDto(HttpStatus.OK, 'User!', resp);
  // }
}
