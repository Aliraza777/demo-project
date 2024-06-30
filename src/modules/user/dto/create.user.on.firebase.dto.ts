import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AuthProviderEnum } from '../../../global/enums/auth.provider.enum';

export class CreateUserOnFirebaseDto {
  @ApiProperty({ required: true, type: String })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ required: true, type: String })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  image: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  name: string;
}
