import { Booking, Hall, User } from '../types';
import { INITIAL_BOOKINGS, INITIAL_HALLS, INITIAL_USERS } from '../data/initialData';

const STORAGE_KEYS = {
  USERS: 'hallbook_users_v1',
  HALLS: 'hallbook_halls_v1',
  BOOKINGS: 'hallbook_bookings_v1',
  CURRENT_USER: 'hallbook_current_user_v1',
  THEME: 'hallbook_theme_v1',
} as const;

/**
 * StorageService provides an encapsulated data access layer.
 * Demonstrates Abstraction by hiding the underlying persistence implementation.
 */
class StorageService {
  constructor() {
    this.initDefaultData();
  }

  public initDefaultData(forceReset: boolean = false): void {
    if (typeof window === 'undefined') return;

    if (forceReset || !localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    }
    if (forceReset || !localStorage.getItem(STORAGE_KEYS.HALLS)) {
      localStorage.setItem(STORAGE_KEYS.HALLS, JSON.stringify(INITIAL_HALLS));
    }
    if (forceReset || !localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
    }
  }

  // --- Users ---
  public getUsers(): User[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  }

  public saveUsers(users: User[]): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  // --- Halls ---
  public getHalls(): Hall[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HALLS);
      return data ? JSON.parse(data) : INITIAL_HALLS;
    } catch {
      return INITIAL_HALLS;
    }
  }

  public saveHalls(halls: Hall[]): void {
    localStorage.setItem(STORAGE_KEYS.HALLS, JSON.stringify(halls));
  }

  // --- Bookings ---
  public getBookings(): Booking[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      return data ? JSON.parse(data) : INITIAL_BOOKINGS;
    } catch {
      return INITIAL_BOOKINGS;
    }
  }

  public saveBookings(bookings: Booking[]): void {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  }

  // --- Session & Current User ---
  public getCurrentUser(): User | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  public setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }

  // --- Theme ---
  public getTheme(): 'light' | 'dark' {
    try {
      const theme = localStorage.getItem(STORAGE_KEYS.THEME);
      return theme === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  }

  public setTheme(theme: 'light' | 'dark'): void {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }

  // Full reset helper for demo
  public resetToSampleData(): void {
    this.initDefaultData(true);
  }
}

export const storageService = new StorageService();
