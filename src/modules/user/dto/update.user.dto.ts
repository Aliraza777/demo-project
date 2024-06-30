import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';
import { image } from '../../../global/constants/constants';
import { AuthProviderEnum } from '../../../global/enums/auth.provider.enum';

export class UpdateUserDto {
  @ApiProperty({ required: false, type: String })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  is_subscribed?: boolean;

  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  is_deleted?: boolean;

  @ApiProperty({ required: false, type: Array<string> })
  @IsOptional()
  auth_provider?: Array<AuthProviderEnum>;

  @ApiProperty({ type: 'string', required: false })
  @IsOptional()
  image?: string;
}
