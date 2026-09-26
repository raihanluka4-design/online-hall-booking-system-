package com.hallbooking;

import java.util.List;

/**
 * OOP Core Concept: Polymorphism
 * Concrete implementation of Report presenting reservation and utilization metrics.
 */
public class BookingSummaryReport extends Report {

    public BookingSummaryReport(int reportId, String generatedDate) {
        super(reportId, generatedDate);
    }

    @Override
    public void generateReport(List<Hall> halls, List<Booking> bookings) {
        System.out.println("\n=======================================================");
        System.out.println("   ONLINE HALL BOOKING SYSTEM - SUMMARY REPORT #" + getReportId());
        System.out.println("   Generated Date: " + getGeneratedDate());
        System.out.println("=======================================================");
        
        System.out.println("Total Registered Halls: " + halls.size());
        System.out.println("Total Bookings Processed: " + bookings.size());
        
        long confirmedCount = bookings.stream().filter(b -> "CONFIRMED".equalsIgnoreCase(b.getStatus())).count();
        long cancelledCount = bookings.stream().filter(b -> "CANCELLED".equalsIgnoreCase(b.getStatus())).count();
        
        System.out.println(" - Active Confirmed Reservations: " + confirmedCount);
        System.out.println(" - Cancelled Reservations: " + cancelledCount);
        
        System.out.println("\n--- Hall Utilization Breakdown ---");
        for (Hall hall : halls) {
            long hallBookings = bookings.stream()
                .filter(b -> b.getHallId() == hall.getHallId() && "CONFIRMED".equalsIgnoreCase(b.getStatus()))
                .count();
            System.out.printf(" * Hall ID %d [%s - Cap: %d]: %d Confirmed Booking(s)\n", 
                hall.getHallId(), hall.getHallName(), hall.getCapacity(), hallBookings);
        }
        System.out.println("=======================================================\n");
    }
}
