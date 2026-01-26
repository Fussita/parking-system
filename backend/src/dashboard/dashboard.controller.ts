import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('occupancy')
  async getOccupancyPercentage() {
    return this.dashboardService.getOccupancyPercentage();
  }

  @Get('free-spaces')
  async getFreeSpaces() {
    return this.dashboardService.getFreeSpaces();
  }

  @Get('monthly-income')
  async getMonthlyIncome() {
    return this.dashboardService.getMonthlyIncome();
  }

  @Get('closed-incidents')
  async getClosedIncidents() {
    return this.dashboardService.getClosedIncidents();
  }

  @Get('annual-income')
  async getAnnualIncome() {
    return this.dashboardService.getAnnualIncome();
  }
}
