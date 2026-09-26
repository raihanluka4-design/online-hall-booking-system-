package com.hallbooking;

/**
 * OOP Core Concept: Abstract Base Class & Encapsulation
 * Demonstrates abstraction by defining the template for system users,
 * and encapsulation by keeping user attributes private with explicit getters/setters.
 */
public abstract class User {
    private int userId;
    private String name;
    private String email;
    private String phone;
    private String department;
    private String password;

    public User(int userId, String name, String email, String phone, String department, String password) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.department = department;
        this.password = password;
    }

    // Abstract method (Abstraction & Polymorphism)
    public abstract String getRole();
    public abstract void displayDashboardInfo();

    // Encapsulation - Getters & Setters
    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return String.format("[%s] ID: %d | Name: %s | Email: %s | Dept: %s", 
            getRole(), userId, name, email, department);
    }
}
