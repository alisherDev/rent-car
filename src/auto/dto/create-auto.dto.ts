import {ApiProperty} from "@nestjs/swagger";

export class CreateAutoDto {
  @ApiProperty()
  readonly brand: string;

  @ApiProperty()
  readonly model: string;

  @ApiProperty()
  readonly state_number: string;

  @ApiProperty()
  readonly vin: string;
}