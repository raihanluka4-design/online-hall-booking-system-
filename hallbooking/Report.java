package com.hallbooking;

import java.util.List;

/**
 * OOP Core Concept: Abstraction & Polymorphism
 * Abstract base class for generating institutional reports.
 */
public abstract class Report {
    private int reportId;
    private String generatedDate;

    public Report(int reportId, String generatedDate) {
        this.reportId = reportId;
        this.generatedDate = generatedDate;
    }

    public int getReportId() {
        return reportId;
    }

    public String getGeneratedDate() {
        return generatedDate;
    }

    // Abstract method for polymorphic behavior
    public abstract void generateReport(List<Hall> halls, List<Booking> bookings);
}
