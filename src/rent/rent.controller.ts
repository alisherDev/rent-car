import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { RentService } from "./rent.service";
import {RequestRentDto} from "./dto/request-rent.dto";

@Controller('/rent')
export class RentController {
  constructor(private rentService: RentService) {}
  @Post()
  create(@Body() dto: RequestRentDto) {
    return this.rentService.create(dto)
  }

  @Get('')
  getAll(@Query() query) {
    return this.rentService.getAll(query.limit, query.skip)
  }

  @Get('/:id')
  getDetail(@Param('id') id: number) {
    return this.rentService.getDetail(id)
  }

  @Get('/generate/report')
  async getReport(@Query() query) {
    return await this.rentService.createReport(query.month)
  }
}