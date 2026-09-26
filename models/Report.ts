import { BookingTrend, HallUtilization, Report as IReport } from '../types';

/**
 * OOP Representation: Report Model Class
 * Encapsulates analytical metrics calculation and formatting.
 */
export class ReportModel implements IReport {
  reportId: string;
  generatedAt: string;
  period: 'day' | 'week' | 'month' | 'all';
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalUsers: number;
  totalHalls: number;
  hallUtilization: HallUtilization[];
  bookingTrends: BookingTrend[];
  mostBookedHall: string;
  leastBookedHall: string;
  averageUtilization: number;

  constructor(data: IReport) {
    this.reportId = data.reportId;
    this.generatedAt = data.generatedAt || new Date().toISOString();
    this.period = data.period;
    this.totalBookings = data.totalBookings;
    this.confirmedBookings = data.confirmedBookings;
    this.pendingBookings = data.pendingBookings;
    this.completedBookings = data.completedBookings;
    this.cancelledBookings = data.cancelledBookings;
    this.totalUsers = data.totalUsers;
    this.totalHalls = data.totalHalls;
    this.hallUtilization = data.hallUtilization;
    this.bookingTrends = data.bookingTrends;
    this.mostBookedHall = data.mostBookedHall;
    this.leastBookedHall = data.leastBookedHall;
    this.averageUtilization = data.averageUtilization;
  }

  getSuccessRate(): number {
    if (this.totalBookings === 0) return 100;
    return Math.round((this.confirmedBookings / this.totalBookings) * 100);
  }

  getCancellationRate(): number {
    if (this.totalBookings === 0) return 0;
    return Math.round((this.cancelledBookings / this.totalBookings) * 100);
  }

  toJSON(): IReport {
    return {
      reportId: this.reportId,
      generatedAt: this.generatedAt,
      period: this.period,
      totalBookings: this.totalBookings,
      confirmedBookings: this.confirmedBookings,
      pendingBookings: this.pendingBookings,
      completedBookings: this.completedBookings,
      cancelledBookings: this.cancelledBookings,
      totalUsers: this.totalUsers,
      totalHalls: this.totalHalls,
      hallUtilization: this.hallUtilization,
      bookingTrends: this.bookingTrends,
      mostBookedHall: this.mostBookedHall,
      leastBookedHall: this.leastBookedHall,
      averageUtilization: this.averageUtilization,
    };
  }
}
