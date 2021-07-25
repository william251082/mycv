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

        return this.repo.save(user)
    }

    findOne(id: number) {
        return this.repo.findOne(id)
    }

    find(email: string) {
        return this.repo.find({email})
    }

    async update(id: number, attrs: Partial<User>) {
        const user = await this.findOne(id)
        if (!user) {
            throw new Error('user not found')
        }
        Object.assign(user, attrs)
        return this.repo.save(user)
    }

    async remove(id: number) {
        const user = await this.findOne(id)
        if (!user) {
            throw new Error('User not found.')
        }
        return this.repo.remove(user)
    }
}

// const usersService = new UsersService({} as any)
// usersService.update(1, {email: 'hi@hi.com', password: 'asasas'})
