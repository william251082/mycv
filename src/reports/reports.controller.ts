import {Body, Controller, Post, UseGuards} from '@nestjs/common';
import {AuthGuard} from "../guards/auth.guard";
import {ReportsService} from "./reports.service";
import {DeepPartial} from "typeorm";
import {Report} from "./report.entity";
import {CurrentUser} from "../users/decorators/current-user.decorator";
import {User} from "../users/user.entity";
import {Serialize} from "../interceptors/serialize.interceptor";
import {ReportDto} from "./dtos/report.dto";

@Controller('reports')
export class ReportsController {
    constructor(private reportsService: ReportsService) {}

    @Post()
    @UseGuards(AuthGuard)
    @Serialize(ReportDto)
    createReport(@Body() body: DeepPartial<Report>, @CurrentUser() user: User) {
        return this.reportsService.create(body, user)
    }
}
