import {ApiProperty} from "@nestjs/swagger";

export class RequestRentDto {
   @ApiProperty()
   auto_id: number;
   @ApiProperty()
   day: number;
   @ApiProperty()
   date: Date;
}