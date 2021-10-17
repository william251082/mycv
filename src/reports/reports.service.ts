import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Report} from "./report.entity";
import {DeepPartial, Repository} from "typeorm";
import {User} from "../users/user.entity";
import {GetEstimateDto} from "./dtos/get-estimate.dto";

@Injectable()
export class ReportsService {
    constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

    createEstimate(estimateDto: GetEstimateDto) {
        return this.repo.createQueryBuilder()
            .select('*')
            .where('make = :make', {make: estimateDto.make})
            .getRawMany()

    }

    create(reportDto: DeepPartial<Report>, user: User) {
        const report = this.repo.create(reportDto)
        report.user = user

        return this.repo.save(report)
    }

    async changeApproval(id: string, approved: boolean) {
        const report = await this.repo.findOne(id)
        if (!report) {
            throw new NotFoundException('report not found')
        }
        report.approved = approved

        return this.repo.save(report)
    }
}
