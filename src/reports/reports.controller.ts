import {Body, Controller, Param, Patch, Post, UseGuards} from '@nestjs/common';
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

@Controller('reports')
export class ReportsController {
    constructor(private reportsService: ReportsService) {}

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
