package com.hallbooking;

import java.util.ArrayList;
import java.util.List;

/**
 * OOP Core Concept: Encapsulation & Class Definition
 * Represents a venue/hall with private properties and controlled access methods.
 */
public class Hall {
    private int hallId;
    private String hallName;
    private int capacity;
    private String location;
    private List<String> facilities;
    private String type; // Auditorium, Seminar Hall, Smart Classroom, etc.
    private String status; // AVAILABLE, UNDER_MAINTENANCE

    public Hall(int hallId, String hallName, int capacity, String location, String type, List<String> facilities) {
        this.hallId = hallId;
        this.hallName = hallName;
        this.capacity = capacity;
        this.location = location;
        this.type = type;
        this.facilities = facilities != null ? facilities : new ArrayList<>();
        this.status = "AVAILABLE";
    }

    public boolean isAvailable() {
        return "AVAILABLE".equalsIgnoreCase(this.status);
    }

    public boolean canAccommodate(int count) {
        return count <= this.capacity;
    }

    // Encapsulation Getters & Setters
    public int getHallId() {
        return hallId;
    }

    public String getHallName() {
        return hallName;
    }

    public void setHallName(String hallName) {
        this.hallName = hallName;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<String> getFacilities() {
        return facilities;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return String.format("Hall #%d: %s [%s] | Capacity: %d | Location: %s | Status: %s | Facilities: %s",
                hallId, hallName, type, capacity, location, status, String.join(", ", facilities));
    }
}
