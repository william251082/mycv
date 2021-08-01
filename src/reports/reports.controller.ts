import {Body, Controller, Post, UseGuards} from '@nestjs/common';
import {AuthGuard} from "../guards/auth.guard";
import {ReportsService} from "./reports.service";
import {DeepPartial} from "typeorm";
import {Report} from "./report.entity";
import {CurrentUser} from "../users/decorators/current-user.decorator";
import {User} from "../users/user.entity";

@Controller('reports')
export class ReportsController {
    constructor(private reportsService: ReportsService) {}

    @Post()
    @UseGuards(AuthGuard)
    createReport(@Body() body: DeepPartial<Report>, @CurrentUser() user: User) {
        return this.reportsService.create(body, user)
    }
}
