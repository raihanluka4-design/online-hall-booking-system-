package com.hallbooking;

/**
 * OOP Core Concept: Inheritance & Polymorphism
 * StudentUser extends User base class, inheriting all attributes and overriding role-specific methods.
 */
public class StudentUser extends User {

    public StudentUser(int userId, String name, String email, String phone, String department, String password) {
        super(userId, name, email, phone, department, password);
    }

    @Override
    public String getRole() {
        return "STUDENT";
    }

    @Override
    public void displayDashboardInfo() {
        System.out.println("=== Student Dashboard ===");
        System.out.println("Welcome, " + getName() + " (" + getDepartment() + ")");
        System.out.println("Privileges: Search Halls, Check Availability, Book Slots, View & Cancel My Bookings.");
    }
}
