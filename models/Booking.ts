import { Booking as IBooking, BookingStatus } from '../types';

/**
 * OOP Representation: Booking Model Class
 * Encapsulates booking state, cancellation rules, and conflict detection logic.
 */
export class BookingModel implements IBooking {
  bookingId: string;
  userId: string;
  hallId: string;
  date: string;
  timeSlot: string;
  status: BookingStatus;
  purpose: string;
  attendees?: number;
  remarks?: string;
  createdAt: string;
  updatedAt?: string;

  constructor(data: IBooking) {
    this.bookingId = data.bookingId;
    this.userId = data.userId;
    this.hallId = data.hallId;
    this.date = data.date;
    this.timeSlot = data.timeSlot;
    this.status = data.status || 'CONFIRMED';
    this.purpose = data.purpose;
    this.attendees = data.attendees;
    this.remarks = data.remarks;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt;
  }

  isUpcoming(): boolean {
    if (this.status === 'CANCELLED' || this.status === 'COMPLETED') return false;
    const today = new Date().toISOString().split('T')[0];
    return this.date >= today;
  }

  isCancelled(): boolean {
    return this.status === 'CANCELLED';
  }

  isCompleted(): boolean {
    return this.status === 'COMPLETED';
  }

  canBeModified(): boolean {
    return this.status === 'CONFIRMED' || this.status === 'PENDING';
  }

  conflictsWith(hallId: string, date: string, timeSlot: string): boolean {
    // Conflict exists if it's the same hall, same date, same time slot, and not cancelled
    if (this.status === 'CANCELLED') return false;
    return (
      this.hallId === hallId &&
      this.date === date &&
      this.timeSlot.trim().toLowerCase() === timeSlot.trim().toLowerCase()
    );
  }

  toJSON(): IBooking {
    return {
      bookingId: this.bookingId,
      userId: this.userId,
      hallId: this.hallId,
      date: this.date,
      timeSlot: this.timeSlot,
      status: this.status,
      purpose: this.purpose,
      attendees: this.attendees,
      remarks: this.remarks,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
