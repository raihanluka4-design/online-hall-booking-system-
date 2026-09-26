package com.hallbooking;

/**
 * OOP Core Concept: Encapsulation
 * Represents a hall reservation event linking User, Hall, Date, Time Slot, and Purpose.
 */
public class Booking {
    private int bookingId;
    private int userId;
    private int hallId;
    private String date; // YYYY-MM-DD
    private String timeSlot; // e.g. "09:00 AM - 11:00 AM"
    private String purpose;
    private String status; // CONFIRMED, CANCELLED, PENDING

    public Booking(int bookingId, int userId, int hallId, String date, String timeSlot, String purpose) {
        this.bookingId = bookingId;
        this.userId = userId;
        this.hallId = hallId;
        this.date = date;
        this.timeSlot = timeSlot;
        this.purpose = purpose;
        this.status = "CONFIRMED";
    }

    public int getBookingId() {
        return bookingId;
    }

    public int getUserId() {
        return userId;
    }

    public int getHallId() {
        return hallId;
    }

    public String getDate() {
        return date;
    }

    public String getTimeSlot() {
        return timeSlot;
    }

    public String getPurpose() {
        return purpose;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean conflictsWith(int targetHallId, String targetDate, String targetSlot) {
        return this.hallId == targetHallId &&
               "CONFIRMED".equalsIgnoreCase(this.status) &&
               this.date.equalsIgnoreCase(targetDate) &&
               this.timeSlot.equalsIgnoreCase(targetSlot);
    }

    @Override
    public String toString() {
        return String.format("Booking #%d | UserID: %d | HallID: %d | Date: %s | Slot: %s | Purpose: %s | Status: %s",
                bookingId, userId, hallId, date, timeSlot, purpose, status);
    }
}
