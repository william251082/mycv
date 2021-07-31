import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import {UsersService} from "./users.service";

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>
  let fakeAuthService: Partial<UsersService>

  beforeEach(async () => {
    fakeUsersService = {
      findOne: () => {},
      find: () => {},
      remove: () => {},
      update: () => {},
    }
    fakeAuthService = {
      signup: () => {},
      signin: () => {}
    }
      const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
