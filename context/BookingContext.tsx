import React, { createContext, useContext, useState, useCallback } from 'react';
import { Booking, BookingStatus, Hall } from '../types';
import { bookingService } from '../services/bookingService';
import { hallService } from '../services/hallService';
import { useAuth } from './AuthContext';

interface BookingContextType {
  halls: Hall[];
  bookings: Booking[];
  userBookings: Booking[];
  isLoading: boolean;
  refreshData: () => void;
  createBooking: (params: {
    hallId: string;
    date: string;
    timeSlot: string;
    purpose: string;
    attendees?: number;
    remarks?: string;
  }) => Promise<Booking>;
  updateBooking: (
    bookingId: string,
    updates: {
      date?: string;
      timeSlot?: string;
      purpose?: string;
      attendees?: number;
      remarks?: string;
      status?: BookingStatus;
    }
  ) => Promise<Booking>;
  cancelBooking: (bookingId: string, reason?: string) => Promise<Booking>;
  addHall: (data: Omit<Hall, 'hallId'>) => Promise<Hall>;
  updateHall: (hallId: string, data: Partial<Hall>) => Promise<Hall>;
  deleteHall: (hallId: string) => Promise<void>;
  getHallById: (hallId: string) => Hall | undefined;
  getBookingById: (bookingId: string) => Booking | undefined;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  // Synchronous initialization for zero load delay
  const [halls, setHalls] = useState<Hall[]>(() => hallService.getAllHalls());
  const [bookings, setBookings] = useState<Booking[]>(() => bookingService.getAllBookings());
  const [isLoading, setIsLoading] = useState(false);

  const refreshData = useCallback(() => {
    const allHalls = hallService.getAllHalls();
    const allBookings = bookingService.getAllBookings();
    setHalls(allHalls);
    setBookings(allBookings);
    setIsLoading(false);
  }, []);

  const userBookings = bookings.filter(b => b.userId === user?.userId);

  const createBooking = async (params: {
    hallId: string;
    date: string;
    timeSlot: string;
    purpose: string;
    attendees?: number;
    remarks?: string;
  }): Promise<Booking> => {
    if (!user) throw new Error('Please log in to book a hall.');
    const newBooking = await bookingService.createBooking({
      ...params,
      userId: user.userId,
    });
    refreshData();
    return newBooking;
  };

  const updateBooking = async (
    bookingId: string,
    updates: {
      date?: string;
      timeSlot?: string;
      purpose?: string;
      attendees?: number;
      remarks?: string;
      status?: BookingStatus;
    }
  ): Promise<Booking> => {
    const updated = await bookingService.updateBooking(bookingId, updates);
    refreshData();
    return updated;
  };

  const cancelBooking = async (bookingId: string, reason?: string): Promise<Booking> => {
    const cancelled = await bookingService.cancelBooking(bookingId, reason);
    refreshData();
    return cancelled;
  };

  const addHall = async (data: Omit<Hall, 'hallId'>): Promise<Hall> => {
    const newHall = hallService.addHall(data);
    refreshData();
    return newHall;
  };

  const updateHall = async (hallId: string, data: Partial<Hall>): Promise<Hall> => {
    const updated = hallService.updateHall(hallId, data);
    refreshData();
    return updated;
  };

  const deleteHall = async (hallId: string): Promise<void> => {
    hallService.deleteHall(hallId);
    refreshData();
  };

  const getHallById = (hallId: string): Hall | undefined => {
    return halls.find(h => h.hallId === hallId);
  };

  const getBookingById = (bookingId: string): Booking | undefined => {
    return bookings.find(b => b.bookingId === bookingId);
  };

  return (
    <BookingContext.Provider
      value={{
        halls,
        bookings,
        userBookings,
        isLoading,
        refreshData,
        createBooking,
        updateBooking,
        cancelBooking,
        addHall,
        updateHall,
        deleteHall,
        getHallById,
        getBookingById,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBookingContext = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookingContext must be used within a BookingProvider');
  }
  return context;
};
