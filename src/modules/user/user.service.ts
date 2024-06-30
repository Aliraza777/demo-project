import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CreateUserOnFirebaseDto } from './dto/create.user.on.firebase.dto';
import { User } from '../../models/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as process from 'process';
import { RequestContext } from 'nestjs-request-context';
import { AuthProviderEnum } from '../../global/enums/auth.provider.enum';
import { UserRolesEnum } from '../../global/enums/user.roles.enum';
import { auth } from 'firebase-admin';
import { CreateUserDto } from './dto/create.user.dto';
import UserRecord = auth.UserRecord;

@Injectable()
export class UserService {
  constructor(
    // private readonly firebaseService: FirebaseService,
    private readonly httpService: HttpService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUserOnDatabase(user: CreateUserDto): Promise<User> {
    try {
      const newUser = await this.userRepository
        .create({
          uuid: user.uuid,
          name: user.name,
          email: user.email,
          role: UserRolesEnum.USER,
          is_subscribed: false,
          is_deleted: false,
          auth_provider: user.auth_provider,
          image: user.image,
        })
        .save();
      return newUser;
    } catch (e) {
      console.error(e);
      if (e?.code === 'ER_DUP_ENTRY')
        throw new BadRequestException('record Already found');
      throw new BadRequestException(e.message);
    }
  }

  async getAllUsers(): Promise<[User[], number]> {
    return await this.userRepository.findAndCount({
      where: {
        is_deleted: false,
      },
    });
  }

  // async createUserOnFireBase(
  //   user: CreateUserOnFirebaseDto,
  // ): Promise<UserRecord> {
  //   return await this.firebaseService.createUserOnFireBase(
  //     user.email,
  //     user.password,
  //   );
  // }

  async getFirebaseTokenByEmailAndPassword(email, password): Promise<string> {
    const firebaseURL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`;

    return await this.httpService
      .post(firebaseURL, {
        email,
        password,
        returnSecureToken: true,
      })
      .toPromise()
      .then(({ data }) => {
        if (data) {
          return data.idToken;
        } else {
          throw new BadRequestException('Unable to get Id Token');
        }
      })
      .catch((e) => {
        throw new BadRequestException(e.response?.data?.error?.message);
      });
  }

  getRequestUser(): { uuid: string; email: string } {
    const req: any = RequestContext.currentContext.req;
    if (req.user) {
      return { uuid: req.user.uuid, email: req.user.email };
    }
    throw new BadRequestException('User not found in the request!');
  }

  async getLoggedInUser(provider: AuthProviderEnum = null): Promise<User> {
    const { uuid } = this.getRequestUser();
    const existingUser = await this.userRepository.findOne({
      where: {
        uuid,
      },
      relations: [],
    });
    if (!existingUser) {
      throw new NotFoundException('User not found!');
    }
    if (provider && !existingUser.auth_provider.includes(provider)) {
      existingUser.auth_provider = existingUser.auth_provider.concat(provider);
      await existingUser.save();
    }
    return existingUser;
  }

  // async verifyLoggedUserStatus() {
  //   const user = await this.getLoggedInUser();
  //   if (user) {
  //     if (user.status === 'blocked') {
  //       return false;
  //     }
  //   }
  //   return true;
  // }

  async validateEmail(email: string) {
    const data = await this.userRepository.findOne({
      where: { email },
    });
    if (data) {
      throw new BadRequestException(`User already Exists with this ${email}`);
    }
    return true;
  }

  async getUser(): Promise<User> {
    return await this.getLoggedInUser();
  }
}
