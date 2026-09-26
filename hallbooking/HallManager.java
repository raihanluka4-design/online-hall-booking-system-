package com.hallbooking;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * OOP Core Concept: Encapsulation & Service Layer Abstraction
 * Central controller managing memory lists for Users, Halls, and Bookings,
 * enforcing business logic such as double-booking prevention.
 */
public class HallManager {
    private List<User> users;
    private List<Hall> halls;
    private List<Booking> bookings;
    private int nextUserId = 100;
    private int nextHallId = 1;
    private int nextBookingId = 1000;

    public HallManager() {
        this.users = new ArrayList<>();
        this.halls = new ArrayList<>();
        this.bookings = new ArrayList<>();
        seedDefaultData();
    }

    private void seedDefaultData() {
        // Seed default users
        registerUser(new AdminUser(nextUserId++, "Mrs. Shana Musthafa APV", "admin@example.com", "9876543210", "AI & ML", "admin123"));
        registerUser(new StudentUser(nextUserId++, "Mishal Shahil", "student@example.com", "9876543211", "AI & ML", "student123"));
        registerUser(new StudentUser(nextUserId++, "Muhammed Zaeem P.A", "zaeem@example.com", "9876543212", "AI & ML", "pass123"));
        registerUser(new StudentUser(nextUserId++, "Najwa A", "najwa@example.com", "9876543213", "AI & ML", "pass123"));
        registerUser(new StudentUser(nextUserId++, "Shahma Sheriff", "shahma@example.com", "9876543214", "AI & ML", "pass123"));
        registerUser(new StudentUser(nextUserId++, "Pranab B Murali", "pranab@example.com", "9876543215", "AI & ML", "pass123"));

        // Seed default halls
        addHall(new Hall(nextHallId++, "Main Auditorium", 500, "Block A, 1st Floor", "Auditorium", 
                Arrays.asList("Air Conditioning", "4K Projector", "Sound System", "Stage", "Wi-Fi")));
        addHall(new Hall(nextHallId++, "Aryabhatta Seminar Hall", 150, "Block B, 2nd Floor", "Seminar Hall", 
                Arrays.asList("Air Conditioning", "Projector", "Sound System", "Smart Board")));
        addHall(new Hall(nextHallId++, "Turing AI Lab Conference Hall", 80, "AI & ML Dept, 3rd Floor", "Mini Conference Hall", 
                Arrays.asList("Air Conditioning", "High-Speed Wi-Fi", "Smart Board")));
        addHall(new Hall(nextHallId++, "APJ Abdul Kalam Hall", 250, "Block C, Ground Floor", "Seminar Hall", 
                Arrays.asList("Air Conditioning", "Projector", "Sound System", "Stage")));

        // Seed initial bookings
        createBooking(101, 1, "2026-09-30", "09:00 AM - 11:00 AM", "PBCST304 Review 1 Presentation");
        createBooking(102, 2, "2026-09-30", "11:00 AM - 01:00 PM", "AI & ML Department Workshop");
    }

    public boolean registerUser(User user) {
        if (users.stream().anyMatch(u -> u.getEmail().equalsIgnoreCase(user.getEmail()))) {
            System.out.println("Error: User with email " + user.getEmail() + " already exists!");
            return false;
        }
        users.add(user);
        return true;
    }

    public Optional<User> authenticate(String email, String password) {
        return users.stream()
                .filter(u -> u.getEmail().equalsIgnoreCase(email) && u.getPassword().equals(password))
                .findFirst();
    }

    public void addHall(Hall hall) {
        halls.add(hall);
    }

    public List<Hall> getAllHalls() {
        return new ArrayList<>(halls);
    }

    public Optional<Hall> getHallById(int hallId) {
        return halls.stream().filter(h -> h.getHallId() == hallId).findFirst();
    }

    public List<Booking> getAllBookings() {
        return new ArrayList<>(bookings);
    }

    public List<Booking> getBookingsByUserId(int userId) {
        return bookings.stream().filter(b -> b.getUserId() == userId).collect(Collectors.toList());
    }

    /**
     * Core Conflict Validation Engine
     * Prevents double-booking by verifying hall availability for date & slot.
     */
    public boolean isSlotAvailable(int hallId, String date, String timeSlot) {
        return bookings.stream().noneMatch(b -> b.conflictsWith(hallId, date, timeSlot));
    }

    public Booking createBooking(int userId, int hallId, String date, String timeSlot, String purpose) {
        if (!isSlotAvailable(hallId, date, timeSlot)) {
            System.out.printf("CONFLICT ERROR: Hall #%d is already reserved for slot '%s' on %s!\n", 
                    hallId, timeSlot, date);
            return null;
        }
        Booking booking = new Booking(nextBookingId++, userId, hallId, date, timeSlot, purpose);
        bookings.add(booking);
        System.out.printf("SUCCESS: Reservation #%d created for Hall #%d on %s (%s).\n", 
                booking.getBookingId(), hallId, date, timeSlot);
        return booking;
    }

    public boolean cancelBooking(int bookingId) {
        Optional<Booking> optBooking = bookings.stream().filter(b -> b.getBookingId() == bookingId).findFirst();
        if (optBooking.isPresent()) {
            optBooking.get().setStatus("CANCELLED");
            System.out.println("SUCCESS: Reservation #" + bookingId + " has been cancelled.");
            return true;
        }
        System.out.println("ERROR: Booking #" + bookingId + " not found.");
        return false;
    }

    public List<User> getAllUsers() {
        return new ArrayList<>(users);
    }
}
