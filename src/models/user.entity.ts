import { Column, Entity, Index } from 'typeorm';
import { CustomBaseEntity } from './custom.base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { AuthProviderEnum } from '../global/enums/auth.provider.enum';
import { UserRolesEnum } from '../global/enums/user.roles.enum';

@Entity()
export class User extends CustomBaseEntity {
  @ApiProperty()
  @Column()
  uuid: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({ length: 200, unique: true })
  email: string;

  @ApiProperty()
  @Column('json', { nullable: true, default: null })
  auth_provider: Array<AuthProviderEnum>;

  @ApiProperty()
  @Column({ nullable: false, default: false })
  is_subscribed: boolean;

  @ApiProperty()
  @Column({ nullable: false, default: false })
  is_deleted: boolean;

  @Index()
  @Column({
    nullable: false,
    type: 'enum',
    enum: UserRolesEnum,
    default: UserRolesEnum.USER,
  })
  role: UserRolesEnum;

  @Column({
    length: 500,
    nullable: true,
    default: null,
  })
  image: string;
}
