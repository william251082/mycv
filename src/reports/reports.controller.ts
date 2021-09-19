import {Body, Controller, Get, Param, Patch, Post, Query, UseGuards} from '@nestjs/common';
import {AuthGuard} from "../guards/auth.guard";
import {ReportsService} from "./reports.service";
import {DeepPartial} from "typeorm";
import {Report} from "./report.entity";
import {CurrentUser} from "../users/decorators/current-user.decorator";
import {User} from "../users/user.entity";
import {Serialize} from "../interceptors/serialize.interceptor";
import {ReportDto} from "./dtos/report.dto";
import {ApproveReportDto} from "./dtos/approve-report.dto";
import {AdminGuard} from "../guards/admin.guard";
import {GetEstimateDto} from "./dtos/create-report.dto";

@Controller('reports')
export class ReportsController {
    constructor(private reportsService: ReportsService) {}

    @Get()
    getEstimate(@Query() query: GetEstimateDto) {

    }

    @Post()
    @UseGuards(AuthGuard)
    @Serialize(ReportDto)
    createReport(@Body() body: DeepPartial<Report>, @CurrentUser() user: User) {
        return this.reportsService.create(body, user)
    }

    @Patch('/:id')
    @UseGuards(AdminGuard)
    approvedReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
        return this.reportsService.changeApproval(id, body.approved)
    }
}
