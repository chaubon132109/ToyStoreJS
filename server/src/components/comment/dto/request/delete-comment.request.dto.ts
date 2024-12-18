
import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from 'src/core/dto/base.dto';

export class DeleteCommentRequestDto extends BaseDto {
  @ApiProperty()
  id: string;
}
