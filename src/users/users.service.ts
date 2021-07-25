import { Injectable } from '@nestjs/common';
import {Repository} from "typeorm";
import {User} from "./user.entity";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class UsersService {
    // InjectRepository is an aid to help nest's DI System understand ts generics
    constructor(@InjectRepository(User) private repo: Repository<User>) {}

    create(email: string, password: string) {
        const user = this.repo.create({email, password})

        // hooks not executed
        // return this.repo.save({email: 'hi@hi.com', password: 'uvgvjg'})

        // hooks executed
        return this.repo.save(user)
    }
}
