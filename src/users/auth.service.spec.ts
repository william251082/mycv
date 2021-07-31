import {Test} from '@nestjs/testing';
import {AuthService} from "./auth.service";
import {UsersService} from "./users.service";
import {User} from "./user.entity";
import {BadRequestException, NotFoundException} from "@nestjs/common";

describe('AuthService', () => {
    let service: AuthService
    let fakeUsersService: Partial<UsersService>
    beforeEach(async () => {
        // Create a fake copy of the users service
        const users: User[] = [];
        fakeUsersService = {
            find: (email: string) => {
                const filteredUsers = users.filter(user => user.email === email)
                return Promise.resolve(filteredUsers)
            },
            create: (email: string, password: string) => {
                const user = {id: Math.floor(Math.random() * 999999), email, password} as User
                users.push(user)
                return Promise.resolve(user)
            }
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
        await service.signup('hi@hi.com', 'asdf')
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
        await service.signup('hi@hi.com', 'asdf')
        try {
            const user = await service.signin('hi@hi.com', 'asdfw')
            expect(user).toBeNull()
        } catch (err) {
            expect(err).toBeInstanceOf(BadRequestException);
            expect(err.message).toBe('bad password');
        }
    })

    it('returns a user if correct password is provided', async () => {
        await service.signup('hi@hi.com', 'asdf')
        const user = await service.signin('hi@hi.com', 'asdf')
        expect(user).toBeDefined()
    })
});

