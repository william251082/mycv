import {Body, Controller, Post, UseGuards} from '@nestjs/common';
import {CreateReportDto} from "./dtos/create-report.dto";
import {AuthGuard} from "../guards/auth.guard";

@Controller('reports')
export class ReportsController {
    constructor(private reportsService: reportsService) {}

    @Post()
    @UseGuards(AuthGuard)
    createReport(@Body() body: CreateReportDto) {
        return this.reportsService.create(body)
    }
}
