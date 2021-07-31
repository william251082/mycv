import { Test} from '@nestjs/testing';
import {AuthService} from "./auth.service";
import {UsersService} from "./users.service";
import {User} from "./user.entity";
import {BadRequestException} from "@nestjs/common";

describe('AuthService', () => {
    let service: AuthService
    let fakeUsersService: Partial<UsersService>
    beforeEach(async () => {
        // Create a fake copy of the users service
        fakeUsersService = {
            find: () => Promise.resolve([]),
            create: (email: string, password: string) => Promise.resolve({id: 1, email, password } as User)
        }
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService
                }
            ]
        }).compile()

        service = module.get(AuthService)
    })

    it('can create an instance of auth service', async () => {
        expect(service).toBeDefined()
    })

    it('create a new user with salted and hashed password', async () => {
        const user = await service.signup('hi@hi.com', 'asdf')

        expect(user.password).not.toEqual('asdf')
        const [salt, hash] = user.password.split('.')
        expect(salt).toBeDefined()
        expect(hash).toBeDefined()
    })

    it('throws an error if use signs up with email that is in use', async () => {
        fakeUsersService.find = () => Promise.resolve([{id:1, email: 'e', password: 'p'} as User])
        expect.assertions(2)
        try {
            await service.signup('hi@hi.com', 'asdf')
        } catch (err) {
            expect(err).toBeInstanceOf(BadRequestException);
            expect(err.message).toBe('email already in use');
        }
    })
});

