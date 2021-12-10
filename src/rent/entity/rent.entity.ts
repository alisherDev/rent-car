import {AutoEntity} from "../../auto/entity/auto.entity";

export class RentEntity {
    id: number;
    created_date: Date;
    auto_id: number;
    auto: AutoEntity;
    day: number;
    price: number;
}