import {Injectable, NestMiddleware} from "@nestjs/common";
import {NextFunction} from "express";
import {UsersService} from "../users/users.service";

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
    constructor(private usersService: UsersService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        // @ts-ignore
        const { userId } = req.session || {}

        if (userId) {
            // @ts-ignore
            req.currentUser = await this.usersService.findOne(userId)
        }

        next()
    }
}