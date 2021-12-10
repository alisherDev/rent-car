import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {RentEntity} from "../entity/rent.entity";
import {db} from "../../db";
import * as moment from "moment";

@Injectable()
export class RentRepository {

    async getById(id: number){
        const rent = await db.query('SELECT * FROM rent WHERE id=$1', [id])
        if (rent.rows.length == 0) {
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error: 'NotFound',
            }, HttpStatus.NOT_FOUND);
        }
        return rent.rows[0]
    }

    async create(entity: RentEntity) {
        const rent = await db.query(
            'INSERT INTO rent (auto_id, created_date, day, price) values ($1, $2, $3, $4) RETURNING *',
            [entity.auto_id, moment(entity.created_date).utc(true), entity.day, entity.price])
        return rent.rows[0]
    }

    async list(skip, limit) {
        const rents = await db.query(
            'SELECT * FROM rent OFFSET ($1) ROWS FETCH NEXT ($2) ROWS ONLY',
            [skip, limit]);
        return rents.rows
    }

    async getByAutoIds(ids: number[]) {
        if (ids.length < 1){
            return [];
        }
        const rents = await db.query(
            'SELECT * FROM rent WHERE auto_id IN ($1)',
            [ids.join(',')]);
        return rents.rows
    }

    async getByAutoId(id: number) {
        const rents = await db.query(
            'SELECT * FROM rent WHERE auto_id = $1 ORDER BY created_date DESC LIMIT 1',
            [id]);
        return rents.rows
    }


    async getAllByAutoId(id: number) {
        const rents = await db.query(
            'SELECT * FROM rent WHERE auto_id = $1',
            [id]);
        return rents.rows
    }
}