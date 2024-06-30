import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ProductTypeEnum } from '../../../global/enums/product.type.enum';

export class getSubscribedUserInformationDto {
  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @ApiProperty({ required: false, type: String })
  product_id: string;

  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  product_type: ProductTypeEnum;

  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  purchase_token: string;

  @ApiProperty({ required: false, type: Date })
  transaction_date: Date;
}
