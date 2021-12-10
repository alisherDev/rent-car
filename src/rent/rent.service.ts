import {forwardRef, HttpException, HttpStatus, Inject, Injectable} from "@nestjs/common";
import * as moment from "moment";
import {AutoService} from "../auto/auto.service";
import {RequestRentDto} from "./dto/request-rent.dto";
import {CarStatus} from "../util/car-status";
import {RentRepository} from "./repository/rent.repository";
import {RentEntity} from "./entity/rent.entity";

// assuming this data will provided from another service
const rentCost = 1000;
const rentDaysDiscount = [
  [1,4,0],
  [5,9,5],
  [10,17,10],
  [18,30,15]
];
const rentMaxDays = 30;
const rentMinDays = 1;
const SATURDAY = 6;
const SUNDAY = 7;

@Injectable()
export class RentService {
  constructor(
      @Inject(forwardRef(() => AutoService))
      private readonly autoService: AutoService,
      private readonly rentRepository: RentRepository,
  ) {}

  calculateTotalPriceOfRent(days: number){
    let total = 0;
    for (let i = 1; i <= days; i++) {
      rentDaysDiscount.forEach(rentDay => {
        if (i >= rentDay[0] && i <= rentDay[1]) {
          total += rentCost - (rentCost * (rentDay[2]/100))
        }
      })
    }
    return total;
  }

  async getByAutoId(id: number){
    return await this.rentRepository.getByAutoId(id);
  }

  async create(dto: RequestRentDto) {
    const availability = await this.autoService.checkAvailabilityForRange(dto.auto_id, dto.date, dto.day);
    if (availability.status === CarStatus.UNAVAILABLE) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'This car unavailabale to rent to this period',
      }, HttpStatus.FORBIDDEN);
    } else if (availability.status === CarStatus.IN_REST) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'Car in rest (3 days) after previous rent',
      }, HttpStatus.FORBIDDEN);
    }
    if (dto.day > rentMaxDays || dto.day < rentMinDays){
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'Invalid value for "days", you can rent auto only for 1-30 days',
      }, HttpStatus.FORBIDDEN);
    }
    const beginDate = moment(dto.date);
    const beginDateWeekDay = beginDate.day();
    const endDate = moment(dto.date).add(dto.day, 'day');
    const endDateWeekDay = endDate.day();
    const deprecatedDays = [SATURDAY,SUNDAY];
    if (
        deprecatedDays.includes(beginDateWeekDay) ||
        deprecatedDays.includes(endDateWeekDay)
    ) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'You can not rent a car in that period. (beginning or end of period in not working days)',
      }, HttpStatus.FORBIDDEN);
    }
    const entity = new RentEntity();
    entity.created_date = dto.date;
    entity.auto_id = dto.auto_id;
    entity.day = dto.day;
    entity.price = this.calculateTotalPriceOfRent(dto.day);
    return await this.rentRepository.create(entity);
  }

  async createReport(monthNum: number = 0){
    const reportMonthBeginning = moment().startOf('month').add(monthNum).startOf('month');
    const daysInCurrentMonth = reportMonthBeginning.daysInMonth();
    const autos = await this.autoService.getAll(100, 0);
    const autoIds = autos.map(auto => auto.id);
    const rents = await this.rentRepository.getByAutoIds(autoIds);
    const autoRentCollection = {};
    rents.forEach(rent => {
      let rentDaysInThisMonth = 0;
      const date = moment(rent.created_date)
      for (let i = 0; i < rent.day; i++){
        if(date.isSame(reportMonthBeginning, 'month')){
          rentDaysInThisMonth++;
        }
        date.add(1, 'day');
      }
      const id = parseInt(rent.auto_id)
      if(id in autoRentCollection){
        autoRentCollection[id].days += rentDaysInThisMonth;
      } else {
        autoRentCollection[id] = {
          days: rentDaysInThisMonth,
        }
      }
    })
    return autos.map(auto => {
      const report = {
        number: auto.state_number,
        percentage: '0%',
      };
      if(auto.id in autoRentCollection){
        let days = autoRentCollection[auto.id].days
        report.percentage = Math.floor((100 / daysInCurrentMonth) * days) + '%';
      }
      return report;
    })
  }

  async getAll(limit, skip) {
    if (!limit){
      limit = 20
    }
    if (!skip) {
      skip = 0
    }
    return await this.rentRepository.list(skip, limit);
  }

  async listRentsByAutoId(id: number) {
    return await this.rentRepository.getAllByAutoId(id);
  }

  async getDetail(id: number) {
    return await this.rentRepository.getById(id);
  }
}