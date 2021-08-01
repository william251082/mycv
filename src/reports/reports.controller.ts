import {Body, Controller, Post, UseGuards} from '@nestjs/common';
import {CreateReportDto} from "./dtos/create-report.dto";
import {AuthGuard} from "../guards/auth.guard";
import {ReportsService} from "./reports.service";
import {DeepPartial} from "typeorm";
import {Report} from "./report.entity";

@Controller('reports')
export class ReportsController {
    constructor(private reportsService: ReportsService) {}

    @Post()
    @UseGuards(AuthGuard)
    createReport(@Body() body: DeepPartial<Report>[]) {
        return this.reportsService.create(body)
    }
}
