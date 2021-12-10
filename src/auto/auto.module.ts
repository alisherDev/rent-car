import { Module } from "@nestjs/common";
import { AutoService } from "./auto.service";
import { AutoController } from "./auto.controller";
import { RentService } from "../rent/rent.service";
import { RentController } from "../rent/rent.controller";
import {AutoRepository} from "./repostory/auto.repository";
import {RentRepository} from "../rent/repository/rent.repository";

@Module({
  providers: [AutoService, RentService, AutoRepository, RentRepository],
  controllers: [AutoController, RentController],
  exports: [AutoService, RentService]
})
export class AutoModule {}