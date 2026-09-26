package com.hallbooking;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Scanner;

/**
 * Main Application Runner & Interactive Viva Test Suite
 * Demonstrates execution of all 6 project modules and OOP principles.
 */
public class Main {
    public static void main(String[] args) {
        System.out.println("==========================================================================");
        System.out.println("   ONLINE HALL BOOKING SYSTEM - JAVA OOP BACKEND DEMONSTRATION");
        System.out.println("   Mini Project: PBCST304 Object-Oriented Programming (Review 1)");
        System.out.println("   Department: AI & ML, CET Payyanur | Academic Year: 2026–27");
        System.out.println("   Guide: Mrs. Shana Musthafa APV, Assistant Professor");
        System.out.println("==========================================================================\n");

        HallManager manager = new HallManager();

        System.out.println("--- 1. DEMONSTRATING ENCAPSULATION & USER AUTHENTICATION ---");
        Optional<User> studentAuth = manager.authenticate("student@example.com", "student123");
        if (studentAuth.isPresent()) {
            User student = studentAuth.get();
            System.out.println("Authenticated User: " + student);
            student.displayDashboardInfo(); // Polymorphic method call
        }

        Optional<User> adminAuth = manager.authenticate("admin@example.com", "admin123");
        if (adminAuth.isPresent()) {
            User admin = adminAuth.get();
            System.out.println("\nAuthenticated Admin: " + admin);
            admin.displayDashboardInfo(); // Polymorphic method call
        }

        System.out.println("\n--- 2. DEMONSTRATING HALL MODULE & ENCAPSULATION ---");
        List<Hall> halls = manager.getAllHalls();
        for (Hall hall : halls) {
            System.out.println(hall);
        }

        System.out.println("\n--- 3. DEMONSTRATING AVAILABILITY & DOUBLE-BOOKING PREVENTION ---");
        String testDate = "2026-10-05";
        String testSlot = "09:00 AM - 11:00 AM";

        System.out.println("Attempting initial booking for Hall #1 on " + testDate + " (" + testSlot + ")...");
        Booking b1 = manager.createBooking(101, 1, testDate, testSlot, "Machine Learning Guest Lecture");

        System.out.println("\nAttempting duplicate booking for SAME Hall #1, SAME Date, SAME Slot...");
        Booking b2 = manager.createBooking(102, 1, testDate, testSlot, "Conflicting Student Club Event");

        if (b2 == null) {
            System.out.println("-> SUCCESS: Double-booking prevented by HallManager conflict validation engine!");
        }

        System.out.println("\n--- 4. DEMONSTRATING BOOKING CANCELLATION ---");
        if (b1 != null) {
            manager.cancelBooking(b1.getBookingId());
        }

        System.out.println("\n--- 5. DEMONSTRATING ABSTRACTION & POLYMORPHIC REPORT GENERATION ---");
        Report report = new BookingSummaryReport(501, LocalDate.now().toString());
        report.generateReport(manager.getAllHalls(), manager.getAllBookings());

        System.out.println("Java OOP Backend Verification Completed Successfully.");
    }
}
