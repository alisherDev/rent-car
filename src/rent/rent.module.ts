import { Module } from '@nestjs/common';
import {RentService} from "./rent.service";
import {AutoService} from "../auto/auto.service";
import {AutoRepository} from "../auto/repostory/auto.repository";
import {RentRepository} from "./repository/rent.repository";

@Module({
    providers: [
        RentService,
        AutoService,
        AutoRepository,
        RentRepository,
    ]
})
export class RentModule {}
