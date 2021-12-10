import {forwardRef, Inject, Injectable} from "@nestjs/common";
import {CreateAutoDto} from "./dto/create-auto.dto";
import {RentService} from "../rent/rent.service";
import * as moment from "moment";
import {CarStatus} from "../util/car-status";
import {AutoRepository} from "./repostory/auto.repository";
import {AutoEntity} from "./entity/auto.entity";

@Injectable()
export class AutoService {
  constructor(
      @Inject(forwardRef(() => RentService))
      private readonly rentService: RentService,
      private readonly autoRepository: AutoRepository,
  ) {}

  async create(dto: CreateAutoDto) {
    const entity = new AutoEntity();
    entity.vin = dto.vin;
    entity.brand = dto.brand;
    entity.model = dto.model;
    entity.state_number = dto.state_number;
    return await this.autoRepository.create(entity)
  }

  async getAll(limit, skip) {
    if (!limit){
      limit = 20
    }
    if (!skip) {
      skip = 0
    }
    return await this.autoRepository.list(skip, limit)
  }

  async getDetail(id: number) {
    return await this.autoRepository.getById(id)
  }

  async checkAvailability(id: number) {
    const REST_DAYS = 3;
    const auto = await this.autoRepository.getById(id);
    const rent = await this.rentService.getByAutoId(auto.id);
    if (rent.length == 0) {
      return { status: CarStatus.AVAILABLE }
    }
    const rentEndDate = moment(rent[0].create_date).add(rent[0].day, 'day');
    if (rentEndDate.isBefore(moment())) {
      if (rentEndDate.add(REST_DAYS, 'day').isAfter(moment())) {
        return { status: CarStatus.IN_REST }
      }
      return { status: CarStatus.AVAILABLE }
    }
    return { status: CarStatus.UNAVAILABLE }
  }

  async checkAvailabilityForRange(id: number, dateFrom: Date, days) {
    const REST_DAYS = 3;
    const auto = await this.autoRepository.getById(id);
    const rents = await this.rentService.listRentsByAutoId(auto.id);
    if (rents.length == 0) {
      return { status: CarStatus.AVAILABLE }
    }
    const requestStartDate = moment(dateFrom);
    const requestEndDate = requestStartDate.clone().add(days,'day')
    for (let i = 0; i <rents.length; i++) {
      const rent = rents[i];
      const rentStartDate = moment(rent.created_date).add(REST_DAYS * -1, 'day');
      const rentEndDate = moment(rent.created_date).add(rent.day, 'day').add(REST_DAYS, 'day');
      if (
          requestStartDate.isAfter(rentStartDate) && requestStartDate.isBefore(rentEndDate)
          ||
          requestEndDate.isAfter(rentStartDate) && requestEndDate.isBefore(rentEndDate)
          ||
          rentStartDate.isAfter(requestStartDate) && rentStartDate.isBefore(requestEndDate)
          ||
          rentEndDate.isAfter(requestStartDate) && rentEndDate.isBefore(requestEndDate)
      ) {
        return { status: CarStatus.UNAVAILABLE }
      }
    }
    return { status: CarStatus.AVAILABLE }
  }
}