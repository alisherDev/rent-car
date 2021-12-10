import {AutoEntity} from "../entity/auto.entity";
import {db} from "../../db";
import {HttpException, HttpStatus, Injectable} from "@nestjs/common";

@Injectable()
export class AutoRepository {
    async create(auto: AutoEntity) {
        const data = await db.query(
            'INSERT INTO auto (brand, model, state_number, vin) values ($1, $2, $3, $4) RETURNING *',
            [auto.brand, auto.model, auto.state_number, auto.vin]);
        if (data.rows.length == 0) {
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error: 'Could not create now, try later',
            }, HttpStatus.NOT_FOUND);
        }
        return data.rows[0]
    }

    async getById(id: number): Promise<AutoEntity> {
        const res = await db.query('SELECT * FROM auto WHERE id = $1', [id]);
        if (res.rows.length == 0) {
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error: 'Car you\'re looking for is not exist in our db',
            }, HttpStatus.NOT_FOUND);
        }
        return res.rows[0];
    }

    async list(skip, limit){
        const data = await db.query('SELECT * FROM auto OFFSET ($1) ROWS FETCH NEXT ($2) ROWS ONLY', [skip, limit])
        return data.rows
    }
}