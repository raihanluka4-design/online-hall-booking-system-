package com.hallbooking;

/**
 * OOP Core Concept: Inheritance & Polymorphism
 * AdminUser extends User base class with administrative management privileges.
 */
public class AdminUser extends User {

    public AdminUser(int userId, String name, String email, String phone, String department, String password) {
        super(userId, name, email, phone, department, password);
    }

    @Override
    public String getRole() {
        return "ADMIN";
    }

    @Override
    public void displayDashboardInfo() {
        System.out.println("=== Administrator Management Console ===");
        System.out.println("Welcome Admin, " + getName() + " (" + getDepartment() + ")");
        System.out.println("Privileges: Add/Update/Delete Halls, Manage Users, Approve Reservations, Generate Reports.");
    }
}
