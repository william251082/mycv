import { Test} from '@nestjs/testing';
import {AuthService} from "./auth.service";
import {UsersService} from "./users.service";
import {User} from "./user.entity";
import {BadRequestException, NotFoundException} from "@nestjs/common";

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

    it('throws if signin is called with an unused email', async () => {
        try {
            await service.signin('hi@hiqwq.com', 'aqwqwsdf')
        } catch (err) {
            expect(err).toBeInstanceOf(NotFoundException);
            expect(err.message).toBe('user not found');
        }
    })

    it('throws if an invalid password is provided', async () => {
        fakeUsersService.find = () => Promise.resolve([{id:1, email: 'hi@hi.com', password: 'asdf'} as User])
        try {
            await service.signin('hi@hi.com', 'asdfw')
        } catch (err) {
            expect(err).toBeInstanceOf(BadRequestException);
            expect(err.message).toBe('bad password');
        }
    })

    it('returns a user if correct password is provided', async () => {
        // fakeUsersService.find = () => Promise.resolve([{id:1, email: 'hi@hi.com', password: 'asdf'} as User])
        // const user = await service.signin('hi@hi.com', 'asdf')
        // expect(user).toBeDefined()
        // option 1
        // const user = await service.signup('hi@hi.com', 'asdf')
        // console.log(user)
        fakeUsersService.find = () => Promise.resolve([{id:1, email: 'hi@hi.com', password: 'e4507829e9ec0f05.792958644f526622bbf44e914f5e973ee9d70a5d505616075da971f7b9e967ef'} as User])
        const user = await service.signin('hi@hi.com', 'asdf')
        expect(user).toBeDefined()
    })
});

