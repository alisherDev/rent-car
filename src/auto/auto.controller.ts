import {Body, Controller, Get, Param, Post, Query} from "@nestjs/common";
import { CreateAutoDto } from "./dto/create-auto.dto";
import { AutoService } from "./auto.service";

@Controller('/auto')
export class AutoController {
  constructor(private autoService: AutoService) {}

  @Post()
  create(@Body() dto: CreateAutoDto) {
    return this.autoService.create(dto)
  }

  @Get('/:id/available')
  checkIfAutoIsAvailable(@Param('id') id: number) {
    return this.autoService.checkAvailability(id);
  }

  @Get()
  getAll(@Query() query) {
    return this.autoService.getAll(query.limit, query.skip)
  }

  @Get('/:id')
  getDetail(@Param('id') id: number) {
    return this.autoService.getDetail(id)
  }
}