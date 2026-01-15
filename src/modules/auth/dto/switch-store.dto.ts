import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SwitchStoreDto {
  @ApiProperty({ example: 'store-uuid-here' })
  @IsUUID()
  storeId: string;
}
