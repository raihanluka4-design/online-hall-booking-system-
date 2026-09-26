import { Booking, BookingStatus, STANDARD_TIME_SLOTS, StandardTimeSlot } from '../types';
import { storageService } from './storageService';
import { hallService } from './hallService';

export interface SlotAvailability {
  timeSlot: StandardTimeSlot | string;
  isAvailable: boolean;
  booking?: Booking;
}

export interface HallAvailabilityMatrix {
  hallId: string;
  hallName: string;
  capacity: number;
  location: string;
  status: string;
  slots: Record<string, { isAvailable: boolean; bookingId?: string }>;
}

/**
 * BookingService is the core engine managing reservation lifecycles
 * and strict conflict-prevention algorithms.
 */
class BookingService {
  /**
   * Conflict Detection Engine
   * Validates whether a specific hall has an overlapping active reservation.
   */
  public hasConflict(hallId: string, date: string, timeSlot: string, excludeBookingId?: string): boolean {
    const bookings = storageService.getBookings();
    const cleanSlot = timeSlot.trim().toLowerCase();

    return bookings.some(b => {
      if (b.bookingId === excludeBookingId) return false;
      if (b.status === 'CANCELLED') return false;
      return (
        b.hallId === hallId &&
        b.date === date &&
        b.timeSlot.trim().toLowerCase() === cleanSlot
      );
    });
  }

  /**
   * Creates a new booking after strictly validating against conflicts.
   */
  public async createBooking(params: {
    userId: string;
    hallId: string;
    date: string;
    timeSlot: string;
    purpose: string;
    attendees?: number;
    remarks?: string;
  }): Promise<Booking> {
    const { userId, hallId, date, timeSlot, purpose, attendees, remarks } = params;

    if (!userId) throw new Error('User authentication required.');
    if (!hallId) throw new Error('Please select a hall.');
    if (!date) throw new Error('Please select a reservation date.');
    if (!timeSlot) throw new Error('Please select a time slot.');
    if (!purpose || purpose.trim().length < 3) {
      throw new Error('Please provide an event purpose (at least 3 characters).');
    }

    // Verify hall exists and is available
    const hall = hallService.getHallById(hallId);
    if (!hall) {
      throw new Error('Selected hall was not found.');
    }
    if (hall.status === 'MAINTENANCE' || hall.status === 'INACTIVE') {
      throw new Error(`This hall is currently under ${hall.status.toLowerCase()} and cannot be booked.`);
    }

    // Prevent booking in the past
    const today = new Date().toISOString().split('T')[0];
    if (date < today) {
      throw new Error('Reservations cannot be made for past dates.');
    }

    // MANDATORY CONFLICT PREVENTION RULE
    if (this.hasConflict(hallId, date, timeSlot)) {
      throw new Error('This hall is already booked for the selected time slot. Please choose another slot.');
    }

    const bookings = storageService.getBookings();
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newBooking: Booking = {
      bookingId: `HB-${randomNum}`,
      userId,
      hallId,
      date,
      timeSlot,
      status: 'CONFIRMED',
      purpose: purpose.trim(),
      attendees: attendees ? Number(attendees) : undefined,
      remarks: remarks?.trim(),
      createdAt: new Date().toISOString(),
    };

    bookings.unshift(newBooking);
    storageService.saveBookings(bookings);
    return newBooking;
  }

  /**
   * Updates an existing booking date/time slot with mandatory re-validation.
   */
  public async updateBooking(bookingId: string, updates: {
    date?: string;
    timeSlot?: string;
    purpose?: string;
    attendees?: number;
    remarks?: string;
    status?: BookingStatus;
  }): Promise<Booking> {
    const bookings = storageService.getBookings();
    const index = bookings.findIndex(b => b.bookingId === bookingId);

    if (index === -1) {
      throw new Error('Booking record not found.');
    }

    const current = bookings[index];
    const targetHallId = current.hallId;
    const targetDate = updates.date || current.date;
    const targetSlot = updates.timeSlot || current.timeSlot;

    // If date or slot changes, verify no conflicts exist
    if (updates.date !== undefined || updates.timeSlot !== undefined) {
      if (this.hasConflict(targetHallId, targetDate, targetSlot, bookingId)) {
        throw new Error('This hall is already booked for the selected time slot. Please choose another slot.');
      }
    }

    bookings[index] = {
      ...current,
      ...updates,
      date: targetDate,
      timeSlot: targetSlot,
      attendees: updates.attendees !== undefined ? Number(updates.attendees) : current.attendees,
      updatedAt: new Date().toISOString(),
    };

    storageService.saveBookings(bookings);
    return bookings[index];
  }

  /**
   * Cancels a booking and frees the slot.
   */
  public async cancelBooking(bookingId: string, reason?: string): Promise<Booking> {
    const bookings = storageService.getBookings();
    const index = bookings.findIndex(b => b.bookingId === bookingId);

    if (index === -1) {
      throw new Error('Booking not found.');
    }

    bookings[index] = {
      ...bookings[index],
      status: 'CANCELLED',
      remarks: reason ? `Cancelled: ${reason}` : bookings[index].remarks,
      updatedAt: new Date().toISOString(),
    };

    storageService.saveBookings(bookings);
    return bookings[index];
  }

  /**
   * Queries slot availability for a specific hall and date.
   */
  public getSlotAvailability(hallId: string, date: string): SlotAvailability[] {
    const bookings = storageService.getBookings();
    const activeBookings = bookings.filter(
      b => b.hallId === hallId && b.date === date && b.status !== 'CANCELLED'
    );

    return STANDARD_TIME_SLOTS.map(slot => {
      const existing = activeBookings.find(
        b => b.timeSlot.trim().toLowerCase() === slot.trim().toLowerCase()
      );

      return {
        timeSlot: slot,
        isAvailable: !existing,
        booking: existing,
      };
    });
  }

  /**
   * Generates a complete availability matrix across all halls for a specific date.
   */
  public getAvailabilityMatrix(date: string): HallAvailabilityMatrix[] {
    const halls = storageService.getHalls();
    const bookings = storageService.getBookings().filter(
      b => b.date === date && b.status !== 'CANCELLED'
    );

    return halls.map(hall => {
      const hallBookings = bookings.filter(b => b.hallId === hall.hallId);
      const slots: Record<string, { isAvailable: boolean; bookingId?: string }> = {};

      STANDARD_TIME_SLOTS.forEach(slot => {
        const found = hallBookings.find(
          b => b.timeSlot.trim().toLowerCase() === slot.trim().toLowerCase()
        );
        slots[slot] = {
          isAvailable: !found && hall.status === 'AVAILABLE',
          bookingId: found?.bookingId,
        };
      });

      return {
        hallId: hall.hallId,
        hallName: hall.hallName,
        capacity: hall.capacity,
        location: hall.location,
        status: hall.status,
        slots,
      };
    });
  }

  public getAllBookings(): Booking[] {
    return storageService.getBookings();
  }

  public getUserBookings(userId: string): Booking[] {
    const bookings = storageService.getBookings();
    return bookings.filter(b => b.userId === userId);
  }

  public getBookingById(bookingId: string): Booking | undefined {
    const bookings = storageService.getBookings();
    return bookings.find(b => b.bookingId === bookingId);
  }
}

export const bookingService = new BookingService();
