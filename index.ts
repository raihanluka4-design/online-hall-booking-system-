export type Role = 'USER' | 'ADMIN';

export type UserStatus = 'ACTIVE' | 'DISABLED';

export interface User {
  userId: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: Role;
  status: UserStatus;
  department?: string;
  createdAt: string;
}

export type HallStatus = 'AVAILABLE' | 'MAINTENANCE' | 'INACTIVE';

export type HallType = 'Auditorium' | 'Seminar Hall' | 'Conference Hall' | 'Computer Lab' | 'Mini Hall';

export interface Hall {
  hallId: string;
  hallName: string;
  capacity: number;
  location: string;
  facilities: string[];
  description: string;
  image: string;
  status: HallStatus;
  type: HallType;
  rules?: string[];
}

export type BookingStatus = 'CONFIRMED' | 'PENDING' | 'COMPLETED' | 'CANCELLED';

export const STANDARD_TIME_SLOTS = [
  '09:00 AM – 11:00 AM',
  '11:00 AM – 01:00 PM',
  '02:00 PM – 04:00 PM',
  '04:00 PM – 06:00 PM',
] as const;

export type StandardTimeSlot = typeof STANDARD_TIME_SLOTS[number];

export interface Booking {
  bookingId: string;
  userId: string;
  hallId: string;
  date: string; // YYYY-MM-DD
  timeSlot: string;
  status: BookingStatus;
  purpose: string;
  attendees?: number;
  remarks?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface HallUtilization {
  hallId: string;
  hallName: string;
  capacity: number;
  totalBookings: number;
  utilizationPercent: number;
}

export interface BookingTrend {
  date: string;
  label: string;
  bookings: number;
  confirmed: number;
  cancelled: number;
}

export interface Report {
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
}

export interface ProjectInfo {
  name: string;
  subject: string;
  courseCode: string;
  department: string;
  academicYear: string;
  guide: {
    name: string;
    designation: string;
  };
  teamMembers: Array<{
    name: string;
    role?: string;
  }>;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}
